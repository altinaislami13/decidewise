import React from 'react';
import { DECISION_TEMPLATES } from '../types/index.js';

const ALL_TEMPLATES = [{ id: null, name: '— None —', icon: '' }, ...DECISION_TEMPLATES];

const styles = `
.step-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 2rem;
}
.step-header {
  margin-bottom: 2.5rem;
}
.step-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}
.step-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2rem;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.step-subtitle {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.75rem;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0.5rem;
}
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  color: var(--ink);
  background: var(--card);
  transition: border-color 0.15s;
  outline: none;
}
.form-input:focus { border-color: var(--gold); }
.form-input::placeholder { color: var(--border); }
textarea.form-input { resize: vertical; min-height: 80px; }

.template-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}
.template-chip {
  background: var(--cream);
  border: 1.5px solid var(--border);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  color: var(--ink);
}
.template-chip:hover { border-color: var(--gold); background: #fdf8f0; }
.template-chip.selected { background: var(--ink); color: var(--paper); border-color: var(--ink); }

.options-list { display: flex; flex-direction: column; gap: 10px; }
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.option-badge {
  min-width: 28px;
  height: 28px;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--muted);
  font-family: 'DM Mono', monospace;
}
.option-input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  color: var(--ink);
  background: var(--card);
  transition: border-color 0.15s;
  outline: none;
}
.option-input:focus { border-color: var(--gold); }
.icon-btn {
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  width: 34px; height: 34px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.15s;
  font-size: 1rem;
}
.icon-btn:hover { border-color: var(--rust); color: var(--rust); }
.add-btn {
  background: none;
  border: 1.5px dashed var(--border);
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 6px;
}
.add-btn:hover { border-color: var(--gold); color: var(--gold); }

.step-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
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

.hint {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.4rem;
}

@media (max-width: 600px) {
  .step-page { padding: 2rem 1rem; }
}
`;

export default function Setup({
  title, setTitle,
  description, setDescription,
  options, addOption, removeOption, updateOption,
  onNext, loadTemplate, selectedTemplate, setSelectedTemplate,
}) {
  const canNext = title.trim().length >= 2 && options.filter(o => o.name.trim()).length >= 2;

  return (
    <>
      <style>{styles}</style>
      <div className="step-page">
        <div className="step-header">
          <div className="step-num">Step 01 / 03</div>
          <h2 className="step-title">Define your decision</h2>
          <p className="step-subtitle">Name your decision and list the options you're comparing.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Decision Title</label>
          <input
            className="form-input"
            placeholder="e.g. Which job offer should I accept?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Quick-start Template</label>
          <div className="template-bar">
            {ALL_TEMPLATES.map(t => (
              <button
                key={t.id || 'none'}
                className={`template-chip ${selectedTemplate === t.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTemplate(t.id);
                  if (t.id) loadTemplate(t);
                }}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Options to Compare</label>
          <div className="options-list">
            {options.map((opt, i) => (
              <div key={opt.id} className="option-row">
                <div className="option-badge">{String.fromCharCode(65 + i)}</div>
                <input
                  className="option-input"
                  value={opt.name}
                  onChange={e => updateOption(opt.id, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
                {options.length > 2 && (
                  <button className="icon-btn" onClick={() => removeOption(opt.id)}>×</button>
                )}
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addOption}>
            + Add another option
          </button>
          <div className="hint">Minimum 2 options required</div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-input"
            placeholder="Context about this decision…"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="step-footer">
          <button className="btn-next" disabled={!canNext} onClick={onNext}>
            Define Criteria →
          </button>
        </div>
      </div>
    </>
  );
}
