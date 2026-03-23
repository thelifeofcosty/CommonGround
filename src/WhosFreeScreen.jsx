import { useState, useEffect } from 'react';
import './WhosFreeScreen.css';

const FRIENDS = [
  { id: 'f1', name: 'Alex Rivera',  initial: 'A', color: '#FF9933' },
  { id: 'f2', name: 'Priya Sharma', initial: 'P', color: '#CC88AA' },
  { id: 'f3', name: 'Jamie Chen',   initial: 'J', color: '#996699' },
  { id: 'f4', name: 'Sam Torres',   initial: 'S', color: '#AFCE65' },
];

// Simulated positive responders (subset, revealed one by one)
const RESPONDERS = [
  { id: 'f3', name: 'Jamie Chen',   initial: 'J', color: '#996699' },
  { id: 'f1', name: 'Alex Rivera',  initial: 'A', color: '#FF9933' },
  { id: 'f4', name: 'Sam Torres',   initial: 'S', color: '#AFCE65' },
];

function Spinner() {
  return (
    <div className="wf-spinner">
      <div className="wf-spinner__ring" />
    </div>
  );
}

export default function WhosFreeScreen({ onBack, onOpenChat }) {
  const [phase, setPhase] = useState('pinging'); // 'pinging' | 'results'
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const pingTimer = setTimeout(() => setPhase('results'), 2400);
    return () => clearTimeout(pingTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'results') return;
    RESPONDERS.forEach((r, i) => {
      const t = setTimeout(() => {
        setVisible(prev => [...prev, r.id]);
      }, i * 500);
      return () => clearTimeout(t);
    });
  }, [phase]);

  return (
    <div className="wf-screen">
      <div className="wf-header">
        <button className="wf-back" onClick={onBack}>←</button>
        <span className="wf-header__title">Who's free now?</span>
        <div style={{ width: 32 }} />
      </div>

      {phase === 'pinging' ? (
        <div className="wf-loading">
          <Spinner />
          <p className="wf-loading__text">Sending a ping to your friends…</p>
          <div className="wf-loading__avatars">
            {FRIENDS.map((f, i) => (
              <div
                key={f.id}
                className="wf-loading__avatar"
                style={{ background: f.color, animationDelay: `${i * 0.15}s` }}
              >
                {f.initial}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="wf-results">
          <p className="wf-results__heading">
            {visible.length === RESPONDERS.length
              ? `${RESPONDERS.length} friends are free right now 🎉`
              : 'Responses coming in…'}
          </p>
          <div className="wf-list">
            {RESPONDERS.map(r => (
              <div
                key={r.id}
                className={['wf-row', visible.includes(r.id) ? 'wf-row--visible' : ''].join(' ')}
              >
                <div className="wf-row__avatar" style={{ background: r.color }}>
                  {r.initial}
                </div>
                <span className="wf-row__name">{r.name}</span>
                <button
                  className="wf-row__chat"
                  onClick={() => onOpenChat(r)}
                >
                  Chat →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
