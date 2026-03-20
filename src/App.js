import { useState } from 'react';
import './App.css';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import AgentChatScreen from './AgentChatScreen';
import FriendsScreen from './FriendsScreen';
import ComingUpScreen from './ComingUpScreen';

function App() {
  const [screen, setScreen] = useState('splash');
  const [userData, setUserData] = useState({});
  const [agentMessage, setAgentMessage] = useState(null);

  const openAgent = (msg) => {
    setAgentMessage(msg);
    setScreen('agent');
  };

  return (
    <div className="screen-wrapper">
      <div className="phone-frame">
        {screen === 'splash' && (
          <SplashScreen onDone={() => setScreen('login')} />
        )}
        {screen === 'login' && (
          <LoginScreen
            onLogin={() => setScreen('home')}
            onForgotPassword={() => setScreen('forgot-password')}
            onGetStarted={() => setScreen('onboarding')}
          />
        )}
        {screen === 'forgot-password' && (
          <ForgotPasswordScreen onBack={() => setScreen('login')} />
        )}
        {screen === 'onboarding' && (
          <OnboardingScreen
            onComplete={(data) => {
              setUserData(data);
              setScreen('home');
            }}
          />
        )}
        {screen === 'home' && (
          <HomeScreen
            userName={userData.name || userData.displayName || 'Rose'}
            onOpenAgent={openAgent}
            onNavigate={setScreen}
          />
        )}
        {screen === 'agent' && (
          <AgentChatScreen
            initialMessage={agentMessage}
            onBack={() => setScreen('home')}
            onNavigate={setScreen}
          />
        )}
        {screen === 'friends' && (
          <FriendsScreen
            onBack={() => setScreen('home')}
            onNavigate={setScreen}
            onOpenAgent={openAgent}
          />
        )}
        {screen === 'comingup' && (
          <ComingUpScreen
            onNavigate={setScreen}
            onOpenAgent={openAgent}
          />
        )}
      </div>
    </div>
  );
}

export default App;
