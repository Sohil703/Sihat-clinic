import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, CalendarDays, Stethoscope, X } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const SearchPage = () => {
  const navigate = useNavigate();
  const { patients, appointments, consultations } = useStore();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    if (!q.trim() || q.length < 2) return null;
    const lq = q.toLowerCase();

    const matchedPatients = patients.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.mobile.includes(q) ||
      p.patientId?.toLowerCase().includes(lq)
    );

    const matchedAppts = appointments.filter(a =>
      a.patientName.toLowerCase().includes(lq) ||
      a.reason?.toLowerCase().includes(lq)
    );

    const matchedConsults = consultations.filter(c =>
      c.patientName.toLowerCase().includes(lq) ||
      c.diagnosis?.toLowerCase().includes(lq)
    );

    return { patients: matchedPatients, appointments: matchedAppts, consultations: matchedConsults };
  }, [q, patients, appointments, consultations]);

  const total = results ? results.patients.length + results.appointments.length + results.consultations.length : 0;

  const colors = ['#0F766E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#22C55E'];
  const getColor = (name) => colors[(name || 'A').charCodeAt(0) % colors.length];

  return (
    <div className="page page-enter">
      <Header title="Search" showBack />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Search input */}
        <div className="search-bar" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}>
          <Search size={18} color="var(--primary)" />
          <input
            placeholder="Search patients, appointments..."
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
            style={{ fontSize: 16 }}
          />
          {q && (
            <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {!q && (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <div className="empty-icon"><Search size={28} /></div>
            <div className="empty-title">Search everything</div>
            <div className="empty-desc">Search by patient name, mobile number, patient ID, or diagnosis</div>
          </div>
        )}

        {q && q.length < 2 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>
            Type at least 2 characters to search...
          </div>
        )}

        {results && total === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><Search size={28} /></div>
            <div className="empty-title">No results found</div>
            <div className="empty-desc">Try searching with different terms</div>
          </div>
        )}

        {results && total > 0 && (
          <>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {total} result{total !== 1 ? 's' : ''} for "{q}"
            </div>

            {/* Patients */}
            {results.patients.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Users size={14} color="var(--primary)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    PATIENTS ({results.patients.length})
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.patients.map(p => {
                    const color = getColor(p.name);
                    const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return (
                      <div key={p.id} className="card" style={{ padding: 14, cursor: 'pointer' }}
                        onClick={() => navigate(`/patients/${p.id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                            background: `linear-gradient(135deg, ${color}, ${color}99)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700,
                          }}>
                            {initials}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              {p.patientId} • {p.mobile} • {p.age}y
                            </div>
                          </div>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                            background: p.doctorId === 'dr-raiyan' ? 'var(--primary-bg)' : '#DBEAFE',
                            color: p.doctorId === 'dr-raiyan' ? 'var(--primary)' : 'var(--secondary)',
                          }}>
                            {p.doctorName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appointments */}
            {results.appointments.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <CalendarDays size={14} color="var(--secondary)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    APPOINTMENTS ({results.appointments.length})
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.appointments.slice(0, 5).map(a => (
                    <div key={a.id} className="card" style={{ padding: 14, cursor: 'pointer' }}
                      onClick={() => navigate(`/patients/${a.patientId}`)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{a.patientName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                            {format(new Date(a.date), 'MMM d, yyyy')} at {a.time} • {a.doctorName}
                          </div>
                          {a.reason && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{a.reason}</div>}
                        </div>
                        <span className={`badge ${a.status === 'completed' ? 'badge-success' : a.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consultations */}
            {results.consultations.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Stethoscope size={14} color="var(--purple)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    CONSULTATIONS ({results.consultations.length})
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.consultations.slice(0, 5).map(c => (
                    <div key={c.id} className="card" style={{ padding: 14, cursor: 'pointer' }}
                      onClick={() => navigate(`/consultation/${c.id}`)}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{c.patientName}</div>
                      <div style={{ fontSize: 13, color: 'var(--primary)', marginTop: 2 }}>{c.diagnosis}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {format(new Date(c.visitDate), 'MMM d, yyyy')} • {c.doctorName}
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

export default SearchPage;

