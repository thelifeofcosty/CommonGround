import { useState } from 'react';
import logoMark from './logo.png';
import './ForgotPasswordScreen.css';

export default function ForgotPasswordScreen({ onBack }) {
  const [step, setStep] = useState('request'); // 'request' | 'sent'
  const [email, setEmail] = useState('');

  if (step === 'sent') {
    return (
      <div className="forgot">
        <button className="forgot__back" onClick={onBack}>← Back to login</button>

        <div className="forgot__sent">
          <div className="forgot__sent-icon">✉️</div>
          <h2 className="forgot__title">Check your email</h2>
          <p className="forgot__sub">
            We sent a reset link to <strong>{email}</strong>. It expires in 15 minutes.
          </p>
          <p className="forgot__hint">Didn't get it? Check your spam folder or</p>
          <button
            type="button"
            className="forgot__resend"
            onClick={() => setStep('request')}
          >
            try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot">
      <button className="forgot__back" onClick={onBack}>← Back to login</button>

      <div className="forgot__header">
        <img src={logoMark} alt="CommonGround" className="forgot__mark" />
        <h2 className="forgot__title">Reset password</h2>
        <p className="forgot__sub">
          Enter your email and we'll send you a link to get back in.
        </p>
      </div>

      <div className="forgot__form">
        <div className="field">
          <label className="field__label">Email address</label>
          <input
            className="field__input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <button
          className={`forgot__btn ${email ? 'forgot__btn--active' : ''}`}
          disabled={!email}
          onClick={() => setStep('sent')}
        >
          Send reset link
        </button>
      </div>
    </div>
  );
}
