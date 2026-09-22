window.__ModuleLoader__.load({
	id: "dsh-token-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region styles
		const css = [
			// single-column vertical flow: no left/right split, no duplicate model bars.
			// roomy panels (padding 16/18), taller table rows (9px 14px, 13px), bigger gaps (18px page / 12px cards).
			".tkst-page{display:flex;flex-direction:column;gap:18px}",
			".tkst-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:12px}",
			".tkst-card{position:relative;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:14px 16px 14px 18px;overflow:hidden;transition:border-color .15s ease,box-shadow .15s ease}",
			".tkst-card::before{content:'';position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 3px 3px 0;background:var(--tkst-accent,var(--dsw-alias-brand-primary));opacity:.9}",
			".tkst-card:hover{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 35%,var(--dsw-alias-border-l1));box-shadow:0 1px 0 color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent) inset}",
			".tkst-card .k{font-size:12px;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}",
			".tkst-card .v{font-size:24px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);margin-top:3px;line-height:1.15;letter-spacing:-.02em}",
			".tkst-card .s{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}",
			".tkst-card .spark{position:absolute;right:8px;bottom:8px;opacity:.55;pointer-events:none}",
			".tkst-toolbar{display:flex;flex-direction:column;gap:10px}",
			".tkst-toolbar-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}",
			".tkst-toolbar .sp{flex:1;min-width:8px}",
			".tkst-seg{display:inline-flex;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:2px;gap:2px}",
			".tkst-seg button{background:transparent;color:var(--dsw-alias-label-secondary);border:0;border-radius:7px;padding:6px 14px;font-size:12.5px;cursor:pointer;transition:background .12s,color .12s}",
			".tkst-seg button:hover{color:var(--dsw-alias-label-primary)}",
			".tkst-seg button.tkst-seg-on{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 16%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-brand-primary);font-weight:600}",
			".tkst-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}",
			".tkst-filters select{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 10px;font-size:12.5px}",
			".tkst-filters button,.tkst-btn{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 12px;font-size:12.5px;cursor:pointer;transition:border-color .12s,color .12s,background .12s}",
			".tkst-filters button:hover,.tkst-btn:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}",
			".tkst-btn-primary{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,var(--dsw-alias-bg-layer-1));border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 40%,var(--dsw-alias-border-l1));color:var(--dsw-alias-brand-primary);font-weight:600}",
			".tkst-btn-primary:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 22%,var(--dsw-alias-bg-layer-1))}",
			".tkst-filters input[type=text]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 10px;font-size:12.5px;min-width:200px}",
			".tkst-filters input[type=text]:focus{border-color:var(--dsw-alias-brand-primary);outline:none;box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent)}",
			".tkst-chips{display:flex;gap:10px;flex-wrap:wrap;align-items:center}",
			".tkst-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:4px 12px;font-variant-numeric:tabular-nums}",
			".tkst-chip b{color:var(--dsw-alias-label-primary);font-weight:600}",
			".tkst-sec{display:flex;flex-direction:column;gap:10px;min-width:0}",
			".tkst-sec-hd{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}",
			".tkst-sec-hd h4{margin:0;font-size:13px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}",
			".tkst-sec-hd .hd-meta{font-size:11px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}",
			".tkst-panel{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:16px 18px}",
			".tkst-chart{width:100%;height:240px;display:block}",
			".tkst-chart-wrap{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:12px 10px 8px}",
			".tkst-legend{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--dsw-alias-label-secondary);margin-bottom:8px;padding:0 6px}",
			".tkst-legend .tkst-lg{display:inline-flex;align-items:center;gap:5px}",
			".tkst-legend .tkst-lg i{display:inline-block;width:9px;height:9px;border-radius:3px;box-shadow:0 0 0 1px color-mix(in srgb,#fff 12%,transparent)}",
			".tkst-chart rect.tkst-bar-r{opacity:.82;transition:opacity .12s ease}",
			".tkst-chart rect.tkst-bar-r:hover{opacity:1}",
			".tkst-chart .tkst-total-line{fill:none;stroke:color-mix(in srgb,var(--dsw-alias-label-primary) 55%,transparent);stroke-width:1.25;stroke-linejoin:round;stroke-linecap:round;pointer-events:none}",
			".tkst-chart .tkst-total-dot{fill:var(--dsw-alias-label-primary);opacity:.7;pointer-events:none}",
			".tkst-donut-row{display:flex;gap:20px;align-items:center;flex-wrap:wrap}",
			".tkst-donut-legend{display:flex;flex-direction:column;gap:10px;min-width:0;flex:1}",
			".tkst-donut-legend .row{display:grid;grid-template-columns:11px 1fr auto;gap:10px;align-items:center;font-size:13px;min-width:0}",
			".tkst-donut-legend .row i{width:11px;height:11px;border-radius:3px}",
			".tkst-donut-legend .row .n{color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".tkst-donut-legend .row .v{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}",
			".tkst-donut{flex-shrink:0}",
			".tkst-tablewrap{overflow:auto;width:100%;max-height:480px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}",
			".tkst-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}",
			".tkst-table th{position:sticky;top:0;z-index:2;text-align:left;color:var(--dsw-alias-label-secondary);font-weight:600;padding:10px 14px;background:var(--dsw-alias-bg-layer-2);border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap;cursor:pointer;user-select:none}",
			".tkst-table th:hover{color:var(--dsw-alias-label-primary)}",
			".tkst-table th.tkst-sort-asc::after{content:' ▲';font-size:9px;opacity:.8}",
			".tkst-table th.tkst-sort-desc::after{content:' ▼';font-size:9px;opacity:.8}",
			".tkst-table td{padding:9px 14px;color:var(--dsw-alias-label-primary);border-bottom:1px solid color-mix(in srgb,var(--dsw-alias-border-l1) 70%,transparent);font-variant-numeric:tabular-nums;white-space:nowrap;background:var(--dsw-alias-bg-layer-1)}",
			".tkst-table tbody tr:hover td{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 6%,var(--dsw-alias-bg-layer-1))}",
			".tkst-table tr.tkst-row-click{cursor:pointer}",
			".tkst-table tr.tkst-row-click td:first-child{box-shadow:inset 2px 0 0 transparent;transition:box-shadow .12s}",
			".tkst-table tr.tkst-row-click:hover td:first-child{box-shadow:inset 2px 0 0 var(--dsw-alias-brand-primary)}",
			".tkst-table tr.tkst-sub td{background:var(--dsw-alias-bg-layer-2);padding:0;border-bottom:1px solid var(--dsw-alias-border-l1)}",
			".tkst-table .tkst-mdot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}",
			".tkst-delta{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.45}",
			".tkst-delta.up{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 14%,transparent)}",
			".tkst-delta.down{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 14%,transparent)}",
			".tkst-delta.flat{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}",
			".tkst-empty{color:var(--dsw-alias-label-secondary);font-size:12px;padding:24px;text-align:center}",
			".tkst-exportbox{margin-top:4px;padding:10px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px}",
			".tkst-exportbox textarea{width:100%;height:140px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;font-size:11px;padding:8px;font-family:ui-monospace,Consolas,monospace}",
			".tkst-err{margin:0;padding:8px 10px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 18%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-error-primary);border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 35%,transparent);border-radius:8px;font-size:12px;white-space:pre-wrap}",
			".tkst-loading{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px;padding:20px;justify-content:center}",
			".tkst-spin{width:14px;height:14px;border:2px solid var(--dsw-alias-border-l1);border-top-color:var(--dsw-alias-brand-primary);border-radius:50%;animation:tkst-rot .8s linear infinite}",
			"@keyframes tkst-rot{to{transform:rotate(360deg)}}",
			".tkst-skel{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:12px}",
			".tkst-skel .sk{height:88px;border-radius:14px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-1) 25%,var(--dsw-alias-bg-layer-2) 50%,var(--dsw-alias-bg-layer-1) 75%);background-size:200% 100%;animation:tkst-shimmer 1.2s ease-in-out infinite;border:1px solid var(--dsw-alias-border-l1)}",
			"@keyframes tkst-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}",
			"@media (prefers-reduced-motion:reduce){.tkst-spin,.tkst-skel .sk{animation:none}.tkst-card,.tkst-filters button{transition:none}}",
			".tkst-meta{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;font-variant-numeric:tabular-nums}",
			".tkst-sess-input{position:relative}",
			".tkst-sess-list{position:absolute;top:calc(100% + 2px);left:0;z-index:50;min-width:220px;max-height:220px;overflow:auto;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.28)}",
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
				noMatch: "无匹配会话", allSess: "全部会话", delta: "环比",
				costShare: "费用构成", session: "会话", topModels: "Top 模型"
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
				noMatch: "No matching session", allSess: "All sessions", delta: "Change",
				costShare: "Cost share", session: "Session", topModels: "Top models"
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

		// model identity color: stable across chart / bars / tables / donut
		const PALETTE = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#22c55e", "#ef4444", "#6366f1", "#14b8a6"];
		const colorOfName = (name, names) => {
			if (!name) return "var(--dsw-alias-brand-primary)";
			const i = (names || []).indexOf(name);
			return PALETTE[(i < 0 ? 0 : i) % PALETTE.length];
		};
		const modelNamesOf = (models) => {
			const grand = new Map();
			for (const list of models) {
				for (const m of list) grand.set(m.model, (grand.get(m.model) || 0) + m.total);
			}
			return [...grand.keys()];
		};

		// ---------- mini sparkline (cards) ----------
		function MiniSpark({ values, color, w, h }) {
			w = w || 64; h = h || 22;
			if (!values || values.length < 2) return null;
			const max = Math.max.apply(null, values.concat([1]));
			const min = 0;
			const n = values.length;
			const pts = values.map((v, i) => {
				const x = (i / (n - 1)) * (w - 2) + 1;
				const y = h - 2 - ((v - min) / (max - min || 1)) * (h - 4);
				return x.toFixed(1) + "," + y.toFixed(1);
			});
			return react.createElement("svg", { className: "spark", width: w, height: h, viewBox: "0 0 " + w + " " + h, "aria-hidden": "true" },
				react.createElement("polyline", {
					points: pts.join(" "),
					fill: "none",
					stroke: color || "var(--dsw-alias-brand-primary)",
					"stroke-width": "1.5",
					"stroke-linejoin": "round",
					"stroke-linecap": "round"
				})
			);
		}

		// ---------- cost share donut ----------
		function CostDonut({ models, colorOf }) {
			const rows = (models || []).filter((m) => (m.usd || 0) > 0).slice(0, 6);
			const sum = rows.reduce((a, m) => a + (m.usd || 0), 0);
			if (!sum) return react.createElement("div", { className: "tkst-empty" }, T().empty);
			const R = 36, C = 2 * Math.PI * R;
			let acc = 0;
			const arcs = rows.map((m, i) => {
				const frac = (m.usd || 0) / sum;
				const len = frac * C;
				const el = react.createElement("circle", {
					key: m.model,
					cx: 50, cy: 50, r: R,
					fill: "none",
					stroke: colorOf(m.model),
					"stroke-width": 12,
					"stroke-dasharray": len.toFixed(2) + " " + (C - len).toFixed(2),
					"stroke-dashoffset": (-acc * C).toFixed(2),
					transform: "rotate(-90 50 50)",
					opacity: 0.92
				});
				acc += frac;
				return el;
			});
			return react.createElement("div", { className: "tkst-donut-row" },
				react.createElement("svg", { className: "tkst-donut", width: 100, height: 100, viewBox: "0 0 100 100" },
					arcs,
					react.createElement("text", { x: 50, y: 48, "text-anchor": "middle", "font-size": 11, fill: "var(--dsw-alias-label-secondary)" }, "USD"),
					react.createElement("text", { x: 50, y: 62, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "var(--dsw-alias-label-primary)" },
						sum < 0.01 ? sum.toFixed(4) : sum.toFixed(2))
				),
				react.createElement("div", { className: "tkst-donut-legend" },
					rows.map((m) => {
						const pct = ((m.usd || 0) / sum * 100).toFixed(1) + "%";
						return react.createElement("div", { className: "row", key: m.model },
							react.createElement("i", { style: { background: colorOf(m.model) } }),
							react.createElement("span", { className: "n", title: m.model }, m.model),
							react.createElement("span", { className: "v" }, fmtMoney(m.usd) + " · " + pct)
						);
					})
				)
			);
		}

		// ---------- trend chart: slim dense stacked bars, gridlines, legend, total line ----------
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
			// keep self-contained (pseudo-exec unit test evals this function alone)
			const colorOf = (name) => {
				if (!name) return "var(--dsw-alias-brand-primary)";
				const i = modelNames.indexOf(name);
				return PALETTE[(i < 0 ? 0 : i) % PALETTE.length];
			};
			const n = series.length;
			const slot = (W - 2 * P) / n;
			const bw = Math.max(2, Math.min(slot * 0.85, 16)); // dense: bars nearly touching
			// horizontal dashed gridlines at 25/50/75%
			const gridLines = [0.25, 0.5, 0.75].map((f, i) => {
				const y = H - P - f * (H - 2 * P);
				return react.createElement("line", { key: "g" + i, x1: P, x2: W - P, y1: y.toFixed(1), y2: y.toFixed(1), stroke: "var(--dsw-alias-border-l1)", "stroke-dasharray": "3,4", "stroke-width": 1 });
			});
			// defs: vertical gradients per palette index
			const defs = react.createElement("defs", null,
				PALETTE.map((c, i) =>
					react.createElement("linearGradient", { key: "gr" + i, id: "tkst-grad-" + i, x1: "0", y1: "0", x2: "0", y2: "1" },
						react.createElement("stop", { offset: "0%", "stop-color": c, "stop-opacity": "0.95" }),
						react.createElement("stop", { offset: "100%", "stop-color": c, "stop-opacity": "0.35" })
					)
				),
				react.createElement("linearGradient", { key: "gr-def", id: "tkst-grad-def", x1: "0", y1: "0", x2: "0", y2: "1" },
					react.createElement("stop", { offset: "0%", "stop-color": "#8b5cf6", "stop-opacity": "0.95" }),
					react.createElement("stop", { offset: "100%", "stop-color": "#8b5cf6", "stop-opacity": "0.35" })
				)
			);
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
					const gi = modelNames.indexOf(ms[j].model);
					const fill = !ms[j].model ? "url(#tkst-grad-def)" : "url(#tkst-grad-" + ((gi < 0 ? 0 : gi) % PALETTE.length) + ")";
					bars.push(react.createElement("rect", {
						key: i + "-" + j, className: "tkst-bar-r",
						x: (P + i * slot).toFixed(2), y: y.toFixed(1),
						width: bw.toFixed(2), height: h.toFixed(1),
						fill: fill, rx: j === ms.length - 1 ? 1.5 : 0
					}, react.createElement("title", null, lines.join("\n"))));
				}
			}
			// total trend polyline over the stacks
			const linePts = series.map((s, i) => {
				const x = P + i * slot + bw / 2;
				const y = H - P - (totals[i] / max) * (H - 2 * P);
				return x.toFixed(1) + "," + y.toFixed(1);
			}).join(" ");
			const lastX = P + (n - 1) * slot + bw / 2;
			const lastY = H - P - (totals[n - 1] / max) * (H - 2 * P);
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
					defs,
					gridLines,
					bars,
					react.createElement("polyline", { className: "tkst-total-line", points: linePts }),
					n > 0 ? react.createElement("circle", { className: "tkst-total-dot", cx: lastX.toFixed(1), cy: lastY.toFixed(1), r: 2.5 }) : null,
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

			const modelOptions = (q0 && q0.models ? q0.models : q && q.models ? q.models : []).map((m) => m.model);
			const uniqueModels = modelOptions.filter((v, i, a) => a.indexOf(v) === i);
			const modelRowsAll = q && q.models ? q.models : [];
			const sessionRowsAll = q && q.sessions ? q.sessions : [];
			// shared model identity list (chart + bars + donut + tables)
			const identityModels = (q0 && q0.models ? q0.models : modelRowsAll).map((m) => ({ model: m.model, total: m.total, usd: m.usd || 0 }));
			const identityNames = identityModels.map((m) => m.model);
			const colorOf = (name) => colorOfName(name, identityNames);
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
			// sparkline source: unfiltered daily series preferred
			const sparkSeries = (q0 && q0.series ? q0.series : series).slice(-14).map((s) => s.total || 0);
			const isLoading = loading && !summary && !q;

			// session search: fuzzy match on id/title
			const sessFiltered = sessQuery
				? sessions.filter((s) => (s.title || s.id).toLowerCase().indexOf(sessQuery.toLowerCase()) !== -1)
				: sessions;
			// sessionId -> display title (join with op=sessions titles so tables show
			// readable session names instead of raw UUIDs)
			const sessTitleMap = new Map(sessions.map((s) => [s.id, s.title || s.id]));
			// drill-down rows for the expanded model / session
			const drillModelSessions = drill.model && drillData.model ? drillData.model : null;
			const drillSessionSeries = drill.session && drillData.session ? drillData.session : null;

			// summary strip under the cards: grand totals incl. cost (from unfiltered model aggregate)
			const sumUsd = q0 && q0.models ? q0.models.reduce((a, m) => a + (m.usd || 0), 0) : null;
			const sumCny = q0 && q0.models ? q0.models.reduce((a, m) => a + (m.cny || 0), 0) : null;

			const cardAccents = ["#06b6d4", "#8b5cf6", "#f59e0b", "#22c55e"];
			const cards = summary ? [
				[t.today, fmt(summary.today.total), t.calls + " " + summary.today.calls, summary.prev ? pctDelta(summary.today.total, summary.prev.yesterday.total) : null, cardAccents[0]],
				[t.week, fmt(summary.week.total), t.calls + " " + summary.week.calls, summary.prev ? pctDelta(summary.week.total, summary.prev.lastWeek.total) : null, cardAccents[1]],
				[t.month, fmt(summary.month.total), t.calls + " " + summary.month.calls, summary.prev ? pctDelta(summary.month.total, summary.prev.lastMonth.total) : null, cardAccents[2]],
				[t.total, fmt(summary.total.total), t.calls + " " + summary.total.calls, null, cardAccents[3]]
			] : null;

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
			const modelDot = (name) => react.createElement("span", { className: "tkst-mdot", style: { background: colorOf(name) } });

			// assemble page children in a flat list (avoids deep ternary nesting)
			const page = [];
			if (err) page.push(react.createElement("div", { key: "err", className: "tkst-err" }, err));
			if (isLoading) {
				page.push(react.createElement("div", { key: "load" },
					react.createElement("div", { className: "tkst-skel" },
						[0, 1, 2, 3].map((i) => react.createElement("div", { className: "sk", key: i }))),
					react.createElement("div", { className: "tkst-loading" },
						react.createElement("span", { className: "tkst-spin" }),
						react.createElement("span", null, t.loading))
				));
			} else {
				page.push(react.createElement("div", { key: "cards", className: "tkst-cards" },
					cards
						? cards.map((c, i) => react.createElement("div", {
							className: "tkst-card", key: i,
							style: { "--tkst-accent": c[4] }
						},
							react.createElement("div", { className: "k" }, c[0]),
							react.createElement("div", { className: "v" }, c[1]),
							react.createElement("div", { className: "s" },
								react.createElement("span", null, c[2]),
								deltaSpan(c[3])
							),
							sparkSeries.length > 1 && i < 3
								? react.createElement(MiniSpark, { values: sparkSeries, color: c[4] })
								: null
						))
						: [0, 1, 2, 3].map((i) => react.createElement("div", {
							className: "tkst-card", key: i,
							style: { "--tkst-accent": cardAccents[i] }
						},
							react.createElement("div", { className: "k" }, "—"),
							react.createElement("div", { className: "v" }, "—"),
							react.createElement("div", { className: "s" }, "")
						))
				));

				// toolbar: two rows — controls (granularity/filters/actions) on top,
				// summary chips + updated time below. No more one-line cramming.
				page.push(react.createElement("div", { key: "toolbar", className: "tkst-toolbar" },
					react.createElement("div", { className: "tkst-toolbar-row" },
						react.createElement("div", { className: "tkst-seg" },
							["day", "week", "month"].map((g) =>
								react.createElement("button", {
									key: g,
									className: gran === g ? "tkst-seg-on" : "",
									onClick: () => setGran(g)
								}, g === "day" ? t.day : g === "week" ? t.weekG : t.monthG))
						),
						react.createElement("div", { className: "tkst-filters" },
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
								sessOpen
									? react.createElement("div", { className: "tkst-sess-list" },
										sessFiltered.length === 0
											? react.createElement("div", { className: "tkst-sess-empty" }, t.noMatch)
											: sessFiltered.map((s) => {
												const sel = s.id === session;
												return react.createElement("div", {
													key: s.id,
													className: sel ? "tkst-sess-sel" : "",
													onMouseDown: () => {
														setSession(sel ? "" : s.id);
														setSessQuery(sel ? "" : s.title || s.id);
														setSessOpen(false);
													}
												}, (s.title || s.id) + (sel ? " ✓" : ""));
											})
									)
									: null
							),
							session
								? react.createElement("button", { onClick: () => { setSession(""); setSessQuery(""); } }, "✕ " + t.allSess)
								: null
						),
						react.createElement("span", { className: "sp" }),
						react.createElement("div", { className: "tkst-filters" },
							react.createElement("button", {
								className: "tkst-btn-primary",
								onClick: () => setRefreshTick((x) => x + 1),
								title: t.refresh
							}, updating ? t.updating : "↻ " + t.refresh),
							react.createElement("button", { onClick: () => doExport("csv") }, t.exportCsv),
							react.createElement("button", { onClick: () => doExport("json") }, t.exportJson)
						)
					),
					react.createElement("div", { className: "tkst-toolbar-row" },
						react.createElement("div", { className: "tkst-chips" },
							summary
								? react.createElement("span", { className: "tkst-chip" },
									"Σ ", react.createElement("b", null, fmt(summary.total.total)), " ", t.tokens)
								: null,
							sumUsd != null
								? react.createElement("span", { className: "tkst-chip" },
									t.costUsd, " ", react.createElement("b", null, fmtMoney(sumUsd)))
								: null,
							sumCny != null
								? react.createElement("span", { className: "tkst-chip" },
									t.costCny, " ", react.createElement("b", null, fmtCny(sumCny)))
								: null,
							summary
								? react.createElement("span", { className: "tkst-chip" },
									t.calls, " ", react.createElement("b", null, String(summary.total.calls)))
								: null,
							meta
								? react.createElement("span", { className: "tkst-chip" },
									t.usdRate, " 1 USD = ", react.createElement("b", null, String(meta.usdCny)), " CNY")
								: null,
							updatedAt
								? react.createElement("span", { className: "tkst-meta" }, t.updatedAt + " " + fmtTime(updatedAt))
								: null
						)
					)
				));

				page.push(react.createElement("div", { key: "trend", className: "tkst-sec" },
					react.createElement("div", { className: "tkst-sec-hd" },
						react.createElement("h4", null, t.trend),
						react.createElement("span", { className: "hd-meta" },
							gran === "day" && trendSeries.length
								? trendSeries[0].label + " → " + trendSeries[trendSeries.length - 1].label
								: "")
					),
					react.createElement("div", { className: "tkst-chart-wrap" },
						series.length === 0 && !q
							? react.createElement("div", { className: "tkst-empty" }, t.loading)
							: react.createElement(TrendChart, { series: trendSeries })
					)
				));

				// 费用构成: full-width panel (donut left, legend right) —
				// replaces the cramped left column + duplicate model bars list.
				page.push(react.createElement("div", { key: "cost", className: "tkst-sec" },
					react.createElement("div", { className: "tkst-sec-hd" },
						react.createElement("h4", null, t.costShare),
						modelRowsAll.length
							? react.createElement("span", { className: "hd-meta" }, modelRowsAll.length + " " + t.model)
							: null
					),
					react.createElement("div", { className: "tkst-panel" },
						react.createElement(CostDonut, {
							models: (q0 && q0.models ? q0.models : modelRowsAll).map((m) => ({
								model: m.model, usd: m.usd, total: m.total
							})),
							colorOf
						})
					)
				));

				const modelTable = tableWrap(react.createElement("table", { className: "tkst-table" },
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
							const rows = [
								react.createElement("tr", {
									key: m.model, className: "tkst-row-click",
									onClick: () => toggleModelDrill(m.model)
								},
									react.createElement("td", null, modelDot(m.model), (isOpen ? "▾ " : "▸ ") + m.model),
									react.createElement("td", null, deltaSpan(dd)),
									react.createElement("td", null, m.calls),
									react.createElement("td", null, fmt(m.total)),
									react.createElement("td", null, fmtMoney(m.usd)),
									react.createElement("td", null, fmtCny(m.cny))
								)
							];
							if (isOpen && drillModelSessions) {
								rows.push(react.createElement("tr", { key: m.model + "-sub" },
									react.createElement("td", { colSpan: 6, className: "tkst-sub" },
										tableWrap(react.createElement("table", { className: "tkst-table" },
											react.createElement("thead", null, react.createElement("tr", null,
												react.createElement("th", null, t.session),
												react.createElement("th", null, t.calls),
												react.createElement("th", null, t.tokens),
												react.createElement("th", null, t.costUsd)
											)),
											react.createElement("tbody", null, drillModelSessions.map((s) =>
												react.createElement("tr", { key: s.sessionId },
													react.createElement("td", { title: s.title || s.sessionId }, shortName(s.title || s.sessionId)),
													react.createElement("td", null, s.calls),
													react.createElement("td", null, fmt(s.total)),
													react.createElement("td", null, fmtMoney(s.usd))
												)
											))
										))
									)
								));
							} else if (isOpen) {
								rows.push(react.createElement("tr", { key: m.model + "-sub-load" },
									react.createElement("td", { colSpan: 6, className: "tkst-sub" }, t.loading)
								));
							}
							return rows;
						})
					)
				));

				// 按模型统计: full-width table — the single source of model stats.
				// (The old left-column bars list duplicated this data and truncated names.)
				page.push(react.createElement("div", { key: "models", className: "tkst-sec" },
					react.createElement("div", { className: "tkst-sec-hd" },
						react.createElement("h4", null, t.byModel),
						modelRowsAll.length
							? react.createElement("span", { className: "hd-meta" }, modelRowsAll.length + " " + t.model)
							: null
					),
					modelRows.length === 0
						? react.createElement("div", { className: "tkst-panel" },
							react.createElement("div", { className: "tkst-empty" }, t.empty))
						: modelTable
				));

				page.push(react.createElement("div", { key: "sess", className: "tkst-sec" },
					react.createElement("div", { className: "tkst-sec-hd" },
						react.createElement("h4", null, t.bySession),
						sessionRowsAll.length
							? react.createElement("span", { className: "hd-meta" }, sessionRowsAll.length + " " + t.session)
							: null
					),
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
								const rows = [
									react.createElement("tr", {
										key: s.sessionId, className: "tkst-row-click",
										onClick: () => toggleSessionDrill(s.sessionId)
									},
										react.createElement("td", { title: s.sessionId }, (isOpen ? "▾ " : "▸ ") + shortName(sessTitleMap.get(s.sessionId) || s.sessionId)),
										react.createElement("td", null, s.calls),
										react.createElement("td", null, fmt(s.total)),
										react.createElement("td", null, fmtMoney(s.usd)),
										react.createElement("td", null, fmtCny(s.cny))
									)
								];
								if (isOpen && drillSessionSeries) {
									rows.push(react.createElement("tr", { key: s.sessionId + "-sub" },
										react.createElement("td", { colSpan: 5, className: "tkst-sub" },
											tableWrap(react.createElement("table", { className: "tkst-table" },
												react.createElement("thead", null, react.createElement("tr", null,
													react.createElement("th", null, t.day),
													react.createElement("th", null, t.calls),
													react.createElement("th", null, t.tokens),
													react.createElement("th", null, t.costUsd)
												)),
												react.createElement("tbody", null, drillSessionSeries.map((p) =>
													react.createElement("tr", { key: p.label },
														react.createElement("td", null, p.label),
														react.createElement("td", null, p.calls),
														react.createElement("td", null, fmt(p.total)),
														react.createElement("td", null, fmtMoney(p.usd))
													)
												))
											))
										)
									));
								} else if (isOpen) {
									rows.push(react.createElement("tr", { key: s.sessionId + "-sub-load" },
										react.createElement("td", { colSpan: 5, className: "tkst-sub" }, t.loading)
									));
								}
								return rows;
							})
						)
					))
				));

				if (exportText) {
					page.push(react.createElement("div", { key: "export", className: "tkst-exportbox" },
						react.createElement("div", null, t.copied),
						react.createElement("textarea", { readOnly: true, value: exportText })
					));
				}
			}

			return react.createElement("div", { className: "tkst-page" }, page);
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
