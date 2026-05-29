import React from 'react';
import { validateWeights, normalizeWeights } from '../utils/scoringAlgorithm.js';

const styles = `
.criteria-list { display: flex; flex-direction: column; gap: 12px; }
.criterion-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  transition: border-color 0.15s;
  animation: slideIn 0.2s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.criterion-card:focus-within { border-color: var(--gold); }
.criterion-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.criterion-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  min-width: 20px;
}
.criterion-name {
  flex: 1;
  border: none;
  outline: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ink);
  background: transparent;
}
.criterion-name::placeholder { color: var(--border); }
.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--border);
  font-size: 1.1rem;
  line-height: 1;
  padding: 2px;
  transition: color 0.15s;
}
.remove-btn:hover { color: var(--rust); }

.weight-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.weight-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--cream);
  outline: none;
  cursor: pointer;
}
.weight-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gold);
  cursor: pointer;
  transition: transform 0.15s;
}
.weight-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
.weight-input {
  width: 60px;
  padding: 4px 8px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  text-align: center;
  color: var(--ink);
  background: var(--card);
  outline: none;
}
.weight-input:focus { border-color: var(--gold); }
.weight-pct {
  font-family: 'DM Mono', monospace;
  font-size: 0.8rem;
  color: var(--muted);
  width: 16px;
}

.weight-total-bar {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.weight-bar-track {
  flex: 1;
  height: 6px;
  background: var(--cream);
  border-radius: 3px;
  overflow: hidden;
}
.weight-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background-color 0.3s;
}
.weight-total-label {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}
.weight-valid { color: var(--sage); }
.weight-warn { color: var(--rust); }

.auto-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.auto-btn:hover { border-color: var(--gold); color: var(--gold); }

.step-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.btn-back {
  background: none;
  border: 1.5px solid var(--border);
  color: var(--ink);
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back:hover { border-color: var(--ink); }
.btn-next {
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-next:hover { background: #2a2a2a; }
.btn-next:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export default function CriteriaBuilder({ criteria, addCriterion, removeCriterion, updateCriterion, onNext, onBack }) {
  const { total, isValid } = validateWeights(criteria);
  const fill = Math.min(total, 100);
  const fillColor = isValid ? '#4a6741' : total > 100 ? '#b84c2b' : '#c8973a';
  const canNext = criteria.length >= 1 && isValid && criteria.every(c => c.name.trim());

  function handleAutoNormalize() {
    const normalized = normalizeWeights(criteria);
    normalized.forEach(c => updateCriterion(c.id, 'weight', c.weight));
  }

  return (
    <>
      <style>{styles}</style>
      <div className="step-page">
        <div className="step-header">
          <div className="step-num">Step 02 / 03</div>
          <h2 className="step-title">Set your criteria</h2>
          <p className="step-subtitle">What factors matter to you? Assign weights that add up to 100%.</p>
        </div>

        <div className="criteria-list">
          {criteria.map((c, i) => (
            <div key={c.id} className="criterion-card">
              <div className="criterion-top">
                <span className="criterion-num">{String(i + 1).padStart(2, '0')}</span>
                <input
                  className="criterion-name"
                  placeholder={`Criterion ${i + 1} (e.g. Salary)`}
                  value={c.name}
                  onChange={e => updateCriterion(c.id, 'name', e.target.value)}
                />
                <button className="remove-btn" onClick={() => removeCriterion(c.id)}>×</button>
              </div>
              <div className="weight-row">
                <input
                  className="weight-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={c.weight}
                  onChange={e => updateCriterion(c.id, 'weight', +e.target.value)}
                  style={{ background: `linear-gradient(to right, var(--gold) ${c.weight}%, var(--cream) ${c.weight}%)` }}
                />
                <input
                  className="weight-input"
                  type="number"
                  min="0"
                  max="100"
                  value={c.weight}
                  onChange={e => updateCriterion(c.id, 'weight', Math.max(0, Math.min(100, +e.target.value)))}
                />
                <span className="weight-pct">%</span>
              </div>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={() => addCriterion('', 0)} style={{ marginTop: '12px' }}>
          + Add criterion
        </button>

        {criteria.length > 0 && (
          <div className="weight-total-bar">
            <div className="weight-bar-track">
              <div className="weight-bar-fill" style={{ width: `${fill}%`, background: fillColor }} />
            </div>
            <div className={`weight-total-label ${isValid ? 'weight-valid' : 'weight-warn'}`}>
              {total.toFixed(0)}% / 100%
            </div>
            {!isValid && (
              <button className="auto-btn" onClick={handleAutoNormalize}>
                Auto-normalize
              </button>
            )}
            {isValid && (
              <span style={{ fontSize: '0.8rem', color: 'var(--sage)', fontWeight: 600 }}>✓ Perfect</span>
            )}
          </div>
        )}

        <div className="step-nav">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-next" disabled={!canNext} onClick={onNext}>
            Score Options →
          </button>
        </div>
      </div>
    </>
  );
}
