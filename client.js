window.__ModuleLoader__.load({
	id: "dsh-token-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region styles
		const css = [
			".tkst-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}",
			".tkst-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px}",
			".tkst-card .k{font-size:11px;color:var(--dsw-alias-label-secondary)}",
			".tkst-card .v{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);margin-top:2px}",
			".tkst-card .s{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px}",
			".tkst-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px}",
			".tkst-filters select{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 10px;font-size:12px}",
			".tkst-filters button{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 12px;font-size:12px;cursor:pointer}",
			".tkst-filters button:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}",
			".tkst-sec{margin-bottom:16px}",
			".tkst-sec h4{margin:0 0 8px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}",
			".tkst-chart{width:100%;height:170px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px}",
			".tkst-bars{display:flex;flex-direction:column;gap:6px}",
			".tkst-bar{display:grid;grid-template-columns:150px 1fr 90px;gap:10px;align-items:center;font-size:12px}",
			".tkst-bar .n{color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".tkst-bar .track{background:var(--dsw-alias-bg-layer-2);border-radius:5px;height:14px;overflow:hidden}",
			".tkst-bar .fill{height:100%;background:var(--dsw-alias-brand-primary);border-radius:5px;min-width:2px}",
			".tkst-bar .v2{color:var(--dsw-alias-label-secondary);text-align:right;font-variant-numeric:tabular-nums}",
			".tkst-table{width:100%;border-collapse:collapse;font-size:12px}",
			".tkst-table th{text-align:left;color:var(--dsw-alias-label-secondary);font-weight:600;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}",
			".tkst-table td{padding:6px 8px;color:var(--dsw-alias-label-primary);border-bottom:1px solid var(--dsw-alias-border-l1);font-variant-numeric:tabular-nums;white-space:nowrap}",
			".tkst-table tr:hover td{background:var(--dsw-alias-bg-layer-1)}",
			".tkst-empty{color:var(--dsw-alias-label-secondary);font-size:12px;padding:18px;text-align:center}",
			".tkst-rate{font-size:11px;color:var(--dsw-alias-label-secondary);margin-left:auto;padding-right:4px}",
			".tkst-exportbox{margin-top:10px;padding:10px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px}",
			".tkst-exportbox textarea{width:100%;height:120px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;font-size:11px;padding:8px;font-family:ui-monospace,Consolas,monospace}",
			".tkst-err{margin:8px 0;padding:8px 10px;background:var(--dsw-alias-state-error-primary);color:#fff;border-radius:8px;font-size:12px;white-space:pre-wrap}"
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
				estimated: "含估算", usdRate: "汇率", copied: "导出内容已生成（浏览器限制，请手动复制下方内容）"
			},
			en: {
				title: "📊 Token Stats", today: "Today", week: "Week", month: "Month", total: "Total",
				model: "Model", calls: "Calls", input: "Input", output: "Output",
				tokens: "Tokens", costUsd: "Cost (USD)", costCny: "Cost (CNY)",
				granularity: "Granularity", day: "Day", weekG: "Week", monthG: "Month", allModels: "All models",
				allSessions: "All sessions", trend: "Usage Trend", byModel: "By Model", bySession: "By Session",
				exportCsv: "Export CSV", exportJson: "Export JSON", empty: "No data",
				estimated: "incl. estimated", usdRate: "Rate", copied: "Export content generated (browser limits, copy manually below)"
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

		// ---------- line chart (SVG) ----------
		function LineChart({ series }) {
			const W = 820, H = 160, P = 26;
			if (!series || series.length === 0) return react.createElement("div", { className: "tkst-empty" }, T().empty);
			const max = Math.max.apply(null, series.map((s) => s.total)) || 1;
			const n = series.length;
			const pts = series.map((s, i) => {
				const x = P + (i * (W - 2 * P)) / Math.max(n - 1, 1);
				const y = H - P - (s.total / max) * (H - 2 * P);
				return x.toFixed(1) + "," + y.toFixed(1);
			}).join(" ");
			const last = series[series.length - 1];
			const tickIdx = [0, Math.floor((n - 1) / 2), n - 1];
			return react.createElement("svg", { viewBox: "0 0 " + W + " " + H, className: "tkst-chart", preserveAspectRatio: "none" },
				react.createElement("polyline", { points: pts, fill: "none", stroke: "var(--dsw-alias-brand-primary)", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }),
				tickIdx.map((i) => {
					if (i < 0 || i >= n) return null;
					const x = P + (i * (W - 2 * P)) / Math.max(n - 1, 1);
					return react.createElement("text", { key: i, x: x, y: H - 8, "font-size": 10, fill: "var(--dsw-alias-label-secondary)", "text-anchor": "middle" }, series[i].label);
				}),
				react.createElement("text", { x: W - P, y: 14, "font-size": 11, fill: "var(--dsw-alias-label-secondary)", "text-anchor": "end" },
					T().tokens + ": " + fmt(last.total))
			);
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

			// mount-only: static data (sessions/models) + summary; filters do not affect them
			react.useEffect(() => {
				let alive = true;
				const load = async () => {
					try {
						const [sum, metaRes, sessRes] = await Promise.all([
							api("summary", {}),
							api("models", {}),
							api("sessions", {}),
						]);
						if (!alive) return;
						setErr("");
						setSummary(sum); setMeta(metaRes); setSessions(sessRes.sessions || []);
					} catch (e) {
						if (alive) setErr("API 错误: " + String(e && e.message ? e.message : e));
					}
				};
				load();
				// keep the summary cards (incl. live in-flight usage) fresh while the tab is open
				const timer = setInterval(() => {
					api("summary", {}).then((sum) => { if (alive) setSummary(sum); }).catch(() => {});
				}, 60000);
				return () => { alive = false; clearInterval(timer); };
			}, []);

			// filter-dependent: only the query endpoint is refetched
			react.useEffect(() => {
				let alive = true;
				const load = async () => {
					try {
						const params = {};
						if (gran) params.granularity = gran;
						if (model) params.model = model;
						if (session) params.sessionId = session;
						const res = await api("query", params);
						if (!alive) return;
						setErr("");
						setQ(res);
						// keep the model dropdown fed by the unfiltered dataset only,
						// so a session filter cannot narrow the model list
						if (!model && !session && res && res.models) setQ0(res);
					} catch (e) {
						if (alive) setErr("API 错误: " + String(e && e.message ? e.message : e));
					}
				};
				load();
				return () => { alive = false; };
			}, [gran, model, session]);

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
				[t.today, fmt(summary.today.total), t.calls + " " + summary.today.calls],
				[t.week, fmt(summary.week.total), t.calls + " " + summary.week.calls],
				[t.month, fmt(summary.month.total), t.calls + " " + summary.month.calls],
				[t.total, fmt(summary.total.total), t.calls + " " + summary.total.calls]
			] : [[t.today, "—", ""], [t.week, "—", ""], [t.month, "—", ""], [t.total, "—", ""]];

			const modelOptions = (q0 && q0.models ? q0.models : q && q.models ? q.models : []).map((m) => m.model);
			const uniqueModels = modelOptions.filter((v, i, a) => a.indexOf(v) === i);
			const modelRows = (q && q.models ? q.models : []).slice(0, 12);
			const sessionRows = (q && q.sessions ? q.sessions : []).slice(0, 12);
			const series = q && q.series ? q.series : [];

			return react.createElement("div", null,
				err ? react.createElement("div", { className: "tkst-err" }, err) : null,
				react.createElement("div", { className: "tkst-cards" }, cards.map((c, i) =>
					react.createElement("div", { className: "tkst-card", key: i },
						react.createElement("div", { className: "k" }, c[0]),
						react.createElement("div", { className: "v" }, c[1]),
						react.createElement("div", { className: "s" }, c[2])
					))),
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
					react.createElement("select", { value: session, onChange: (e) => setSession(e.target.value) },
						react.createElement("option", { value: "" }, t.allSessions),
						sessions.map((s) => react.createElement("option", { key: s.id, value: s.id }, s.title))
					),
					react.createElement("button", { onClick: () => doExport("csv") }, t.exportCsv),
					react.createElement("button", { onClick: () => doExport("json") }, t.exportJson),
					react.createElement("span", { className: "tkst-rate" },
						meta ? t.usdRate + " 1 USD = " + meta.usdCny + " CNY · " + t.estimated : "")
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.trend),
					react.createElement(LineChart, { series: series })
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.byModel),
					modelRows.length === 0
						? react.createElement("div", { className: "tkst-empty" }, t.empty)
						: react.createElement("div", { className: "tkst-bars" }, modelRows.map((m) => {
							const max = modelRows[0].total || 1;
							return react.createElement("div", { className: "tkst-bar", key: m.model },
								react.createElement("span", { className: "n", title: m.model }, m.model),
								react.createElement("div", { className: "track" },
									react.createElement("div", { className: "fill", style: { width: Math.max(2, (m.total / max) * 100) + "%" } })),
								react.createElement("span", { className: "v2" }, fmt(m.total))
							);
						}))
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.byModel + " / " + t.bySession),
					react.createElement("table", { className: "tkst-table" },
						react.createElement("thead", null, react.createElement("tr", null,
							react.createElement("th", null, t.model), react.createElement("th", null, t.calls),
							react.createElement("th", null, t.input), react.createElement("th", null, t.output),
							react.createElement("th", null, t.tokens), react.createElement("th", null, t.costUsd),
							react.createElement("th", null, t.costCny)
						)),
						react.createElement("tbody", null, modelRows.map((m) =>
							react.createElement("tr", { key: m.model },
								react.createElement("td", null, m.model), react.createElement("td", null, m.calls),
								react.createElement("td", null, fmt(m.input)), react.createElement("td", null, fmt(m.output)),
								react.createElement("td", null, fmt(m.total)),
								react.createElement("td", null, fmtMoney(m.usd)), react.createElement("td", null, fmtCny(m.cny))
							)))
					)
				),
				react.createElement("div", { className: "tkst-sec" },
					react.createElement("h4", null, t.bySession),
					react.createElement("table", { className: "tkst-table" },
						react.createElement("thead", null, react.createElement("tr", null,
							react.createElement("th", null, t.session), react.createElement("th", null, t.calls),
							react.createElement("th", null, t.tokens), react.createElement("th", null, t.costUsd),
							react.createElement("th", null, t.costCny)
						)),
						react.createElement("tbody", null, sessionRows.map((s) =>
							react.createElement("tr", { key: s.sessionId },
								react.createElement("td", null, s.sessionId), react.createElement("td", null, s.calls),
								react.createElement("td", null, fmt(s.total)),
								react.createElement("td", null, fmtMoney(s.usd)), react.createElement("td", null, fmtCny(s.cny))
							)))
					)
				),
				exportText ? react.createElement("div", { className: "tkst-exportbox" },
					react.createElement("div", null, t.copied),
					react.createElement("textarea", { readOnly: true, value: exportText })
				) : null
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
			}, () => react.createElement(StatsView, {})));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
