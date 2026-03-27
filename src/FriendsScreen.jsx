import { useState, useRef, useEffect, useCallback } from 'react';
import './FriendsScreen.css';
import BottomNav from './BottomNav';
import { PEOPLE_PHOTOS, photoStyle } from './people';

// ── Mock data ─────────────────────────────────────────
const PENDING = [
  { id: 'p1', name: 'Maya Rodriguez', initial: 'M', color: '#FF9933', mutual: 3 },
];

const ALL_CONTACTS = [
  {
    id: 'g1', type: 'group', name: 'Weekend Crew', sortMs: Date.now() - 2 * 86400000,
    lastActivity: 'Cocktails at Mr Lyan', date: '2 days ago',
    members: [
      { name: 'Alex',  initial: 'A', color: '#FF9933' },
      { name: 'Sam',   initial: 'S', color: '#AFCE65' },
      { name: 'Priya', initial: 'P', color: '#CC88AA' },
      { name: 'Jamie', initial: 'J', color: '#996699' },
    ],
  },
  {
    id: 'f1', type: 'friend', name: 'Alex Rivera', initial: 'A', color: '#FF9933',
    sortMs: Date.now() - 5 * 86400000,
    lastActivity: 'Hike at Hampstead Heath', date: '5 days ago',
  },
  {
    id: 'f2', type: 'friend', name: 'Priya Sharma', initial: 'P', color: '#CC88AA',
    sortMs: Date.now() - 7 * 86400000,
    lastActivity: 'Brunch at Ottolenghi', date: '1 week ago',
  },
  {
    id: 'f3', type: 'friend', name: 'Jamie Chen', initial: 'J', color: '#996699',
    sortMs: Date.now() - 21 * 86400000,
    lastActivity: 'Dinner at Padella', date: '3 weeks ago',
  },
  {
    id: 'f4', type: 'friend', name: 'Sam Torres', initial: 'S', color: '#AFCE65',
    sortMs: Date.now() - 30 * 86400000,
    lastActivity: 'Gallery night at Tate', date: '1 month ago',
  },
  {
    id: 'g2', type: 'group', name: 'Date Night Squad', sortMs: Date.now() - 42 * 86400000,
    lastActivity: 'Supper at Brat', date: '6 weeks ago',
    members: [
      { name: 'Jamie', initial: 'J', color: '#996699' },
      { name: 'Sam',   initial: 'S', color: '#AFCE65' },
      { name: 'Priya', initial: 'P', color: '#CC88AA' },
    ],
  },
];

const SEARCH_POOL = [
  { id: 's1', name: 'Lena Fischer',   initial: 'L', color: '#5BA4CF', mutual: 2 },
  { id: 's2', name: 'Marcus Webb',    initial: 'M', color: '#85C1A0', mutual: 5 },
  { id: 's3', name: 'Sofia Andrade',  initial: 'S', color: '#E8A87C', mutual: 1 },
  { id: 's4', name: 'Tom Nguyen',     initial: 'T', color: '#B08FD4', mutual: 4 },
];

// ── Small reusables ───────────────────────────────────
function CircleAvatar({ initial, color, size = 46, name }) {
  const photo = name && PEOPLE_PHOTOS[name];
  return (
    <div className="circle-avatar" style={{ width: size, height: size, background: photo ? 'transparent' : color, fontSize: size * 0.41, overflow: 'hidden' }}>
      {photo ? <img src={photo} alt={name} style={photoStyle} /> : initial}
    </div>
  );
}

function StackedAvatars({ members }) {
  const shown = members.slice(0, 3);
  return (
    <div className="stacked-avatars">
      {shown.map((m, i) => {
        const photo = m.name && PEOPLE_PHOTOS[m.name];
        return (
          <div key={m.name} className="stacked-avatar"
            style={{ background: photo ? 'transparent' : m.color, zIndex: shown.length - i, marginLeft: i > 0 ? -12 : 0, overflow: 'hidden' }}>
            {photo ? <img src={photo} alt={m.name} style={photoStyle} /> : m.initial}
          </div>
        );
      })}
      {members.length > 3 && (
        <div className="stacked-avatar stacked-avatar--more"
          style={{ zIndex: 0, marginLeft: -12 }}>
          +{members.length - 3}
        </div>
      )}
    </div>
  );
}

// ── Swipeable contact row ─────────────────────────────
const REVEAL = 148;

function ContactRow({ contact, onOpenGroup, onRemove, onBlock }) {
  const [offsetX, setOffsetX] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef(null);
  const startOffset = useRef(0);
  const rowRef = useRef(null);

  const clamp = (val) => Math.max(-REVEAL, Math.min(0, val));

  const onStart = (clientX) => {
    startX.current = clientX;
    startOffset.current = offsetX;
  };
  const onMove = (clientX) => {
    if (startX.current === null) return;
    const delta = clientX - startX.current;
    setOffsetX(clamp(startOffset.current + delta));
  };
  const onEnd = () => {
    startX.current = null;
    const snapped = offsetX < -REVEAL / 2;
    setOffsetX(snapped ? -REVEAL : 0);
    setOpen(snapped);
  };

  // close when tapping outside
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (rowRef.current && !rowRef.current.contains(e.target)) {
        setOffsetX(0); setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [open]);

  const isGroup = contact.type === 'group';

  return (
    <div className="contact-wrap" ref={rowRef}>
      {/* Swipe-reveal actions */}
      <div className="contact-actions">
        <button className="contact-action contact-action--remove" onClick={() => onRemove(contact)}>
          Remove
        </button>
        <button className="contact-action contact-action--block" onClick={() => onBlock(contact)}>
          Block
        </button>
      </div>

      {/* Row content */}
      <div
        className="contact-row"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={e => onStart(e.touches[0].clientX)}
        onTouchMove={e => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={e => onStart(e.clientX)}
        onMouseMove={e => { if (startX.current !== null) onMove(e.clientX); }}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onClick={() => {
          if (isGroup && offsetX === 0) onOpenGroup(contact);
        }}
      >
        <div className="contact-row__avatar">
          {isGroup
            ? <StackedAvatars members={contact.members} />
            : <CircleAvatar initial={contact.initial} color={contact.color} name={contact.name} />
          }
        </div>
        <div className="contact-row__body">
          <div className="contact-row__top">
            <span className="contact-row__name">
              {contact.name}
              {isGroup && <span className="contact-row__count"> · {contact.members.length}</span>}
            </span>
            <span className="contact-row__date">{contact.date}</span>
          </div>
          <span className="contact-row__sub">{contact.lastActivity}</span>
        </div>
        {isGroup && (
          <div className="contact-row__chevron">›</div>
        )}
      </div>
    </div>
  );
}

// ── Pending request card ──────────────────────────────
function PendingCard({ requests, onAccept, onDecline }) {
  if (!requests.length) return null;
  return (
    <div className="pending-card">
      <p className="pending-card__label">
        {requests.length === 1 ? 'Friend request' : `${requests.length} friend requests`}
      </p>
      {requests.map(r => (
        <div key={r.id} className="pending-row">
          <CircleAvatar initial={r.initial} color={r.color} size={40} name={r.name} />
          <div className="pending-row__info">
            <span className="pending-row__name">{r.name}</span>
            <span className="pending-row__mutual">{r.mutual} mutual friends</span>
          </div>
          <button className="pending-btn pending-btn--accept" onClick={() => onAccept(r)}>Accept</button>
          <button className="pending-btn pending-btn--decline" onClick={() => onDecline(r)}>Decline</button>
        </div>
      ))}
    </div>
  );
}

// ── Add Friend / Create Group bottom sheet ────────────
function AddSheet({ onClose, allContacts }) {
  const [tab, setTab] = useState('add');
  const [query, setQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sent, setSent] = useState([]);
  const sheetRef = useRef(null);

  const results = query.trim()
    ? SEARCH_POOL.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const memberResults = memberQuery.trim()
    ? SEARCH_POOL.filter(p =>
        p.name.toLowerCase().includes(memberQuery.toLowerCase()) &&
        !selectedMembers.find(m => m.id === p.id)
      )
    : [];

  const toggleMember = (person) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === person.id)
        ? prev.filter(m => m.id !== person.id)
        : prev.length < 10 ? [...prev, person] : prev
    );
    setMemberQuery('');
  };

  const canCreate = groupName.trim().length > 0 && selectedMembers.length >= 2;

  return (
    <div className="sheet-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" ref={sheetRef}>
        <div className="sheet__handle" />

        {/* Tabs */}
        <div className="sheet__tabs">
          <button
            className={`sheet__tab ${tab === 'add' ? 'sheet__tab--active' : ''}`}
            onClick={() => setTab('add')}
          >
            Add a Friend
          </button>
          <button
            className={`sheet__tab ${tab === 'group' ? 'sheet__tab--active' : ''}`}
            onClick={() => setTab('group')}
          >
            Create a Group
          </button>
        </div>

        {/* Add a Friend */}
        {tab === 'add' && (
          <div className="sheet__body">
            <div className="sheet__search-wrap">
              <span className="sheet__search-icon">🔍</span>
              <input
                className="sheet__search"
                placeholder="Name, email or phone…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {results.length > 0 ? (
              <div className="sheet__results">
                {results.map(p => (
                  <div key={p.id} className="sheet__result-row">
                    <CircleAvatar initial={p.initial} color={p.color} size={40} name={p.name} />
                    <div className="sheet__result-info">
                      <span className="sheet__result-name">{p.name}</span>
                      <span className="sheet__result-mutual">{p.mutual} mutual friends</span>
                    </div>
                    {sent.includes(p.id) ? (
                      <span className="sheet__sent">Sent ✓</span>
                    ) : (
                      <button className="sheet__add-btn" onClick={() => setSent(s => [...s, p.id])}>
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : query.length > 0 ? (
              <p className="sheet__empty">No results for "{query}"</p>
            ) : (
              <p className="sheet__hint">Search CommonGround to find friends.</p>
            )}
          </div>
        )}

        {/* Create a Group */}
        {tab === 'group' && (
          <div className="sheet__body">
            <div className="sheet__field">
              <label className="sheet__field-label">Group name</label>
              <input
                className="sheet__field-input"
                placeholder="e.g. Friday crew"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
            </div>

            <div className="sheet__field">
              <label className="sheet__field-label">
                Add members <span className="sheet__field-hint">({selectedMembers.length}/10 · min 2)</span>
              </label>

              {selectedMembers.length > 0 && (
                <div className="sheet__members-wrap">
                  {selectedMembers.map(m => (
                    <div key={m.id} className="sheet__member-pill">
                      <CircleAvatar initial={m.initial} color={m.color} size={22} name={m.name} />
                      <span>{m.name.split(' ')[0]}</span>
                      <button onClick={() => toggleMember(m)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="sheet__search-wrap">
                <span className="sheet__search-icon">🔍</span>
                <input
                  className="sheet__search"
                  placeholder="Search friends…"
                  value={memberQuery}
                  onChange={e => setMemberQuery(e.target.value)}
                />
              </div>

              {memberResults.length > 0 && (
                <div className="sheet__results sheet__results--inline">
                  {memberResults.map(p => (
                    <div key={p.id} className="sheet__result-row" onClick={() => toggleMember(p)}>
                      <CircleAvatar initial={p.initial} color={p.color} size={36} name={p.name} />
                      <span className="sheet__result-name">{p.name}</span>
                      <div className="sheet__add-circle">+</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`sheet__create-btn ${canCreate ? 'sheet__create-btn--active' : ''}`}
              disabled={!canCreate}
              onClick={onClose}
            >
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Group detail screen ───────────────────────────────
function GroupDetail({ group, onClose }) {
  const [members, setMembers] = useState(group.members);
  const [name, setName] = useState(group.name);
  const [editingName, setEditingName] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const addResults = addQuery.trim()
    ? SEARCH_POOL.filter(p =>
        p.name.toLowerCase().includes(addQuery.toLowerCase()) &&
        !members.find(m => m.name === p.name)
      )
    : [];

  const removeMember = (m) => setMembers(prev => prev.filter(x => x.name !== m.name));

  return (
    <div className="group-detail">
      {/* Header */}
      <div className="group-detail__header">
        <button className="group-detail__back" onClick={onClose}>←</button>
        <p className="group-detail__title">Group Info</p>
        <div style={{ width: 32 }} />
      </div>

      <div className="group-detail__body">
        {/* Group identity */}
        <div className="group-detail__identity">
          <StackedAvatars members={members} />
          {editingName ? (
            <input
              className="group-detail__name-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              autoFocus
            />
          ) : (
            <h2 className="group-detail__name" onClick={() => setEditingName(true)}>
              {name} <span className="group-detail__edit-hint">✏️</span>
            </h2>
          )}
          <p className="group-detail__meta">{members.length} members</p>
        </div>

        {/* Members list */}
        <div className="group-detail__section">
          <p className="group-detail__section-label">Members</p>
          {members.map(m => (
            <div key={m.name} className="group-detail__member-row">
              <CircleAvatar initial={m.initial} color={m.color} size={40} name={m.name} />
              <span className="group-detail__member-name">{m.name}</span>
              <button className="group-detail__remove-btn" onClick={() => removeMember(m)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add members */}
        <button className="group-detail__add-btn" onClick={() => setShowAdd(v => !v)}>
          + Add Members
        </button>

        {showAdd && (
          <div className="group-detail__add-wrap">
            <div className="sheet__search-wrap">
              <span className="sheet__search-icon">🔍</span>
              <input
                className="sheet__search"
                placeholder="Search friends…"
                value={addQuery}
                onChange={e => setAddQuery(e.target.value)}
              />
            </div>
            {addResults.map(p => (
              <div key={p.id} className="sheet__result-row" onClick={() => {
                setMembers(prev => [...prev, { name: p.name, initial: p.initial, color: p.color }]);
                setAddQuery('');
                setShowAdd(false);
              }}>
                <CircleAvatar initial={p.initial} color={p.color} size={36} name={p.name} />
                <span className="sheet__result-name">{p.name}</span>
                <div className="sheet__add-circle">+</div>
              </div>
            ))}
          </div>
        )}

        {/* Leave group */}
        <button className="group-detail__leave-btn">Leave Group</button>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────
export default function FriendsScreen({ onBack, onNavigate, onOpenAgent }) {
  const [contacts, setContacts] = useState(
    [...ALL_CONTACTS].sort((a, b) => b.sortMs - a.sortMs)
  );
  const [pending, setPending] = useState(PENDING);
  const [search, setSearch] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAccept = (req) => setPending(p => p.filter(r => r.id !== req.id));
  const handleDecline = (req) => setPending(p => p.filter(r => r.id !== req.id));
  const handleRemove = (c) => setContacts(p => p.filter(x => x.id !== c.id));
  const handleBlock = useCallback((c) => setContacts(p => p.filter(x => x.id !== c.id)), []);

  if (activeGroup) {
    return <GroupDetail group={activeGroup} onClose={() => setActiveGroup(null)} />;
  }

  return (
    <div className="friends-screen">
      {/* ── Header ── */}
      <div className="friends-header">
        <h1 className="friends-header__title">Friends</h1>
        <button className="friends-header__add" onClick={() => setShowSheet(true)}>+</button>
      </div>

      {/* ── Search ── */}
      <div className="friends-search-wrap">
        <span className="friends-search-icon">🔍</span>
        <input
          className="friends-search"
          placeholder="Search friends and groups…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="friends-search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      {/* ── Scrollable content ── */}
      <div className="friends-list">
        <PendingCard requests={pending} onAccept={handleAccept} onDecline={handleDecline} />

        {filtered.length === 0 && (
          <p className="friends-empty">No results for "{search}"</p>
        )}

        {filtered.map(contact => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onOpenGroup={setActiveGroup}
            onRemove={handleRemove}
            onBlock={handleBlock}
          />
        ))}

        <p className="friends-count">{contacts.length} friends & groups</p>
      </div>

      {/* ── Bottom sheet ── */}
      {showSheet && (
        <AddSheet onClose={() => setShowSheet(false)} allContacts={contacts} />
      )}

      <BottomNav
        active="friends"
        onFriends={() => {}}
        onPlans={() => { if (onNavigate) onNavigate('home'); }}
        onComingUp={() => { if (onNavigate) onNavigate('comingup'); }}
      />
    </div>
  );
}
