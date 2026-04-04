import { useState } from 'react';

const SERVICES_DB = {
  Netflix: {
    cancelUrl: 'https://www.netflix.com/cancelplan',
    noticeDays: 1,
    icon: '🎬',
  },
  Spotify: {
    cancelUrl: 'https://www.spotify.com/account/subscription/',
    noticeDays: 1,
    icon: '🎵',
  },
  'Adobe Creative Cloud': {
    cancelUrl: 'https://account.adobe.com/plans',
    noticeDays: 2,
    icon: '🎨',
    warn: 'May charge fee after trial',
  },
  'Amazon Prime': {
    cancelUrl: 'https://www.amazon.com/gp/primecentral',
    noticeDays: 1,
    icon: '📦',
  },
  'Apple TV+': {
    cancelUrl: 'https://tv.apple.com/settings',
    noticeDays: 1,
    icon: '🍎',
  },
  'Disney+': {
    cancelUrl: 'https://www.disneyplus.com/account/subscription',
    noticeDays: 1,
    icon: '✨',
  },
  'YouTube Premium': {
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    noticeDays: 1,
    icon: '▶️',
  },
  Hulu: {
    cancelUrl: 'https://secure.hulu.com/account',
    noticeDays: 1,
    icon: '📺',
  },
  'LinkedIn Premium': {
    cancelUrl: 'https://www.linkedin.com/premium/manage',
    noticeDays: 2,
    icon: '💼',
  },
  'Duolingo Plus': {
    cancelUrl: 'https://www.duolingo.com/settings/subscription',
    noticeDays: 1,
    icon: '🦉',
  },
  Notion: {
    cancelUrl: 'https://www.notion.so/profile/billing',
    noticeDays: 1,
    icon: '📝',
  },
  Dropbox: {
    cancelUrl: 'https://www.dropbox.com/account/plan',
    noticeDays: 1,
    icon: '📁',
  },
  'ChatGPT Plus': {
    cancelUrl: 'https://chat.openai.com/manage-subscription',
    noticeDays: 1,
    icon: '🤖',
  },
  'Microsoft 365': {
    cancelUrl: 'https://account.microsoft.com/services',
    noticeDays: 2,
    icon: '💻',
    warn: 'Cancel at least 2 days before renewal',
  },
  'Apple Music': {
    cancelUrl: 'https://music.apple.com/account/subscriptions',
    noticeDays: 1,
    icon: '🎶',
  },
  'iCloud+': {
    cancelUrl: 'https://appleid.apple.com/account/manage',
    noticeDays: 1,
    icon: '☁️',
  },
  'Canva Pro': {
    cancelUrl: 'https://www.canva.com/settings/purchase-history',
    noticeDays: 1,
    icon: '🖌️',
  },
  NordVPN: {
    cancelUrl: 'https://my.nordaccount.com/dashboard/nordvpn/',
    noticeDays: 2,
    icon: '🔒',
    warn: 'Refund only within 30 days of purchase',
  },
  Audible: {
    cancelUrl: 'https://www.audible.com/account/membershipdetails',
    noticeDays: 1,
    icon: '🎧',
  },
  Headspace: {
    cancelUrl: 'https://www.headspace.com/account/subscriptions',
    noticeDays: 1,
    icon: '🧘',
  },
  Other: {
    cancelUrl: '',
    noticeDays: 2,
    icon: '🔖',
    warn: 'Check service terms',
  },
};

function getDaysLeft(endDate, noticeDays) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const safe = new Date(end);
  safe.setDate(safe.getDate() - noticeDays);
  return {
    daysToSafe: Math.ceil((safe - now) / 86400000),
    daysToEnd: Math.ceil((end - now) / 86400000),
  };
}

function getStatus(daysToSafe) {
  if (daysToSafe < 0) return 'expired';
  if (daysToSafe <= 2) return 'critical';
  if (daysToSafe <= 5) return 'warning';
  return 'safe';
}

const STATUS = {
  expired: {
    bg: '#2a0808',
    pill: '#ff3b30',
    pillText: '#fff',
    label: 'CHARGED',
    bar: '#ff3b30',
  },
  critical: {
    bg: '#2a1500',
    pill: '#ff9500',
    pillText: '#000',
    label: 'CANCEL NOW',
    bar: '#ff9500',
  },
  warning: {
    bg: '#1a1f00',
    pill: '#ffd60a',
    pillText: '#000',
    label: 'CANCEL SOON',
    bar: '#ffd60a',
  },
  safe: {
    bg: '#001a0f',
    pill: '#30d158',
    pillText: '#000',
    label: 'SAFE',
    bar: '#30d158',
  },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function TrialCard({ trial, onDelete }) {
  const svc = SERVICES_DB[trial.service] || SERVICES_DB['Other'];
  const { daysToSafe } = getDaysLeft(trial.endDate, svc.noticeDays);
  const status = getStatus(daysToSafe);
  const s = STATUS[status];
  const safeDate = new Date(trial.endDate);
  safeDate.setDate(safeDate.getDate() - svc.noticeDays);

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.bar}22`,
        borderLeft: `3px solid ${s.bar}`,
        borderRadius: 12,
        padding: '16px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{svc.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f5' }}>
              {trial.service}
            </div>
            {trial.note && (
              <div style={{ fontSize: 12, color: '#666', marginTop: 1 }}>
                {trial.note}
              </div>
            )}
          </div>
        </div>
        <span
          style={{
            background: s.pill,
            color: s.pillText,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: 99,
          }}
        >
          {s.label}
        </span>
      </div>

      <div
        style={{
          height: 3,
          background: '#ffffff10',
          borderRadius: 99,
          overflow: 'hidden',
          margin: '12px 0 6px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(0, Math.min(100, (daysToSafe / 30) * 100))}%`,
            background: s.bar,
            borderRadius: 99,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#666',
        }}
      >
        <span>
          Cancel by{' '}
          <span style={{ color: s.bar, fontWeight: 700 }}>
            {formatDate(safeDate)}
          </span>
        </span>
        <span>
          Ends{' '}
          <span style={{ color: '#888' }}>{formatDate(trial.endDate)}</span>
        </span>
      </div>

      {svc.warn && (
        <div
          style={{
            fontSize: 11,
            color: '#ff9500',
            marginTop: 8,
            padding: '4px 8px',
            background: '#ff950011',
            borderRadius: 6,
          }}
        >
          ⚠ {svc.warn}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {svc.cancelUrl ? (
          <a
            href={svc.cancelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              background: s.bar,
              color: s.pillText,
              fontWeight: 700,
              fontSize: 13,
              padding: '10px',
              borderRadius: 8,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Cancel Subscription →
          </a>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        <button
          onClick={() => onDelete(trial.id)}
          style={{
            background: '#ffffff0a',
            border: '1px solid #ffffff11',
            color: '#555',
            fontSize: 16,
            width: 42,
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function AddSheet({ onAdd, onClose }) {
  const [service, setService] = useState('Netflix');
  const [days, setDays] = useState(30);
  const [note, setNote] = useState('');

  const endDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  })();

  const safeCancelDate = (() => {
    const d = new Date(endDate);
    d.setDate(d.getDate() - (SERVICES_DB[service]?.noticeDays || 2));
    return formatDate(d.toISOString().split('T')[0]);
  })();

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#f5f5f5',
    fontSize: 15,
    padding: '13px 14px',
    borderRadius: 10,
    outline: 'none',
    fontFamily: 'system-ui',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: '#000000cc',
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          margin: '0 auto',
          background: '#111',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: '#333',
            borderRadius: 99,
            margin: '0 auto 20px',
          }}
        />
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#f5f5f5',
            marginBottom: 18,
          }}
        >
          Add Free Trial
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#666',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}
        >
          SERVICE
        </div>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          style={{ ...inputStyle, marginBottom: 14, appearance: 'none' }}
        >
          {Object.keys(SERVICES_DB).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div
          style={{
            fontSize: 11,
            color: '#666',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          TRIAL LENGTH
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[7, 14, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                flex: 1,
                padding: '11px 0',
                background: days === d ? '#00aa55' : '#1a1a1a',
                border: `1px solid ${days === d ? '#00aa55' : '#2a2a2a'}`,
                color: days === d ? '#000' : '#888',
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'system-ui',
              }}
            >
              {d}d
            </button>
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#666',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}
        >
          NOTE (OPTIONAL)
        </div>
        <input
          type="text"
          placeholder="e.g. Photography plan"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ ...inputStyle, marginBottom: 16 }}
        />

        <div
          style={{
            background: '#1a1a1a',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: '#888',
            marginBottom: 18,
          }}
        >
          ⏰ Safe cancel deadline:{' '}
          <span style={{ color: '#00cc66', fontWeight: 700 }}>
            {safeCancelDate}
          </span>
          <span style={{ color: '#555' }}>
            {' '}
            ({SERVICES_DB[service]?.noticeDays || 2}d before charge)
          </span>
        </div>

        <button
          onClick={() => {
            onAdd({ id: Date.now(), service, endDate, note });
            onClose();
          }}
          style={{
            width: '100%',
            background: '#00aa55',
            color: '#000',
            fontWeight: 800,
            fontSize: 16,
            padding: '15px',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontFamily: 'system-ui',
          }}
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [trials, setTrials] = useState([
    {
      id: 1,
      service: 'Adobe Creative Cloud',
      endDate: '2026-04-06',
      note: 'Photography plan',
    },
    {
      id: 2,
      service: 'LinkedIn Premium',
      endDate: '2026-04-15',
      note: 'Job search',
    },
    { id: 3, service: 'Spotify', endDate: '2026-04-28', note: '' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState('all');

  const sorted = [...trials].sort((a, b) => {
    const sa = SERVICES_DB[a.service] || SERVICES_DB['Other'];
    const sb = SERVICES_DB[b.service] || SERVICES_DB['Other'];
    return (
      getDaysLeft(a.endDate, sa.noticeDays).daysToSafe -
      getDaysLeft(b.endDate, sb.noticeDays).daysToSafe
    );
  });

  const filtered = sorted.filter((t) => {
    const s = SERVICES_DB[t.service] || SERVICES_DB['Other'];
    const { daysToSafe } = getDaysLeft(t.endDate, s.noticeDays);
    const status = getStatus(daysToSafe);
    if (tab === 'urgent') return status === 'critical' || status === 'expired';
    if (tab === 'safe') return status === 'safe' || status === 'warning';
    return true;
  });

  const urgentCount = trials.filter((t) => {
    const s = SERVICES_DB[t.service] || SERVICES_DB['Other'];
    return ['critical', 'expired'].includes(
      getStatus(getDaysLeft(t.endDate, s.noticeDays).daysToSafe)
    );
  }).length;

  return (
    <div
      style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#f5f5f5',
        fontFamily: 'system-ui',
        paddingBottom: 100,
      }}
    >
      <div style={{ height: 12 }} />

      {/* Header */}
      <div style={{ padding: '12px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: '#00aa55',
                letterSpacing: '0.12em',
              }}
            >
              🛡️ TRIALGUARD
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              My Trials
            </div>
          </div>
          {urgentCount > 0 && (
            <div
              style={{
                background: '#ff3b3022',
                border: '1px solid #ff3b3044',
                color: '#ff3b30',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 99,
              }}
            >
              ⚠ {urgentCount} urgent
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[
            { label: 'TRACKING', value: trials.length },
            { label: 'URGENT', value: urgentCount, accent: urgentCount > 0 },
            { label: 'EST. SAVED', value: `$${trials.length * 12}` },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: '#141414',
                borderRadius: 12,
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: accent ? '#ff9500' : '#f5f5f5',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: '#555',
                  marginTop: 2,
                  letterSpacing: '0.06em',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 20px 10px' }}>
        {['all', 'urgent', 'safe'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '9px 0',
              background: tab === t ? '#1e1e1e' : 'transparent',
              border: `1px solid ${tab === t ? '#333' : '#1a1a1a'}`,
              color: tab === t ? '#f5f5f5' : '#555',
              fontSize: 12,
              fontWeight: tab === t ? 700 : 400,
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: 'system-ui',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ padding: '0 20px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#333',
              fontSize: 14,
            }}
          >
            {trials.length === 0 ? (
              <>
                No trials yet.
                <br />
                Tap + to add your first one.
              </>
            ) : (
              'Nothing here.'
            )}
          </div>
        ) : (
          filtered.map((t) => (
            <TrialCard
              key={t.id}
              trial={t}
              onDelete={(id) =>
                setTrials((prev) => prev.filter((x) => x.id !== id))
              }
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#00aa55',
          color: '#000',
          fontWeight: 800,
          fontSize: 15,
          padding: '15px 32px',
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 24px #00aa5566',
          fontFamily: 'system-ui',
          zIndex: 40,
          whiteSpace: 'nowrap',
        }}
      >
        + Add Trial
      </button>

      {showAdd && (
        <AddSheet
          onAdd={(t) => setTrials((prev) => [...prev, t])}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
