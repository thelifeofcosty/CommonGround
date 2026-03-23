import { useState } from 'react';
import './SettingsScreen.css';

const INTERESTS = ['Food & Drinks', 'Outdoors', 'Culture', 'Nightlife', 'Live Music', 'Sports', 'Art', 'Gaming'];
const DIETARY = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'Dairy-free'];

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#AFCE65" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#AFCE65" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      className={`settings__toggle ${on ? 'settings__toggle--on' : ''}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className="settings__toggle-thumb" />
    </button>
  );
}

function SectionLabel({ children }) {
  return <div className="settings__section-label">{children}</div>;
}

export default function SettingsScreen({ onBack, userName = 'Rose', userEmail = 'rose@example.com' }) {
  const firstName = userName.split(' ')[0];

  // Profile
  const [displayName, setDisplayName] = useState(userName);
  const [editingName, setEditingName] = useState(false);

  // Preferences
  const [interests, setInterests] = useState(['Food & Drinks', 'Outdoors', 'Live Music']);
  const [budget, setBudget] = useState('££');
  const [dietary, setDietary] = useState([]);
  const [showDietary, setShowDietary] = useState(false);
  const [otherDietaryText, setOtherDietaryText] = useState('');
  const [showOtherDietary, setShowOtherDietary] = useState(false);
  const [accessibility, setAccessibility] = useState(false);

  // Calendars
  const [calendars, setCalendars] = useState([
    { id: 'google', name: 'Google Calendar', emoji: '📅' },
  ]);

  // Privacy
  const [profilePublic, setProfilePublic] = useState(true);
  const [friendsSee, setFriendsSee] = useState({
    activity: true,
    interests: true,
    location: false,
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    planReminders: true,
    whosFree: true,
    nudges: true,
    friendRequests: true,
    appUpdates: false,
  });

  const toggleInterest = (i) => setInterests(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  );
  const toggleDietary = (d) => setDietary(prev =>
    prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
  );
  const setNotif = (key, val) => setNotifs(prev => ({ ...prev, [key]: val }));
  const setFriend = (key, val) => setFriendsSee(prev => ({ ...prev, [key]: val }));

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings__header">
        <button className="settings__back" onClick={onBack}>
          <BackIcon />
        </button>
        <h1 className="settings__title">Settings</h1>
        <div style={{ width: 38 }} />
      </div>

      <div className="settings__body">

        {/* ── PROFILE ─────────────────────────────────── */}
        <SectionLabel>Profile</SectionLabel>
        <div className="settings__card">

          <div className="settings__profile-row">
            <div className="settings__avatar-wrap">
              <div className="settings__avatar">{firstName[0]}</div>
              <div className="settings__avatar-edit"><EditIcon /></div>
            </div>
            <div className="settings__profile-info">
              {editingName ? (
                <input
                  className="settings__name-input"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                />
              ) : (
                <span className="settings__profile-name">{displayName}</span>
              )}
              <span className="settings__profile-email">{userEmail}</span>
            </div>
          </div>

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Display name</span>
            <span className="settings__row-value">{displayName}</span>
            <button className="settings__text-btn" onClick={() => setEditingName(true)}>Edit</button>
          </div>

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Email</span>
            <span className="settings__row-value">{userEmail}</span>
          </div>

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Password</span>
            <span className="settings__row-value">••••••••</span>
            <button className="settings__text-btn">Edit</button>
          </div>
        </div>

        {/* ── PREFERENCES ──────────────────────────────── */}
        <SectionLabel>Preferences</SectionLabel>
        <div className="settings__card">

          <div className="settings__row-col">
            <span className="settings__row-label">Activity interests</span>
            <div className="settings__pills">
              {INTERESTS.map(i => (
                <button
                  key={i}
                  className={`settings__pill ${interests.includes(i) ? 'settings__pill--on' : ''}`}
                  onClick={() => toggleInterest(i)}
                >{i}</button>
              ))}
            </div>
          </div>

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Budget range</span>
            <div className="settings__budget-group">
              {['£', '££', '£££'].map(b => (
                <button
                  key={b}
                  className={`settings__budget-btn ${budget === b ? 'settings__budget-btn--on' : ''}`}
                  onClick={() => setBudget(b)}
                >{b}</button>
              ))}
            </div>
          </div>

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Dietary restrictions</span>
            <Toggle on={showDietary} onChange={setShowDietary} />
          </div>
          {showDietary && (
            <div className="settings__pills settings__pills--indent">
              {DIETARY.map(d => (
                <button
                  key={d}
                  className={`settings__pill ${dietary.includes(d) ? 'settings__pill--on' : ''}`}
                  onClick={() => toggleDietary(d)}
                >{d}</button>
              ))}
              {dietary.filter(d => !DIETARY.includes(d)).map(d => (
                <button
                  key={d}
                  className="settings__pill settings__pill--on"
                  onClick={() => toggleDietary(d)}
                >{d} ✕</button>
              ))}
              <button
                className={`settings__pill ${showOtherDietary ? 'settings__pill--on' : ''}`}
                onClick={() => setShowOtherDietary(p => !p)}
              >+ Other</button>
              {showOtherDietary && (
                <div className="settings__other-dietary">
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Low-FODMAP"
                    value={otherDietaryText}
                    onChange={e => setOtherDietaryText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && otherDietaryText.trim()) {
                        if (!dietary.includes(otherDietaryText.trim())) toggleDietary(otherDietaryText.trim());
                        setOtherDietaryText('');
                        setShowOtherDietary(false);
                      }
                    }}
                  />
                  <button
                    disabled={!otherDietaryText.trim()}
                    onClick={() => {
                      if (!dietary.includes(otherDietaryText.trim())) toggleDietary(otherDietaryText.trim());
                      setOtherDietaryText('');
                      setShowOtherDietary(false);
                    }}
                  >✓</button>
                </div>
              )}
            </div>
          )}

          <div className="settings__divider" />

          <div className="settings__row">
            <span className="settings__row-label">Accessibility needs</span>
            <Toggle on={accessibility} onChange={setAccessibility} />
          </div>
        </div>

        {/* ── CALENDAR ─────────────────────────────────── */}
        <SectionLabel>Calendar</SectionLabel>
        <div className="settings__card">
          {calendars.map(cal => (
            <div key={cal.id}>
              <div className="settings__row">
                <span className="settings__cal-emoji">{cal.emoji}</span>
                <span className="settings__row-label settings__row-label--flex">{cal.name}</span>
                <button
                  className="settings__text-btn settings__text-btn--red"
                  onClick={() => setCalendars(prev => prev.filter(c => c.id !== cal.id))}
                >Disconnect</button>
              </div>
              <div className="settings__divider" />
            </div>
          ))}
          <div className="settings__row">
            <button className="settings__text-btn settings__text-btn--green">+ Connect another calendar</button>
          </div>
        </div>

        {/* ── PRIVACY ──────────────────────────────────── */}
        <SectionLabel>Privacy</SectionLabel>
        <div className="settings__card">

          <div className="settings__row">
            <span className="settings__row-label">Profile visibility</span>
            <div className="settings__seg">
              <button
                className={`settings__seg-btn ${profilePublic ? 'settings__seg-btn--on' : ''}`}
                onClick={() => setProfilePublic(true)}
              >Public</button>
              <button
                className={`settings__seg-btn ${!profilePublic ? 'settings__seg-btn--on' : ''}`}
                onClick={() => setProfilePublic(false)}
              >Private</button>
            </div>
          </div>

          <div className="settings__divider" />
          <div className="settings__row-col">
            <span className="settings__row-label">What friends can see</span>
            {[
              { key: 'activity', label: 'Activity & events' },
              { key: 'interests', label: 'Interests' },
              { key: 'location', label: 'Approximate location' },
            ].map(({ key, label }) => (
              <label key={key} className="settings__check-row">
                <input
                  type="checkbox"
                  className="settings__checkbox"
                  checked={friendsSee[key]}
                  onChange={e => setFriend(key, e.target.checked)}
                />
                <span className="settings__check-label">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── NOTIFICATIONS ────────────────────────────── */}
        <SectionLabel>Notifications</SectionLabel>
        <div className="settings__card">
          {[
            { key: 'planReminders', label: 'Plan reminders' },
            { key: 'whosFree', label: "Who's free now pings" },
            { key: 'nudges', label: 'Reconnect nudges' },
            { key: 'friendRequests', label: 'Friend requests' },
            { key: 'appUpdates', label: 'App updates' },
          ].map(({ key, label }, i, arr) => (
            <div key={key}>
              <div className="settings__row">
                <span className="settings__row-label">{label}</span>
                <Toggle on={notifs[key]} onChange={v => setNotif(key, v)} />
              </div>
              {i < arr.length - 1 && <div className="settings__divider" />}
            </div>
          ))}
        </div>

        {/* ── ACCOUNT ──────────────────────────────────── */}
        <SectionLabel>Account</SectionLabel>
        <div className="settings__card">
          <div className="settings__row">
            <button className="settings__danger-btn settings__danger-btn--orange">Log out</button>
          </div>
          <div className="settings__divider" />
          <div className="settings__row">
            <button className="settings__danger-btn settings__danger-btn--red">Delete account</button>
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
