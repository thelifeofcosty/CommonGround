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
import SettingsScreen from './SettingsScreen';

function App() {
  const [screen, setScreen] = useState('splash');
  const [userData, setUserData] = useState({});
  const [agentMessage, setAgentMessage] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [drafts, setDrafts] = useState([]);

  const openAgent = (msg) => {
    setAgentMessage(msg);
    setCurrentDraft(null);
    setScreen('agent');
  };

  const saveDraft = (draftData) => {
    const draft = {
      id: `draft-${Date.now()}`,
      ...draftData,
      savedAt: new Date().toISOString(),
    };
    setDrafts(prev => [draft, ...prev]);
    return draft.id;
  };

  const loadDraft = (draftId) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraft(draft);
      setAgentMessage(draft.initialMessage);
      setScreen('agent');
    }
  };

  const deleteCurrentDraft = () => {
    if (currentDraft) {
      setDrafts(prev => prev.filter(d => d.id !== currentDraft.id));
      setCurrentDraft(null);
    }
  };

  const deleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  return (
    <div className="screen-wrapper">
      <div className="phone-frame">
        {screen === 'splash' && (
          <SplashScreen onDone={() => setScreen('login')} />
        )}
        {screen === 'login' && (
          <LoginScreen
            onLogin={(user) => {
              setUserData(user);
              setScreen('home');
            }}
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
            drafts={drafts}
            onLoadDraft={loadDraft}
            onDeleteDraft={deleteDraft}
          />
        )}
        {screen === 'agent' && (
          <AgentChatScreen
            initialMessage={agentMessage}
            onBack={() => setScreen('home')}
            onNavigate={setScreen}
            onSaveDraft={saveDraft}
            onDeleteCurrentDraft={deleteCurrentDraft}
            drafts={drafts}
            draftData={currentDraft}
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
        {screen === 'settings' && (
          <SettingsScreen
            onBack={() => setScreen('home')}
            userName={userData.name || userData.displayName || 'Rose'}
            userEmail={userData.email || 'rose@example.com'}
          />
        )}
      </div>
    </div>
  );
}

export default App;
