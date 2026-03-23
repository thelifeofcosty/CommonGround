import { useEffect, useState } from 'react';
import logoFull from './logo-full.png';
import './SplashScreen.css';

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out at 7s, call onDone at 8s
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const doneTimer = setTimeout(() => onDone(), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash ${fading ? 'splash--fading' : ''}`}>
      <img src={logoFull} alt="CommonGround" className="splash__logo" />
      <p className="splash__tagline">From "we should hang out" to "see you Thursday."</p>
    </div>
  );
}
