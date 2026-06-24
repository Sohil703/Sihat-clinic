import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Heart, AlertTriangle, CalendarDays } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const Notifications = () => {
  const navigate = useNavigate();
  const { appointments, followups } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const todayAppts = appointments.filter(a => a.date === today && a.status === 'upcoming');
  const missedAppts = appointments.filter(a => a.date < today && a.status === 'upcoming');
  const tomorrowFollowups = followups.filter(f => f.followUpDate === tomorrow);
  const todayFollowups = followups.filter(f => f.followUpDate === today);

  const total = todayAppts.length + missedAppts.length + tomorrowFollowups.length + todayFollowups.length;

  const NotifItem = ({ icon, iconBg, iconColor, title, desc, time, onClick, badge }) => (
    <div className="card" style={{ padding: 14, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {React.cloneElement(icon, { size: 18, color: iconColor })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }} className="truncate">{title}</div>
            {badge}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page page-enter">
      <Header title="Notifications" showBack />
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {total === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Bell size={28} /></div>
            <div className="empty-title">All caught up!</div>
            <div className="empty-desc">No pending notifications right now.</div>
          </div>
        ) : (
          <>
            {todayAppts.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Today's Appointments — {todayAppts.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {todayAppts.map(a => (
                    <NotifItem
                      key={a.id}
                      icon={<Clock />}
                      iconBg="var(--primary-bg)"
                      iconColor="var(--primary)"
                      title={a.patientName}
                      desc={`${a.time} with ${a.doctorName}${a.reason ? ` — ${a.reason}` : ''}`}
                      onClick={() => navigate('/today')}
                      badge={<span className="badge badge-primary">Today</span>}
                    />
                  ))}
                </div>
              </div>
            )}

            {todayFollowups.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Follow-ups Today — {todayFollowups.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {todayFollowups.map(f => (
                    <NotifItem
                      key={f.id}
                      icon={<Heart />}
                      iconBg="#FEF3C7"
                      iconColor="var(--warning)"
                      title={f.patientName}
                      desc={f.reason}
                      onClick={() => navigate(`/patients/${f.patientId}`)}
                      badge={<span className="badge badge-warning">Today</span>}
                    />
                  ))}
                </div>
              </div>
            )}

            {tomorrowFollowups.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Follow-ups Tomorrow — {tomorrowFollowups.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tomorrowFollowups.map(f => (
                    <NotifItem
                      key={f.id}
                      icon={<CalendarDays />}
                      iconBg="#DBEAFE"
                      iconColor="var(--secondary)"
                      title={f.patientName}
                      desc={f.reason}
                      onClick={() => navigate(`/patients/${f.patientId}`)}
                      badge={<span className="badge badge-secondary">Tomorrow</span>}
                    />
                  ))}
                </div>
              </div>
            )}

            {missedAppts.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Missed Appointments — {missedAppts.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {missedAppts.map(a => (
                    <NotifItem
                      key={a.id}
                      icon={<AlertTriangle />}
                      iconBg="#FEE2E2"
                      iconColor="var(--danger)"
                      title={a.patientName}
                      desc={`${format(new Date(a.date), 'MMM d')} at ${a.time} — ${a.doctorName}`}
                      onClick={() => navigate('/appointments')}
                      badge={<span className="badge badge-danger">Missed</span>}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

export default Notifications;

