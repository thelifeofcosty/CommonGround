import { useState, useEffect, useRef } from 'react';
import './EventChatScreen.css';

const SAMPLE_MESSAGES = {
  1: [
    { id: 1, sender: 'Jamie', text: 'Hey everyone! Excited for drinks tonight 🍹', time: '18:45', isMe: false },
    { id: 2, sender: 'You', text: 'Me too! What time are we meeting?', time: '18:47', isMe: true },
    { id: 3, sender: 'Alex', text: '7pm at the bar entrance?', time: '18:50', isMe: false },
    { id: 4, sender: 'Jamie', text: 'Perfect! See you there', time: '18:52', isMe: false },
  ],
  2: [
    { id: 1, sender: 'Sam', text: 'Morning! Brunch at 11:30, right?', time: '10:15', isMe: false },
    { id: 2, sender: 'You', text: 'Yes! I\'m bringing the pancakes 🥞', time: '10:20', isMe: true },
    { id: 3, sender: 'Priya', text: 'Can\'t wait! I\'ll be there early', time: '10:25', isMe: false },
    { id: 4, sender: 'Jamie', text: 'Traffic might be bad, leaving now', time: '10:30', isMe: false },
  ],
  3: [
    { id: 1, sender: 'Sam', text: 'Board games ready! Who\'s bringing what?', time: '17:00', isMe: false },
    { id: 2, sender: 'You', text: 'I have Catan and Ticket to Ride', time: '17:05', isMe: true },
    { id: 3, sender: 'Alex', text: 'Bringing Monopoly and snacks 🍿', time: '17:10', isMe: false },
    { id: 4, sender: 'Jordan', text: 'I\'ll bring some card games too', time: '17:15', isMe: false },
  ],
  4: [
    { id: 1, sender: 'Jamie', text: 'Ready for our parkrun? 🏃‍♀️', time: '08:30', isMe: false },
    { id: 2, sender: 'You', text: 'Absolutely! Meet at the start line?', time: '08:35', isMe: true },
    { id: 3, sender: 'Jamie', text: 'Yes! Then coffee after ☕', time: '08:40', isMe: false },
  ],
};

const SENDER_COLORS = {
  'Jamie': '#996699',
  'Alex': '#FF9933',
  'Sam': '#AFCE65',
  'Priya': '#7cb9e8',
  'Jordan': '#FF6B6B',
  'You': '#25D366', // WhatsApp green for self
};

export default function EventChatScreen({ event, onBack }) {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES[event.id] || []);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="event-chat">
      {/* Header */}
      <div className="event-chat__header">
        <button className="event-chat__back" onClick={onBack}>←</button>
        <div className="event-chat__info">
          <div className="event-chat__title">{event.title}</div>
          <div className="event-chat__subtitle">{event.attendees.length} members</div>
        </div>
        <div className="event-chat__menu">⋯</div>
      </div>

      {/* Messages */}
      <div className="event-chat__messages" ref={scrollRef}>
        <div className="event-chat__spacer" />
        {messages.map(msg => (
          <div key={msg.id} className={`event-chat__message ${msg.isMe ? 'event-chat__message--me' : ''}`}>
            {!msg.isMe && (
              <div className="event-chat__sender">
                <span
                  className="event-chat__sender-avatar"
                  style={{ background: SENDER_COLORS[msg.sender] }}
                >
                  {msg.sender[0]}
                </span>
                <span className="event-chat__sender-name">{msg.sender}</span>
              </div>
            )}
            <div className="event-chat__bubble">
              <div className="event-chat__text">{msg.text}</div>
              <div className="event-chat__time">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="event-chat__input">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="event-chat__input-field"
        />
        <button
          className={`event-chat__send ${inputText.trim() ? 'event-chat__send--active' : ''}`}
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
    </div>
  );
}