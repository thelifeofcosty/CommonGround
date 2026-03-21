import { useState } from 'react';
import './ComingUpScreen.css';
import BottomNav from './BottomNav';

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: 'Drinks at The Alchemist',
    date: '2026-03-22',
    time: '19:00',
    location: 'The Alchemist, Spinningfields',
    attendees: ['You', 'Jamie', 'Alex'],
    description: 'Cocktails and catch-up after work.',
    color: '#996699',
    emoji: '🍹',
  },
  {
    id: 2,
    title: 'Brunch at Elnecot',
    date: '2026-03-28',
    time: '11:30',
    location: 'Elnecot, Ancoats',
    attendees: ['You', 'Sam', 'Jamie', 'Priya'],
    description: 'Weekend brunch — booked the big table.',
    color: '#FF9933',
    emoji: '🥞',
  },
  {
    id: 3,
    title: 'Boardgame Night at Sam\'s',
    date: '2026-04-04',
    time: '18:30',
    location: 'Sam\'s Place, Didsbury',
    attendees: ['You', 'Sam', 'Alex', 'Jordan'],
    description: 'Bringing Catan. Sam has Ticket to Ride.',
    color: '#AFCE65',
    emoji: '🎲',
  },
  {
    id: 4,
    title: 'Parkrun + Coffee',
    date: '2026-04-11',
    time: '09:00',
    location: 'Platt Fields Park',
    attendees: ['You', 'Jamie'],
    description: '5k then coffee at the park café.',
    color: '#AFCE65',
    emoji: '🏃',
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((event - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function ComingUpScreen({ onNavigate, onOpenAgent }) {
  const [joined, setJoined] = useState({});

  const toggle = (id) => {
    setJoined(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="comingup">
      <div className="comingup__body">

        <div className="comingup__header">
          <h1 className="comingup__title">Coming Up</h1>
          <p className="comingup__subtitle">Your upcoming plans</p>
        </div>

        <div className="comingup__list">
          {SAMPLE_EVENTS.map(ev => (
            <div className="comingup__card" key={ev.id}>
              <div className="comingup__card-accent" style={{ background: ev.color }} />
              <div className="comingup__card-inner">
                <div className="comingup__card-top">
                  <span className="comingup__emoji">{ev.emoji}</span>
                  <div className="comingup__card-info">
                    <span className="comingup__card-title">{ev.title}</span>
                    <span className="comingup__card-when">{formatDate(ev.date)} · {ev.time}</span>
                    <span className="comingup__card-where">📍 {ev.location}</span>
                  </div>
                  <span className="comingup__pill" style={{ background: ev.color + '22', color: ev.color }}>
                    {daysUntil(ev.date)}
                  </span>
                </div>

                {ev.description ? (
                  <p className="comingup__card-desc">{ev.description}</p>
                ) : null}

                <div className="comingup__card-bottom">
                  <div className="comingup__avatars">
                    {ev.attendees.slice(0, 4).map((name, i) => (
                      <div
                        key={i}
                        className="comingup__avatar"
                        style={{ background: ['#996699','#AFCE65','#FF9933','#7cb9e8'][i % 4], zIndex: 10 - i }}
                        title={name}
                      >
                        {name[0]}
                      </div>
                    ))}
                    {ev.attendees.length > 4 && (
                      <div className="comingup__avatar comingup__avatar--more">
                        +{ev.attendees.length - 4}
                      </div>
                    )}
                    <span className="comingup__attendee-count">{ev.attendees.length} going</span>
                  </div>
                  <button
                    className={`comingup__join ${joined[ev.id] ? 'comingup__join--active' : ''}`}
                    onClick={() => toggle(ev.id)}
                  >
                    {joined[ev.id] ? "✓ I'm in" : "I'm coming"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav
        active="comingup"
        onFriends={() => onNavigate && onNavigate('friends')}
        onPlans={() => onNavigate && onNavigate('home')}
        onComingUp={() => {}}
      />
    </div>
  );
}
