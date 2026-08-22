window.__ModuleLoader__.load({
	id: "dsh-token-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region styles
		const css = [
			".tkst-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:14px}",
			".tkst-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px}",
			".tkst-card .k{font-size:11px;color:var(--dsw-alias-label-secondary)}",
			".tkst-card .v{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);margin-top:2px}",
			".tkst-card .s{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px;display:flex;gap:6px;align-items:center}",
			".tkst-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px}",
			".tkst-filters select{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 10px;font-size:12px}",
			".tkst-filters button{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 12px;font-size:12px;cursor:pointer}",
			".tkst-filters button:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}",
			".tkst-filters input[type=text]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 10px;font-size:12px;min-width:160px}",
			".tkst-filters input[type=text]:focus{border-color:var(--dsw-alias-brand-primary);outline:none}",
			".tkst-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px;align-items:start}",
			".tkst-grid .tkst-full{grid-column:1 / -1}",
			".tkst-sec{margin-bottom:16px}",
			".tkst-sec h4{margin:0 0 8px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}",
			".tkst-chart{width:100%;height:230px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px}",
			".tkst-sumline{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--dsw-alias-label-secondary);margin-bottom:10px;font-variant-numeric:tabular-nums}",
			".tkst-sumline b{color:var(--dsw-alias-label-primary);font-weight:600}",
			".tkst-chart rect.tkst-bar-r{opacity:.72;transition:opacity .12s}",
			".tkst-chart rect.tkst-bar-r:hover{opacity:1}",
			".tkst-legend{display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:var(--dsw-alias-label-secondary);margin-bottom:6px}",
			".tkst-legend .tkst-lg{display:inline-flex;align-items:center;gap:4px}",
			".tkst-legend .tkst-lg i{display:inline-block;width:10px;height:10px;border-radius:3px}",
			".tkst-bars{display:flex;flex-direction:column;gap:6px}",
			".tkst-bar{display:grid;grid-template-columns:150px 1fr 90px;gap:10px;align-items:center;font-size:12px;cursor:pointer;padding:2px 4px;border-radius:6px}",
			".tkst-bar:hover{background:var(--dsw-alias-bg-layer-2)}",
			".tkst-bar .n{color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".tkst-bar .track{background:var(--dsw-alias-bg-layer-2);border-radius:5px;height:14px;overflow:hidden}",
			".tkst-bar .fill{height:100%;background:var(--dsw-alias-brand-primary);border-radius:5px;min-width:2px}",
			".tkst-bar .v2{color:var(--dsw-alias-label-secondary);text-align:right;font-variant-numeric:tabular-nums}",
			".tkst-tablewrap{overflow-x:auto;width:100%}",
			".tkst-table{width:100%;border-collapse:collapse;font-size:12px}",
			".tkst-table th{text-align:left;color:var(--dsw-alias-label-secondary);font-weight:600;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap;cursor:pointer;user-select:none}",
			".tkst-table th:hover{color:var(--dsw-alias-label-primary)}",
			".tkst-table th.tkst-sort-asc::after{content:' ▲';font-size:9px}",
			".tkst-table th.tkst-sort-desc::after{content:' ▼';font-size:9px}",
			".tkst-table td{padding:6px 8px;color:var(--dsw-alias-label-primary);border-bottom:1px solid var(--dsw-alias-border-l1);font-variant-numeric:tabular-nums;white-space:nowrap}",
			".tkst-table th:first-child,.tkst-table td:first-child{max-width:260px;overflow:hidden;text-overflow:ellipsis}",
			".tkst-table tr:hover td{background:var(--dsw-alias-bg-layer-1)}",
			".tkst-table tr.tkst-row-click{cursor:pointer}",
			".tkst-table tr.tkst-sub td{background:var(--dsw-alias-bg-layer-2);padding-left:24px;border-bottom:1px solid var(--dsw-alias-border-l1)}",
			".tkst-delta{font-size:11px;font-weight:600;font-variant-numeric:tabular-nums}",
			".tkst-delta.up{color:var(--dsw-alias-state-error-primary)}",
			".tkst-delta.down{color:var(--dsw-alias-state-success-primary)}",
			".tkst-delta.flat{color:var(--dsw-alias-label-secondary)}",
			".tkst-empty{color:var(--dsw-alias-label-secondary);font-size:12px;padding:18px;text-align:center}",
			".tkst-rate{font-size:11px;color:var(--dsw-alias-label-secondary);margin-left:auto;padding-right:4px}",
			".tkst-exportbox{margin-top:10px;padding:10px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px}",
			".tkst-exportbox textarea{width:100%;height:120px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;font-size:11px;padding:8px;font-family:ui-monospace,Consolas,monospace}",
			".tkst-err{margin:8px 0;padding:8px 10px;background:var(--dsw-alias-state-error-primary);color:#fff;border-radius:8px;font-size:12px;white-space:pre-wrap}",
			".tkst-loading{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px;padding:16px;justify-content:center}",
			".tkst-spin{width:14px;height:14px;border:2px solid var(--dsw-alias-border-l1);border-top-color:var(--dsw-alias-brand-primary);border-radius:50%;animation:tkst-rot .8s linear infinite}",
			"@keyframes tkst-rot{to{transform:rotate(360deg)}}",
			".tkst-meta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-left:auto;padding-right:4px;white-space:nowrap}",
			".tkst-btn-refresh{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 12px;font-size:12px;cursor:pointer}",
			".tkst-btn-refresh:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}",
			".tkst-sess-input{position:relative}",
			".tkst-sess-list{position:absolute;top:calc(100% + 2px);left:0;z-index:50;min-width:220px;max-height:220px;overflow:auto;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.2)}",
			".tkst-sess-list div{padding:6px 10px;font-size:12px;color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".tkst-sess-list div:hover,.tkst-sess-list div.tkst-sess-sel{background:var(--dsw-alias-bg-layer-2)}",
			".tkst-sess-empty{padding:8px 10px;font-size:12px;color:var(--dsw-alias-label-secondary)}"
		].join("");
		const tagId = "dsh-token-stats/style";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-token-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion

		// ---------- language (follow system) ----------
		const isZh = () => {
			try {
				const id = (typeof navigator !== "undefined" && navigator.language) || "zh-CN";
				return String(id).toLowerCase().startsWith("zh");
			} catch (e) { return true; }
		};
		const DICT = {
			zh: {
				title: "📊 Token 统计", today: "今日", week: "本周", month: "本月", total: "累计",
				model: "模型", calls: "调用", input: "输入", output: "输出",
				tokens: "Tokens", costUsd: "费用 (USD)", costCny: "费用 (CNY)",
				granularity: "时间粒度", day: "按天", weekG: "按周", monthG: "按月", allModels: "全部模型",
				allSessions: "全部会话", trend: "用量趋势", byModel: "按模型统计", bySession: "按会话统计",
				exportCsv: "导出 CSV", exportJson: "导出 JSON", empty: "暂无数据",
				estimated: "含估算", usdRate: "汇率", copied: "导出内容已生成（浏览器限制，请手动复制下方内容）",
				refresh: "刷新", loading: "加载中…", updating: "刷新中…", updatedAt: "最后更新",
				vsPrev: "较上期", expand: "展开", collapse: "收起", searchSess: "搜索会话…",
				noMatch: "无匹配会话", allSess: "全部会话", delta: "环比"
			},
			en: {
				title: "📊 Token Stats", today: "Today", week: "Week", month: "Month", total: "Total",
				model: "Model", calls: "Calls", input: "Input", output: "Output",
				tokens: "Tokens", costUsd: "Cost (USD)", costCny: "Cost (CNY)",
				granularity: "Granularity", day: "Day", weekG: "Week", monthG: "Month", allModels: "All models",
				allSessions: "All sessions", trend: "Usage Trend", byModel: "By Model", bySession: "By Session",
				exportCsv: "Export CSV", exportJson: "Export JSON", empty: "No data",
				estimated: "incl. estimated", usdRate: "Rate", copied: "Export content generated (browser limits, copy manually below)",
				refresh: "Refresh", loading: "Loading…", updating: "Refreshing…", updatedAt: "Updated",
				vsPrev: "vs prev", expand: "Expand", collapse: "Collapse", searchSess: "Search sessions…",
				noMatch: "No matching session", allSess: "All sessions", delta: "Change"
			}
		};
		const T = () => (isZh() ? DICT.zh : DICT.en);

		// ---------- helpers ----------
		const fmt = (n) => {
			n = n || 0;
			if (n >= 1e8) return (n / 1e8).toFixed(2) + "亿";
			if (n >= 1e4) return (n / 1e4).toFixed(1) + "万";
			return String(n);
		};
		const fmtMoney = (n) => (n == null ? "—" : "$" + (n < 0.01 ? n.toFixed(4) : n.toFixed(3)));
		const fmtCny = (n) => (n == null ? "—" : "¥" + (n < 0.1 ? n.toFixed(3) : n.toFixed(2)));

		const api = async (op, params) => {
			const qs = new URLSearchParams(params || {});
			qs.set("op", op);
			const res = await fetch("/token-stats/api?" + qs.toString(), { cache: "no-store" });
			const data = await res.json();
			if (!data || data.ok !== true) throw new Error((data && data.error) || "api error");
			return data;
		};

		// ---------- sessionStorage cache (stale-while-revalidate) ----------
		// Opening the tab / switching filters renders the previous result instantly,
		// then refreshes in the background — no blank wait, no flicker.
		const cacheGet = (key) => {
			try {
				const raw = sessionStorage.getItem(key);
				return raw ? JSON.parse(raw) : null;
			} catch (e) { return null; }
		};
		const cacheSet = (key, val) => {
			try { sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* quota */ }
		};
		const C_SUMMARY = "tkst.summary.v1";
		const C_META = "tkst.meta.v1";
		const C_SESSIONS = "tkst.sessions.v1";
		const C_QUERY = (gran, model, session) =>
			"tkst.query.v1|" + (gran || "day") + "|" + (model || "*") + "|" + (session || "*");
		const fmtTime = (d) => {
			const p = (n) => String(n).padStart(2, "0");
			return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
		};

		// period-over-period: percent change with up/down/flat class
		const pctDelta = (cur, prev) => {
			if (!prev) return { cls: "flat", txt: "—" };
			const d = (cur - prev) / prev;
			const sign = d > 0 ? "+" : d < 0 ? "-" : "";
			const cls = d > 0.0001 ? "up" : d < -0.0001 ? "down" : "flat";
			return { cls, txt: sign + (Math.abs(d) * 100).toFixed(1) + "%" };
		};
		// generic sorter for tables (key may be a string or getter)
		const sortRows = (rows, key, dir) => {
			if (!key) return rows;
			const k = (r) => (typeof key === "function" ? key(r) : r[key]);
			return [...rows].sort((a, b) => {
				const va = k(a), vb = k(b);
				if (typeof va === "string" && typeof vb === "string") return dir * (va < vb ? -1 : va > vb ? 1 : 0);
				return dir * ((va || 0) - (vb || 0));
			});
		};

		const download = (filename, content, onFallback) => {
			try {
				const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url; a.download = filename;
				document.body.appendChild(a); a.click(); document.body.removeChild(a);
				setTimeout(() => URL.revokeObjectURL(url), 2000);
			} catch (e) { onFallback(content); }
		};

		// ---------- trend chart: slim dense stacked bars, gridlines, legend ----------
		const PALETTE = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#22c55e", "#ef4444", "#6366f1", "#14b8a6"];
		function TrendChart({ series }) {
			const W = 820, H = 230, P = 24;
			if (!series || series.length === 0) return react.createElement("div", { className: "tkst-empty" }, T().empty);
			// per-point totals (models breakdown if present; fallback to plain total for stale caches)
			const pointModels = series.map((s) =>
				Array.isArray(s.models) && s.models.length ? s.models : [{ model: "", total: s.total }]);
			const totals = pointModels.map((ms) => ms.reduce((a, m) => a + m.total, 0));
			const max = Math.max.apply(null, totals.concat([1]));
			// stable model order across all points (by grand total)
			const grand = new Map();
			for (const ms of pointModels) for (const m of ms) grand.set(m.model, (grand.get(m.model) || 0) + m.total);
			const modelNames = [...grand.keys()];
			const colorOf = (name) => {
				if (!name) return "var(--dsw-alias-brand-primary)";
				return PALETTE[modelNames.indexOf(name) % PALETTE.length];
			};
			const n = series.length;
			const slot = (W - 2 * P) / n;
			const bw = Math.max(2, Math.min(slot * 0.85, 16)); // dense: bars nearly touching
			// horizontal dashed gridlines at 25/50/75%
			const gridLines = [0.25, 0.5, 0.75].map((f, i) => {
				const y = H - P - f * (H - 2 * P);
				return react.createElement("line", { key: "g" + i, x1: P, x2: W - P, y1: y.toFixed(1), y2: y.toFixed(1), stroke: "var(--dsw-alias-border-l1)", "stroke-dasharray": "3,4", "stroke-width": 1 });
			});
			// stacked slim bars; tooltip carries calls + cost per point
			const bars = [];
			for (let i = 0; i < n; i++) {
				const ms = pointModels[i];
				const pt = series[i];
				let acc = 0;
				for (let j = 0; j < ms.length; j++) {
					const h = Math.max(1, (ms[j].total / max) * (H - 2 * P));
					const y = H - P - acc - h;
					acc += h;
					const lines = [series[i].label + " · " + fmt(totals[i]) + " " + T().tokens];
					lines.push(T().calls + " " + pt.calls + " · " + fmtMoney(pt.usd) + " / " + fmtCny(pt.cny));
					if (ms.length > 1 || ms[0].model) for (const m of ms) lines.push("· " + m.model + ": " + fmt(m.total));
					bars.push(react.createElement("rect", {
						key: i + "-" + j, className: "tkst-bar-r",
						x: (P + i * slot).toFixed(2), y: y.toFixed(1),
						width: bw.toFixed(2), height: h.toFixed(1),
						fill: colorOf(ms[j].model), rx: j === ms.length - 1 ? 1.5 : 0
					}, react.createElement("title", null, lines.join("\n"))));
				}
			}
			const tickIdx = n <= 4 ? [0, n - 1]
				: [0, Math.round((n - 1) / 4), Math.round((n - 1) / 2), Math.round((3 * (n - 1)) / 4), n - 1];
			const showLegend = modelNames.filter(Boolean).length > 1;
			return react.createElement("div", null,
				showLegend ? react.createElement("div", { className: "tkst-legend" },
					modelNames.filter(Boolean).map((m) =>
						react.createElement("span", { key: m, className: "tkst-lg" },
							react.createElement("i", { style: { background: colorOf(m) } }), m))
				) : null,
				react.createElement("svg", { viewBox: "0 0 " + W + " " + H, className: "tkst-chart", preserveAspectRatio: "none" },
					gridLines,
					bars,
					react.createElement("text", { x: P, y: 13, "font-size": 10, fill: "var(--dsw-alias-label-secondary)" }, "≤ " + fmt(max)),
					tickIdx.map((i, k) => {
						if (i < 0 || i >= n) return null;
						const x = P + i * ((W - 2 * P)) / Math.max(n - 1, 1);
						return react.createElement("text", { key: "t" + k, x: x.toFixed(1), y: H - 7, "font-size": 10, fill: "var(--dsw-alias-label-secondary)", "text-anchor": k === 0 ? "start" : k === tickIdx.length - 1 ? "end" : "middle" }, series[i].label);
					})
				)
			);
		}

		// error boundary: a render bug must show a message, never a blank page
		class StatsErrorBoundary extends react.Component {
			constructor(props) { super(props); this.state = { err: null }; }
			static getDerivedStateFromError(e) { return { err: e }; }
			componentDidCatch(e) { try { console.error("[token-stats] render error", e); } catch (x) { /* noop */ } }
			render() {
				if (this.state.err) {
					const msg = String((this.state.err && this.state.err.message) || this.state.err);
					return react.createElement("div", { className: "tkst-err" }, "[token-stats] 渲染错误: " + msg);
				}
				return this.props.children;
			}
		}

		// ---------- full stats page (settings section) ----------
		function StatsView() {
			const [summary, setSummary] = react.useState(null);
			const [gran, setGran] = react.useState("day");
			const [model, setModel] = react.useState("");
			const [session, setSession] = react.useState("");
			const [q, setQ] = react.useState(null);
			const [q0, setQ0] = react.useState(null);
			const [meta, setMeta] = react.useState(null);
			const [sessions, setSessions] = react.useState([]);
			const [exportText, setExportText] = react.useState("");
			const [err, setErr] = react.useState("");
			const [loading, setLoading] = react.useState(true);      // initial load (no data yet)
			const [updating, setUpdating] = react.useState(false);   // background refresh in progress
			const [updatedAt, setUpdatedAt] = react.useState(null);  // last successful refresh time
			const [refreshTick, setRefreshTick] = react.useState(0); // manual refresh trigger
			const [sessQuery, setSessQuery] = react.useState("");     // session search box text
			const [sessOpen, setSessOpen] = react.useState(false);    // session dropdown open
			const [sortModel, setSortModel] = react.useState({ key: "total", dir: -1 }); // model table sort
			const [sortSess, setSortSess] = react.useState({ key: "total", dir: -1 });   // session table sort
			// drill-down: expanded model -> its sessions; expanded session -> daily detail
			const [drill, setDrill] = react.useState({ model: null, session: null });
			const [drillData, setDrillData] = react.useState({ model: null, session: null }); // {model: {sessions:[...]}, session: {series:[...]}}

			// mount + manual refresh: static data (sessions/models) + summary, cached
			react.useEffect(() => {
				let alive = true;
				// 1) instant paint from cache (stale-while-revalidate)
				const cSum = cacheGet(C_SUMMARY);
				const cMeta = cacheGet(C_META);
				const cSess = cacheGet(C_SESSIONS);
				if (cSum) { setSummary(cSum); setLoading(false); }
				if (cMeta) setMeta(cMeta);
				if (cSess) setSessions(cSess.sessions || []);
				// 2) background refresh
				setUpdating(true);
				const load = async () => {
					try {
						const [sum, metaRes, sessRes] = await Promise.all([
							api("summary", {}),
							api("models", {}),
							api("sessions", {}),
						]);
						if (!alive) return;
						setErr("");
						setLoading(false); setUpdating(false);
						setSummary(sum); setMeta(metaRes); setSessions(sessRes.sessions || []);
						setUpdatedAt(new Date());
						cacheSet(C_SUMMARY, sum); cacheSet(C_META, metaRes); cacheSet(C_SESSIONS, sessRes);
					} catch (e) {
						if (alive) { setLoading(false); setUpdating(false); setErr("API 错误: " + String(e && e.message ? e.message : e)); }
					}
				};
				load();
				// 3) quiet auto-refresh of summary cards while the tab is open
				const timer = setInterval(() => {
					api("summary", {}).then((sum) => {
						if (alive) { setSummary(sum); setUpdatedAt(new Date()); cacheSet(C_SUMMARY, sum); }
					}).catch(() => {});
				}, 30000);
				return () => { alive = false; clearInterval(timer); };
			}, [refreshTick]);

			// filter-dependent: query endpoint only, cached per filter combo
			react.useEffect(() => {
				let alive = true;
				const params = {};
				if (gran) params.granularity = gran;
				if (model) params.model = model;
				if (session) params.sessionId = session;
				// 1) instant paint from cache
				const cQ = cacheGet(C_QUERY(gran, model, session));
				if (cQ) {
					setQ(cQ);
					if (!model && !session && cQ.models) setQ0(cQ);
				}
				// 2) background refresh (keep previous data visible while it runs)
				const load = async () => {
					try {
						const res = await api("query", params);
						if (!alive) return;
						setErr("");
						setQ(res);
						setUpdatedAt(new Date());
						// keep the model dropdown fed by the unfiltered dataset only,
						// so a session filter cannot narrow the model list
						if (!model && !session && res && res.models) setQ0(res);
						cacheSet(C_QUERY(gran, model, session), res);
					} catch (e) {
						if (alive) setErr("API 错误: " + String(e && e.message ? e.message : e));
					}
				};
				load();
				return () => { alive = false; };
			}, [gran, model, session, refreshTick]);

			// drill-down loader: expanded model -> sessions; expanded session -> daily series
			react.useEffect(() => {
				let alive = true;
				const run = async () => {
					try {
						if (drill.model && !drillData.model) {
							const res = await api("query", { granularity: "day", model: drill.model });
							if (alive) setDrillData((d) => ({ ...d, model: res.sessions || [] }));
						}
						if (drill.session && !drillData.session) {
							const res = await api("query", { granularity: "day", sessionId: drill.session });
							if (alive) setDrillData((d) => ({ ...d, session: res.series || [] }));
						}
					} catch (e) {
						if (alive) setErr("钻取加载失败: " + String(e && e.message ? e.message : e));
					}
				};
				run();
				return () => { alive = false; };
			}, [drill, drillData.model, drillData.session]);

			const toggleModelDrill = (m) => {
				// always invalidate cached sub-rows so switching targets refetches
				setDrillData((d) => ({ ...d, model: null }));
				setDrill((d) => ({ ...d, model: d.model === m ? null : m }));
			};
			const toggleSessionDrill = (sid) => {
				setDrillData((d) => ({ ...d, session: null }));
				setDrill((d) => ({ ...d, session: d.session === sid ? null : sid }));
			};

			const t = T();
			const doExport = async (format) => {
				try {
					const params = { format };
					if (model) params.model = model;
					if (session) params.sessionId = session;
					const qs = new URLSearchParams(params);
					const res = await fetch("/token-stats/api?op=export&" + qs.toString(), { cache: "no-store" });
					if (!res.ok) throw new Error("export failed " + res.status);
					const disp = res.headers.get("content-disposition") || "";
					const m = disp.match(/filename="?([^";]+)"?/);
					const filename = m ? m[1] : "token-stats." + (format === "json" ? "json" : "csv");
					const content = await res.text();
					download(filename, content, (c) => setExportText(c));
				} catch (e) { setErr("导出错误: " + String(e && e.message ? e.message : e)); }
			};

			const cards = summary ? [
				[t.today, fmt(summary.today.total), t.calls + " " + summary.today.calls, summary.prev ? pctDelta(summary.today.total, summary.prev.yesterday.total) : null],
				[t.week, fmt(summary.week.total), t.calls + " " + summary.week.calls, summary.prev ? pctDelta(summary.week.total, summary.prev.lastWeek.total) : null],
				[t.month, fmt(summary.month.total), t.calls + " " + summary.month.calls, summary.prev ? pctDelta(summary.month.total, summary.prev.lastMonth.total) : null],
				[t.total, fmt(summary.total.total), t.calls + " " + summary.total.calls, null]
			] : null;

			const modelOptions = (q0 && q0.models ? q0.models : q && q.models ? q.models : []).map((m) => m.model);
			const uniqueModels = modelOptions.filter((v, i, a) => a.indexOf(v) === i);
			const modelRowsAll = q && q.models ? q.models : [];
			const sessionRowsAll = q && q.sessions ? q.sessions : [];
			// precompute a sortable period-over-period ratio per model row
			const modelRowsWithDelta = modelRowsAll.map((m) => ({
				...m,
				deltaRatio: m.prevTotal > 0 ? m.total / m.prevTotal : (m.prevTotal === 0 && m.total > 0 ? Infinity : 0),
			}));
			const modelRows = sortRows(modelRowsWithDelta, sortModel.key, sortModel.dir).slice(0, 20);
			const sessionRows = sortRows(sessionRowsAll, sortSess.key, sortSess.dir).slice(0, 20);
			const series = q && q.series ? q.series : [];
			// day granularity: dense view of the most recent 30 points
			const trendSeries = gran === "day" && series.length > 30 ? series.slice(-30) : series;
			const isLoading = loading && !summary && !q;

			// session search: fuzzy match on id/title
			const sessFiltered = sessQuery
				? sessions.filter((s) => (s.title || s.id).toLowerCase().indexOf(sessQuery.toLowerCase()) !== -1)
				: sessions;
			const sessSelTitle = session
				? (sessions.find((s) => s.id === session) || { title: session }).title
				: "";
			// drill-down rows for the expanded model / session
			const drillModelSessions = drill.model && drillData.model ? drillData.model : null;
			const drillSessionSeries = drill.session && drillData.session ? drillData.session : null;

			// summary strip under the cards: grand totals incl. cost (from unfiltered model aggregate)
			const sumUsd = q0 && q0.models ? q0.models.reduce((a, m) => a + (m.usd || 0), 0) : null;
			const sumCny = q0 && q0.models ? q0.models.reduce((a, m) => a + (m.cny || 0), 0) : null;

			const th = (label, sort, state, setState) => {
				const cls = state.key === sort ? (state.dir === 1 ? "tkst-sort-asc" : "tkst-sort-desc") : "";
				return react.createElement("th", {
					key: sort,
					className: cls,
					onClick: () => setState((s) => s.key === sort ? { key: sort, dir: -s.dir } : { key: sort, dir: -1 })
				}, label);
			};
			const deltaSpan = (d) => d
				? react.createElement("span", { className: "tkst-delta " + d.cls }, d.txt)
				: null;
			const shortName = (txt) => (txt && String(txt).length > 30 ? String(txt).slice(0, 29) + "…" : txt);
			const tableWrap = (el) => react.createElement("div", { className: "tkst-tablewrap" }, el);

			return react.createElement("div", null,
				err ? react.createElement("div", { className: "tkst-err" }, err) : null,
				isLoading
					? react.createElement("div", { className: "tkst-loading" },
						react.createElement("span", { className: "tkst-spin" }),
						react.createElement("span", null, t.loading))
					: react.createElement("div", null,
				react.createElement("div", { className: "tkst-cards" },
					cards ? cards.map((c, i) =>
						react.createElement("div", { className: "tkst-card", key: i },
							react.createElement("div", { className: "k" }, c[0]),
							react.createElement("div", { className: "v" }, c[1]),
							react.createElement("div", { className: "s" },
								react.createElement("span", null, c[2]),
								deltaSpan(c[3])
							)
						))
					: [0, 1, 2, 3].map((i) =>
						react.createElement("div", { className: "tkst-card", key: i },
							react.createElement("div", { className: "k" }, "—"),
							react.createElement("div", { className: "v" }, "—"),
							react.createElement("div", { className: "s" }, "")))),
				react.createElement("div", { className: "tkst-sumline" },
					summary ? [
						react.createElement("span", { key: "tk" }, "Σ " + t.tokens + " "),
						react.createElement("b", { key: "tkv" }, fmt(summary.total.total)),
						react.createElement("span", { key: "usd" }, t.costUsd + " "),
						react.createElement("b", { key: "usdv" }, fmtMoney(sumUsd)),
						react.createElement("span", { key: "cny" }, t.costCny + " "),
						react.createElement("b", { key: "cnyv" }, fmtCny(sumCny)),
						react.createElement("span", { key: "cl" }, t.calls + " "),
						react.createElement("b", { key: "clv" }, String(summary.total.calls))
					] : null),
				react.createElement("div", { className: "tkst-filters" },
					react.createElement("span", null, t.granularity),
					react.createElement("select", { value: gran, onChange: (e) => setGran(e.target.value) },
						react.createElement("option", { value: "day" }, t.day),
						react.createElement("option", { value: "week" }, t.weekG),
						react.createElement("option", { value: "month" }, t.monthG)
					),
					react.createElement("select", { value: model, onChange: (e) => setModel(e.target.value) },
						react.createElement("option", { value: "" }, t.allModels),
						uniqueModels.map((m) => react.createElement("option", { key: m, value: m }, m))
					),
					react.createElement("div", { className: "tkst-sess-input" },
						react.createElement("input", {
							type: "text", placeholder: t.searchSess,
							value: sessQuery,
							onFocus: () => setSessOpen(true),
							onBlur: () => setTimeout(() => setSessOpen(false), 150),
							onChange: (e) => { setSessQuery(e.target.value); setSessOpen(true); }
						}),
						sessOpen ? react.createElement("div", { className: "tkst-sess-list" },
							sessFiltered.length === 0
								? react.createElement("div", { className: "tkst-sess-empty" }, t.noMatch)
								: sessFiltered.map((s) => {
									const sel = s.id === session;
									return react.createElement("div", { key: s.id, className: sel ? "tkst-sess-sel" : "", onMouseDown: () => {
										setSession(sel ? "" : s.id);
										setSessQuery(sel ? "" : s.title || s.id);
										setSessOpen(false);
									}}, (s.title || s.id) + (sel ? " ✓" : ""));
								})
						) : null
					),
					session ? react.createElement("button", { onClick: () => { setSession(""); setSessQuery(""); } }, "✕ " + t.allSess) : null,
					react.createElement("button", { onClick: () => setRefreshTick((x) => x + 1), title: t.refresh },
						updating ? t.updating : "↻ " + t.refresh),
					react.createElement("button", { onClick: () => doExport("csv") }, t.exportCsv),
					react.createElement("button", { onClick: () => doExport("json") }, t.exportJson),
					react.createElement("span", { className: "tkst-rate" },
						meta ? t.usdRate + " 1 USD = " + meta.usdCny + " CNY · " + t.estimated : ""),
					updatedAt ? react.createElement("span", { className: "tkst-meta" },
						t.updatedAt + " " + fmtTime(updatedAt)) : null
				),
				react.createElement("div", { className: "tkst-grid" },
				react.createElement("div", { className: "tkst-full" },
					react.createElement("div", { className: "tkst-sec" },
						react.createElement("h4", null, t.trend),
						series.length === 0 && !q
							? react.createElement("div", { className: "tkst-empty" }, t.loading)
							: react.createElement(TrendChart, { series: trendSeries })
					)),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.byModel),
					modelRows.length === 0
						? react.createElement("div", { className: "tkst-empty" }, t.empty)
						: react.createElement("div", { className: "tkst-bars" }, modelRows.map((m) => {
							const max = modelRows[0].total || 1;
							return react.createElement("div", { className: "tkst-bar", key: m.model, onClick: () => toggleModelDrill(m.model), title: t.expand + ": " + m.model },
								react.createElement("span", { className: "n", title: m.model }, (drill.model === m.model ? "▾ " : "▸ ") + m.model),
								react.createElement("div", { className: "track" },
									react.createElement("div", { className: "fill", style: { width: Math.max(2, (m.total / max) * 100) + "%" } })),
								react.createElement("span", { className: "v2" }, fmt(m.total))
							);
						}))
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.byModel + " / " + t.bySession),
					tableWrap(react.createElement("table", { className: "tkst-table" },
						react.createElement("thead", null, react.createElement("tr", null,
							th(t.model, "model", sortModel, setSortModel),
							th(t.delta, "deltaRatio", sortModel, setSortModel),
							th(t.calls, "calls", sortModel, setSortModel),
							th(t.tokens, "total", sortModel, setSortModel),
							th(t.costUsd, "usd", sortModel, setSortModel),
							th(t.costCny, "cny", sortModel, setSortModel)
						)),
						react.createElement("tbody", null,
							modelRows.map((m) => {
								const dd = m.prevTotal > 0 ? pctDelta(m.total, m.prevTotal) : null;
								const isOpen = drill.model === m.model;
								return [
									react.createElement("tr", { key: m.model, className: "tkst-row-click", onClick: () => toggleModelDrill(m.model) },
										react.createElement("td", null, (isOpen ? "▾ " : "▸ ") + m.model),
										react.createElement("td", null, deltaSpan(dd)),
										react.createElement("td", null, m.calls),
										react.createElement("td", null, fmt(m.total)),
										react.createElement("td", null, fmtMoney(m.usd)), react.createElement("td", null, fmtCny(m.cny))
									),
									isOpen && drillModelSessions
										? react.createElement("tr", { key: m.model + "-sub" },
											react.createElement("td", { colSpan: 6, className: "tkst-sub" },
												tableWrap(react.createElement("table", { className: "tkst-table" },
													react.createElement("thead", null, react.createElement("tr", null,
														react.createElement("th", null, t.session), react.createElement("th", null, t.calls),
														react.createElement("th", null, t.tokens), react.createElement("th", null, t.costUsd)
													)),
													react.createElement("tbody", null, drillModelSessions.map((s) =>
														react.createElement("tr", { key: s.sessionId },
															react.createElement("td", { title: s.title || s.sessionId }, shortName(s.title || s.sessionId)),
															react.createElement("td", null, s.calls),
															react.createElement("td", null, fmt(s.total)),
															react.createElement("td", null, fmtMoney(s.usd))
														)))
												))
											))
										: null,
									isOpen && !drillModelSessions
										? react.createElement("tr", { key: m.model + "-sub-load" },
											react.createElement("td", { colSpan: 6, className: "tkst-sub" }, t.loading))
										: null
								];
							})
						)
					))
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.bySession),
					tableWrap(react.createElement("table", { className: "tkst-table" },
						react.createElement("thead", null, react.createElement("tr", null,
							th(t.session, "sessionId", sortSess, setSortSess),
							th(t.calls, "calls", sortSess, setSortSess),
							th(t.tokens, "total", sortSess, setSortSess),
							th(t.costUsd, "usd", sortSess, setSortSess),
							th(t.costCny, "cny", sortSess, setSortSess)
						)),
						react.createElement("tbody", null,
							sessionRows.map((s) => {
								const isOpen = drill.session === s.sessionId;
								return [
									react.createElement("tr", { key: s.sessionId, className: "tkst-row-click", onClick: () => toggleSessionDrill(s.sessionId) },
										react.createElement("td", { title: s.sessionId }, (isOpen ? "▾ " : "▸ ") + shortName(s.sessionId)),
										react.createElement("td", null, s.calls),
										react.createElement("td", null, fmt(s.total)),
										react.createElement("td", null, fmtMoney(s.usd)), react.createElement("td", null, fmtCny(s.cny))
									),
									isOpen && drillSessionSeries
										? react.createElement("tr", { key: s.sessionId + "-sub" },
											react.createElement("td", { colSpan: 5, className: "tkst-sub" },
												tableWrap(react.createElement("table", { className: "tkst-table" },
													react.createElement("thead", null, react.createElement("tr", null,
														react.createElement("th", null, t.day), react.createElement("th", null, t.calls),
														react.createElement("th", null, t.tokens), react.createElement("th", null, t.costUsd)
													)),
													react.createElement("tbody", null, drillSessionSeries.map((p) =>
														react.createElement("tr", { key: p.label },
															react.createElement("td", null, p.label), react.createElement("td", null, p.calls),
															react.createElement("td", null, fmt(p.total)),
															react.createElement("td", null, fmtMoney(p.usd))
														)))
												))
											))
										: null,
									isOpen && !drillSessionSeries
										? react.createElement("tr", { key: s.sessionId + "-sub-load" },
											react.createElement("td", { colSpan: 5, className: "tkst-sub" }, t.loading))
										: null
								];
							})
						)
					))
				),
				exportText ? react.createElement("div", { className: "tkst-exportbox" },
					react.createElement("div", null, t.copied),
					react.createElement("textarea", { readOnly: true, value: exportText })
				) : null
				)
					)
			);
		}

		// ---------- registration: settings section only ----------
		const inject = ["slots"];

		function apply(ctx) {
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "token-stats",
				order: 25,
				label: () => T().title
		}, () => react.createElement(StatsErrorBoundary, null,
			react.createElement(StatsView, {}))));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
