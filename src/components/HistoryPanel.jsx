import React from 'react';

const styles = `
.history-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,13,13,0.4);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.history-panel {
  background: var(--paper);
  width: 420px;
  max-width: 100vw;
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid var(--border);
  animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.history-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: var(--paper);
  z-index: 1;
}
.history-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.3rem;
  letter-spacing: -0.02em;
}
.close-btn {
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--muted);
  font-size: 1.1rem;
  transition: all 0.15s;
}
.close-btn:hover { border-color: var(--ink); color: var(--ink); }
.history-count {
  padding: 0.75rem 1.5rem;
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}
.history-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.history-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--muted);
  padding: 3rem;
  text-align: center;
}
.history-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.history-empty p { font-size: 0.9rem; line-height: 1.6; }

.history-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.history-card:hover { border-color: var(--gold); box-shadow: 0 4px 12px var(--shadow); }
.history-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.history-card-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--ink);
  line-height: 1.3;
  flex: 1;
}
.history-delete {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--border);
  font-size: 1rem;
  padding: 2px 4px;
  transition: color 0.15s;
  line-height: 1;
}
.history-delete:hover { color: var(--rust); }
.history-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.history-badge {
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.72rem;
  color: var(--muted);
  font-family: 'DM Mono', monospace;
}
.history-winner {
  background: #fdf8ef;
  border-color: var(--gold);
  color: var(--gold);
  font-weight: 600;
}
.history-date {
  font-size: 0.72rem;
  color: var(--border);
  margin-left: auto;
  font-family: 'DM Mono', monospace;
}
`;

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HistoryPanel({ decisions, onLoad, onDelete, onClose }) {
  return (
    <>
      <style>{styles}</style>
      <div className="history-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="history-panel">
          <div className="history-header">
            <div className="history-title">Decision History</div>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="history-count">{decisions.length} saved decision{decisions.length !== 1 ? 's' : ''}</div>

          {decisions.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">🗂️</div>
              <p>No saved decisions yet. Complete a decision analysis and save it to see it here.</p>
            </div>
          ) : (
            <div className="history-list">
              {decisions.map(d => (
                <div key={d.id} className="history-card" onClick={() => { onLoad(d); onClose(); }}>
                  <div className="history-card-top">
                    <div className="history-card-name">{d.title}</div>
                    <button
                      className="history-delete"
                      onClick={e => { e.stopPropagation(); onDelete(d.id); }}
                      title="Delete"
                    >×</button>
                  </div>
                  <div className="history-meta">
                    <span className="history-badge">{d.options?.length || 0} options</span>
                    <span className="history-badge">{d.criteria?.length || 0} criteria</span>
                    {d.winner && (
                      <span className="history-badge history-winner">★ {d.winner}</span>
                    )}
                    <span className="history-date">{formatDate(d.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
