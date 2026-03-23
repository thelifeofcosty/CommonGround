import { useState } from 'react';
import logoMark from './logo.png';
import './OnboardingScreen.css';

// ── Shared sub-components ─────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div className={`ob-toggle ${checked ? 'ob-toggle--on' : ''}`} onClick={() => onChange(!checked)}>
      <div className="ob-toggle__thumb" />
    </div>
  );
}

function ProgressHeader({ step, onBack }) {
  return (
    <div className="ob-header">
      <button
        className="ob-back"
        onClick={onBack}
        style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
      >
        ←
      </button>

      <div className="ob-steps">
        {[1, 2, 3].map(s => (
          <div key={s} className="ob-step-track">
            <div className={[
              'ob-step-dot',
              s < step  ? 'ob-step-dot--done' : '',
              s === step ? 'ob-step-dot--active' : '',
            ].join(' ')}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={['ob-step-line', s < step ? 'ob-step-line--done' : ''].join(' ')} />
            )}
          </div>
        ))}
      </div>

      <div style={{ width: 32 }} />
    </div>
  );
}

// ── Step 1: Create your account ───────────────────────

function StepAccount({ form, set, onNext }) {
  const [showPw, setShowPw] = useState(false);
  const canContinue = form.name.trim() && form.email.trim() && form.password.length >= 6;

  return (
    <div className="ob-step" key="s1">
      <div className="ob-step__head">
        <img src={logoMark} alt="" className="ob-step__logo" />
        <h2 className="ob-step__title">Create your account</h2>
        <p className="ob-step__sub">It only takes a moment.</p>
      </div>

      <div className="ob-fields">
        <div className="ob-field">
          <label>Full name</label>
          <input
            placeholder="Jane Smith"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="ob-field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="ob-field">
          <div className="ob-field__row">
            <label>Password</label>
            <button type="button" className="ob-field__toggle" onClick={() => setShowPw(v => !v)}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="ob-footer">
        <button
          className={['ob-btn ob-btn--green', canContinue ? 'ob-btn--active' : ''].join(' ')}
          disabled={!canContinue}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Connect your calendar ─────────────────────

const CALENDARS = [
  {
    id: 'google', label: 'Google',
    bg: '#fff', border: '#e0e0e0',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'apple', label: 'Apple',
    bg: '#1A1A1A', border: '#1A1A1A',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    id: 'outlook', label: 'Outlook',
    bg: '#0078D4', border: '#0078D4',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
        <path d="M7 6h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z" opacity=".3"/>
        <path d="M5 8l7 5 7-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="2" y="5" width="8" height="10" rx="1.5" fill="#0078D4"/>
        <text x="6" y="13.5" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">Ol</text>
      </svg>
    ),
  },
];

function StepCalendar({ form, set, onNext, onSkip }) {
  const toggle = (id) =>
    set('calendars', prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <div className="ob-step" key="s2">
      <div className="ob-step__head">
        <h2 className="ob-step__title">Connect your calendar</h2>
        <p className="ob-step__sub">We'll suggest events that fit your schedule.</p>
      </div>

      <div className="ob-cal-grid">
        {CALENDARS.map(cal => {
          const sel = form.calendars.includes(cal.id);
          return (
            <button
              key={cal.id}
              className={['ob-cal-tile', sel ? 'ob-cal-tile--selected' : ''].join(' ')}
              onClick={() => toggle(cal.id)}
              style={{ borderColor: sel ? '#FF9933' : cal.border }}
            >
              <div
                className="ob-cal-tile__icon"
                style={{ background: cal.bg, border: `1px solid ${cal.border}` }}
              >
                {cal.icon}
              </div>
              <span className="ob-cal-tile__label">{cal.label}</span>
              {sel && <div className="ob-cal-tile__check">✓</div>}
            </button>
          );
        })}
      </div>

      <div className="ob-footer">
        <button
          className={['ob-btn ob-btn--orange', form.calendars.length > 0 ? 'ob-btn--active' : ''].join(' ')}
          disabled={form.calendars.length === 0}
          onClick={onNext}
        >
          Connect {form.calendars.length} calendar{form.calendars.length > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Interests ─────────────────────────────────

const INTERESTS = [
  'Food & Drinks', 'Outdoors', 'Culture', 'Nightlife',
  'Live Music', 'Sports', 'Art', 'Gaming',
];

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free', 'Nut-Free',
];

const BUDGETS = [
  { id: '1', label: '£', sub: 'Budget' },
  { id: '2', label: '££', sub: 'Mid-range' },
  { id: '3', label: '£££', sub: 'Upscale' },
];

function StepInterests({ form, set, onFinish }) {
  const [otherDietaryText, setOtherDietaryText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const toggleInterest = (v) =>
    set('interests', prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  const toggleDietary = (v) =>
    set('dietary', prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  const confirmOtherDietary = () => {
    const val = otherDietaryText.trim();
    if (val && !form.dietary.includes(val)) set('dietary', prev => [...prev, val]);
    setOtherDietaryText('');
    setShowOtherInput(false);
  };

  const canFinish = form.interests.length > 0 && form.budget;

  return (
    <div className="ob-step" key="s3">
      <div className="ob-step__head">
        <h2 className="ob-step__title">What do you love doing?</h2>
        <p className="ob-step__sub">Help us find the right people and places for you.</p>
      </div>

      <div className="ob-section">
        <div className="ob-pills-wrap">
          {INTERESTS.map(v => (
            <button
              key={v}
              className={['ob-pill', form.interests.includes(v) ? 'ob-pill--selected' : ''].join(' ')}
              onClick={() => toggleInterest(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="ob-section">
        <p className="ob-section__label">What's your budget?</p>
        <div className="ob-budget-row">
          {BUDGETS.map(b => (
            <button
              key={b.id}
              className={['ob-budget', form.budget === b.id ? 'ob-budget--selected' : ''].join(' ')}
              onClick={() => set('budget', b.id)}
            >
              <span className="ob-budget__amount">{b.label}</span>
              <span className="ob-budget__sub">{b.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-section">
        <div className="ob-dietary-toggle-row">
          <div>
            <p className="ob-section__label" style={{ marginBottom: 0 }}>Dietary restrictions</p>
            <p className="ob-dietary-sub">I have dietary requirements</p>
          </div>
          <Toggle
            checked={form.dietaryToggle}
            onChange={v => set('dietaryToggle', v)}
          />
        </div>

        {form.dietaryToggle && (
          <div className="ob-dietary-pills">
            {DIETARY_OPTIONS.map(d => (
              <button
                key={d}
                className={['ob-pill ob-pill--sm', form.dietary.includes(d) ? 'ob-pill--selected' : ''].join(' ')}
                onClick={() => toggleDietary(d)}
              >
                {d}
              </button>
            ))}
            {form.dietary.filter(d => !DIETARY_OPTIONS.includes(d)).map(d => (
              <button
                key={d}
                className="ob-pill ob-pill--sm ob-pill--selected"
                onClick={() => toggleDietary(d)}
              >
                {d} ✕
              </button>
            ))}
            <button
              className={['ob-pill ob-pill--sm', showOtherInput ? 'ob-pill--selected' : ''].join(' ')}
              onClick={() => setShowOtherInput(p => !p)}
            >
              + Other
            </button>
            {showOtherInput && (
              <div className="ob-other-dietary">
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Low-FODMAP"
                  value={otherDietaryText}
                  onChange={e => setOtherDietaryText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmOtherDietary()}
                />
                <button onClick={confirmOtherDietary} disabled={!otherDietaryText.trim()}>✓</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ob-footer">
        <button
          className={['ob-btn ob-btn--green', canFinish ? 'ob-btn--active' : ''].join(' ')}
          disabled={!canFinish}
          onClick={onFinish}
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}

// ── Main onboarding shell ─────────────────────────────

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    calendars: [],
    interests: [], budget: '',
    dietaryToggle: false, dietary: [],
  });

  const set = (key, updater) =>
    setForm(f => ({
      ...f,
      [key]: typeof updater === 'function' ? updater(f[key]) : updater,
    }));

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  return (
    <div className="ob-screen">
      <ProgressHeader step={step} onBack={back} />

      <div className="ob-body">
        {step === 1 && <StepAccount    form={form} set={set} onNext={next} />}
        {step === 2 && <StepCalendar   form={form} set={set} onNext={next} />}
        {step === 3 && <StepInterests  form={form} set={set} onFinish={() => onComplete(form)} />}
      </div>
    </div>
  );
}
