import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarDays, Clock, Activity, UserPlus, Plus, ChevronRight, Stethoscope, Bell, Heart } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import StatCard from '../components/common/StatCard.jsx';
import AppointmentCard from '../components/appointments/AppointmentCard.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { patients, appointments, consultations, followups } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const todayAppts = appointments.filter(a => a.date === today);
  const todayUpcoming = todayAppts.filter(a => a.status === 'upcoming');
  const upcomingAppts = appointments.filter(a => a.date > today && a.status === 'upcoming');
  const activeTreatments = consultations.filter(c => c.followUpDate && c.followUpDate >= today);
  const tomorrowFollowups = followups.filter(f => f.followUpDate === tomorrow);

  const raiyanPatients = patients.filter(p => p.doctorId === 'dr-raiyan').length;
  const fahimPatients = patients.filter(p => p.doctorId === 'dr-fahim').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page page-enter">
      <Header title="Sihat Clinic" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Welcome Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 60%, #3B82F6 100%)',
          borderRadius: 20,
          padding: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, right: 30,
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: 4 }}>
              {greeting()} 👋
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              Sihat Clinic
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <div style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
                padding: '8px 14px', borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Clock size={14} color="white" />
                <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>
                  {todayUpcoming.length} patients today
                </span>
              </div>
              {tomorrowFollowups.length > 0 && (
                <div style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 14px', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Bell size={14} color="white" />
                  <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>
                    {tomorrowFollowups.length} follow-ups tomorrow
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <div className="section-header">
            <span className="section-title">Overview</span>
          </div>
          <div className="grid-2">
            <StatCard
              icon={<Users />}
              label="Total Patients"
              value={patients.length}
              color="var(--primary)"
              onClick={() => navigate('/patients')}
            />
            <StatCard
              icon={<CalendarDays />}
              label="Today's Appointments"
              value={todayAppts.length}
              color="var(--secondary)"
              onClick={() => navigate('/today')}
            />
            <StatCard
              icon={<Clock />}
              label="Upcoming"
              value={upcomingAppts.length}
              color="var(--warning)"
              onClick={() => navigate('/appointments')}
            />
            <StatCard
              icon={<Activity />}
              label="Active Treatments"
              value={activeTreatments.length}
              color="var(--success)"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="section-header">
            <span className="section-title">Quick Actions</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, borderRadius: 12, padding: '13px 10px' }}
              onClick={() => navigate('/patients/new')}
            >
              <UserPlus size={16} />
              <span style={{ fontSize: 13 }}>Add Patient</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, borderRadius: 12, padding: '13px 10px' }}
              onClick={() => navigate('/appointments/new')}
            >
              <Plus size={16} />
              <span style={{ fontSize: 13 }}>New Appt</span>
            </button>
            <button
              className="btn"
              style={{
                flex: 1, borderRadius: 12, padding: '13px 10px',
                background: '#EDE9FE', color: 'var(--purple)', border: 'none',
              }}
              onClick={() => navigate('/today')}
            >
              <Clock size={16} />
              <span style={{ fontSize: 13 }}>Today</span>
            </button>
          </div>
        </div>

        {/* Doctor Stats */}
        <div>
          <div className="section-header">
            <span className="section-title">Doctors</span>
            <span className="section-link" onClick={() => navigate('/doctors')}>View all →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'dr-raiyan', name: 'Dr. Raiyan', specialty: 'Chronic Disease & Pain', count: raiyanPatients, color: '#0F766E' },
              { id: 'dr-fahim', name: 'Dr. Fahim', specialty: 'Face & Hair Treatment', count: fahimPatients, color: '#3B82F6' },
            ].map(doc => (
              <div key={doc.id} className="card" style={{ padding: 16 }} onClick={() => navigate(`/doctors/${doc.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 14,
                  }}>
                    {doc.name.split(' ')[1][0]}{doc.name.split(' ')[2]?.[0] || ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{doc.specialty}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: doc.color }}>{doc.count}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>patients</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Appointments */}
        {todayAppts.length > 0 && (
          <div>
            <div className="section-header">
              <span className="section-title">Today's Schedule</span>
              <span className="section-link" onClick={() => navigate('/today')}>See all →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayAppts.slice(0, 3).map(appt => (
                <AppointmentCard key={appt.id} appointment={appt} showActions compact />
              ))}
            </div>
          </div>
        )}

        {/* Follow-ups */}
        {tomorrowFollowups.length > 0 && (
          <div>
            <div className="section-header">
              <span className="section-title">Tomorrow's Follow-ups</span>
              <span className="section-link" onClick={() => navigate('/followups')}>See all →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tomorrowFollowups.map(fu => (
                <div key={fu.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Heart size={16} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{fu.patientName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{fu.reason}</div>
                    </div>
                    <span className="badge badge-warning">Tomorrow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

export default Dashboard;

