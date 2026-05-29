import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";

// ─── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: "job", name: "Job Offer", icon: "💼", criteria: [{ name: "Salary", weight: 35 }, { name: "Career Growth", weight: 25 }, { name: "Work-Life Balance", weight: 20 }, { name: "Location", weight: 10 }, { name: "Company Culture", weight: 10 }] },
  { id: "city", name: "City to Live In", icon: "🏙️", criteria: [{ name: "Cost of Living", weight: 30 }, { name: "Job Market", weight: 25 }, { name: "Quality of Life", weight: 20 }, { name: "Climate", weight: 15 }, { name: "Community", weight: 10 }] },
  { id: "university", name: "University", icon: "🎓", criteria: [{ name: "Academic Reputation", weight: 35 }, { name: "Tuition Cost", weight: 25 }, { name: "Location", weight: 15 }, { name: "Campus Life", weight: 15 }, { name: "Career Services", weight: 10 }] },
  { id: "laptop", name: "Laptop / Tech", icon: "💻", criteria: [{ name: "Performance", weight: 30 }, { name: "Price", weight: 25 }, { name: "Battery Life", weight: 20 }, { name: "Build Quality", weight: 15 }, { name: "Portability", weight: 10 }] },
  { id: "custom", name: "Custom", icon: "✨", criteria: [] },
];

const SCORE_LABELS = { 1: "Very Poor", 2: "Poor", 3: "Below Average", 4: "Slightly Below", 5: "Average", 6: "Slightly Above", 7: "Good", 8: "Very Good", 9: "Excellent", 10: "Perfect" };
const PALETTE = ["#c8973a", "#b84c2b", "#4a6741", "#5b7ea6", "#8b5cf6", "#ec4899"];

// ─── Utilities ─────────────────────────────────────────────────────────────────

let _id = 1;
const uid = () => `id_${_id++}`;

function calcScores(options, criteria, scores) {
  const totalW = criteria.reduce((s, c) => s + c.weight, 0);
  return options.map(opt => {
    let total = 0;
    const breakdown = {};
    criteria.forEach(c => {
      const raw = scores[opt.id]?.[c.id] ?? 0;
      const nw = c.weight / totalW;
      const w = nw * raw;
      total += w;
      breakdown[c.id] = { raw, weighted: +w.toFixed(3) };
    });
    return { optionId: opt.id, optionName: opt.name, total: +total.toFixed(2), breakdown };
  });
}

function rank(scored) { return [...scored].sort((a, b) => b.total - a.total); }

function confidence(margin) {
  if (margin >= 2) return { label: "High Confidence", color: "#4a6741" };
  if (margin >= 1) return { label: "Moderate", color: "#c8973a" };
  return { label: "Very Close Call", color: "#b84c2b" };
}

function validateW(criteria) {
  const t = criteria.reduce((s, c) => s + (parseFloat(c.weight) || 0), 0);
  return { total: t, ok: Math.abs(t - 100) < 0.01 };
}

// ─── Shared Styles ─────────────────────────────────────────────────────────────

const S = {
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a7269", display: "block", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #d4cfc4", borderRadius: 8, fontFamily: "inherit", fontSize: 15, color: "#0d0d0d", background: "#fff", outline: "none", boxSizing: "border-box" },
  btnPrimary: { background: "#0d0d0d", color: "#f7f4ef", border: "none", padding: "12px 26px", borderRadius: 8, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  btnOutline: { background: "transparent", color: "#0d0d0d", border: "1.5px solid #d4cfc4", padding: "12px 22px", borderRadius: 8, fontFamily: "inherit", fontSize: 15, cursor: "pointer" },
  card: { background: "#fff", border: "1.5px solid #d4cfc4", borderRadius: 12, padding: "1rem 1.25rem" },
  page: { maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem" },
  stepNum: { fontFamily: "monospace", fontSize: 11, color: "#7a7269", letterSpacing: "0.1em", marginBottom: 6 },
  stepTitle: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "#0d0d0d", marginBottom: 6, lineHeight: 1.15 },
  sub: { fontSize: 14, color: "#7a7269", lineHeight: 1.6, marginBottom: 24 },
  nav: { display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid #ede9e0" },
};

const CustomTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div style={{ background: "#fff", border: "1px solid #e0d9cf", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, fontFamily: "monospace" }}>{p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}</div>)}
    </div>
  ) : null;

// ─── Steps ─────────────────────────────────────────────────────────────────────

function StepHeader({ n, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={S.stepNum}>Step {n} / 03</div>
      <h2 style={{ ...S.stepTitle, margin: "0 0 6px" }}>{title}</h2>
      <p style={{ ...S.sub, margin: 0 }}>{sub}</p>
    </div>
  );
}

// Step 1: Setup
function Setup({ title, setTitle, description, setDescription, options, addOption, removeOption, updateOption, loadTemplate, onNext }) {
  const [selTpl, setSelTpl] = useState(null);
  const can = title.trim().length >= 2 && options.filter(o => o.name.trim()).length >= 2;

  return (
    <div style={S.page}>
      <StepHeader n="01" title="Define your decision" sub="Name it and list what you're comparing." />

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Decision Title</label>
        <input style={S.input} placeholder="e.g. Which job should I take?" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Quick-start template</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TEMPLATES.map(t => (
            <button key={t.id}
              onClick={() => { setSelTpl(t.id); if (t.id !== "custom") loadTemplate(t); }}
              style={{ background: selTpl === t.id ? "#0d0d0d" : "#ede9e0", color: selTpl === t.id ? "#f7f4ef" : "#0d0d0d", border: "1.5px solid", borderColor: selTpl === t.id ? "#0d0d0d" : "#d4cfc4", borderRadius: 100, padding: "6px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Options to Compare</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((opt, i) => (
            <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 28, height: 28, background: "#ede9e0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#7a7269", fontFamily: "monospace" }}>{String.fromCharCode(65 + i)}</div>
              <input style={{ ...S.input, flex: 1 }} value={opt.name} onChange={e => updateOption(opt.id, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
              {options.length > 2 && <button onClick={() => removeOption(opt.id)} style={{ background: "none", border: "1.5px solid #d4cfc4", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#7a7269" }}>×</button>}
            </div>
          ))}
        </div>
        <button onClick={addOption} style={{ marginTop: 8, width: "100%", background: "none", border: "1.5px dashed #d4cfc4", borderRadius: 8, padding: 10, fontFamily: "inherit", fontSize: 14, color: "#7a7269", cursor: "pointer" }}>+ Add option</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Notes (optional)</label>
        <textarea style={{ ...S.input, minHeight: 70, resize: "vertical" }} placeholder="Context…" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>

      <div style={{ ...S.nav, justifyContent: "flex-end" }}>
        <button style={{ ...S.btnPrimary, opacity: can ? 1 : 0.4, cursor: can ? "pointer" : "not-allowed" }} disabled={!can} onClick={onNext}>Define Criteria →</button>
      </div>
    </div>
  );
}

// Step 2: Criteria
function Criteria({ criteria, addCriterion, removeCriterion, updateCriterion, onNext, onBack }) {
  const { total, ok } = validateW(criteria);
  const fill = Math.min(total, 100);
  const fillColor = ok ? "#4a6741" : total > 100 ? "#b84c2b" : "#c8973a";
  const can = criteria.length >= 1 && ok && criteria.every(c => c.name.trim());

  function autoNorm() {
    const t = criteria.reduce((s, c) => s + c.weight, 0);
    if (!t) return;
    const normed = criteria.map(c => ({ ...c, weight: Math.round((c.weight / t) * 100) }));
    const diff = 100 - normed.reduce((s, c) => s + c.weight, 0);
    if (normed.length) normed[0].weight += diff;
    normed.forEach(c => updateCriterion(c.id, "weight", c.weight));
  }

  return (
    <div style={S.page}>
      <StepHeader n="02" title="Set your criteria" sub="What matters? Weights must sum to 100%." />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {criteria.map((c, i) => (
          <div key={c.id} style={{ ...S.card, animation: "fadeIn .2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#7a7269", minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <input value={c.name} onChange={e => updateCriterion(c.id, "name", e.target.value)} placeholder={`Criterion ${i + 1} (e.g. Salary)`} style={{ ...S.input, border: "none", padding: "2px 0", fontSize: 15, fontWeight: 500, flex: 1 }} />
              <button onClick={() => removeCriterion(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d4cfc4", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="range" min={0} max={100} value={c.weight} onChange={e => updateCriterion(c.id, "weight", +e.target.value)}
                style={{ flex: 1, accentColor: "#c8973a" }} />
              <input type="number" min={0} max={100} value={c.weight} onChange={e => updateCriterion(c.id, "weight", Math.max(0, Math.min(100, +e.target.value)))}
                style={{ width: 58, padding: "4px 8px", border: "1.5px solid #d4cfc4", borderRadius: 6, fontFamily: "monospace", fontSize: 14, textAlign: "center" }} />
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "#7a7269" }}>%</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => addCriterion("", 0)} style={{ marginTop: 10, width: "100%", background: "none", border: "1.5px dashed #d4cfc4", borderRadius: 8, padding: 10, fontFamily: "inherit", fontSize: 14, color: "#7a7269", cursor: "pointer" }}>+ Add criterion</button>

      {criteria.length > 0 && (
        <div style={{ ...S.card, marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: "#ede9e0", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fill}%`, background: fillColor, borderRadius: 3, transition: "width .3s" }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: ok ? "#4a6741" : "#b84c2b", minWidth: 70, textAlign: "right" }}>{total.toFixed(0)}% / 100%</span>
          {!ok && <button onClick={autoNorm} style={{ background: "none", border: "1px solid #d4cfc4", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#7a7269", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Auto-fix</button>}
          {ok && <span style={{ fontSize: 12, color: "#4a6741", fontWeight: 700 }}>✓ Perfect</span>}
        </div>
      )}

      <div style={S.nav}>
        <button style={S.btnOutline} onClick={onBack}>← Back</button>
        <button style={{ ...S.btnPrimary, opacity: can ? 1 : 0.4, cursor: can ? "pointer" : "not-allowed" }} disabled={!can} onClick={onNext}>Score Options →</button>
      </div>
    </div>
  );
}

// Step 3: Scoring
function Scoring({ options, criteria, scores, setScore, onNext, onBack }) {
  const total = options.length * criteria.length;
  const filled = options.reduce((s, opt) => s + criteria.filter(c => (scores[opt.id]?.[c.id] ?? 0) > 0).length, 0);
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const can = pct === 100;

  function scoreColor(v) {
    if (!v) return { bg: "#f0ede8", text: "#b0a898" };
    if (v <= 3) return { bg: "#fde8e2", text: "#b84c2b" };
    if (v <= 5) return { bg: "#fef3e2", text: "#c8973a" };
    if (v <= 7) return { bg: "#e8f0e2", text: "#4a6741" };
    return { bg: "#d4e8d0", text: "#2d5e28" };
  }

  return (
    <div style={{ ...S.page, maxWidth: 960 }}>
      <StepHeader n="03" title="Score each option" sub="Rate 1–10 per criterion. Move each slider to register a score." />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7a7269", marginBottom: 4 }}>
          <span>{filled} / {total} scored</span>
          <span style={{ fontFamily: "monospace", color: "#c8973a", fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: "#ede9e0", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#c8973a", transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a7269", borderBottom: "1.5px solid #d4cfc4", background: "#ede9e0" }}>Criterion</th>
              {options.map(opt => (
                <th key={opt.id} style={{ padding: "8px 12px", textAlign: "center", fontSize: 14, color: "#0d0d0d", borderBottom: "1.5px solid #d4cfc4", background: "#ede9e0", fontStyle: "italic", fontWeight: 600 }}>{opt.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map(crit => (
              <tr key={crit.id} style={{ borderBottom: "1px solid #f0ede8" }}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0d0d0d" }}>{crit.name}</div>
                  <div style={{ fontSize: 11, color: "#7a7269", fontFamily: "monospace" }}>{crit.weight}%</div>
                </td>
                {options.map(opt => {
                  const val = scores[opt.id]?.[crit.id] ?? 0;
                  const col = scoreColor(val);
                  return (
                    <td key={opt.id} style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ minWidth: 28, height: 24, borderRadius: 4, background: col.bg, color: col.text, fontFamily: "monospace", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{val || "—"}</div>
                        <input type="range" min={1} max={10} value={val || 1}
                          onChange={e => setScore(opt.id, crit.id, +e.target.value)}
                          style={{ width: 90, accentColor: col.text || "#c8973a" }} />
                        {val > 0 && <span style={{ fontSize: 10, color: "#7a7269" }}>{SCORE_LABELS[val]}</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={S.nav}>
        <button style={S.btnOutline} onClick={onBack}>← Back</button>
        <button style={{ ...S.btnPrimary, opacity: can ? 1 : 0.4, cursor: can ? "pointer" : "not-allowed" }} disabled={!can} onClick={onNext}>See Results →</button>
      </div>
    </div>
  );
}

// Results
function Results({ title, options, criteria, scores, onNew, onEdit, onSave, isSaved }) {
  const [tab, setTab] = useState("bar");
  const ranked = rank(calcScores(options, criteria, scores));
  const winner = ranked[0];
  const margin = ranked.length >= 2 ? +(ranked[0].total - ranked[1].total).toFixed(2) : 10;
  const conf = confidence(margin);

  const radarData = criteria.map(c => {
    const entry = { criterion: c.name };
    options.forEach(o => { entry[o.name] = scores[o.id]?.[c.id] ?? 0; });
    return entry;
  });

  const barData = ranked.map(r => ({ name: r.optionName, score: r.total }));

  const tabs = ["bar", "radar", "breakdown"];

  return (
    <div style={{ ...S.page, maxWidth: 940 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#7a7269", letterSpacing: "0.1em", marginBottom: 6 }}>RESULTS</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>{title}</h2>
      </div>

      {winner && (
        <div style={{ background: "#0d0d0d", borderRadius: 16, padding: "1.75rem 2rem", color: "#f7f4ef", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, background: "#c8973a", borderRadius: "50%", opacity: 0.07 }} />
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#c8973a", fontWeight: 700, marginBottom: 8 }}>🏆 RECOMMENDED CHOICE</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 5vw, 3rem)", letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.1 }}>{winner.optionName}</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", color: "#c8973a", fontSize: 16 }}>Score: {winner.total} / 10</span>
            <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 14px", fontSize: 12, fontWeight: 600, color: conf.color }}>
              {conf.label} · margin {margin}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {ranked.map((r, i) => (
          <div key={r.optionId} style={{ ...S.card, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: i === 0 ? "#c8973a" : "#7a7269", minWidth: 24, fontWeight: i === 0 ? 700 : 400 }}>{i === 0 ? "★" : `#${i + 1}`}</div>
            <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{r.optionName}</div>
            <div style={{ flex: 2, height: 6, background: "#ede9e0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(r.total / 10) * 100}%`, background: PALETTE[i] || "#ccc", borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: PALETTE[i] || "#ccc", minWidth: 36, textAlign: "right" }}>{r.total}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#0d0d0d" : "transparent", color: tab === t ? "#f7f4ef" : "#7a7269", border: "1.5px solid", borderColor: tab === t ? "#0d0d0d" : "#d4cfc4", borderRadius: 8, padding: "8px 16px", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
            {t === "bar" ? "Bar Chart" : t === "radar" ? "Radar" : "Breakdown"}
          </button>
        ))}
      </div>

      <div style={{ ...S.card, marginBottom: 24 }}>
        {tab === "bar" && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
              <XAxis dataKey="name" tick={{ fontFamily: "inherit", fontSize: 13 }} />
              <YAxis domain={[0, 10]} tick={{ fontFamily: "monospace", fontSize: 11 }} />
              <Tooltip content={<CustomTip />} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#c8973a" />
            </BarChart>
          </ResponsiveContainer>
        )}
        {tab === "radar" && (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8e2d8" />
              <PolarAngleAxis dataKey="criterion" tick={{ fontFamily: "inherit", fontSize: 11, fill: "#7a7269" }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fontFamily: "monospace", fontSize: 9 }} />
              {options.map((o, i) => (
                <Radar key={o.id} name={o.name} dataKey={o.name} stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.12} strokeWidth={2} />
              ))}
              <Legend wrapperStyle={{ fontFamily: "inherit", fontSize: 13 }} />
              <Tooltip content={<CustomTip />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
        {tab === "breakdown" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1.5px solid #d4cfc4", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a7269" }}>Criterion</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1.5px solid #d4cfc4", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a7269" }}>Weight</th>
                  {ranked.map(r => <th key={r.optionId} style={{ padding: "8px 10px", textAlign: "center", borderBottom: "1.5px solid #d4cfc4", fontStyle: "italic", color: "#0d0d0d" }}>{r.optionName}</th>)}
                </tr>
              </thead>
              <tbody>
                {criteria.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f0ede8" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: "#7a7269" }}>{c.weight}%</td>
                    {ranked.map(r => {
                      const bd = r.breakdown[c.id];
                      return <td key={r.optionId} style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace" }}>{bd?.raw || 0} → <strong>{bd?.weighted?.toFixed(2) || "0.00"}</strong></td>;
                    })}
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #d4cfc4" }}>
                  <td colSpan={2} style={{ padding: "10px 10px", fontWeight: 700 }}>Total</td>
                  {ranked.map(r => <td key={r.optionId} style={{ padding: "10px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#c8973a", fontSize: 16 }}>{r.total}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!isSaved
          ? <button style={{ ...S.btnPrimary, background: "#c8973a", color: "#0d0d0d" }} onClick={onSave}>💾 Save Decision</button>
          : <span style={{ fontSize: 13, color: "#4a6741", fontWeight: 700, padding: "12px 0", alignSelf: "center" }}>✓ Saved to history</span>}
        <button style={S.btnOutline} onClick={onEdit}>← Edit Scores</button>
        <button style={S.btnPrimary} onClick={onNew}>+ New Decision</button>
      </div>
    </div>
  );
}

// History Panel
function History({ decisions, onLoad, onDelete, onClose }) {
  function fmt(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,13,13,0.45)", zIndex: 999, display: "flex", justifyContent: "flex-end" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#f7f4ef", width: 400, maxWidth: "100vw", height: "100%", overflowY: "auto", borderLeft: "1px solid #d4cfc4", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #d4cfc4", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#f7f4ef" }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Decision History</div>
          <button onClick={onClose} style={{ background: "none", border: "1.5px solid #d4cfc4", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: "#7a7269" }}>×</button>
        </div>
        <div style={{ padding: "0.75rem 1.5rem", fontSize: 11, color: "#7a7269", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #d4cfc4" }}>{decisions.length} saved</div>
        {decisions.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#7a7269", padding: "3rem", textAlign: "center" }}>
            <span style={{ fontSize: 28 }}>🗂️</span>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>No saved decisions yet. Save one after your analysis.</p>
          </div>
        ) : (
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: 8 }}>
            {decisions.map(d => (
              <div key={d.id} style={{ background: "#fff", border: "1.5px solid #d4cfc4", borderRadius: 10, padding: "1rem", cursor: "pointer", transition: "border-color .15s" }}
                onClick={() => { onLoad(d); onClose(); }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c8973a"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#d4cfc4"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, flex: 1, lineHeight: 1.3 }}>{d.title}</div>
                  <button onClick={e => { e.stopPropagation(); onDelete(d.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#d4cfc4", fontSize: 16, lineHeight: 1, padding: "0 2px" }}>×</button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {[`${d.options?.length || 0} options`, `${d.criteria?.length || 0} criteria`].map(t => (
                    <span key={t} style={{ background: "#ede9e0", border: "1px solid #d4cfc4", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#7a7269", fontFamily: "monospace" }}>{t}</span>
                  ))}
                  {d.winner && <span style={{ background: "#fdf8ef", border: "1px solid #c8973a", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#c8973a", fontWeight: 600, fontFamily: "monospace" }}>★ {d.winner}</span>}
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#d4cfc4", fontFamily: "monospace" }}>{fmt(d.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState("home");
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([{ id: uid(), name: "Option A" }, { id: uid(), name: "Option B" }]);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [savedDecisions, setSavedDecisions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dw_decisions") || "[]"); } catch { return []; }
  });

  function saveToLS(data) { try { localStorage.setItem("dw_decisions", JSON.stringify(data)); } catch {} }

  const addOption = () => setOptions(p => [...p, { id: uid(), name: `Option ${String.fromCharCode(65 + p.length)}` }]);
  const removeOption = id => { setOptions(p => p.filter(o => o.id !== id)); setScores(p => { const n = { ...p }; delete n[id]; return n; }); };
  const updateOption = (id, name) => setOptions(p => p.map(o => o.id === id ? { ...o, name } : o));

  const addCriterion = (name = "", weight = 0) => setCriteria(p => [...p, { id: uid(), name, weight }]);
  const removeCriterion = id => setCriteria(p => p.filter(c => c.id !== id));
  const updateCriterion = (id, field, value) => setCriteria(p => p.map(c => c.id === id ? { ...c, [field]: value } : c));

  const setScore = (optionId, criterionId, value) => setScores(p => ({ ...p, [optionId]: { ...(p[optionId] || {}), [criterionId]: value } }));

  function loadTemplate(tpl) {
    setCriteria(tpl.criteria.map(c => ({ ...c, id: uid() })));
  }

  function reset() {
    setTitle(""); setDescription(""); setScores({}); setIsSaved(false);
    setOptions([{ id: uid(), name: "Option A" }, { id: uid(), name: "Option B" }]);
    setCriteria([]);
    setStep("home");
  }

  function loadSaved(d) {
    setTitle(d.title); setDescription(d.description || "");
    setOptions(d.options); setCriteria(d.criteria); setScores(d.scores);
    setIsSaved(true); setStep("results");
  }

  function saveDecision() {
    const ranked = rank(calcScores(options, criteria, scores));
    const d = { id: uid(), createdAt: new Date().toISOString(), title, description, options, criteria, scores, winner: ranked[0]?.optionName, ranked };
    setSavedDecisions(p => { const u = [d, ...p]; saveToLS(u); return u; });
    setIsSaved(true);
  }

  function deleteDecision(id) { setSavedDecisions(p => { const u = p.filter(d => d.id !== id); saveToLS(u); return u; }); }

  const STEPS = { home: 0, setup: 1, criteria: 2, scoring: 3, results: 4 };
  const stepIdx = STEPS[step] ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif", color: "#0d0d0d" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { cursor: pointer; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,244,239,0.93)", backdropFilter: "blur(12px)", borderBottom: "1px solid #d4cfc4", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={reset}>
            <div style={{ width: 32, height: 32, background: "#0d0d0d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#c8973a", fontWeight: 700, fontFamily: "monospace", letterSpacing: "-1px" }}>DW</div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>Decide<span style={{ color: "#c8973a" }}>Wise</span></div>
          </div>

          {step !== "home" && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {["setup", "criteria", "scoring", "results"].map((s, i) => {
                const cur = stepIdx - 1;
                const state = i < cur ? "done" : i === cur ? "active" : "idle";
                return <div key={s} style={{ height: 6, borderRadius: 3, background: state === "done" ? "#4a6741" : state === "active" ? "#c8973a" : "#d4cfc4", width: state === "active" ? 18 : 6, transition: "all .3s" }} />;
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowHistory(true)} style={{ ...S.btnOutline, padding: "7px 14px", fontSize: 13 }}>History</button>
            <button onClick={reset} style={{ ...S.btnPrimary, background: "#c8973a", color: "#0d0d0d", padding: "7px 16px", fontSize: 13 }}>+ New</button>
          </div>
        </div>
      </header>

      {/* Stepper bar */}
      {step !== "home" && (
        <div style={{ background: "#ede9e0", borderBottom: "1px solid #d4cfc4" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem", display: "flex", overflowX: "auto" }}>
            {[["setup", "Setup", "Name & options"], ["criteria", "Criteria", "Weights"], ["scoring", "Scoring", "Rate options"], ["results", "Results", "Analysis"]].map(([s, lbl, desc], i) => {
              const cur = stepIdx - 1;
              const state = i < cur ? "done" : i === cur ? "active" : "";
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.85rem 1.25rem 0.85rem 0", flexShrink: 0, marginRight: i < 3 ? 8 : 0 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid", borderColor: state === "done" ? "#4a6741" : state === "active" ? "#c8973a" : "#d4cfc4", background: state === "done" ? "#4a6741" : state === "active" ? "#c8973a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: state ? "#fff" : "#7a7269", flexShrink: 0, transition: "all .2s", fontFamily: "monospace" }}>
                    {state === "done" ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: state ? "#0d0d0d" : "#7a7269" }}>{lbl}</div>
                    <div style={{ fontSize: 11, color: "#b4b0a8" }}>{desc}</div>
                  </div>
                  {i < 3 && <span style={{ marginLeft: 12, color: "#d4cfc4", fontSize: 12 }}>→</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Home */}
      {step === "home" && (
        <div style={{ minHeight: "calc(100vh - 60px)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ede9e0", border: "1px solid #d4cfc4", borderRadius: 100, padding: "4px 14px 4px 8px", fontSize: 11, fontWeight: 600, color: "#7a7269", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8973a", animation: "pulse 2s infinite" }} />
              Weighted Sum Model · MCDA
            </div>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.25rem, 6vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 680, marginBottom: 20 }}>
              Make decisions with <em style={{ fontStyle: "italic", color: "#c8973a" }}>clarity,</em> not chaos.
            </h1>
            <p style={{ fontSize: 17, color: "#7a7269", maxWidth: 500, lineHeight: 1.6, marginBottom: 32, fontWeight: 300 }}>
              Compare options logically with multi-criteria analysis. Assign weights, score options, and surface what truly matters.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <button style={S.btnPrimary} onClick={() => { setCriteria([]); setStep("setup"); }}>Start a Decision →</button>
              <button style={S.btnOutline} onClick={() => { loadTemplate(TEMPLATES[0]); setTitle("Job Offer Comparison"); setStep("setup"); }}>Try Job Example</button>
            </div>

            <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "1.1rem 1.5rem", marginBottom: 36, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a7269", fontWeight: 600, whiteSpace: "nowrap" }}>Algorithm</span>
              <span style={{ fontFamily: "monospace", fontSize: 14, color: "#c8973a" }}>Score(option) = Σ (weight_i × score_i)</span>
              <span style={{ fontSize: 11, color: "#444", marginLeft: "auto", whiteSpace: "nowrap" }}>Transparent · Objective · Yours</span>
            </div>

            <div style={{ marginBottom: 16, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a7269" }}>Quick-start templates</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { loadTemplate(t); setTitle(t.name); setStep("setup"); }}
                  style={{ background: "#fff", border: "1.5px solid #d4cfc4", borderRadius: 12, padding: "1.1rem", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8973a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#d4cfc4"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#7a7269" }}>{t.criteria.length > 0 ? `${t.criteria.length} criteria` : "Build your own"}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: "#ede9e0", borderTop: "1px solid #d4cfc4", padding: "3rem 1.5rem" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a7269", marginBottom: 20 }}>How it works</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {[["⚖️", "Define Weights", "Assign percentages based on what matters most."], ["📊", "Score Options", "Rate 1–10 across all criteria in an intuitive matrix."], ["🔍", "Visual Analysis", "Bar, radar, and breakdown charts reveal the winner."], ["💾", "Save & Review", "All decisions are saved locally to track your thinking."]].map(([icon, name, desc]) => (
                  <div key={name}>
                    <div style={{ width: 36, height: 36, background: "#0d0d0d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 12 }}>{icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, fontFamily: "Georgia, serif" }}>{name}</div>
                    <div style={{ fontSize: 13, color: "#7a7269", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "setup" && <Setup title={title} setTitle={setTitle} description={description} setDescription={setDescription} options={options} addOption={addOption} removeOption={removeOption} updateOption={updateOption} loadTemplate={loadTemplate} onNext={() => { if (criteria.length === 0) addCriterion("", 0); setStep("criteria"); }} />}
      {step === "criteria" && <Criteria criteria={criteria} addCriterion={addCriterion} removeCriterion={removeCriterion} updateCriterion={updateCriterion} onNext={() => setStep("scoring")} onBack={() => setStep("setup")} />}
      {step === "scoring" && <Scoring options={options} criteria={criteria} scores={scores} setScore={setScore} onNext={() => setStep("results")} onBack={() => setStep("criteria")} />}
      {step === "results" && <Results title={title} options={options} criteria={criteria} scores={scores} onNew={reset} onEdit={() => setStep("scoring")} onSave={saveDecision} isSaved={isSaved} />}

      {showHistory && <History decisions={savedDecisions} onLoad={loadSaved} onDelete={deleteDecision} onClose={() => setShowHistory(false)} />}

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }`}</style>
    </div>
  );
}
