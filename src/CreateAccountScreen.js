import { useState } from 'react';
import logoMark from './logo.png';
import './CreateAccountScreen.css';

function passwordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: 'transparent' };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const variety = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  if (pw.length < 6) return { level: 1, label: 'Too short', color: '#e53e3e' };
  if (pw.length < 8 || variety < 1) return { level: 2, label: 'Fair', color: '#FF9933' };
  if (variety >= 2) return { level: 4, label: 'Strong', color: '#AFCE65' };
  return { level: 3, label: 'Good', color: '#68d391' };
}

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div className="perm-row" onClick={() => onChange(!checked)}>
      <div className="perm-row__text">
        <span className="perm-row__label">{label}</span>
        {sublabel && <span className="perm-row__sub">{sublabel}</span>}
      </div>
      <div className={`toggle ${checked ? 'toggle--on' : ''}`}>
        <div className="toggle__thumb" />
      </div>
    </div>
  );
}

function ScreenHeader({ step, total, onBack, showLogo }) {
  return (
    <div className="ca__header">
      <div className="ca__header-top">
        {step > 1 ? (
          <button className="ca__back" onClick={onBack}>←</button>
        ) : showLogo ? (
          <img src={logoMark} alt="" className="ca__mark" />
        ) : (
          <div style={{ width: 28 }} />
        )}
        <span className="ca__step-label">{step} of {total}</span>
      </div>
      <div className="ca__progress-bar">
        <div className="ca__progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

function StepPersonal({ form, set, onNext }) {
  const canNext = form.name.trim() && form.email.trim();
  return (
    <div className="ca__step">
      <div className="ca__step-header">
        <h2 className="ca__title">Create your account</h2>
        <p className="ca__sub">Let's start with the basics.</p>
      </div>
      <div className="ca__fields">
        <div className="ca-field">
          <label>Full name</label>
          <input
            placeholder="Jane Smith"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="ca-field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="ca-field">
          <label>
            Phone number <span className="ca-field__optional">optional</span>
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="ca__footer">
        <button
          className={`ca__btn ${canNext ? 'ca__btn--active' : ''}`}
          disabled={!canNext}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StepPassword({ form, set, onNext }) {
  const [show, setShow] = useState(false);
  const strength = passwordStrength(form.password);
  const canNext = strength.level >= 3;
  return (
    <div className="ca__step">
      <div className="ca__step-header">
        <h2 className="ca__title">Create a password</h2>
        <p className="ca__sub">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
      </div>
      <div className="ca__fields">
        <div className="ca-field">
          <div className="ca-field__row">
            <label>Password</label>
            <button type="button" className="ca-field__toggle" onClick={() => setShow(v => !v)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            autoComplete="new-password"
          />
          {form.password.length > 0 && (
            <div className="strength">
              <div className="strength__bars">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="strength__bar"
                    style={{ background: i <= strength.level ? strength.color : '#e2e2e2' }}
                  />
                ))}
              </div>
              <span className="strength__label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="ca__footer">
        <button
          className={`ca__btn ${canNext ? 'ca__btn--active' : ''}`}
          disabled={!canNext}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StepPermissions({ form, set, onComplete }) {
  const canComplete = form.agreedTerms;
  return (
    <div className="ca__step">
      <div className="ca__step-header">
        <h2 className="ca__title">One last thing</h2>
        <p className="ca__sub">Review permissions before we set up your account.</p>
      </div>

      <div className="ca__perms">
        <div className="perm-section">
          <p className="perm-section__title">Legal</p>
          <div className="perm-row perm-row--check" onClick={() => set('agreedTerms', !form.agreedTerms)}>
            <div className="perm-row__text">
              <span className="perm-row__label">Terms & Conditions</span>
              <span className="perm-row__sub">
                I agree to the{' '}
                <span className="perm-row__link">Terms of Service</span> and{' '}
                <span className="perm-row__link">Privacy Policy</span>
              </span>
            </div>
            <div className={`checkbox ${form.agreedTerms ? 'checkbox--checked' : ''}`}>
              {form.agreedTerms && '✓'}
            </div>
          </div>
        </div>

        <div className="perm-section">
          <p className="perm-section__title">App permissions</p>
          <Toggle
            checked={form.pushNotifications}
            onChange={v => set('pushNotifications', v)}
            label="Push notifications"
            sublabel="Get notified about events and matches"
          />
          <Toggle
            checked={form.locationTracking}
            onChange={v => set('locationTracking', v)}
            label="Location access"
            sublabel="Find events and people near you"
          />
          <Toggle
            checked={form.photoGallery}
            onChange={v => set('photoGallery', v)}
            label="Photo library"
            sublabel="Upload photos to your profile"
          />
        </div>
      </div>

      <div className="ca__footer">
        <button
          className={`ca__btn ${canComplete ? 'ca__btn--active' : ''}`}
          disabled={!canComplete}
          onClick={onComplete}
        >
          Create account
        </button>
        <p className="ca__terms-note">
          Permissions can be changed anytime in Settings.
        </p>
      </div>
    </div>
  );
}

export default function CreateAccountScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    agreedTerms: false,
    pushNotifications: false,
    locationTracking: false,
    photoGallery: false,
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="ca">
      <ScreenHeader
        step={step}
        total={3}
        showLogo
        onBack={() => setStep(s => s - 1)}
      />
      {step === 1 && <StepPersonal form={form} set={set} onNext={() => setStep(2)} />}
      {step === 2 && <StepPassword form={form} set={set} onNext={() => setStep(3)} />}
      {step === 3 && <StepPermissions form={form} set={set} onComplete={() => onComplete(form)} />}
    </div>
  );
}
