import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Phone, Stethoscope, CheckCircle, XCircle, History, User, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const StatusBadge = ({ status }) => {
  const cfg = {
    upcoming: { label: 'Upcoming', bg: 'var(--primary-bg)', color: 'var(--primary)' },
    completed: { label: 'Completed', bg: '#DCFCE7', color: '#15803D' },
    cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#DC2626' },
  };
  const c = cfg[status] || cfg.upcoming;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
};

const Today = () => {
  const navigate = useNavigate();
  const { appointments, patients, updateAppointmentStatus } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');

  const todayAppts = useMemo(() =>
    appointments
      .filter(a => a.date === today)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  );

  const upcoming = todayAppts.filter(a => a.status === 'upcoming');
  const completed = todayAppts.filter(a => a.status === 'completed');
  const cancelled = todayAppts.filter(a => a.status === 'cancelled');

  const getPatient = (patientId) => patients.find(p => p.id === patientId);

  return (
    <div className="page page-enter">
      <Header title="Today's Patients" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Date Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
          borderRadius: 16, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Today</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginTop: 2 }}>
              {format(new Date(), 'EEEE, MMMM d')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{upcoming.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{completed.length}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Done</div>
            </div>
          </div>
        </div>

        {todayAppts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><CalendarDays size={28} /></div>
            <div className="empty-title">No appointments today</div>
            <div className="empty-desc">Schedule appointments for today to see patients here</div>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/appointments/new')}>
              <Clock size={16} /> Add Today's Appointment
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Upcoming — {upcoming.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {upcoming.map(appt => {
                    const patient = getPatient(appt.patientId);
                    const initials = appt.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return (
                      <div key={appt.id} className="card" style={{ padding: 16, borderLeft: `4px solid ${appt.doctorId === 'dr-raiyan' ? 'var(--primary)' : 'var(--secondary)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                            background: appt.doctorId === 'dr-raiyan' ?
                              'linear-gradient(135deg, #0F766E, #14B8A6)' :
                              'linear-gradient(135deg, #3B82F6, #60A5FA)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 16,
                          }}>
                            {initials}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 15, fontWeight: 700 }} className="truncate">{appt.patientName}</span>
                              <span style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 13, fontWeight: 700,
                                color: appt.doctorId === 'dr-raiyan' ? 'var(--primary)' : 'var(--secondary)',
                              }}>
                                <Clock size={12} /> {appt.time}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{appt.doctorName}</span>
                              {appt.reason && (
                                <>
                                  <span style={{ color: 'var(--border)' }}>·</span>
                                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }} className="truncate">{appt.reason}</span>
                                </>
                              )}
                            </div>
                            {patient?.mobile && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                <Phone size={11} color="var(--text-muted)" />
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.mobile}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{
                          display: 'flex', gap: 8, marginTop: 12,
                          paddingTop: 12, borderTop: '1px solid var(--border-light)',
                        }}>
                          <button
                            className="btn btn-sm"
                            style={{ flex: 1, background: 'var(--primary-bg)', color: 'var(--primary)', border: 'none', borderRadius: 10 }}
                            onClick={() => navigate(`/consultation/new?appointmentId=${appt.id}&patientId=${appt.patientId}`)}
                          >
                            <Stethoscope size={13} />
                            Start Consult
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ flex: 1, background: '#DCFCE7', color: '#15803D', border: 'none', borderRadius: 10 }}
                            onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                          >
                            <CheckCircle size={13} />
                            Mark Done
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, width: 36 }}
                            onClick={() => navigate(`/patients/${appt.patientId}`)}
                          >
                            <History size={13} color="var(--text-secondary)" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#15803D', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Completed — {completed.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {completed.map(appt => (
                    <div key={appt.id} className="card" style={{ padding: 14, opacity: 0.75, borderLeft: '4px solid var(--success)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                          background: '#DCFCE7',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CheckCircle size={18} color="#15803D" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{appt.patientName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{appt.doctorName} • {appt.time}</div>
                        </div>
                        <StatusBadge status="completed" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled */}
            {cancelled.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cancelled — {cancelled.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cancelled.map(appt => (
                    <div key={appt.id} className="card" style={{ padding: 14, opacity: 0.6, borderLeft: '4px solid var(--danger)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 11,
                          background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <XCircle size={18} color="#DC2626" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{appt.patientName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{appt.doctorName} • {appt.time}</div>
                        </div>
                        <StatusBadge status="cancelled" />
                      </div>
                    </div>
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

export default Today;

