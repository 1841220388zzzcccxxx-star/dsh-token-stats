// Static-reference + pseudo-execution check for client.js TrendChart logic.
// Loads the whole client.js factory body in a stubbed browser-ish environment,
// drives the exposed apply() to grab the registered settings section component,
// then walks its render path with realistic data to surface ReferenceErrors /
// render crashes that `node --check` cannot see.
import { readFileSync } from 'node:fs'

const code = readFileSync(new URL('./client.js', import.meta.url), 'utf8')

let failures = 0
const check = (name, cond, extra = '') => {
  if (cond) console.log('  ok ' + name)
  else { failures++; console.log('  FAIL ' + name + (extra ? ' — ' + extra : '')) }
}

// ---- stub browser env ----
const vdom = []
let created = null
globalThis.window = {
  __ModuleLoader__: { load: (mod) => { created = mod } },
  URL: { revokeObjectURL: () => {} },
}
// stub for slots injection used by apply()
const registered = { settings: null }
globalThis.document = {
  createElement: (tag) => ({ tag, dataset: {}, textContent: '' }),
  head: { appendChild: () => {} },
  querySelector: () => null,
  body: { appendChild: () => {}, removeChild: () => {} },
}
const react = {
  useState: (init) => {
    const s = { v: init, set: (x) => { s.v = typeof x === 'function' ? x(s.v) : x } }
    return [s, s.set]
  },
  useEffect: () => {},
  useRef: () => ({ current: null }),
  Component: class { constructor(p) { this.props = p } },
  createElement: (type, props, ...kids) => ({ type, props: props || {}, kids }),
}
// module loader needs require('react')
const requireShim = (id) => id === 'react' ? react : (() => { throw new Error('unknown require ' + id) })()

// execute the module record (factory receives require)
let result
try {
  created = null
  eval(code) // registers window.__ModuleLoader__.load with the record
  if (!created) throw new Error('__ModuleLoader__.load was not invoked')
  result = created.factory(requireShim)
} catch (e) {
  console.log('  FAIL module factory threw: ' + e.message)
  process.exit(1)
}

// apply with a fake ctx that captures the settings.section component
const compRef = { comp: null }
const fakeCtx = {
  slots: {
    inject: (slot, fn) => { const reg = fn(); reg.settings = { comp: reg.settings } },
    register: (meta, comp) => { compRef.comp = comp; return { settings: { comp } } },
  },
}
try {
  result.apply(fakeCtx)
} catch (e) {
  console.log('  FAIL apply threw: ' + e.message)
  process.exit(1)
}
check('apply registers settings section component', !!compRef.comp)

// ---- build realistic data and walk StatView render path ----
// We can't run hooks for real; instead we assert the data-shaping helpers exist
// by scanning the source for the identifiers we rely on.
const need = ['function TrendChart', 'StatsErrorBoundary', 'pctDelta', 'sortRows', 'shortName', 'tableWrap', 'tkst-chip', 'tkst-grad-', 'slot * 0.85', 'H = 230', 'T().calls']
for (const n of need) check('source contains ' + n, code.includes(n))

// ---- pseudo-execute the pure math parts of TrendChart ----
// Extract the function body via regex and run it with stubs to prove no ReferenceError.
const trendStart = code.indexOf('function TrendChart')
const trendEnd = code.indexOf('// error boundary', trendStart)
const trendFnSrc = code.slice(trendStart, trendEnd)
const T = () => ({ empty: 'no data', tokens: 'Tokens', calls: 'Calls' })
const fmt = (n) => { if (n == null) return '—'; if (n >= 1e8) return (n / 1e8).toFixed(2) + '亿'; if (n >= 1e4) return (n / 1e4).toFixed(1) + '万'; return String(Math.round(n)) }
const fmtMoney = (n) => (n == null ? '—' : '$' + (n < 0.01 ? n.toFixed(4) : n.toFixed(3)))
const fmtCny = (n) => (n == null ? '—' : '¥' + (n < 0.1 ? n.toFixed(3) : n.toFixed(2)))
const PALETTE = ['#8b5cf6']
const makeSeries = (days, nModels) => Array.from({ length: days }, (_, i) => {
  const models = Array.from({ length: nModels }, (_, j) => ({ model: 'model-' + j, total: 100 + i * 10 + j * 50 }))
  const total = models.reduce((a, m) => a + m.total, 0)
  return { label: '2026-08-' + String((i % 28) + 1).padStart(2, '0'), total, calls: i * 3, usd: i * 0.01, cny: i * 0.07, models }
})
// evaluate TrendChart via direct eval so it shares this module's scope
// (react, T, fmt, fmtMoney, fmtCny, PALETTE are all in scope here)
const TrendChart2 = eval(trendFnSrc + '\nTrendChart')
const out1 = TrendChart2({ series: makeSeries(30, 3) })
const out2 = TrendChart2({ series: makeSeries(60, 8) })
const out3 = TrendChart2({ series: makeSeries(2, 1) })
check('TrendChart renders 30-day stacked series', !!out1)
check('TrendChart renders 60-day dense series', !!out2)
check('TrendChart renders tiny 2-point single-model series', !!out3)

console.log(failures === 0 ? '\nALL CLIENT CHECKS PASSED' : `\n${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)