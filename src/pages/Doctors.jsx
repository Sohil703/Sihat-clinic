import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, CalendarDays, Activity, Heart, Stethoscope, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import PatientCard from '../components/patients/PatientCard.jsx';
import AppointmentCard from '../components/appointments/AppointmentCard.jsx';

const DOCTORS = [
  { id: 'dr-raiyan', name: 'Dr. Raiyan', specialty: 'Chronic Disease & Pain Management', color: '#0F766E', initials: 'DR', desc: 'Specializes in managing chronic conditions including diabetes, hypertension, thyroid disorders, and pain management therapies.' },
  { id: 'dr-fahim', name: 'Dr. Fahim', specialty: 'Face & Hair Treatment', color: '#3B82F6', initials: 'DF', desc: 'Expert in dermatological treatments for face and hair including acne treatment, hair fall management, PRP therapy and cosmetic procedures.' },
];

export const DoctorsList = () => {
  const navigate = useNavigate();
  const { patients, appointments, consultations, followups } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="page page-enter">
      <Header title="Our Doctors" showBack />
      <div className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DOCTORS.map(doc => {
            const docPatients = patients.filter(p => p.doctorId === doc.id).length;
            const docTodayAppts = appointments.filter(a => a.doctorId === doc.id && a.date === today).length;
            const docFollowups = followups.filter(f => f.doctorId === doc.id).length;
            return (
              <div key={doc.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/doctors/${doc.id}`)}>
                {/* Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`,
                  padding: '20px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 20,
                  }}>
                    {doc.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{doc.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{doc.specialty}</div>
                  </div>
                  <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                </div>
                {/* Stats */}
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>{doc.desc}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { icon: <Users size={14} />, label: 'Patients', value: docPatients, color: doc.color },
                      { icon: <CalendarDays size={14} />, label: 'Today', value: docTodayAppts, color: '#F59E0B' },
                      { icon: <Heart size={14} />, label: 'Follow-ups', value: docFollowups, color: '#EF4444' },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', background: 'var(--bg)', borderRadius: 10 }}>
                        <div style={{ color: s.color, marginBottom: 2, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, appointments, consultations, followups } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const doc = DOCTORS.find(d => d.id === id);
  if (!doc) return null;

  const docPatients = patients.filter(p => p.doctorId === id);
  const docAppts = appointments.filter(a => a.doctorId === id).sort((a, b) => b.date.localeCompare(a.date));
  const todayAppts = docAppts.filter(a => a.date === today);
  const docFollowups = followups.filter(f => f.doctorId === id);

  return (
    <div className="page page-enter">
      <Header title={doc.name} showBack />
      <div className="page-content">

        {/* Profile */}
        <div style={{
          background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)`,
          borderRadius: 20, padding: 20, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 22,
            }}>
              {doc.initials}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{doc.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{doc.specialty}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {[
              { label: 'Total Patients', value: docPatients.length },
              { label: "Today's Appts", value: todayAppts.length },
              { label: 'Follow-ups', value: docFollowups.length },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: 'rgba(255,255,255,0.18)',
                padding: '8px 4px', borderRadius: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's appointments */}
        {todayAppts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="section-header"><span className="section-title">Today's Appointments</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayAppts.map(a => <AppointmentCard key={a.id} appointment={a} showActions />)}
            </div>
          </div>
        )}

        {/* Patients */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-title">Patients ({docPatients.length})</span>
          </div>
          {docPatients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>No patients assigned</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {docPatients.slice(0, 5).map(p => <PatientCard key={p.id} patient={p} />)}
              {docPatients.length > 5 && (
                <button
                  className="btn btn-secondary btn-full"
                  style={{ borderRadius: 12 }}
                  onClick={() => navigate('/patients')}
                >
                  View all {docPatients.length} patients
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

