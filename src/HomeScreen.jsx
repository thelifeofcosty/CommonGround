import { useState, useRef, useEffect } from 'react';
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

const NEARBY_VENUES = [
  { id: 1, name: "Carmine's Italian",   distance: '0.4 mi', sponsored: false, photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Victoria Park',        distance: '0.8 mi', sponsored: false, photo: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: "Ronnie's Jazz Club",   distance: '0.6 mi', sponsored: true,  photo: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Workshop Coffee',      distance: '0.3 mi', sponsored: false, photo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Tate Modern',          distance: '1.2 mi', sponsored: true,  photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Pergola Rooftop',      distance: '1.5 mi', sponsored: false, photo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=400&q=80' },
];

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
  const unseenScrollRef = useRef(null);
  const venuesScrollRef = useRef(null);

  useEffect(() => {
    function makeAutoScroll(el, pxPerSec) {
      if (!el) return () => {};
      let paused = false;
      let raf;
      let prev = null;
      let accum = 0;

      const tick = (now) => {
        if (!paused) {
          if (prev !== null) {
            accum += pxPerSec * (now - prev) / 1000;
            if (accum >= 1) {
              const move = Math.floor(accum);
              accum -= move;
              el.scrollLeft += move;
              if (el.scrollLeft >= el.scrollWidth / 2) {
                el.scrollLeft -= el.scrollWidth / 2;
              }
            }
          }
          prev = now;
        } else {
          prev = null;
          accum = 0;
        }
        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);

      const pause = () => { paused = true; };
      const resume = () => { setTimeout(() => { paused = false; }, 800); };

      el.addEventListener('touchstart', pause, { passive: true });
      el.addEventListener('touchend', resume, { passive: true });
      el.addEventListener('touchcancel', resume, { passive: true });
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);

      return () => {
        cancelAnimationFrame(raf);
        el.removeEventListener('touchstart', pause);
        el.removeEventListener('touchend', resume);
        el.removeEventListener('touchcancel', resume);
        el.removeEventListener('mouseenter', pause);
        el.removeEventListener('mouseleave', resume);
      };
    }

    const c1 = makeAutoScroll(unseenScrollRef.current, 18);
    const c2 = makeAutoScroll(venuesScrollRef.current, 14);
    return () => { c1(); c2(); };
  }, []);

  const firstName = userName.split(' ')[0];

  const launchAgent = (msg, people, venueContext) => {
    if (onOpenAgent) onOpenAgent(msg || null, people || null, venueContext || null);
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
          <div className="home__unseen-scroll" ref={unseenScrollRef}>
            <div className="home__unseen-track">
              {[...UNSEEN_FRIENDS, ...UNSEEN_FRIENDS].map((f, i) => {
                const photo = PEOPLE_PHOTOS[f.name];
                return (
                  <button
                    key={`${f.name}-${i}`}
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
        </div>

        <div className="home__venues">
          <p className="home__venues-title">Discover something new...</p>
          <div className="home__venues-scroll" ref={venuesScrollRef}>
            <div className="home__venues-track">
              {[...NEARBY_VENUES, ...NEARBY_VENUES].map((v, i) => (
                <button key={`${v.id}-${i}`} className="home__venues-card" onClick={() => launchAgent(null, null, v.name)}>
                  <div className="home__venues-photo">
                    <img src={v.photo} alt={v.name} />
                    {v.sponsored && <span className="home__venues-sponsored">Sponsored</span>}
                  </div>
                  <div className="home__venues-info">
                    <span className="home__venues-name">{v.name}</span>
                    <span className="home__venues-distance">
                      <svg width="10" height="12" viewBox="0 0 10 13" fill="none">
                        <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="#AFCE65"/>
                      </svg>
                      {v.distance}
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
