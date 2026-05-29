import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import {
  calculateScores, rankOptions, getWinner, getMargin,
  getConfidenceLevel, generateRadarData, generateBarData
} from '../utils/scoringAlgorithm.js';
import { COLORS } from '../types/index.js';

const styles = `
.results-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
}
.winner-card {
  background: var(--ink);
  border-radius: 16px;
  padding: 2rem;
  color: var(--paper);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}
.winner-card::before {
  content: '';
  position: absolute;
  top: -30px; right: -30px;
  width: 150px; height: 150px;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0.08;
}
.winner-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gold);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.winner-name {
  font-family: 'DM Serif Display', serif;
  font-size: 2.5rem;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
  line-height: 1.1;
}
.winner-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}
.winner-score {
  font-family: 'DM Mono', monospace;
  font-size: 1.1rem;
  color: var(--gold);
}
.confidence-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 2rem;
}
.score-row {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}
.score-row:hover { border-color: var(--gold); }
.score-rank {
  font-family: 'DM Mono', monospace;
  font-size: 0.8rem;
  color: var(--muted);
  min-width: 24px;
}
.score-rank.first { color: var(--gold); font-weight: 700; }
.score-opt-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--ink);
}
.score-bar-wrap {
  flex: 2;
  height: 6px;
  background: var(--cream);
  border-radius: 3px;
  overflow: hidden;
}
.score-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.score-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}
.chart-tab {
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.chart-tab.active {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}
.chart-tab:hover:not(.active) { border-color: var(--gold); color: var(--gold); }

.chart-container {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.chart-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.breakdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.breakdown-table th {
  padding: 8px 12px;
  text-align: left;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  border-bottom: 1.5px solid var(--border);
  font-weight: 600;
}
.breakdown-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--cream);
  color: var(--ink);
}
.breakdown-table tbody tr:hover td { background: #faf8f4; }
.breakdown-table .mono { font-family: 'DM Mono', monospace; font-size: 0.8rem; }

.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.btn-save {
  background: var(--gold);
  color: var(--ink);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-save:hover { background: var(--gold-light); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-new {
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-new:hover { background: #333; }
.btn-edit {
  background: none;
  border: 1.5px solid var(--border);
  color: var(--ink);
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-edit:hover { border-color: var(--ink); }
.saved-note {
  font-size: 0.85rem;
  color: var(--sage);
  font-weight: 600;
  padding: 12px 0;
  align-self: center;
}

.section-divider {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-weight: 600;
  margin: 2rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

@media (max-width: 600px) {
  .results-page { padding: 2rem 1rem; }
  .winner-name { font-size: 1.75rem; }
  .score-bar-wrap { display: none; }
}
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e0d9cf', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.85rem' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: '0.8rem', color: p.color, fontFamily: 'DM Mono, monospace' }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Results({ title, options, criteria, scores, onSave, onNew, onEdit, saveDecision }) {
  const [chartTab, setChartTab] = useState('bar');
  const [saved, setSaved] = useState(false);

  const ranked = rankOptions(calculateScores(options, criteria, scores));
  const winner = getWinner(ranked);
  const margin = getMargin(ranked);
  const confidence = getConfidenceLevel(margin);
  const radarData = generateRadarData(options, criteria, scores);
  const barData = generateBarData(ranked);

  function handleSave() {
    saveDecision({ title, options, criteria, scores, winner: winner?.optionName, ranked });
    setSaved(true);
  }

  return (
    <>
      <style>{styles}</style>
      <div className="results-page">
        <div className="step-header">
          <div className="step-num">Results</div>
          <h2 className="step-title">{title}</h2>
        </div>

        {winner && (
          <div className="winner-card">
            <div className="winner-label">🏆 Recommended Choice</div>
            <div className="winner-name">{winner.optionName}</div>
            <div className="winner-meta">
              <span className="winner-score">Score: {winner.total} / 10</span>
              <span className="confidence-badge" style={{ color: confidence.color }}>
                {confidence.icon} {confidence.label} · margin {margin}
              </span>
            </div>
          </div>
        )}

        <div className="section-divider">Ranking</div>
        <div className="scores-list">
          {ranked.map((r, i) => (
            <div key={r.optionId} className="score-row">
              <div className={`score-rank ${i === 0 ? 'first' : ''}`}>
                {i === 0 ? '★' : `#${i + 1}`}
              </div>
              <div className="score-opt-name">{r.optionName}</div>
              <div className="score-bar-wrap">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${(r.total / 10) * 100}%`,
                    background: COLORS[i] || '#ccc',
                  }}
                />
              </div>
              <div className="score-num" style={{ color: COLORS[i] || '#ccc' }}>
                {r.total}
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider">Visualisations</div>
        <div className="chart-tabs">
          <button className={`chart-tab ${chartTab === 'bar' ? 'active' : ''}`} onClick={() => setChartTab('bar')}>Bar Chart</button>
          <button className={`chart-tab ${chartTab === 'radar' ? 'active' : ''}`} onClick={() => setChartTab('radar')}>Radar</button>
          <button className={`chart-tab ${chartTab === 'breakdown' ? 'active' : ''}`} onClick={() => setChartTab('breakdown')}>Breakdown</button>
        </div>

        <div className="chart-container">
          {chartTab === 'bar' && (
            <>
              <div className="chart-title">Weighted Total Scores</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d8" />
                  <XAxis dataKey="name" tick={{ fontFamily: 'Outfit', fontSize: 13 }} />
                  <YAxis domain={[0, 10]} tick={{ fontFamily: 'DM Mono', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#c8973a" radius={[6,6,0,0]}>
                    {barData.map((entry, index) => (
                      <rect key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  {barData.map((entry, i) => null)}
                  <Bar dataKey="score" radius={[6,6,0,0]}>
                    {barData.map((entry, i) => (
                      <rect key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {chartTab === 'radar' && (
            <>
              <div className="chart-title">Performance by Criterion</div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e8e2d8" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fontFamily: 'Outfit', fontSize: 11, fill: '#7a7269' }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontFamily: 'DM Mono', fontSize: 9 }} />
                  {options.map((opt, i) => (
                    <Radar
                      key={opt.id}
                      name={opt.name}
                      dataKey={opt.name}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '0.82rem' }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </>
          )}

          {chartTab === 'breakdown' && (
            <>
              <div className="chart-title">Weighted Score Breakdown</div>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Weight</th>
                    {options.map(o => <th key={o.id}>{o.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td className="mono">{c.weight}%</td>
                      {ranked.map(r => {
                        const bd = r.breakdown[c.id];
                        return (
                          <td key={r.optionId} className="mono">
                            {bd?.raw || 0} → <strong>{bd?.weighted?.toFixed(2) || '0.00'}</strong>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid var(--border)', fontWeight: 700 }}>
                    <td colSpan={2} style={{ paddingTop: 12 }}>Total Score</td>
                    {ranked.map(r => (
                      <td key={r.optionId} className="mono" style={{ color: 'var(--gold)', fontSize: '1rem' }}>
                        {r.total}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="actions-row">
          {!saved ? (
            <button className="btn-save" onClick={handleSave}>💾 Save Decision</button>
          ) : (
            <span className="saved-note">✓ Saved to history</span>
          )}
          <button className="btn-edit" onClick={onEdit}>← Edit Scores</button>
          <button className="btn-new" onClick={onNew}>+ New Decision</button>
        </div>
      </div>
    </>
  );
}
