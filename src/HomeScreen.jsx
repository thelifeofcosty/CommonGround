import { useState } from 'react';
import './HomeScreen.css';
import BottomNav from './BottomNav';
import { PEOPLE_PHOTOS, photoStyle } from './people';

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const UNSEEN_FRIENDS = [
  { name: 'Jamie',  initial: 'J', color: '#996699', lastSeen: '3 weeks ago' },
  { name: 'Alex',   initial: 'A', color: '#FF9933', lastSeen: 'last month' },
  { name: 'Priya',  initial: 'P', color: '#CC88AA', lastSeen: '2 weeks ago' },
  { name: 'Sam',    initial: 'S', color: '#AFCE65', lastSeen: '5 weeks ago' },
  { name: 'Jordan', initial: 'J', color: '#FF6B6B', lastSeen: 'last month' },
];

export default function HomeScreen({ userName = 'Rose', onOpenAgent, onNavigate, drafts = [], onLoadDraft, onDeleteDraft }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('plans');

  const firstName = userName.split(' ')[0];

  const launchAgent = (msg, people) => {
    if (onOpenAgent) onOpenAgent(msg || null, people || null);
  };

  return (
    <div className="home">
      <div className="home__body">

        <div className="home__topbar">
          <button className="home__free-pill" onClick={() => onNavigate && onNavigate('whos-free')}>⚡ Who's free now?</button>
          <div className="home__spacer" />
          <button className="home__profile-avatar" onClick={() => onNavigate && onNavigate('settings')}>
            {firstName[0]}
          </button>
        </div>

        <div className="home__greeting">
          <h1 className="home__heading">
            What are we planning,<br />{firstName}? 👋
          </h1>
          <p className="home__subheading">Your people are waiting</p>
        </div>

        <div className="home__input-wrap" onClick={() => !query && launchAgent(null)}>
          <input
            className="home__input"
            placeholder="Ask CommonGround..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) launchAgent(query.trim());
            }}
          />
          <button
            className={`home__send ${query ? 'home__send--active' : ''}`}
            onClick={e => { e.stopPropagation(); if (query.trim()) launchAgent(query.trim()); }}
          >
            <SendIcon />
          </button>
        </div>

        <div className="home__unseen">
          <p className="home__unseen-title">Friends you haven't seen in a while...</p>
          <div className="home__unseen-scroll">
            {UNSEEN_FRIENDS.map(f => {
              const photo = PEOPLE_PHOTOS[f.name];
              return (
                <button
                  key={f.name}
                  className="home__unseen-card"
                  onClick={() => launchAgent(`Plan something with ${f.name}!`, [{ name: f.name, initial: f.initial, color: f.color }])}
                >
                  <div className="home__unseen-photo" style={{ background: photo ? 'transparent' : f.color, overflow: 'hidden' }}>
                    {photo ? <img src={photo} alt={f.name} style={photoStyle} /> : f.initial}
                  </div>
                  <span className="home__unseen-name">{f.name}</span>
                  <span className="home__unseen-time">{f.lastSeen}</span>
                </button>
              );
            })}
          </div>
        </div>

        {drafts.length > 0 && (
          <div className="home__drafts">
            <h3 className="home__drafts-title">📝 Drafts</h3>
            {drafts.map(draft => (
              <div key={draft.id} className="home__draft-item">
                <div className="home__draft-content">
                  <p className="home__draft-text">{draft.previewText || draft.initialMessage}</p>
                  <span className="home__draft-status">{draft.status}</span>
                </div>
                <div className="home__draft-actions">
                  <button
                    className="home__draft-resume"
                    onClick={() => onLoadDraft && onLoadDraft(draft.id)}
                  >
                    Resume
                  </button>
                  <button
                    className="home__draft-delete"
                    onClick={() => onDeleteDraft && onDeleteDraft(draft.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav
        active={activeTab}
        onFriends={() => { setActiveTab('friends'); if (onNavigate) onNavigate('friends'); }}
        onPlans={() => { setActiveTab('plans'); launchAgent(null); }}
        onComingUp={() => { setActiveTab('comingup'); if (onNavigate) onNavigate('comingup'); }}
      />
    </div>
  );
}
