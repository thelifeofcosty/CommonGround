import './BottomNav.css';

function PeopleIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 20c0-2.761-1.791-5-4-5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function CalendarIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke={color} strokeWidth="2"/>
      <path d="M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8"  cy="15" r="1" fill={color}/>
      <circle cx="12" cy="15" r="1" fill={color}/>
      <circle cx="16" cy="15" r="1" fill={color}/>
    </svg>
  );
}

export default function BottomNav({ active, onFriends, onPlans, onComingUp }) {
  return (
    <div className="bnav">
      <button className="bnav__tab" onClick={onFriends}>
        <PeopleIcon color={active === 'friends' ? '#996699' : '#C9C1B5'} />
        <span style={{ color: active === 'friends' ? '#996699' : '#C9C1B5' }}>Friends</span>
      </button>

      <div className="bnav__fab-wrap">
        <button
          className={['bnav__fab', active === 'plans' ? 'bnav__fab--active' : ''].join(' ')}
          onClick={onPlans}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="bnav__fab-label" style={{ color: active === 'plans' ? '#AFCE65' : '#C9C1B5' }}>
          Plans
        </span>
      </div>

      <button className="bnav__tab" onClick={onComingUp}>
        <CalendarIcon color={active === 'comingup' ? '#FF9933' : '#C9C1B5'} />
        <span style={{ color: active === 'comingup' ? '#FF9933' : '#C9C1B5' }}>Coming Up</span>
      </button>
    </div>
  );
}
