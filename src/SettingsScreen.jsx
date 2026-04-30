import { useState } from 'react';
import './SettingsScreen.css';

const INTERESTS = ['Food & Drinks', 'Outdoors', 'Culture', 'Nightlife', 'Live Music', 'Sports', 'Art', 'Gaming'];
const DIETARY = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'Dairy-free'];
const CALENDAR_PROVIDERS = [
  { id: 'icloud', name: 'iCloud', subtitle: 'Apple iCloud' },
  { id: 'exchange', name: 'Microsoft Exchange', subtitle: 'Exchange' },
  { id: 'google', name: 'Google', subtitle: 'Google Calendar' },
  { id: 'yahoo', name: 'Yahoo!', subtitle: 'Yahoo Mail' },
  { id: 'aol', name: 'AOL.', subtitle: 'AOL Mail' },
  { id: 'outlook', name: 'Outlook.com', subtitle: 'Outlook' },
];

function ProviderIcon({ id }) {
  switch (id) {
    case 'icloud':
      // Apple Mail blue envelope icon
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5.5" fill="#1C8EF9"/>
          <path d="M4.5 8h15v10h-15V8z" fill="white"/>
          <path d="M4.5 8l7.5 5.5L19.5 8H4.5z" fill="#D6EAFF"/>
          <path d="M4.5 8l7.5 5.5L19.5 8" stroke="#B8D8F8" strokeWidth="0.6" fill="none"/>
        </svg>
      );
    case 'exchange':
      // Microsoft Exchange icon — blue with stylized E/X shape
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5.5" fill="#0F6CBD"/>
          {/* E body */}
          <rect x="4" y="4" width="9" height="16" rx="1.5" fill="#28A8E0"/>
          {/* E cutouts to form the E shape */}
          <rect x="7" y="7.5" width="5.5" height="2.5" rx="0.5" fill="#0F6CBD"/>
          <rect x="7" y="14" width="5.5" height="2.5" rx="0.5" fill="#0F6CBD"/>
          {/* Crossing bar */}
          <rect x="10" y="8" width="10" height="8" rx="1.5" fill="#50B0E8" opacity="0.85"/>
          <rect x="12" y="10.5" width="5.5" height="2.5" rx="0.5" fill="#0F6CBD" opacity="0.6"/>
        </svg>
      );
    case 'google':
      // Gmail multicolor M envelope icon (official Gmail SVG scaled to 24x24)
      return (
        <svg width="24" height="24" viewBox="52 42 88 66" fill="none">
          <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
          <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
          <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
          <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92"/>
          <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
        </svg>
      );
    case 'yahoo':
      // Yahoo Mail purple rounded square with envelope and yahoo! text
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="yahooGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7B2FBE"/>
              <stop offset="100%" stopColor="#5C18A4"/>
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="url(#yahooGrad)"/>
          <rect x="4" y="5.5" width="16" height="10" rx="1.5" fill="white"/>
          <path d="M4 7l8 5.5L20 7" stroke="#7B2FBE" strokeWidth="1.3" fill="none"/>
          <text x="12" y="22" fontSize="5" fontWeight="800" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">yahoo!</text>
        </svg>
      );
    case 'aol':
      // AOL Mail — envelope with AOL text overlay
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="3" fill="#F0F4FF"/>
          <path d="M2 6h20v14H2V6z" fill="#E8EEF8"/>
          <path d="M2 6l10 8L22 6H2z" fill="#B0BEE0"/>
          <path d="M2 6l10 8L22 6" stroke="#8A9DC0" strokeWidth="0.5" fill="none"/>
          <text x="12" y="17" fontSize="6.5" fontWeight="900" fill="#2A4FA8" textAnchor="middle" fontFamily="Arial, sans-serif">AOL.</text>
        </svg>
      );
    case 'outlook':
      // Outlook icon — blue background, white O letter, calendar grid
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5.5" fill="#0F6CBD"/>
          {/* White O */}
          <circle cx="9" cy="13" r="5" fill="white"/>
          <circle cx="9" cy="13" r="3" fill="#0F6CBD"/>
          {/* Calendar grid (right side) */}
          <rect x="15" y="5" width="7" height="7" rx="1" fill="white"/>
          <rect x="16" y="6.5" width="2" height="1.2" rx="0.3" fill="#0F6CBD"/>
          <rect x="19" y="6.5" width="2" height="1.2" rx="0.3" fill="#0F6CBD"/>
          <rect x="16" y="9" width="2" height="1.2" rx="0.3" fill="#0F6CBD"/>
          <rect x="19" y="9" width="2" height="1.2" rx="0.3" fill="#0F6CBD"/>
        </svg>
      );
    default:
      return <span />;
  }
}

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

function ProviderSelection({ onSelect, onAddOther }) {
  return (
    <div className="settings__provider-body">
      <div className="settings__provider-intro">Choose your provider</div>
      <div className="settings__provider-list">
        {CALENDAR_PROVIDERS.map(provider => (
          <button
            key={provider.id}
            className="settings__provider-card"
            onClick={() => onSelect(provider)}
          >
            <span className="settings__provider-icon"><ProviderIcon id={provider.id} /></span>
            <div className="settings__provider-copy">
              <span className="settings__provider-name">{provider.name}</span>
              <span className="settings__provider-subtitle">{provider.subtitle}</span>
            </div>
          </button>
        ))}
        <button className="settings__provider-card settings__provider-card--other" onClick={onAddOther}>
          <span className="settings__provider-icon">+</span>
          <div className="settings__provider-copy">
            <span className="settings__provider-name">Add Other Account…</span>
          </div>
        </button>
      </div>
    </div>
  );
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
  const [showProviderPicker, setShowProviderPicker] = useState(false);

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

  const openProviderPicker = () => setShowProviderPicker(true);
  const closeProviderPicker = () => setShowProviderPicker(false);
  const connectProvider = (provider) => {
    setCalendars(prev => {
      if (prev.some(c => c.id === provider.id)) return prev;
      return [...prev, { id: provider.id, name: provider.name, emoji: provider.emoji }];
    });
    setShowProviderPicker(false);
  };

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings__header">
        <button className="settings__back" onClick={showProviderPicker ? closeProviderPicker : onBack}>
          <BackIcon />
        </button>
        <h1 className="settings__title">{showProviderPicker ? 'Add Account' : 'Settings'}</h1>
        <div style={{ width: 38 }} />
      </div>

      <div className="settings__body">
        {showProviderPicker ? (
          <ProviderSelection
            onSelect={connectProvider}
            onAddOther={closeProviderPicker}
          />
        ) : (
          <>

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
            <button className="settings__text-btn settings__text-btn--green" onClick={openProviderPicker}>+ Connect another calendar</button>
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
          </>
        )}
      </div>
    </div>
  );
}
