import { useState, useEffect, useCallback } from 'react';
import logoMark from './logo.png';
import './LoginScreen.css';

export default function LoginScreen({ onLogin, onForgotPassword, onGetStarted }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = useCallback((response) => {
    // Decode the JWT token to get user info
    const userObject = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
      name: userObject.name,
      email: userObject.email,
      picture: userObject.picture,
      googleId: userObject.sub,
    };
    onLogin(user);
  }, [onLogin]);

  useEffect(() => {
    // Initialize Google Sign-In
    window.google?.accounts?.id?.initialize({
      client_id: '750517705353-n9re6ohilan4rp1for99era10bfmum5h.apps.googleusercontent.com', // Replace with actual client ID
      callback: handleGoogleSignIn,
    });
  }, [handleGoogleSignIn]);

  const handleGoogleClick = () => {
    window.google?.accounts?.id?.prompt();
  };

  return (
    <div className="login">
      <div className="login__header">
        <img src={logoMark} alt="CommonGround" className="login__mark" />
        <h1 className="login__title">Welcome back</h1>
        <p className="login__sub">Sign in to your account</p>
      </div>

      <div className="login__form">
        <div className="field">
          <label className="field__label">Email or username</label>
          <input
            className="field__input"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="field">
          <div className="field__row">
            <label className="field__label">Password</label>
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            className="field__input"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          type="button"
          className="forgot-link"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>

        <button
          className={`login__btn ${email && password ? 'login__btn--active' : ''}`}
          disabled={!email || !password}
          onClick={() => onLogin({ email, password })}
        >
          Log in
        </button>
      </div>

      <div className="login__divider">
        <span className="login__divider-line" />
        <span className="login__divider-text">or continue with</span>
        <span className="login__divider-line" />
      </div>

      <div className="login__sso">
        <button className="sso-btn" onClick={handleGoogleClick}>
          <GoogleIcon />
          Google
        </button>
        <button className="sso-btn">
          <AppleIcon />
          Apple
        </button>
      </div>

      <p className="login__signup">
        New here?{' '}
        <span onClick={onGetStarted}>Create an account</span>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
