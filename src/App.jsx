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
import EventChatScreen from './EventChatScreen';
import SettingsScreen from './SettingsScreen';
import WhosFreeScreen from './WhosFreeScreen';
import FreeChatScreen from './FreeChatScreen';

function App() {
  const [screen, setScreen] = useState('splash');
  const [userData, setUserData] = useState({});
  const [agentMessage, setAgentMessage] = useState(null);
  const [agentPeople, setAgentPeople] = useState(null);
  const [agentVenueContext, setAgentVenueContext] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [freeChatFriend, setFreeChatFriend] = useState(null);

  const openAgent = (msg, people, venueContext) => {
    setAgentMessage(msg);
    setAgentPeople(people || null);
    setAgentVenueContext(venueContext || null);
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
            people={agentPeople}
            venueContext={agentVenueContext}
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
            onOpenEventChat={(event) => {
              setCurrentEvent(event);
              setScreen('event-chat');
            }}
          />
        )}
        {screen === 'event-chat' && currentEvent && (
          <EventChatScreen
            event={currentEvent}
            onBack={() => setScreen('comingup')}
          />
        )}
        {screen === 'whos-free' && (
          <WhosFreeScreen
            onBack={() => setScreen('home')}
            onOpenChat={(person) => {
              setFreeChatFriend(person);
              setScreen('free-chat');
            }}
          />
        )}
        {screen === 'free-chat' && freeChatFriend && (
          <FreeChatScreen
            friend={freeChatFriend}
            onBack={() => setScreen('whos-free')}
            onNavigate={setScreen}
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
