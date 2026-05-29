import React from 'react';
import { DECISION_TEMPLATES } from '../types/index.js';

const styles = `
.home {
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}
.hero {
  padding: 5rem 2rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 4px 14px 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}
.hero-tag-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.hero h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--ink);
  max-width: 700px;
  margin-bottom: 1.25rem;
}
.hero h1 em {
  font-style: italic;
  color: var(--gold);
}
.hero p {
  font-size: 1.15rem;
  color: var(--muted);
  max-width: 520px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  font-weight: 300;
}
.hero-cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn-primary {
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.01em;
}
.btn-primary:hover { background: #2a2a2a; transform: translateY(-1px); }
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--border);
  padding: 14px 28px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--ink); transform: translateY(-1px); }

.formula-strip {
  background: var(--ink);
  color: var(--paper);
  padding: 1.25rem 2rem;
  overflow: hidden;
}
.formula-strip-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.formula-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-weight: 600;
  white-space: nowrap;
}
.formula-code {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  color: var(--gold);
  letter-spacing: 0.02em;
}

.templates-section {
  padding: 3rem 2rem 5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 1.25rem;
}
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.template-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.template-card:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow);
}
.template-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
.template-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 0.35rem;
}
.template-count {
  font-size: 0.78rem;
  color: var(--muted);
}

.features {
  background: var(--cream);
  border-top: 1px solid var(--border);
  padding: 4rem 2rem;
}
.features-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.feature-item h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--ink);
}
.feature-item p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.6;
}
.feature-icon {
  width: 36px; height: 36px;
  background: var(--ink);
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .hero { padding: 3rem 1rem 2rem; }
  .templates-section { padding: 2rem 1rem; }
  .formula-strip { padding: 1rem; }
}
`;

export default function Home({ onStart, onLoadTemplate }) {
  return (
    <>
      <style>{styles}</style>
      <div className="home">
        <section className="hero">
          <div className="hero-tag">
            <div className="hero-tag-dot" />
            Weighted Sum Model · MCDA
          </div>
          <h1>Make decisions with <em>clarity,</em> not chaos.</h1>
          <p>
            Compare options logically using multi-criteria analysis. Assign weights, score options, and let the algorithm surface what matters most.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => onStart(null)}>
              Start a New Decision →
            </button>
            <button className="btn-secondary" onClick={() => onLoadTemplate({ id: 'job', criteria: DECISION_TEMPLATES[0].criteria })}>
              Try Job Offer Example
            </button>
          </div>
        </section>

        <div className="formula-strip">
          <div className="formula-strip-inner">
            <span className="formula-label">Algorithm</span>
            <span className="formula-code">Score(option) = Σ (weight_i × score_i)</span>
            <span className="formula-label" style={{marginLeft: 'auto', color: '#666'}}>Transparent · Objective · Yours</span>
          </div>
        </div>

        <section className="templates-section">
          <div className="section-label">Quick-start templates</div>
          <div className="templates-grid">
            {DECISION_TEMPLATES.map(template => (
              <button
                key={template.id}
                className="template-card"
                onClick={() => onLoadTemplate(template)}
              >
                <div className="template-icon">{template.icon}</div>
                <div className="template-name">{template.name}</div>
                <div className="template-count">
                  {template.criteria.length > 0
                    ? `${template.criteria.length} criteria ready`
                    : 'Build your own'}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="features">
          <div className="features-inner">
            <div className="section-label">How it works</div>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">⚖️</div>
                <h3>Define Your Weights</h3>
                <p>Assign percentage weights to each criterion based on what truly matters to you.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Score Each Option</h3>
                <p>Rate every option 1–10 across all criteria using an intuitive scoring matrix.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h3>Visual Comparison</h3>
                <p>Bar charts, radar charts, and detailed breakdowns reveal the clear winner.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💾</div>
                <h3>Save & Revisit</h3>
                <p>All decisions are saved locally. Review how your thinking evolves over time.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
