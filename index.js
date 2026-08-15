// dsh-token-stats — server half
// Token usage statistics for DeepSeek Harness.
//
// Data source (authoritative): DSH session logs. Every model call lands an
// `assistant/message` event carrying real `usage` (input / output / cacheRead
// / cacheWrite / reasoning tokens) plus a `request/header` event carrying the
// provider/model. This plugin keeps an in-memory aggregation index built from
// those events (live via `session/event`, historic via a one-shot backfill
// scan of `sessionQuery`), so statistics survive restarts because the logs do.
//
// HTTP API under /token-stats/api:
//   op=summary    -> { today, week, month, total, session } token aggregates
//   op=query      -> { series, models, sessions } by day/week/month granularity
//   op=models     -> pricing table + USD->CNY rate
//   op=sessions   -> [{ id, title }] session list
//   op=export     -> CSV or JSON dump (format=csv|json)

export const name = 'token-stats'
export const inject = ['webServer']

export function apply(ctx) {
  // ============ data layer: in-memory aggregation index ============
  const EMPTY = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 })
  const records = new Map()          // key: sessionId:turn:step -> record
  const sessionHeaders = new Map()   // sessionId -> {provider, model}
  const inflight = new Map()         // sessionId -> usage (llm/stream live, display only)
  const sessionKeys = new Map()      // sessionId -> Set<key>
  const titleCache = new Map()       // sessionId -> {title, at} (batched read + TTL, avoids N sequential readTitle)
  const TITLE_TTL = 5 * 60 * 1000    // refresh a cached title at most every 5 minutes

  const keyOf = (sid, turn, step) => sid + ':' + turn + ':' + step
  const dateStr = (ts) => {
    const d = new Date(ts)
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }
  const norm = (u) => ({
    input: Math.max(0, Math.round(u.inputTokens || 0)),
    output: Math.max(0, Math.round(u.outputTokens || 0)),
    cacheRead: Math.max(0, Math.round(u.cacheReadTokens || 0)),
    cacheWrite: Math.max(0, Math.round(u.cacheWriteTokens || 0)),
    reasoning: Math.max(0, Math.round(u.reasoningTokens || 0)),
  })
  const addRecord = (rec) => {
    const key = keyOf(rec.sessionId, rec.turn, rec.step)
    if (records.has(key)) return false
    records.set(key, rec)
    let set = sessionKeys.get(rec.sessionId)
    if (!set) { set = new Set(); sessionKeys.set(rec.sessionId, set) }
    set.add(key)
    return true
  }
  const modelOf = (sid) => sessionHeaders.get(sid) || { provider: 'unknown', model: 'unknown' }

  // extract provider/model from a request/header event (data.header.config)
  const headerOf = (event) => {
    try {
      const h = event.data && event.data.header
      const cfg = h && h.config
      if (cfg && cfg.provider && cfg.model) return { provider: cfg.provider, model: cfg.model }
    } catch (e) { /* ignore */ }
    return null
  }

  // estimate usage when an adapter reported none
  const estimateUsage = (message) => {
    try {
      const tm = ctx.get('tokenMeter')
      if (tm && tm.estimateMessage) {
        const n = tm.estimateMessage(message)
        if (n > 0) return { input: Math.max(0, Math.round(n)), output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0 }
      }
    } catch (e) { /* ignore */ }
    return null
  }

  const ingest = (event) => {
    const d = event.data
    const meta = modelOf(String(d.sessionId || ''))
    let usage = d.usage ? norm(d.usage) : null
    let source = 'real'
    if (!usage) {
      usage = estimateUsage(d.message)
      if (usage) source = 'estimated'
    }
    if (!usage) usage = EMPTY()
    addRecord({
      sessionId: String(d.sessionId || ''), turn: d.turn, step: d.step,
      ts: event.time || Date.now(), date: dateStr(event.time || Date.now()),
      provider: meta.provider, model: meta.model, usage, source,
    })
  }

  // run fn over items with limited concurrency (backfill / title reads)
  const runPool = async (items, limit, fn) => {
    let i = 0
    const workers = []
    const n = Math.min(Math.max(1, limit), items.length)
    for (let w = 0; w < n; w++) {
      workers.push((async () => {
        while (i < items.length) {
          const cur = i++
          try { await fn(items[cur]) } catch (e) { /* caller decides */ }
        }
      })())
    }
    await Promise.all(workers)
  }

  // ============ 1) authoritative ingestion: session log event stream ============
  ctx.on('session/event', (session, event) => {
    const sid = String(session.id)
    if (event.type === 'request/header') {
      const meta = headerOf(event)
      if (meta) sessionHeaders.set(sid, meta)
      return
    }
    if (event.type !== 'assistant/message') return
    const d = event.data
    const meta = modelOf(sid)
    let usage = d.usage ? norm(d.usage) : null
    let source = 'real'
    if (!usage) {
      usage = estimateUsage(d.message)
      if (usage) source = 'estimated'
    }
    if (!usage) usage = EMPTY()
    addRecord({
      sessionId: sid, turn: d.turn, step: d.step,
      ts: event.time || Date.now(), date: dateStr(event.time || Date.now()),
      provider: meta.provider, model: meta.model, usage, source,
    })
    const inf = inflight.get(sid)
    if (inf) {
      inf.input = Math.max(0, inf.input - usage.input)
      inf.output = Math.max(0, inf.output - usage.output)
      inf.cacheRead = Math.max(0, inf.cacheRead - usage.cacheRead)
      inf.cacheWrite = Math.max(0, inf.cacheWrite - usage.cacheWrite)
      inf.reasoning = Math.max(0, inf.reasoning - usage.reasoning)
    }
  })

  // ============ 2) live count: llm/stream waterfall (usage chunks, display only) ============
  ctx.on('llm/stream', (options, next) => {
    return (async function* () {
      const inner = await next()
      for await (const chunk of inner) {
        if (chunk && chunk.type === 'usage' && chunk.usage && options.sessionId) {
          const u = norm(chunk.usage)
          const sid = String(options.sessionId)
          let acc = inflight.get(sid)
          if (!acc) { acc = EMPTY(); inflight.set(sid, acc) }
          acc.input += u.input; acc.output += u.output
          acc.cacheRead += u.cacheRead; acc.cacheWrite += u.cacheWrite; acc.reasoning += u.reasoning
        }
        yield chunk
      }
    })()
  })

  // ============ 3) history backfill: scan all session logs once ============
  const backfill = async () => {
    const sq = ctx.get('sessionQuery')
    if (!sq || !sq.listSessions || !sq.readSession) return
    try {
      const sessions = await sq.listSessions()
      // read logs with bounded concurrency instead of one-by-one serial awaits
      await runPool(sessions, 6, async (s) => {
        const id = String(s.header.id)
        let log = null
        try { log = await sq.readSession(id) } catch (e) { return }
        if (!log || !Array.isArray(log.events)) return
        let header = null
        for (const ev of log.events) {
          if (ev.type === 'request/header') {
            const meta = headerOf(ev)
            if (meta) header = meta
            if (header) sessionHeaders.set(id, header)
          } else if (ev.type === 'assistant/message') {
            const d = ev.data
            const meta = header || sessionHeaders.get(id) || { provider: 'unknown', model: 'unknown' }
            let usage = d.usage ? norm(d.usage) : null
            let source = 'real'
            if (!usage) {
              usage = estimateUsage(d.message)
              if (usage) source = 'estimated'
            }
            if (!usage) usage = EMPTY()
            addRecord({
              sessionId: id, turn: d.turn, step: d.step,
              ts: ev.time || 0, date: dateStr(ev.time || 0),
              provider: meta.provider, model: meta.model, usage, source,
            })
          }
        }
      })
    } catch (e) {
      console.error('[token-stats] backfill failed', e)
    }
  }
  void backfill()

  // ============ 4) pricing table (USD / 1M tokens) + exchange rate ============
  const PRICING = [
    { match: 'deepseek-chat', input: 0.27, output: 1.10, cacheRead: 0.07 },
    { match: 'deepseek-reasoner', input: 0.55, output: 2.19, cacheRead: 0.14 },
    { match: 'deepseek-v4-flash', input: 0.27, output: 1.10, cacheRead: 0.07 },
    { match: 'deepseek-v4-pro', input: 0.55, output: 2.19, cacheRead: 0.14 },
    { match: 'deepseek', input: 0.27, output: 1.10, cacheRead: 0.07 },
    { match: 'gpt-4o-mini', input: 0.15, output: 0.60 },
    { match: 'gpt-4o', input: 2.50, output: 10.00 },
    { match: 'gpt-4.1-mini', input: 0.40, output: 1.60 },
    { match: 'gpt-4.1-nano', input: 0.10, output: 0.40 },
    { match: 'gpt-4.1', input: 2.00, output: 8.00 },
    { match: 'gpt-4-turbo', input: 10.00, output: 30.00 },
    { match: 'gpt-4', input: 30.00, output: 60.00 },
    { match: 'gpt-3.5-turbo', input: 0.50, output: 1.50 },
    { match: 'o1', input: 15.00, output: 60.00 },
    { match: 'o3', input: 2.00, output: 8.00 },
    { match: 'claude-opus', input: 15.00, output: 75.00 },
    { match: 'claude-sonnet', input: 3.00, output: 15.00 },
    { match: 'claude-haiku', input: 0.80, output: 4.00 },
    { match: 'gemini-2.5-pro', input: 1.25, output: 10.00 },
    { match: 'gemini-2.5-flash', input: 0.30, output: 2.50 },
    { match: 'gemini-2.0-flash', input: 0.10, output: 0.40 },
    { match: 'gemini-1.5-pro', input: 1.25, output: 5.00 },
    { match: 'qwen-max', input: 1.60, output: 6.40 },
    { match: 'qwen-plus', input: 0.40, output: 1.20 },
    { match: 'qwen-turbo', input: 0.10, output: 0.30 },
  ]
  const USD_CNY = 7.2
  const priceCache = new Map()       // lowercased model -> pricing row (memoized substring scan)
  const priceOf = (model) => {
    const m = String(model || '').toLowerCase()
    if (priceCache.has(m)) return priceCache.get(m)
    let hit = null
    for (const p of PRICING) if (m.includes(p.match)) { hit = p; break }
    priceCache.set(m, hit)
    return hit
  }
  const costOf = (usage, p) => {
    if (!p) return { usd: null, cny: null }
    const usd = (usage.input * p.input + usage.output * p.output + usage.cacheRead * (p.cacheRead || p.input) + usage.cacheWrite * p.input) / 1e6
    return { usd, cny: usd * USD_CNY }
  }
  const recordCost = new WeakMap()   // per-record cost memo (query/export aggregate repeatedly)
  const costOfRecord = (r) => {
    let c = recordCost.get(r)
    if (c === undefined) { c = costOf(r.usage, priceOf(r.model)); recordCost.set(r, c) }
    return c
  }

  // ============ 5) aggregation helpers ============
  const allRecords = () => records.values()
  const isoWeek = (ts) => {
    const d = new Date(ts); const day = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - day + 3)
    const first = new Date(d.getFullYear(), 0, 4)
    const week = 1 + Math.round(((d - first) / 86400000 - 3 + ((first.getDay() + 6) % 7)) / 7)
    return d.getFullYear() + '-W' + String(week).padStart(2, '0')
  }
  const monthStr = (ts) => dateStr(ts).slice(0, 7)
  const labelOf = (ts, g) => g === 'week' ? isoWeek(ts) : g === 'month' ? monthStr(ts) : dateStr(ts)
  const weekStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime() }
  const monthStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(1); return d.getTime() }

  const collect = (list, cost) => {
    const agg = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, calls: 0, usd: 0, cny: 0, unknownCost: 0 }
    for (const r of list) {
      agg.input += r.usage.input; agg.output += r.usage.output
      agg.cacheRead += r.usage.cacheRead; agg.cacheWrite += r.usage.cacheWrite
      agg.reasoning += r.usage.reasoning; agg.calls++
      if (cost) {
        const c = costOfRecord(r)
        if (c.usd === null) agg.unknownCost += 1
        else { agg.usd += c.usd; agg.cny += c.cny }
      }
    }
    return agg
  }

  // ============ 6) HTTP API ============
  const summaryPayload = () => {
    const now = Date.now()
    const today = dateStr(now)
    const ws = weekStart()
    const ms = monthStart()
    // single pass over all records, no repeated array filtering
    const d = EMPTY(); const w = EMPTY(); const m = EMPTY(); const t = EMPTY()
    let dc = 0; let wc = 0; let mc = 0; let tc = 0
    for (const r of records.values()) {
      const u = r.usage
      t.input += u.input; t.output += u.output; t.cacheRead += u.cacheRead; t.cacheWrite += u.cacheWrite; t.reasoning += u.reasoning; tc++
      if (r.date === today) { d.input += u.input; d.output += u.output; d.cacheRead += u.cacheRead; d.cacheWrite += u.cacheWrite; d.reasoning += u.reasoning; dc++ }
      if (r.ts >= ws) { w.input += u.input; w.output += u.output; w.cacheRead += u.cacheRead; w.cacheWrite += u.cacheWrite; w.reasoning += u.reasoning; wc++ }
      if (r.ts >= ms) { m.input += u.input; m.output += u.output; m.cacheRead += u.cacheRead; m.cacheWrite += u.cacheWrite; m.reasoning += u.reasoning; mc++ }
    }
    const act = EMPTY()
    for (const u of inflight.values()) {
      act.input += u.input; act.output += u.output; act.cacheRead += u.cacheRead; act.cacheWrite += u.cacheWrite; act.reasoning += u.reasoning
    }
    const shape = (u, calls) => ({
      input: u.input, output: u.output, cacheRead: u.cacheRead,
      cacheWrite: u.cacheWrite, reasoning: u.reasoning,
      total: u.input + u.output + u.cacheRead + u.cacheWrite + u.reasoning,
      calls,
    })
    const day = shape(d, dc); const week = shape(w, wc); const month = shape(m, mc); const total = shape(t, tc)
    // merge live (inflight, display-only) usage into today/week/month/total
    for (const dst of [day, week, month, total]) {
      dst.input += act.input; dst.output += act.output
      dst.cacheRead += act.cacheRead; dst.cacheWrite += act.cacheWrite; dst.reasoning += act.reasoning
      dst.total += act.input + act.output + act.cacheRead + act.cacheWrite + act.reasoning
    }
    return { today: day, week, month, total, active: act, backfilled: sessionKeys.size > 0 }
  }

  const queryPayload = (params) => {
    const g = params.get('granularity') === 'week' ? 'week' : params.get('granularity') === 'month' ? 'month' : 'day'
    const from = params.get('from')
    const to = params.get('to')
    const mf = params.get('model')
    const sf = params.get('sessionId')
    const all = [...allRecords()].filter((r) => {
      if (from && r.date < from) return false
      if (to && r.date > to) return false
      if (mf && r.model !== mf) return false
      if (sf && r.sessionId !== sf) return false
      return true
    })
    const byLabel = new Map()
    const byModel = new Map()
    const bySession = new Map()
    for (const r of all) {
      const lb = labelOf(r.ts, g)
      if (!byLabel.has(lb)) byLabel.set(lb, [])
      byLabel.get(lb).push(r)
      if (!byModel.has(r.model)) byModel.set(r.model, [])
      byModel.get(r.model).push(r)
      if (!bySession.has(r.sessionId)) bySession.set(r.sessionId, [])
      bySession.get(r.sessionId).push(r)
    }
    const series = [...byLabel.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1).map(([label, list]) => {
      const a = collect(list, true)
      return { label, input: a.input, output: a.output, total: a.input + a.output + a.cacheRead + a.cacheWrite + a.reasoning, calls: a.calls, usd: a.usd, cny: a.cny }
    })
    const models = [...byModel.entries()].map(([model, list]) => {
      const a = collect(list, true)
      return { model, input: a.input, output: a.output, total: a.input + a.output + a.cacheRead + a.cacheWrite + a.reasoning, calls: a.calls, usd: a.usd, cny: a.cny }
    }).sort((a, b) => b.total - a.total)
    const sessions = [...bySession.entries()].map(([sessionId, list]) => {
      const a = collect(list, true)
      return { sessionId, input: a.input, output: a.output, total: a.input + a.output + a.cacheRead + a.cacheWrite + a.reasoning, calls: a.calls, usd: a.usd, cny: a.cny }
    }).sort((a, b) => b.total - a.total)
    return { series, models, sessions }
  }

  const exportPayload = async (params) => {
    const format = params.get('format') === 'json' ? 'json' : 'csv'
    const mf = params.get('model')
    const sf = params.get('sessionId')
    const all = [...allRecords()].filter((r) => {
      if (mf && r.model !== mf) return false
      if (sf && r.sessionId !== sf) return false
      return true
    }).sort((a, b) => a.ts - b.ts)
    const stamp = dateStr(Date.now()).replace(/-/g, '')
    if (format === 'json') {
      const rows = all.map((r) => {
        const c = costOfRecord(r)
        return {
          sessionId: r.sessionId, turn: r.turn, step: r.step, ts: r.ts, date: r.date,
          provider: r.provider, model: r.model, source: r.source, usage: r.usage,
          costUsd: c.usd, costCny: c.cny,
        }
      })
      return { filename: 'token-stats-' + stamp + '.json', content: JSON.stringify({ exportedAt: Date.now(), count: rows.length, rows }, null, 2) }
    }
    const esc = (v) => { const s = String(v == null ? '' : v); return /[,"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s }
    const head = ['date', 'time', 'provider', 'model', 'sessionId', 'turn', 'step', 'input', 'output', 'cacheRead', 'cacheWrite', 'reasoning', 'total', 'source', 'costUsd', 'costCny'].map(esc).join(',')
    const lines = all.map((r) => {
      const c = costOfRecord(r)
      return [r.date, new Date(r.ts).toISOString(), r.provider, r.model, r.sessionId, r.turn, r.step,
        r.usage.input, r.usage.output, r.usage.cacheRead, r.usage.cacheWrite, r.usage.reasoning,
        r.usage.input + r.usage.output + r.usage.cacheRead + r.usage.cacheWrite + r.usage.reasoning,
        r.source, c.usd === null ? '' : c.usd.toFixed(6), c.cny === null ? '' : c.cny.toFixed(6)].map(esc).join(',')
    })
    return { filename: 'token-stats-' + stamp + '.csv', content: head + '\n' + lines.join('\n') }
  }

  const sessionsPayload = async () => {
    const sq = ctx.get('sessionQuery')
    const ids = [...sessionKeys.keys()]
    const now = Date.now()
    // refresh only entries that are missing or older than TTL
    const stale = ids.filter((id) => {
      const e = titleCache.get(id)
      return !e || now - e.at > TITLE_TTL
    })
    if (stale.length > 0 && sq) {
      if (sq.readTitleSnapshots) {
        // one batched corpus observation instead of N sequential readTitle calls
        try {
          const results = await sq.readTitleSnapshots(stale)
          for (let i = 0; i < stale.length; i++) {
            const r = results && results[i]
            const t = r && r.status === 'fulfilled' && r.value ? r.value.title : null
            titleCache.set(stale[i], { title: t && typeof t.title === 'string' && t.title.length ? t.title : null, at: now })
          }
        } catch (e) {
          for (const id of stale) titleCache.set(id, { title: null, at: now })
        }
      } else if (sq.readTitle) {
        // fallback: parallel, still cached
        await runPool(stale, 6, async (id) => {
          try {
            const t = await sq.readTitle(id)
            titleCache.set(id, { title: t && typeof t.title === 'string' && t.title.length ? t.title : null, at: now })
          } catch (e) {
            titleCache.set(id, { title: null, at: now })
          }
        })
      } else {
        for (const id of stale) titleCache.set(id, { title: null, at: now })
      }
    }
    const out = ids.map((id) => {
      const e = titleCache.get(id)
      const title = e && e.title ? e.title : id
      return { id, title }
    })
    out.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
    return out
  }

  ctx.webServer.register({
    kind: 'prefix',
    path: '/token-stats',
    handler: async (req, res) => {
      const sendJson = (obj, status = 200) => {
        const body = JSON.stringify(obj)
        res.writeHead(status, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(body)
      }
      try {
        const url = new URL(req.url, 'http://localhost')
        if (url.pathname !== '/token-stats/api') {
          sendJson({ ok: false, error: 'not-found' }, 404)
          return
        }
        const op = url.searchParams.get('op') || 'summary'
        if (op === 'summary') {
          sendJson({ ok: true, ...summaryPayload() })
        } else if (op === 'query') {
          sendJson({ ok: true, ...queryPayload(url.searchParams) })
        } else if (op === 'models') {
          sendJson({
            ok: true,
            rates: PRICING.map((p) => ({ match: p.match, input: p.input, output: p.output, cacheRead: p.cacheRead || p.input })),
            usdCny: USD_CNY,
          })
        } else if (op === 'sessions') {
          sendJson({ ok: true, sessions: await sessionsPayload() })
        } else if (op === 'export') {
          const ex = await exportPayload(url.searchParams)
          res.writeHead(200, {
            'content-type': 'text/plain; charset=utf-8',
            'content-disposition': 'attachment; filename="' + ex.filename + '"',
            'cache-control': 'no-store',
          })
          res.end(ex.content)
        } else {
          sendJson({ ok: false, error: 'unknown-op' }, 400)
        }
      } catch (err) {
        try {
          sendJson({ ok: false, error: String((err && err.message) || err) }, 500)
        } catch { /* response already committed */ }
      }
    },
  })
}
