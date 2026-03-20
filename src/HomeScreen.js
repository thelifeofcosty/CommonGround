import { useState } from 'react';
import './HomeScreen.css';
import BottomNav from './BottomNav';

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HomeScreen({ userName = 'Rose', onOpenAgent, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('plans');

  const firstName = userName.split(' ')[0];

  const launchAgent = (msg) => {
    if (onOpenAgent) onOpenAgent(msg || null);
  };

  return (
    <div className="home">
      <div className="home__body">

        <div className="home__topbar">
          <div className="home__spacer" />
          <button className="home__free-pill">⚡ Who's free now?</button>
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

        <div className="home__nudge" onClick={() => launchAgent("Plan something with Jamie — it's been 3 weeks!")}>
          <div className="home__nudge-avatar">J</div>
          <div className="home__nudge-body">
            <p className="home__nudge-text">
              It's been 3 weeks since you saw <strong>Jamie</strong>. Want to make a plan?
            </p>
            <button className="home__nudge-cta">Let's go →</button>
          </div>
        </div>

      </div>

      <BottomNav
        active={activeTab}
        onFriends={() => { setActiveTab('friends'); if (onNavigate) onNavigate('friends'); }}
        onPlans={() => { setActiveTab('plans'); launchAgent(null); }}
        onComingUp={() => setActiveTab('comingup')}
      />
    </div>
  );
}
