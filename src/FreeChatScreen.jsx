import { useState, useEffect, useRef, useCallback } from 'react';
import logoMark from './logo.png';
import './FreeChatScreen.css';
import BottomNav from './BottomNav';

// ── Typing indicator ──────────────────────────────────
function TypingIndicator({ avatar, color }) {
  return (
    <div className="fc-row">
      <div className="fc-avatar" style={{ background: color }}>{avatar}</div>
      <div className="fc-typing"><span /><span /><span /></div>
    </div>
  );
}

// ── Agent (CG logo) typing ────────────────────────────
function AgentTyping() {
  return (
    <div className="fc-row">
      <div className="fc-avatar fc-avatar--agent">
        <img src={logoMark} alt="CG" />
      </div>
      <div className="fc-typing"><span /><span /><span /></div>
    </div>
  );
}

// ── Venue suggestions card ────────────────────────────
function VenueCard({ onSelect, locked, friendName }) {
  const [selected, setSelected] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState('');

  const venues = [
    { id: 'a', emoji: '☕', name: 'Workshop Coffee',   meta: 'Café · 0.3 mi · Open now', tag: 'Quick & easy' },
    { id: 'b', emoji: '🍕', name: 'Homeslice Pizza',   meta: 'Pizza · 0.6 mi · Open now', tag: 'Casual & fun' },
    { id: 'c', emoji: '🍺', name: 'The Exmouth Arms',  meta: 'Pub · 0.4 mi · Open now',  tag: 'Classic catch-up' },
    { id: 'other', emoji: '📍', name: 'Suggest your own', meta: 'Type a place', tag: '' },
  ];

  return (
    <div className="fc-venue-card">
      <p className="fc-venue-card__title">📍 Spots near {friendName}</p>
      {venues.map(v => (
        <div key={v.id}>
          <button
            disabled={locked}
            className={['fc-venue-row', selected === v.id ? 'fc-venue-row--selected' : ''].join(' ')}
            onClick={() => {
              if (locked) return;
              if (v.id === 'other') {
                setSelected('other');
                setShowCustom(true);
              } else {
                setSelected(v.id);
                setShowCustom(false);
                onSelect(v);
              }
            }}
          >
            <span className="fc-venue-emoji">{v.emoji}</span>
            <div className="fc-venue-info">
              <span className="fc-venue-name">{v.name}</span>
              <span className="fc-venue-meta">{v.meta}</span>
              {v.tag && <span className="fc-venue-tag">{v.tag}</span>}
            </div>
            <div className={['fc-venue-check', selected === v.id ? 'fc-venue-check--on' : ''].join(' ')}>
              {selected === v.id ? '✓' : ''}
            </div>
          </button>
          {v.id === 'other' && showCustom && (
            <div className="fc-custom-input">
              <input
                autoFocus
                type="text"
                placeholder="Enter a place…"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customText.trim()) {
                    onSelect({ id: 'custom', emoji: '📍', name: customText.trim(), meta: 'Your pick', tag: '' });
                  }
                }}
                disabled={locked}
              />
              <button
                className={['fc-custom-submit', customText.trim() ? 'fc-custom-submit--active' : ''].join(' ')}
                disabled={!customText.trim() || locked}
                onClick={() => onSelect({ id: 'custom', emoji: '📍', name: customText.trim(), meta: 'Your pick', tag: '' })}
              >✓</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Meet-up confirmed card ────────────────────────────
function MeetCard({ venue, friend }) {
  return (
    <div className="fc-meet-card">
      <div className="fc-meet-card__icon">🎉</div>
      <div className="fc-meet-card__body">
        <p className="fc-meet-card__title">You're meeting {friend.name}!</p>
        <p className="fc-meet-card__venue">{venue.emoji} {venue.name}</p>
        <p className="fc-meet-card__note">Invite sent · Added to your plans</p>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────
export default function FreeChatScreen({ friend, onBack, onNavigate }) {
  const [messages, setMessages]     = useState([]);
  const [isTypingAgent, setIsTypingAgent] = useState(false);
  const [isTypingFriend, setIsTypingFriend] = useState(false);
  const [inputText, setInputText]   = useState('');
  const [step, setStep]             = useState('idle');
  const [venueChosen, setVenueChosen] = useState(null);

  const stepRef    = useRef('idle');
  const scrollRef  = useRef(null);
  const startedRef = useRef(false);

  stepRef.current = step;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTypingAgent, isTypingFriend]);

  const addMsg = useCallback((msg) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, ...msg }]);
  }, []);

  // Agent says something (CG logo)
  const agentSay = useCallback((waitMs, msg) => new Promise(resolve => {
    setTimeout(() => {
      setIsTypingAgent(true);
      setTimeout(() => {
        setIsTypingAgent(false);
        setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type: 'agent', ...msg }]);
        resolve();
      }, 1000);
    }, waitMs);
  }), []);

  // Friend replies
  const friendSay = useCallback((waitMs, text) => new Promise(resolve => {
    setTimeout(() => {
      setIsTypingFriend(true);
      setTimeout(() => {
        setIsTypingFriend(false);
        setMessages(prev => [...prev, {
          id: `${Date.now()}-${Math.random()}`,
          type: 'friend',
          text,
        }]);
        resolve();
      }, 1100);
    }, waitMs);
  }), []);

  // Kick off conversation
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      await agentSay(400, {
        text: `${friend.name} is free right now! 🎉 Want me to help you sort a spot to meet?`,
        quickReplies: [`Ask ${friend.name} where they are`, 'Suggest places nearby'],
      });
      setStep('awaiting_start');
    })();
  }, [agentSay, friend.name]);

  const handleQuickReply = useCallback((reply) => {
    addMsg({ type: 'user', text: reply });

    if (reply === `Ask ${friend.name} where they are`) {
      setStep('waiting_location');
      (async () => {
        await friendSay(700, `Hey! I'm near Shoreditch right now 📍`);
        await agentSay(500, {
          text: `${friend.name}'s near Shoreditch. Here are some easy spots close by:`,
          cardType: 'venues',
        });
        setStep('awaiting_venue');
      })();

    } else if (reply === 'Suggest places nearby') {
      setStep('awaiting_venue');
      (async () => {
        await agentSay(400, {
          text: `Here are some spots that work right now — pick one or suggest your own:`,
          cardType: 'venues',
        });
      })();

    } else if (reply === 'Send it!' || reply === "Let's go!") {
      if (!venueChosen) return;
      setStep('done');
      (async () => {
        await friendSay(600, `Perfect, heading there now! See you soon 👋`);
        await agentSay(400, {
          text: `All sorted! Have a great time ✨`,
          cardType: 'meet',
        });
      })();

    } else if (reply === 'Change venue') {
      setStep('awaiting_venue');
      addMsg({ type: 'agent', text: 'No problem — pick another spot:', cardType: 'venues' });
    }
  }, [addMsg, agentSay, friendSay, friend.name, venueChosen]);

  const handleVenueSelect = useCallback((venue) => {
    if (stepRef.current !== 'awaiting_venue') return;
    setVenueChosen(venue);
    setStep('awaiting_confirm');
    addMsg({ type: 'user', text: `${venue.name} looks good!` });

    (async () => {
      await agentSay(400, {
        text: `Nice choice! Shall I let ${friend.name} know you're both heading to ${venue.name}?`,
        quickReplies: ["Send it!", "Change venue"],
      });
    })();
  }, [addMsg, agentSay, friend.name]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    addMsg({ type: 'user', text });
    setInputText('');
    agentSay(500, { text: `On it — let me factor that in…` });
  };

  const lastAgentIdx = messages.map((m, i) => m.type === 'agent' ? i : -1).filter(i => i !== -1).pop() ?? -1;

  return (
    <div className="fc-screen">
      {/* Header */}
      <div className="fc-header">
        <button className="fc-header__back" onClick={onBack}>←</button>
        <div className="fc-header__info">
          <div className="fc-header__avatar" style={{ background: friend.color }}>
            {friend.initial}
          </div>
          <div>
            <p className="fc-header__name">{friend.name}</p>
            <p className="fc-header__status">
              <span className="fc-header__dot" /> free now
            </p>
          </div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Messages */}
      <div className="fc-messages" ref={scrollRef}>
        <div className="fc-messages__spacer" />

        {messages.map((msg, idx) => {
          const isLatest = idx === lastAgentIdx;

          if (msg.type === 'user') {
            return (
              <div key={msg.id} className="fc-user-row">
                <div className="fc-user-bubble">{msg.text}</div>
              </div>
            );
          }

          if (msg.type === 'friend') {
            return (
              <div key={msg.id} className="fc-row">
                <div className="fc-avatar" style={{ background: friend.color }}>{friend.initial}</div>
                <div className="fc-friend-bubble">{msg.text}</div>
              </div>
            );
          }

          // agent message
          return (
            <div key={msg.id} className="fc-row">
              <div className="fc-avatar fc-avatar--agent">
                <img src={logoMark} alt="CG" />
              </div>
              <div className="fc-agent-col">
                {msg.text && <div className="fc-agent-bubble">{msg.text}</div>}
                {msg.cardType === 'venues' && (
                  <VenueCard
                    onSelect={handleVenueSelect}
                    locked={!isLatest}
                    friendName={friend.name}
                  />
                )}
                {msg.cardType === 'meet' && venueChosen && (
                  <MeetCard venue={venueChosen} friend={friend} />
                )}
                {msg.quickReplies && isLatest && (
                  <div className="fc-quick-replies">
                    {msg.quickReplies.map(qr => (
                      <button key={qr} className="fc-quick-reply" onClick={() => handleQuickReply(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTypingAgent  && <AgentTyping />}
        {isTypingFriend && <TypingIndicator avatar={friend.initial} color={friend.color} />}
      </div>

      {/* Input */}
      <div className="fc-input-bar">
        <input
          className="fc-input"
          placeholder="Say something…"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className={['fc-send', inputText ? 'fc-send--active' : ''].join(' ')}
          onClick={handleSend}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <BottomNav
        active="plans"
        onFriends={() => onNavigate && onNavigate('friends')}
        onPlans={() => {}}
        onComingUp={() => onNavigate && onNavigate('comingup')}
      />
    </div>
  );
}
