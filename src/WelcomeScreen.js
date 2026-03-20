import logoFull from './logo-full.png';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="welcome">
      <div className="welcome__top">
        <img src={logoFull} alt="CommonGround" className="welcome__logo" />
      </div>

      <div className="welcome__middle">
        <h1 className="welcome__headline">
          Find your<br />people.
        </h1>
        <p className="welcome__sub">
          CommonGround connects you with locals who share your passions — from weekend hikes to hidden dining spots.
        </p>
      </div>

      <div className="welcome__bottom">
        <button className="welcome__cta" onClick={onContinue}>
          Get started
        </button>
        <p className="welcome__signin">
          Already have an account? <span>Sign in</span>
        </p>
      </div>
    </div>
  );
}
