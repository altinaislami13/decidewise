import React from 'react';
import { SCORE_LABELS } from '../types/index.js';

const styles = `
.score-matrix-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.score-matrix {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}
.score-matrix th {
  padding: 10px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  text-align: left;
  border-bottom: 1.5px solid var(--border);
  background: var(--cream);
}
.score-matrix th.opt-header {
  text-align: center;
  font-family: 'DM Serif Display', serif;
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink);
  font-weight: normal;
  font-style: italic;
}
.score-matrix td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--cream);
  vertical-align: middle;
}
.score-matrix tr:hover td { background: #faf8f4; }
.criterion-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.criterion-cell-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--ink);
}
.criterion-cell-weight {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
}

.score-cell {
  text-align: center;
}
.score-input-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.score-slider {
  width: 90px;
  -webkit-appearance: none;
  height: 3px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s;
}
.score-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
.score-value-badge {
  min-width: 28px;
  height: 22px;
  border-radius: 4px;
  display: grid;
  place-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
}
.score-label {
  font-size: 0.65rem;
  color: var(--muted);
  text-align: center;
}

.progress-row {
  margin-bottom: 1.25rem;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.progress-text {
  font-size: 0.8rem;
  color: var(--muted);
}
.progress-pct {
  font-family: 'DM Mono', monospace;
  font-size: 0.8rem;
  color: var(--gold);
  font-weight: 600;
}
.progress-track {
  height: 4px;
  background: var(--cream);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 2px;
  transition: width 0.4s;
}
`;

function getScoreColor(val) {
  if (!val) return { bg: '#f0ede8', text: '#b0a898', slider: '#d4cfc4' };
  if (val <= 3) return { bg: '#fde8e2', text: '#b84c2b', slider: '#b84c2b' };
  if (val <= 5) return { bg: '#fef3e2', text: '#c8973a', slider: '#c8973a' };
  if (val <= 7) return { bg: '#e8f0e2', text: '#4a6741', slider: '#4a6741' };
  return { bg: '#d4e8d0', text: '#2d5e28', slider: '#2d5e28' };
}

export default function ScoreMatrix({ options, criteria, scores, setScore, onNext, onBack }) {
  const total = options.length * criteria.length;
  const filled = options.reduce((sum, opt) =>
    sum + criteria.filter(c => (scores[opt.id]?.[c.id] ?? 0) > 0).length, 0);
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const canNext = pct === 100;

  return (
    <>
      <style>{styles}</style>
      <div className="step-page" style={{ maxWidth: '900px' }}>
        <div className="step-header">
          <div className="step-num">Step 03 / 03</div>
          <h2 className="step-title">Score each option</h2>
          <p className="step-subtitle">Rate every option 1–10 for each criterion. Hover over the score to see its label.</p>
        </div>

        <div className="progress-row">
          <div className="progress-info">
            <span className="progress-text">{filled} / {total} scores entered</span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="score-matrix-wrap">
          <table className="score-matrix">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Criterion</th>
                {options.map(opt => (
                  <th key={opt.id} className="opt-header">{opt.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map(criterion => (
                <tr key={criterion.id}>
                  <td>
                    <div className="criterion-cell">
                      <span className="criterion-cell-name">{criterion.name}</span>
                      <span className="criterion-cell-weight">{criterion.weight}% weight</span>
                    </div>
                  </td>
                  {options.map(opt => {
                    const val = scores[opt.id]?.[criterion.id] ?? 0;
                    const col = getScoreColor(val);
                    return (
                      <td key={opt.id} className="score-cell">
                        <div className="score-input-wrap">
                          <div
                            className="score-value-badge"
                            style={{ background: col.bg, color: col.text }}
                            title={val ? SCORE_LABELS[val] : 'Not scored'}
                          >
                            {val || '—'}
                          </div>
                          <input
                            className="score-slider"
                            type="range"
                            min="1"
                            max="10"
                            value={val || 1}
                            onChange={e => setScore(opt.id, criterion.id, +e.target.value)}
                            onMouseEnter={e => { if (!val) setScore(opt.id, criterion.id, +e.target.value); }}
                            style={{
                              background: `linear-gradient(to right, ${col.slider} ${(((val || 1) - 1) / 9) * 100}%, var(--cream) ${(((val || 1) - 1) / 9) * 100}%)`
                            }}
                          />
                          {val > 0 && (
                            <span className="score-label">{SCORE_LABELS[val]}</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!canNext && (
          <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
            ⚠ Move each slider at least once to register a score.
          </div>
        )}

        <div className="step-nav">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-next" onClick={onNext} disabled={!canNext}>
            See Results →
          </button>
        </div>
      </div>
    </>
  );
}
