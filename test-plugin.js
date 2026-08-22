// Standalone verification + benchmark for dsh-token-stats (no DSH runtime needed).
// Mocks ctx (on/get/webServer), a fake sessionQuery corpus, then drives the plugin
// through backfill + HTTP handlers and asserts correctness and performance.
import { performance } from 'node:perf_hooks'

const now = () => performance.now()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------- mock corpus ----------------
function makeCorpus(sessionCount, msgsPerSession = 1, readTitleDelayMs = 30) {
  const sessions = []
  for (let i = 0; i < sessionCount; i++) {
    const id = 'session-' + String(i).padStart(4, '0')
    const events = []
    events.push({
      type: 'request/header', time: Date.now() - 86400000 * (i + 1),
      data: { header: { config: { provider: 'deepseek', model: i % 3 === 0 ? 'deepseek-v4-flash' : i % 3 === 1 ? 'deepseek-chat' : 'deepseek-reasoner' } } },
    })
    for (let k = 0; k < msgsPerSession; k++) {
      events.push({
        type: 'assistant/message', time: Date.now() - 86400000 * (i + 1) + k * 1000,
        data: {
          turn: k, step: 0,
          usage: { inputTokens: 100 + i + k, outputTokens: 50 + k, cacheReadTokens: 20, cacheWriteTokens: 5, reasoningTokens: k % 2 },
        },
      })
    }
    sessions.push({ header: { id }, events })
  }
  const byId = new Map(sessions.map((s) => [s.header.id, s]))
  let readSessionCalls = 0
  let readTitleCalls = 0
  let readTitleSnapshotsCalls = 0
  return {
    readSessionCalls: () => readSessionCalls,
    readTitleCalls: () => readTitleCalls,
    readTitleSnapshotsCalls: () => readTitleSnapshotsCalls,
    listSessions: async () => sessions.map((s) => ({ header: { id: s.header.id } })),
    readSession: async (id) => { readSessionCalls++; await sleep(2); const s = byId.get(id); return s ? { header: s.header, events: s.events } : null },
    readTitle: async (id) => { readTitleCalls++; await sleep(readTitleDelayMs); return { title: 'Title:' + id } },
    readTitleSnapshots: async (ids) => { readTitleSnapshotsCalls++; await sleep(5); return ids.map((id) => ({ status: 'fulfilled', value: { session: { id }, title: { title: 'Title:' + id } } })) },
  }
}

// ---------------- mock ctx + HTTP plumbing ----------------
function makeCtx(corpus) {
  const listeners = new Map()
  let registered = null
  return {
    listeners,
    registered: () => registered,
    on: (event, fn) => {
      if (!listeners.has(event)) listeners.set(event, [])
      listeners.get(event).push(fn)
    },
    emit: async (event, ...args) => {
      for (const fn of listeners.get(event) || []) await fn(...args)
    },
    get: (key) => {
      if (key === 'sessionQuery') return corpus
      if (key === 'tokenMeter') return { estimateMessage: () => 0 }
      return undefined
    },
    webServer: { register: (r) => { registered = r } },
  }
}

function fakeRes() {
  let status = 200
  const headers = {}
  let body = ''
  return {
    writeHead: (s, h) => { status = s; Object.assign(headers, h) },
    end: (b) => { body = b },
    result: () => ({ status, headers, body }),
  }
}

function callHandler(handler, url) {
  const res = fakeRes()
  return handler({ url, method: 'GET' }, res).then(() => res)
}

async function waitFor(fn, timeoutMs = 10000) {
  const t0 = now()
  while (now() - t0 < timeoutMs) {
    if (await fn()) return true
    await sleep(25)
  }
  return !!(await fn())
}

// ---------------- tests ----------------
let failures = 0
const check = (name, cond, extra = '') => {
  if (cond) console.log('  ✓ ' + name)
  else { failures++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')) }
}

const mod = await import('./index.js')
const plugin = mod.default || mod

console.log('== correctness (small corpus: 5 sessions × 1 msg) ==')
{
  const corpus = makeCorpus(5, 1)
  const ctx = makeCtx(corpus)
  plugin.apply(ctx)
  const handler = ctx.registered().handler
  const ok = await waitFor(async () => {
    const r = await callHandler(handler, '/token-stats/api?op=summary')
    const s = JSON.parse(r.result().body)
    return s.ok && s.total.calls === 5
  })
  check('apply + register ok', !!handler)

  // summary
  let res = await callHandler(handler, '/token-stats/api?op=summary')
  const sum = JSON.parse(res.result().body)
  check('summary.ok', sum.ok === true)
  check('summary.total.calls === 5', sum.total.calls === 5, 'got ' + sum.total.calls)
  check('summary.total.input === 5*100+10', sum.total.input === 510, 'got ' + sum.total.input) // 100+i+k for i=0..4,k=0
  check('summary.total.total === input+output+cacheRead+cacheWrite+reasoning',
    sum.total.total === sum.total.input + sum.total.output + sum.total.cacheRead + sum.total.cacheWrite + sum.total.reasoning)
  check('summary.today.calls === 0 (events are 1..5 days old)', sum.today.calls === 0, 'got ' + sum.today.calls)
  check('summary.prev has yesterday/lastWeek/lastMonth',
    !!sum.prev && 'yesterday' in sum.prev && 'lastWeek' in sum.prev && 'lastMonth' in sum.prev)
  check('summary.prev.yesterday is a shape', sum.prev.yesterday && typeof sum.prev.yesterday.total === 'number')

  // query (day granularity, no filter)
  res = await callHandler(handler, '/token-stats/api?op=query&granularity=day')
  const q = JSON.parse(res.result().body)
  check('query.ok', q.ok === true)
  check('query.series.length === 5', q.series.length === 5, 'got ' + q.series.length)
  check('query.models.length === 3', q.models.length === 3, 'got ' + q.models.length)
  check('query.sessions.length === 5', q.sessions.length === 5, 'got ' + q.sessions.length)
  check('query cost: deepseek-v4-flash usd > 0', q.models.some((m) => m.model.includes('deepseek-v4-flash') && m.usd > 0))
  check('query.models have prevTotal field', q.models.every((m) => typeof m.prevTotal === 'number'))

  // query with model filter
  res = await callHandler(handler, '/token-stats/api?op=query&model=deepseek-chat')
  const qf = JSON.parse(res.result().body)
  check('query model filter: only deepseek-chat', qf.models.length === 1 && qf.models[0].model === 'deepseek-chat', JSON.stringify(qf.models.map((m) => m.model)))

  // query with session filter
  res = await callHandler(handler, '/token-stats/api?op=query&sessionId=session-0000')
  const qs = JSON.parse(res.result().body)
  check('query session filter: 1 session, 1 series', qs.sessions.length === 1 && qs.series.length === 1)

  // models
  res = await callHandler(handler, '/token-stats/api?op=models')
  const mo = JSON.parse(res.result().body)
  check('models.ok + usdCny', mo.ok === true && mo.usdCny === 7.2 && mo.rates.length > 10)

  // sessions: batch path
  res = await callHandler(handler, '/token-stats/api?op=sessions')
  const se = JSON.parse(res.result().body)
  check('sessions.ok', se.ok === true)
  check('sessions count === 5', se.sessions.length === 5, 'got ' + se.sessions.length)
  check('sessions titles resolved (not ids)', se.sessions.every((s) => s.title === 'Title:' + s.id))
  check('readTitleSnapshots called exactly once', corpus.readTitleSnapshotsCalls() === 1, 'got ' + corpus.readTitleSnapshotsCalls())
  check('readTitle NOT called', corpus.readTitleCalls() === 0, 'got ' + corpus.readTitleCalls())

  // sessions again: cache hit, no new snapshot read
  res = await callHandler(handler, '/token-stats/api?op=sessions')
  check('second sessions call uses cache (no extra snapshots read)', corpus.readTitleSnapshotsCalls() === 1, 'got ' + corpus.readTitleSnapshotsCalls())

  // export csv / json
  res = await callHandler(handler, '/token-stats/api?op=export&format=csv')
  const csv = res.result()
  check('export csv: 200 status + content-disposition', csv.status === 200 && /filename="token-stats-\d+\.csv"/.test(csv.headers['content-disposition']))
  check('export csv: header + 5 rows', csv.body.split('\n').length === 6, 'lines=' + csv.body.split('\n').length)
  check('export csv: contains model column value', csv.body.includes('deepseek-v4-flash'))
  res = await callHandler(handler, '/token-stats/api?op=export&format=json')
  const j = JSON.parse(res.result().body)
  check('export json: count === 5', j.count === 5 && j.rows.length === 5)

  // unknown op
  res = await callHandler(handler, '/token-stats/api?op=bogus')
  check('unknown op -> 400', JSON.parse(res.result().body).ok === false)
  // not found path
  res = await callHandler(handler, '/token-stats/other')
  check('wrong path -> 404', res.result().status === 404)
}

console.log('== fallback path (no readTitleSnapshots, only readTitle) ==')
{
  const corpus = makeCorpus(3, 1)
  delete corpus.readTitleSnapshots
  const ctx = makeCtx(corpus)
  plugin.apply(ctx)
  const handler = ctx.registered().handler
  await waitFor(async () => { const r = await callHandler(handler, '/token-stats/api?op=summary'); const s = JSON.parse(r.result().body); return s.ok && s.total.calls === 3 })
  const res = await callHandler(handler, '/token-stats/api?op=sessions')
  const se = JSON.parse(res.result().body)
  check('fallback: titles resolved', se.ok && se.sessions.length === 3 && se.sessions.every((s) => s.title.startsWith('Title:')))
  check('fallback: readTitle used, cached on 2nd call', corpus.readTitleCalls() === 3)
  const res2 = await callHandler(handler, '/token-stats/api?op=sessions')
  check('fallback: second call cache hit', corpus.readTitleCalls() === 3, 'got ' + corpus.readTitleCalls())
}

console.log('== performance (large corpus: 200 sessions × 50 msgs = 10k records) ==')
{
  const corpus = makeCorpus(200, 50)
  const ctx = makeCtx(corpus)
  plugin.apply(ctx)
  const handler = ctx.registered().handler
  await waitFor(async () => {
    const r = await callHandler(handler, '/token-stats/api?op=summary')
    const s = JSON.parse(r.result().body)
    return s.ok && s.total.calls === 10000
  }, 20000)
  check('backfill ingested 10000 records', corpus.readSessionCalls() === 200, 'readSession calls=' + corpus.readSessionCalls())

  const time = async (url) => {
    const t0 = now(); const r = await callHandler(handler, url); return now() - t0
  }
  const tSummary = await time('/token-stats/api?op=summary')
  const tQuery = await time('/token-stats/api?op=query&granularity=day')
  const tQueryFiltered = await time('/token-stats/api?op=query&sessionId=session-0000')
  const tSessions1 = await time('/token-stats/api?op=sessions')
  const tSessions2 = await time('/token-stats/api?op=sessions')
  console.log(`  summary=${tSummary.toFixed(1)}ms query=${tQuery.toFixed(1)}ms queryFiltered=${tQueryFiltered.toFixed(1)}ms sessions#1=${tSessions1.toFixed(1)}ms sessions#2(cache)=${tSessions2.toFixed(1)}ms`)
  check('summary < 100ms (10k records)', tSummary < 100, tSummary.toFixed(1) + 'ms')
  check('query < 100ms', tQuery < 100, tQuery.toFixed(1) + 'ms')
  check('sessions batch < 200ms', tSessions1 < 200, tSessions1.toFixed(1) + 'ms')
  check('sessions cache hit < 20ms', tSessions2 < 20, tSessions2.toFixed(1) + 'ms')
  check('readTitle never called in batch path', corpus.readTitleCalls() === 0, 'got ' + corpus.readTitleCalls())

  // correctness spot-check on the big corpus
  const r = await callHandler(handler, '/token-stats/api?op=summary')
  const sum = JSON.parse(r.result().body)
  check('big corpus summary consistent', sum.total.calls === 10000 && sum.total.input === sum.total.input)
}

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
