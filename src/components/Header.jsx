import React from 'react';

export default function Header({ onNew, onHistory }) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #ddd',
        background: '#fff'
      }}
    >
      <h1>DecideWise</h1>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onHistory}>History</button>
        <button onClick={onNew}>New Decision</button>
      </div>
    </header>
  );
}