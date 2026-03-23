import { useState } from 'react';
import './AccountCustomizationScreen.css';

function ScreenHeader({ step, total, onBack }) {
  return (
    <div className="ac__header">
      <div className="ac__header-top">
        <button className="ac__back" onClick={onBack}>←</button>
        <div className="ac__header-center">
          <span className="ac__section">Customize profile</span>
          <span className="ac__step-label">{step} of {total}</span>
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div className="ac__progress-bar">
        <div className="ac__progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div className="ac-perm-row" onClick={() => onChange(!checked)}>
      <div className="ac-perm-row__text">
        <span className="ac-perm-row__label">{label}</span>
        {sublabel && <span className="ac-perm-row__sub">{sublabel}</span>}
      </div>
      <div className={`ac-toggle ${checked ? 'ac-toggle--on' : ''}`}>
        <div className="ac-toggle__thumb" />
      </div>
    </div>
  );
}

function StepProfile({ form, set, onNext }) {
  const initials = form.displayName
    ? form.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="ac__step">
      <div className="ac__step-header">
        <h2 className="ac__title">Your profile</h2>
        <p className="ac__sub">Add a photo and confirm how you want to appear to others.</p>
      </div>

      <div className="ac__avatar-wrap">
        <div className="ac__avatar">
          <span className="ac__avatar-initials">{initials}</span>
          <div className="ac__avatar-cam">📷</div>
        </div>
        <p className="ac__avatar-hint">Tap to add a photo</p>
      </div>

      <div className="ac__fields">
        <div className="ac-field">
          <label>Display name</label>
          <input
            placeholder="How should we call you?"
            value={form.displayName}
            onChange={e => set('displayName', e.target.value)}
          />
        </div>
        <div className="ac-field">
          <label>Bio <span className="ac-field__optional">optional</span></label>
          <textarea
            className="ac__textarea"
            placeholder="A short intro about yourself..."
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="ac__footer">
        <button
          className={`ac__btn ${form.displayName ? 'ac__btn--active' : ''}`}
          disabled={!form.displayName}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const FRIEND_VISIBILITY = [
  { id: 'activity', label: 'Activity & events', sub: "What you're attending or interested in" },
  { id: 'interests', label: 'Interests', sub: 'Your food, activity, and budget preferences' },
  { id: 'location', label: 'Approximate location', sub: 'Neighbourhood-level, never exact' },
];

function StepPrivacy({ form, set, onNext }) {
  const toggleFriendVis = (id) =>
    set('friendVisibility', prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <div className="ac__step">
      <div className="ac__step-header">
        <h2 className="ac__title">Privacy settings</h2>
        <p className="ac__sub">Control who sees what. You can change this any time.</p>
      </div>

      <div className="ac__priv-sections">
        <div className="ac-priv-section">
          <p className="ac-priv-section__title">Profile visibility</p>
          <div className="ac-segment">
            <button
              className={`ac-segment__opt ${form.profilePublic ? 'ac-segment__opt--on' : ''}`}
              onClick={() => set('profilePublic', true)}
            >
              🌍 Public
            </button>
            <button
              className={`ac-segment__opt ${!form.profilePublic ? 'ac-segment__opt--on' : ''}`}
              onClick={() => set('profilePublic', false)}
            >
              🔒 Private
            </button>
          </div>
          <p className="ac-priv-note">
            {form.profilePublic
              ? 'Anyone on CommonGround can see your profile.'
              : 'Only people you connect with can see your profile.'}
          </p>
        </div>

        <div className="ac-priv-section">
          <p className="ac-priv-section__title">What friends can see</p>
          {FRIEND_VISIBILITY.map(({ id, label, sub }) => (
            <div
              key={id}
              className="ac-perm-row"
              onClick={() => toggleFriendVis(id)}
            >
              <div className="ac-perm-row__text">
                <span className="ac-perm-row__label">{label}</span>
                <span className="ac-perm-row__sub">{sub}</span>
              </div>
              <div className={`ac-checkbox ${form.friendVisibility.includes(id) ? 'ac-checkbox--checked' : ''}`}>
                {form.friendVisibility.includes(id) && '✓'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ac__footer">
        <button className="ac__btn ac__btn--active" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}

const NOTIF_OPTIONS = [
  { id: 'matches', label: 'New matches', sub: 'When someone with shared interests connects' },
  { id: 'messages', label: 'Messages', sub: 'Direct messages from your connections' },
  { id: 'events', label: 'Events nearby', sub: 'New events matching your interests' },
  { id: 'reminders', label: 'Event reminders', sub: "Reminders before events you've saved" },
  { id: 'updates', label: 'App updates', sub: 'New features and announcements' },
];

function StepNotifications({ form, set, onComplete }) {
  const toggle = (id) =>
    set('notifications', prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <div className="ac__step">
      <div className="ac__step-header">
        <h2 className="ac__title">Notifications</h2>
        <p className="ac__sub">Choose what you'd like to hear about.</p>
      </div>

      <div className="ac-priv-section ac-priv-section--standalone">
        {NOTIF_OPTIONS.map(({ id, label, sub }) => (
          <Toggle
            key={id}
            checked={form.notifications.includes(id)}
            onChange={() => toggle(id)}
            label={label}
            sublabel={sub}
          />
        ))}
      </div>

      <div className="ac__footer">
        <button className="ac__btn ac__btn--finish" onClick={onComplete}>
          Finish setup 🎉
        </button>
        <p className="ac__terms-note">You're almost there! Let's find your CommonGround.</p>
      </div>
    </div>
  );
}

export default function AccountCustomizationScreen({ userName, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    displayName: userName || '',
    bio: '',
    profilePublic: true,
    friendVisibility: ['activity', 'interests'],
    notifications: ['matches', 'messages', 'events', 'reminders'],
  });

  const set = (key, updater) =>
    setForm(f => ({ ...f, [key]: typeof updater === 'function' ? updater(f[key]) : updater }));

  const back = () => setStep(s => s - 1);
  const next = () => setStep(s => s + 1);

  return (
    <div className="ac">
      <ScreenHeader step={step} total={3} onBack={back} />
      {step === 1 && <StepProfile form={form} set={set} onNext={next} />}
      {step === 2 && <StepPrivacy form={form} set={set} onNext={next} />}
      {step === 3 && <StepNotifications form={form} set={set} onComplete={() => onComplete(form)} />}
    </div>
  );
}
