import { useState, useEffect, useRef, useCallback } from 'react';
import logoMark from './logo.png';
import './AgentChatScreen.css';
import BottomNav from './BottomNav';
import { PEOPLE_PHOTOS, photoStyle } from './people';

const SYSTEM_PROMPT = `You are CommonGround's planning assistant — warm, concise, and focused on helping users coordinate social plans. You help friends find the right time, pick great venues, and turn vague plans into real ones. Keep responses short (1–3 sentences), conversational, and action-oriented. You're embedded in a planning app where structured actions like checking availability, picking venues, and sending invites are handled by the UI — respond naturally to questions and free-form messages. Never list options or repeat UI information already shown.`;

// ── Default group (used when no people prop is passed) ─
const DEFAULT_GROUP = [
  { name: 'Jamie', initial: 'J', color: '#996699' },
  { name: 'Alex',  initial: 'A', color: '#FF9933' },
  { name: 'Sam',   initial: 'S', color: '#AFCE65' },
];

const AVATAR_COLORS = ['#996699', '#FF9933', '#AFCE65', '#FF6B6B', '#CC88AA', '#6B9FFF'];

function parseNames(text) {
  const parts = text.split(/,|\band\b|&/i).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return parts.map((raw, i) => {
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    return { name, initial: name[0], color: AVATAR_COLORS[i % AVATAR_COLORS.length] };
  });
}

// Format a list of people into a readable string
function formatNames(people) {
  if (people.length === 1) return people[0].name;
  if (people.length === 2) return `${people[0].name} and ${people[1].name}`;
  return `${people.slice(0, -1).map(p => p.name).join(', ')}, and ${people[people.length - 1].name}`;
}

// Staggered confirm delays per person (ms after card mounts)
function getConfirmDelays(count) {
  return Array.from({ length: count }, (_, i) => 1600 + i * 1300);
}

// ── Tiny avatar ───────────────────────────────────────
function Avatar({ initial, color, size = 32, name }) {
  const photo = name && PEOPLE_PHOTOS[name];
  return (
    <div
      className="mini-avatar"
      style={{ width: size, height: size, background: photo ? 'transparent' : color, fontSize: size * 0.42, overflow: 'hidden' }}
    >
      {photo ? <img src={photo} alt={name} style={photoStyle} /> : initial}
    </div>
  );
}

// ── Typing dots ───────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="agent-row">
      <div className="agent-avatar">
        <img src={logoMark} alt="CG" />
      </div>
      <div className="typing-indicator">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Availability card ─────────────────────────────────
function AvailabilityCard({ onSelect, locked, people }) {
  const [selected, setSelected] = useState(null);

  const formatDate = date => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const slots = [];
  const start = new Date();
  for (let i = 0; i < 7; i += 1) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const dayName = DAYS[cur.getDay()];
    const dateLabel = `${dayName} ${formatDate(cur)}`;

    const slotTimes = ['10:00 – 12:00', '18:00 – 20:00'];
    slotTimes.forEach((time, idx) => {
      const id = `${dayName.toLowerCase().slice(0,3)}-${idx}`;
      slots.push({ id, day: dateLabel, time, free: people.length });
    });
  }

  const availableSlots = slots.slice(0, 4);

  return (
    <div className="avail-card">
      <div className="avail-card__header">
        <span className="avail-card__title">📅 Next week</span>
      </div>
      <div className="avail-grid">
        {availableSlots.map(slot => (
          <button
            key={slot.id}
            disabled={locked}
            className={[
              'avail-slot',
              selected === slot.id ? 'avail-slot--selected' : '',
            ].join(' ')}
            onClick={() => {
              if (locked) return;
              setSelected(slot.id);
              onSelect(slot);
            }}
          >
            <span className="avail-slot__day">{slot.day}</span>
            <span className="avail-slot__time">{slot.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Options card ──────────────────────────────────────
function OptionsCard({ onSelect, locked }) {
  const [selected, setSelected] = useState(null);
  const [customVenue, setCustomVenue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const opts = [
    { id: 'a', emoji: '🍝', name: "Carmine's Italian", meta: 'Italian · $$ · 0.8 mi', tag: 'Top pick for groups' },
    { id: 'b', emoji: '🍣', name: 'Sushi Palace',      meta: 'Japanese · $$$ · 1.2 mi', tag: "Matches Jamie's taste" },
    { id: 'c', emoji: '🍕', name: 'The Wood House',    meta: 'Pizza · $ · 0.3 mi', tag: 'Closest & accessible' },
    { id: 'other', emoji: '🏠', name: 'Other', meta: 'Choose your own place', tag: 'Custom choice' },
  ];

  const handleCustomSubmit = () => {
    if (customVenue.trim() && !locked) {
      onSelect({
        id: 'custom',
        name: customVenue.trim(),
        emoji: '🎯',
        meta: 'Your choice · Custom',
        tag: 'Personal pick'
      });
      setSelected('other');
    }
  };

  return (
    <div className="options-card">
      <p className="options-card__title">✨ Picks for your group</p>
      {opts.map(opt => (
        <div key={opt.id}>
          <button
            disabled={locked}
            className={['option-row', selected === opt.id ? 'option-row--selected' : ''].join(' ')}
            onClick={() => {
              if (locked) return;
              if (opt.id === 'other') {
                setSelected(opt.id);
                setShowCustomInput(true);
              } else {
                setSelected(opt.id);
                setShowCustomInput(false);
                onSelect(opt);
              }
            }}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <div className="option-info">
              <span className="option-name">{opt.name}</span>
              <span className="option-meta">{opt.meta}</span>
              <span className="option-tag">{opt.tag}</span>
            </div>
            <div className={['option-check', selected === opt.id ? 'option-check--on' : ''].join(' ')}>
              {selected === opt.id ? '✓' : ''}
            </div>
          </button>
          {opt.id === 'other' && showCustomInput && (
            <div className="custom-venue-input">
              <input
                type="text"
                placeholder="Enter venue name..."
                value={customVenue}
                onChange={(e) => setCustomVenue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                disabled={locked}
              />
              <button
                className={['custom-venue-submit', customVenue.trim() ? 'custom-venue-submit--active' : ''].join(' ')}
                onClick={handleCustomSubmit}
                disabled={!customVenue.trim() || locked}
              >
                ✓
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── People confirmation card ──────────────────────────
function PeopleConfirmCard({ venue, slot, onAllConfirmed, people }) {
  const delays = getConfirmDelays(people.length);
  // statuses: 'sent' | 'confirmed'
  const [statuses, setStatuses] = useState(people.map(() => 'sent'));
  const calledBack = useRef(false);

  useEffect(() => {
    const timers = delays.map((delay, i) =>
      setTimeout(() => {
        setStatuses(prev => {
          const next = [...prev];
          next[i] = 'confirmed';
          return next;
        });
      }, delay)
    );

    // Once last person confirms, notify parent
    const doneTimer = setTimeout(() => {
      if (!calledBack.current) {
        calledBack.current = true;
        onAllConfirmed();
      }
    }, delays[delays.length - 1] + 600);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [onAllConfirmed]);

  const allConfirmed = statuses.every(s => s === 'confirmed');
  const confirmedCount = statuses.filter(s => s === 'confirmed').length;

  return (
    <div className="people-confirm-card">
      <div className="people-confirm-card__header">
        <span className="people-confirm-card__title">
          {allConfirmed ? "Everyone's in! 🎉" : `Waiting for confirmations… ${confirmedCount}/${people.length}`}
        </span>
        <div className="people-confirm-card__venue">
          {venue?.emoji || '📍'} {venue?.name} · {slot?.day}
        </div>
      </div>

      <div className="people-confirm-card__list">
        {people.map((person, i) => {
          const confirmed = statuses[i] === 'confirmed';
          return (
            <div key={person.name} className="confirm-row">
              <Avatar initial={person.initial} color={person.color} size={36} name={person.name} />
              <div className="confirm-row__info">
                <span className="confirm-row__name">{person.name}</span>
                <span className={`confirm-row__status ${confirmed ? 'confirm-row__status--ok' : ''}`}>
                  {confirmed ? 'Confirmed ✓' : 'Invite sent…'}
                </span>
              </div>
              <div className={`confirm-badge ${confirmed ? 'confirm-badge--ok' : 'confirm-badge--pending'}`}>
                {confirmed ? '✓' : '⏳'}
              </div>
            </div>
          );
        })}
      </div>

      {allConfirmed && (
        <div className="people-confirm-card__footer">
          All {people.length} {people.length === 1 ? 'person' : 'people'} confirmed · Ready to book
        </div>
      )}
    </div>
  );
}

// ── Calendar confirmation card ────────────────────────
function CalendarCard({ venue, slot, people }) {
  return (
    <div className="cal-confirm-card">
      <div className="cal-confirm-card__top">
        <div className="cal-confirm-card__icon">🎉</div>
        <div>
          <p className="cal-confirm-card__title">All set!</p>
          <p className="cal-confirm-card__venue">{venue?.name || 'Your outing'}</p>
          <p className="cal-confirm-card__time">{slot?.day} · {slot?.time}</p>
        </div>
      </div>
      <div className="cal-confirm-card__divider" />
      <div className="cal-confirm-card__people">
        {people.map(p => (
          <div key={p.name} className="cal-confirm-person">
            <Avatar initial={p.initial} color={p.color} size={30} name={p.name} />
            <span className="cal-confirm-person__name">{p.name}</span>
            <span className="cal-confirm-person__status">✓ Added</span>
          </div>
        ))}
      </div>
      <p className="cal-confirm-card__note">{people.length} {people.length === 1 ? 'calendar' : 'calendars'} updated · Invites sent</p>
    </div>
  );
}

// ── Single message row ────────────────────────────────
function MessageRow({ msg, onSlotSelect, onVenueSelect, onQuickReply,
                      onAllConfirmed, slotRef, venueRef, isLatest, people }) {
  if (msg.type === 'user') {
    return (
      <div className="user-row">
        <div className="user-bubble">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="agent-row">
      <div className="agent-avatar">
        <img src={logoMark} alt="CG" />
      </div>
      <div className="agent-col">
        {msg.text && <div className="agent-bubble">{msg.text}</div>}
        {msg.cardType === 'availability' && (
          <AvailabilityCard onSelect={onSlotSelect} locked={!isLatest} people={people} />
        )}
        {msg.cardType === 'options' && (
          <OptionsCard onSelect={onVenueSelect} locked={!isLatest} />
        )}
        {msg.cardType === 'people-confirm' && (
          <PeopleConfirmCard
            venue={venueRef.current}
            slot={slotRef.current}
            onAllConfirmed={onAllConfirmed}
            people={people}
          />
        )}
        {msg.cardType === 'calendar' && (
          <CalendarCard venue={venueRef.current} slot={slotRef.current} people={people} />
        )}
        {msg.quickReplies && isLatest && (
          <div className="quick-replies">
            {msg.quickReplies.map(qr => (
              <button key={qr} className="quick-reply" onClick={() => onQuickReply(qr)}>
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Venue detection & Google Places ──────────────────
function isVenueQuery(text) {
  return /restaurant|bar|cafe|coffee|pub|food|eat|drink|venue|place|suggest|recommend|where (should|can) (we|i)|find (a|some)|looking for|what.s (good|near|around)|activit|things? to do|night ?out|brunch|dinner|lunch/i.test(text);
}

async function fetchPlaces(query) {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.currentOpeningHours,places.priceLevel,places.editorialSummary',
      },
      body: JSON.stringify({ textQuery: query }),
    });
    const data = await res.json();
    return data.places?.slice(0, 5) || [];
  } catch (err) {
    console.error('Google Places error:', err);
    return [];
  }
}

function formatPlacesForContext(places) {
  const lines = places.slice(0, 3).map((p, i) => {
    const name    = p.displayName?.text || 'Unknown';
    const address = p.formattedAddress || '';
    const rating  = p.rating ? `⭐ ${p.rating}` : '';
    return `${i + 1}. ${name} — ${address}${rating ? ' · ' + rating : ''}`;
  });
  return `Real venues from Google Places:\n${lines.join('\n')}`;
}

// ── Main screen ───────────────────────────────────────
export default function AgentChatScreen({ initialMessage, people: peopleProp, venueContext, onBack, onNavigate, onSaveDraft, onDeleteCurrentDraft, draftData }) {
  const [people, setPeople] = useState(peopleProp || DEFAULT_GROUP);
  const peopleRef = useRef(peopleProp || DEFAULT_GROUP);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [step, setStep]           = useState('idle');
  const [confirmationsSent, setConfirmationsSent] = useState(false);
  const stepRef        = useRef('idle');
  const slotRef        = useRef(null);
  const venueRef       = useRef(null);
  const scrollRef      = useRef(null);
  const startedRef     = useRef(false);
  const apiMessagesRef = useRef([]);

  stepRef.current = step;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMsg = useCallback((msg) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, ...msg }]);
    if (msg.type === 'user' && msg.text) {
      apiMessagesRef.current = [...apiMessagesRef.current, { role: 'user', content: msg.text }];
    }
  }, []);

  const agentSay = useCallback((waitMs, msg, uiOnly = false) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type: 'agent', ...msg }]);
          if (!uiOnly && msg.text) {
            apiMessagesRef.current = [...apiMessagesRef.current, { role: 'assistant', content: msg.text }];
          }
          resolve();
        }, 1100);
      }, waitMs);
    });
  }, []);

  const callClaude = useCallback(async (userText) => {
    const msgId = `${Date.now()}-${Math.random()}`;
    setIsTyping(false);
    setMessages(prev => [...prev, { id: msgId, type: 'agent', text: '' }]);

    // Fetch real venue data if the user is asking for suggestions
    let systemPrompt = SYSTEM_PROMPT;
    if (userText && isVenueQuery(userText)) {
      const places = await fetchPlaces(userText);
      if (places.length > 0) {
        systemPrompt += '\n\n' + formatPlacesForContext(places);
      }
    }

    try {
      console.log('[Claude] system prompt length:', systemPrompt.length, '| messages count:', apiMessagesRef.current.length);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt,
          messages: apiMessagesRef.current
        })
      });
      const data = await response.json();
      const reply = data.content[0].text;

      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: reply } : m));
      apiMessagesRef.current = [...apiMessagesRef.current, { role: 'assistant', content: reply }];
    } catch (err) {
      console.error('[Claude] API error:', err);
      console.error('[Claude] error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      const fallback = "Sorry, I'm having trouble connecting right now. Please try again!";
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fallback } : m));
    }
  }, []);

  // Start conversation once
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (draftData) {
      // Restore from draft
      setMessages(draftData.messages || []);
      setStep(draftData.step || 'idle');
      setConfirmationsSent(draftData.confirmationsSent || false);
      if (draftData.slot) slotRef.current = draftData.slot;
      if (draftData.venue) venueRef.current = draftData.venue;
    } else if (venueContext) {
      // Venue card tap: agent speaks first with contextual opening
      setConfirmationsSent(false);
      setStep('venue_awaiting_who');
      (async () => {
        await agentSay(300, {
          text: `Great pick — ${venueContext} looks fun! Who do you want to go with? You can name a friend or pick a group.`,
        }, true);
      })();
    } else {
      // Start new conversation — display messages in UI only, don't populate apiMessagesRef
      setConfirmationsSent(false);
      const first = initialMessage || `Hey, I want to plan something with ${formatNames(people)}`;
      setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type: 'user', text: first }]);
      setStep('awaiting_slot');

      const checkingMsg = people.length === 1
        ? `On it! Checking when ${people[0].name} is free this week... 🔍`
        : `On it! Checking when ${formatNames(people)} are all free this week... 🔍`;

      (async () => {
        await agentSay(400, { text: checkingMsg }, true);
        await agentSay(600, {
          text: "Found it! Here's availability — tap a slot to pick your window:",
          cardType: 'availability',
        }, true);
      })();
    }
  }, [addMsg, agentSay, initialMessage, venueContext, draftData]);

  const handleSlotSelect = useCallback((slot) => {
    if (stepRef.current !== 'awaiting_slot') return;
    slotRef.current = slot;
    addMsg({ type: 'user', text: `${slot.day} ${slot.time} works for me!` });

    if (venueContext) {
      // Venue already chosen — skip options, go straight to confirmation
      venueRef.current = { name: venueContext, emoji: '📍' };
      setStep('awaiting_rsvp');
      (async () => {
        await agentSay(400, {
          text: `${slot.day} it is! 🙌 I'll send the invites to ${formatNames(peopleRef.current)} now.`,
          cardType: 'people-confirm',
        });
        setConfirmationsSent(true);
      })();
    } else {
      setStep('slot_chosen');
      const currentPeople = peopleRef.current;
      let activity;
      if (slot.time.includes('11 am') || slot.time.includes('2 pm')) {
        activity = { id: 'lunch', name: 'Lunch', emoji: '🥗' };
      } else if (slot.time.includes('2 – 5 pm')) {
        activity = { id: 'coffee', name: 'Coffee', emoji: '☕' };
      } else if (slot.time.includes('6 – 9 pm') || slot.time.includes('7 – 10 pm')) {
        activity = { id: 'dinner', name: 'Dinner', emoji: '🍽️' };
      }
      (async () => {
        await agentSay(300, {
          text: `${slot.day} ${slot.time.split(' – ')[0]} it is! 🙌 Planning a ${activity?.name.toLowerCase() ?? 'hangout'} with ${formatNames(currentPeople)}. Pulling up options that match everyone's taste...`,
        });
        await agentSay(700, {
          text: "Here are my top picks — tap one to lock it in:",
          cardType: 'options',
        });
        setStep('awaiting_venue');
      })();
    }
  }, [addMsg, agentSay, venueContext]);

  const handleVenueSelect = useCallback((venue) => {
    if (stepRef.current !== 'awaiting_venue') return;
    venueRef.current = venue;
    setStep('awaiting_rsvp');
    addMsg({ type: 'user', text: `${venue.name} looks perfect!` });

    (async () => {
      await agentSay(400, {
        text: "Great pick! Before I book, let me send confirmation requests to everyone.",
        cardType: 'people-confirm',
      });
      setConfirmationsSent(true);
      // onAllConfirmed will fire automatically from the card after all people confirm
    })();
  }, [addMsg, agentSay]);

  // Called by PeopleConfirmCard once all statuses reach 'confirmed'
  const handleAllConfirmed = useCallback(() => {
    if (stepRef.current !== 'awaiting_rsvp') return;
    setStep('awaiting_book');

    (async () => {
      await agentSay(400, {
        text: "Everyone's confirmed! 🎉 Shall I go ahead and book it?",
        quickReplies: ["Yes, book!", "Cancel Plan"],
      });
    })();
  }, [agentSay]);

  const handleQuickReply = useCallback((reply) => {
    if (stepRef.current !== 'awaiting_book') return;
    addMsg({ type: 'user', text: reply });

    if (reply === "Yes, book!") {
      setStep('done');
      if (draftData) onDeleteCurrentDraft();
      (async () => {
        await agentSay(300, { text: "Booking confirmed and adding to everyone's calendars now... 📅" });
        await agentSay(600, {
          text: "Done! Everyone's been notified. See you Saturday! 🥂",
          cardType: 'calendar',
        });
      })();
    } else if (reply === "Cancel Plan") {
      setStep('cancelled');
      (async () => {
        await agentSay(400, {
          text: "See you next time! 👋",
          quickReplies: ["End Chat"],
        });
      })();
    } else if (reply === "End Chat") {
      if (draftData) onDeleteCurrentDraft();
      onBack();
    }
  }, [addMsg, agentSay, draftData, onDeleteCurrentDraft, onBack]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    addMsg({ type: 'user', text });
    setInputText('');

    if (stepRef.current === 'venue_awaiting_who') {
      const parsed = parseNames(text);
      if (parsed) {
        setPeople(parsed);
        peopleRef.current = parsed;
      }
      setStep('venue_awaiting_when');
      (async () => {
        await agentSay(500, {
          text: "Got it — when were you thinking? I can check everyone's availability and find a time that works.",
        });
      })();
    } else if (stepRef.current === 'venue_awaiting_when') {
      setStep('awaiting_slot');
      const currentPeople = peopleRef.current;
      (async () => {
        const checkMsg = currentPeople.length === 1
          ? `On it! Checking when ${currentPeople[0].name} is free... 🔍`
          : `On it! Checking when ${formatNames(currentPeople)} are all free... 🔍`;
        await agentSay(400, { text: checkMsg });
        await agentSay(600, {
          text: "Found it! Here's availability — tap a slot to pick your window:",
          cardType: 'availability',
        });
      })();
    } else {
      callClaude(text);
    }
  };

  const handleBack = () => {
    // Show exit dialog if there's any progress to save (not just initial states or completed bookings)
    if (step !== 'idle' && step !== 'awaiting_slot' && step !== 'done') {
      setShowExitDialog(true);
    } else {
      onBack();
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      initialMessage: initialMessage || messages.find(m => m.type === 'user')?.text || 'Planning session',
      messages,
      step,
      slot: slotRef.current,
      venue: venueRef.current,
      confirmationsSent,
      previewText: getPreviewText(),
      status: getStatusText(),
    };
    onSaveDraft(draftData);
    setShowExitDialog(false);
    onBack();
  };

  const getPreviewText = () => {
    if (venueRef.current) {
      return `Planning ${venueRef.current.name} with the group`;
    } else if (slotRef.current) {
      return `Planning ${slotRef.current.day} ${slotRef.current.time}`;
    }
    return initialMessage || 'Planning session';
  };

  const getStatusText = () => {
    switch (step) {
      case 'awaiting_rsvp': return 'Awaiting confirmations';
      case 'awaiting_book': return 'Ready to book';
      case 'awaiting_venue': return 'Choosing venue';
      case 'awaiting_slot': return 'Choosing time';
      case 'cancelled': return 'Plan cancelled';
      default: return 'In progress';
    }
  };

  return (
    <div className="agent-screen">

      {/* ── Header ── */}
      <div className="agent-header">
        <button className="agent-header__back" onClick={handleBack}>←</button>
        <div className="agent-header__info">
          <img src={logoMark} alt="" className="agent-header__logo" />
          <div>
            <p className="agent-header__name">CommonGround AI</p>
            <p className="agent-header__status">
              <span className="agent-header__dot" />
              Planning assistant
            </p>
          </div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Messages ── */}
      <div className="agent-messages" ref={scrollRef}>
        <div className="agent-messages__spacer" />
        {(() => {
          const lastAgentIdx = messages.map((m, i) => m.type === 'agent' ? i : -1).filter(i => i !== -1).pop() || -1;
          return messages.map((msg, idx) => (
            <MessageRow
              key={msg.id}
              msg={msg}
              isLatest={idx === lastAgentIdx}
              onSlotSelect={handleSlotSelect}
              onVenueSelect={handleVenueSelect}
              onAllConfirmed={handleAllConfirmed}
              onQuickReply={handleQuickReply}
              slotRef={slotRef}
              venueRef={venueRef}
              people={people}
            />
          ));
        })()}
        {isTyping && <TypingIndicator />}
      </div>

      {/* ── Save while waiting ── */}
      {step === 'awaiting_rsvp' && confirmationsSent && (
        <div className="save-while-waiting">
          <button className="save-while-waiting__button" onClick={() => {
            handleSaveDraft();
            onBack();
          }}>
            💾 Save while you wait
          </button>
          <p className="save-while-waiting__text">
            We'll notify you when everyone confirms!
          </p>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="agent-input-bar">
        <input
          className="agent-input"
          placeholder="Reply or ask anything..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className={['agent-send', inputText ? 'agent-send--active' : ''].join(' ')}
          onClick={handleSend}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Exit Dialog ── */}
      {showExitDialog && (
        <div className="exit-dialog-overlay">
          <div className="exit-dialog">
            <h3 className="exit-dialog__title">Save as Draft?</h3>
            <p className="exit-dialog__message">
              You're in the middle of planning. Save this as a draft to continue later?
            </p>
            <div className="exit-dialog__actions">
              <button className="exit-dialog__cancel" onClick={() => {
                setShowExitDialog(false);
                onBack();
              }}>
                Don't save
              </button>
              <button className="exit-dialog__save" onClick={handleSaveDraft}>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav
        active="plans"
        onFriends={() => { if (onNavigate) onNavigate('friends'); }}
        onPlans={() => {}}
        onComingUp={() => { if (onNavigate) onNavigate('comingup'); }}
      />
    </div>
  );
}
