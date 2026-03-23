import { useState } from 'react';
import './SetupAccountScreen.css';

const CALENDARS = [
  { id: 'google', label: 'Google', color: '#4285F4', icon: 'G' },
  { id: 'apple', label: 'Apple', color: '#1A1A1A', icon: '' },
  { id: 'outlook', label: 'Outlook', color: '#0078D4', icon: 'O' },
  { id: 'yahoo', label: 'Yahoo', color: '#6001D2', icon: 'Y' },
  { id: 'notion', label: 'Notion', color: '#333', icon: 'N' },
];

const FOOD = [
  'Italian', 'Asian', 'Mexican', 'Mediterranean', 'American',
  'Indian', 'Japanese', 'Thai', 'Middle Eastern', 'French',
];

const ACTIVITIES = [
  'Hiking', 'Sports', 'Live Music', 'Art & Culture', 'Gaming',
  'Travel', 'Cooking', 'Fitness', 'Photography', 'Board Games',
  'Film & TV', 'Volunteering',
];

const BUDGET_OPTIONS = [
  { id: 'budget', label: '$', sub: 'Under $20' },
  { id: 'mid', label: '$$', sub: '$20–50' },
  { id: 'upscale', label: '$$$', sub: '$50–100' },
  { id: 'luxury', label: '$$$$', sub: '$100+' },
];

const DIETARY = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal',
  'Kosher', 'Dairy-Free', 'Nut-Free', 'No restrictions',
];

const ACCESSIBILITY = [
  'Wheelchair access', 'Visual accommodations', 'Hearing accommodations',
  'Quiet environments', 'Sensory-friendly', 'None needed',
];

function ScreenHeader({ step, total, onBack, title }) {
  return (
    <div className="sa__header">
      <div className="sa__header-top">
        <button className="sa__back" onClick={onBack}>←</button>
        <div className="sa__header-center">
          <span className="sa__section">Set up account</span>
          <span className="sa__step-label">{step} of {total}</span>
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div className="sa__progress-bar">
        <div className="sa__progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

function TagPill({ label, selected, onClick }) {
  return (
    <button
      className={`tag-pill ${selected ? 'tag-pill--selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function StepCalendar({ form, set, onNext }) {
  const toggle = (id) => {
    set('calendars', prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  return (
    <div className="sa__step">
      <div className="sa__step-header">
        <h2 className="sa__title">Connect your calendar</h2>
        <p className="sa__sub">We'll suggest events that fit your schedule. Pick as many as you use.</p>
      </div>
      <div className="cal-grid">
        {CALENDARS.map(({ id, label, color, icon }) => {
          const selected = form.calendars.includes(id);
          return (
            <button
              key={id}
              className={`cal-card ${selected ? 'cal-card--selected' : ''}`}
              onClick={() => toggle(id)}
            >
              <div className="cal-card__icon" style={{ background: color }}>
                {icon || (
                  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                )}
              </div>
              <span className="cal-card__label">{label}</span>
              {selected && <div className="cal-card__check">✓</div>}
            </button>
          );
        })}
      </div>
      <div className="sa__footer">
        <button className="sa__skip" onClick={onNext}>Skip for now</button>
        <button
          className={`sa__btn ${form.calendars.length > 0 ? 'sa__btn--active' : 'sa__btn--active'}`}
          onClick={onNext}
        >
          {form.calendars.length > 0 ? `Connect ${form.calendars.length} calendar${form.calendars.length > 1 ? 's' : ''}` : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function StepInterests({ form, set, onNext }) {
  const toggleFood = (v) => set('food', p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleActivity = (v) => set('activities', p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const canNext = form.food.length > 0 || form.activities.length > 0;
  return (
    <div className="sa__step sa__step--scroll">
      <div className="sa__step-header">
        <h2 className="sa__title">What are you into?</h2>
        <p className="sa__sub">Help us match you with the right people and events.</p>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Food preferences</p>
        <div className="tag-wrap">
          {FOOD.map(f => (
            <TagPill key={f} label={f} selected={form.food.includes(f)} onClick={() => toggleFood(f)} />
          ))}
        </div>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Activities</p>
        <div className="tag-wrap">
          {ACTIVITIES.map(a => (
            <TagPill key={a} label={a} selected={form.activities.includes(a)} onClick={() => toggleActivity(a)} />
          ))}
        </div>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Budget range (per person)</p>
        <div className="budget-grid">
          {BUDGET_OPTIONS.map(({ id, label, sub }) => (
            <button
              key={id}
              className={`budget-card ${form.budget === id ? 'budget-card--selected' : ''}`}
              onClick={() => set('budget', () => id)}
            >
              <span className="budget-card__amount">{label}</span>
              <span className="budget-card__sub">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sa__footer">
        <button
          className={`sa__btn ${canNext ? 'sa__btn--active' : ''}`}
          disabled={!canNext}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StepPreferences({ form, set, onNext }) {
  const toggleDietary = (v) => set('dietary', p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const toggleAccess = (v) => set('accessibility', p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <div className="sa__step sa__step--scroll">
      <div className="sa__step-header">
        <h2 className="sa__title">Dietary & accessibility</h2>
        <p className="sa__sub">We'll use this to suggest the right spots for everyone.</p>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Dietary restrictions</p>
        <div className="tag-wrap">
          {DIETARY.map(d => (
            <TagPill key={d} label={d} selected={form.dietary.includes(d)} onClick={() => toggleDietary(d)} />
          ))}
        </div>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Accessibility needs</p>
        <div className="tag-wrap">
          {ACCESSIBILITY.map(a => (
            <TagPill key={a} label={a} selected={form.accessibility.includes(a)} onClick={() => toggleAccess(a)} />
          ))}
        </div>
      </div>

      <div className="sa__group">
        <p className="sa__group-label">Anything else? <span className="sa__optional">optional</span></p>
        <textarea
          className="sa__textarea"
          placeholder="Allergies, mobility notes, other preferences..."
          value={form.otherPrefs}
          onChange={e => set('otherPrefs', () => e.target.value)}
          rows={3}
        />
      </div>

      <div className="sa__footer">
        <button className="sa__btn sa__btn--active" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default function SetupAccountScreen({ userName, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    calendars: [],
    food: [],
    activities: [],
    budget: '',
    dietary: [],
    accessibility: [],
    otherPrefs: '',
  });

  const set = (key, updater) =>
    setForm(f => ({ ...f, [key]: typeof updater === 'function' ? updater(f[key]) : updater }));

  const next = () => {
    if (step < 3) setStep(s => s + 1);
    else onComplete(form);
  };
  const back = () => setStep(s => s - 1);

  return (
    <div className="sa">
      <ScreenHeader step={step} total={3} onBack={back} />
      {step === 1 && <StepCalendar form={form} set={set} onNext={next} />}
      {step === 2 && <StepInterests form={form} set={set} onNext={next} />}
      {step === 3 && <StepPreferences form={form} set={set} onNext={next} />}
    </div>
  );
}
