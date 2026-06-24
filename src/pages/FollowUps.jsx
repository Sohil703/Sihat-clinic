import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CalendarDays, Plus, Trash2, Clock } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const FollowUps = () => {
  const navigate = useNavigate();
  const { followups, removeFollowup } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

  const sorted = useMemo(() =>
    [...followups].sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)),
    [followups]
  );

  const groups = useMemo(() => {
    const todayList = sorted.filter(f => f.followUpDate === today);
    const tomorrowList = sorted.filter(f => f.followUpDate === tomorrow);
    const thisWeek = sorted.filter(f => f.followUpDate > tomorrow && f.followUpDate <= weekEnd);
    const later = sorted.filter(f => f.followUpDate > weekEnd);
    const overdue = sorted.filter(f => f.followUpDate < today);
    return { overdue, todayList, tomorrowList, thisWeek, later };
  }, [sorted, today, tomorrow, weekEnd]);

  const renderGroup = (title, items, color = 'var(--text-secondary)') => {
    if (items.length === 0) return null;
    return (
      <div key={title} style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color, marginBottom: 10,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>{title}</span>
          <span style={{
            background: color === 'var(--text-secondary)' ? 'var(--bg)' : `${color}20`,
            color, padding: '1px 8px', borderRadius: 99, fontSize: 11,
          }}>{items.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(fu => (
            <div key={fu.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: fu.doctorId === 'dr-raiyan' ? 'linear-gradient(135deg, #0F766E, #14B8A6)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Heart size={17} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }} className="truncate">{fu.patientName}</div>
                    <button
                      onClick={() => removeFollowup(fu.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
                    >
                      <Trash2 size={14} color="var(--text-muted)" />
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{fu.reason}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarDays size={12} color={color} />
                      <span style={{ fontSize: 12, fontWeight: 600, color }}>
                        {format(parseISO(fu.followUpDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fu.doctorName}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                <button
                  className="btn btn-sm"
                  style={{ flex: 1, background: 'var(--primary-bg)', color: 'var(--primary)', border: 'none', borderRadius: 8 }}
                  onClick={() => navigate(`/patients/${fu.patientId}`)}
                >
                  View Patient
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/appointments/new?patientId=${fu.patientId}`)}
                >
                  Schedule Appt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const total = followups.length;

  return (
    <div className="page page-enter">
      <Header title="Follow-ups" showBack />

      <div className="page-content">

        {/* Summary */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { label: "Today", value: groups.todayList.length, color: 'var(--primary)' },
            { label: "Tomorrow", value: groups.tomorrowList.length, color: 'var(--secondary)' },
            { label: "This Week", value: groups.thisWeek.length, color: 'var(--warning)' },
            { label: "Overdue", value: groups.overdue.length, color: 'var(--danger)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {total === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Heart size={28} /></div>
            <div className="empty-title">No follow-ups scheduled</div>
            <div className="empty-desc">Follow-ups are automatically created when you save a consultation with a follow-up date.</div>
          </div>
        ) : (
          <>
            {renderGroup('Overdue', groups.overdue, 'var(--danger)')}
            {renderGroup('Today', groups.todayList, 'var(--primary)')}
            {renderGroup('Tomorrow', groups.tomorrowList, 'var(--secondary)')}
            {renderGroup('This Week', groups.thisWeek, 'var(--warning)')}
            {renderGroup('Upcoming', groups.later)}
          </>
        )}

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

export default FollowUps;

