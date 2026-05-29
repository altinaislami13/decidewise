import React from 'react';

const styles = `
.stepper {
  border-bottom: 1px solid var(--border);
  background: var(--cream);
}
.stepper-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: stretch;
  overflow-x: auto;
}
.stepper-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.5rem 1rem 0;
  cursor: default;
  flex-shrink: 0;
  position: relative;
}
.stepper-step::after {
  content: '→';
  color: var(--border);
  font-size: 0.8rem;
  margin-left: 1rem;
}
.stepper-step:last-child::after { display: none; }
.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: grid;
  place-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--muted);
  transition: all 0.2s;
  flex-shrink: 0;
}
.step-circle.active {
  border-color: var(--gold);
  background: var(--gold);
  color: var(--ink);
}
.step-circle.done {
  border-color: var(--sage);
  background: var(--sage);
  color: white;
}
.step-info {}
.step-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
  transition: color 0.2s;
  display: block;
}
.step-label.active { color: var(--ink); }
.step-label.done { color: var(--sage); }
.step-desc {
  font-size: 0.7rem;
  color: var(--border);
}

@media (max-width: 600px) {
  .stepper-inner { padding: 0 1rem; }
  .stepper-step { padding: 0.75rem 1rem 0.75rem 0; }
  .step-desc { display: none; }
}
`;

const STEPS = [
  { id: 'setup', label: 'Setup', desc: 'Name & options' },
  { id: 'criteria', label: 'Criteria', desc: 'Weights' },
  { id: 'scoring', label: 'Scoring', desc: 'Rate options' },
  { id: 'results', label: 'Results', desc: 'Analysis' },
];

export default function Stepper({ currentStep }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  return (
    <>
      <style>{styles}</style>
      <div className="stepper">
        <div className="stepper-inner">
          {STEPS.map((step, i) => {
            const state = i < currentIdx ? 'done' : i === currentIdx ? 'active' : '';
            return (
              <div key={step.id} className="stepper-step">
                <div className={`step-circle ${state}`}>
                  {state === 'done' ? '✓' : i + 1}
                </div>
                <div className="step-info">
                  <span className={`step-label ${state}`}>{step.label}</span>
                  <span className="step-desc">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
