import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import AppointmentCard from '../components/appointments/AppointmentCard.jsx';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments } = useStore();
  const [filter, setFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const today = format(new Date(), 'yyyy-MM-dd');

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (filter === 'today') list = list.filter(a => a.date === today);
    else if (filter === 'upcoming') list = list.filter(a => a.date >= today && a.status === 'upcoming');
    else if (filter === 'completed') list = list.filter(a => a.status === 'completed');
    else if (filter === 'cancelled') list = list.filter(a => a.status === 'cancelled');

    if (doctorFilter !== 'all') list = list.filter(a => a.doctorId === doctorFilter);

    return list.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return a.time.localeCompare(b.time);
    });
  }, [appointments, filter, doctorFilter, today]);

  const counts = useMemo(() => ({
    all: appointments.length,
    today: appointments.filter(a => a.date === today).length,
    upcoming: appointments.filter(a => a.date >= today && a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }), [appointments, today]);

  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(a => {
      if (!g[a.date]) g[a.date] = [];
      g[a.date].push(a);
    });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const formatDate = (d) => {
    if (d === today) return 'Today';
    if (d === format(addDays(new Date(), 1), 'yyyy-MM-dd')) return 'Tomorrow';
    if (d === format(subDays(new Date(), 1), 'yyyy-MM-dd')) return 'Yesterday';
    return format(new Date(d), 'EEE, MMM d');
  };

  return (
    <div className="page page-enter">
      <Header title="Appointments" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'today', label: `Today (${counts.today})` },
            { key: 'upcoming', label: `Upcoming (${counts.upcoming})` },
            { key: 'completed', label: `Done (${counts.completed})` },
          ].map(f => (
            <span
              key={f.key}
              className={`chip ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
              style={{ flexShrink: 0 }}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Doctor filters */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { value: 'all', label: 'All Doctors' },
            { value: 'dr-raiyan', label: 'Dr. Raiyan' },
            { value: 'dr-fahim', label: 'Dr. Fahim' },
          ].map(f => (
            <span
              key={f.value}
              className={`chip ${doctorFilter === f.value ? 'active' : ''}`}
              onClick={() => setDoctorFilter(f.value)}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Groups */}
        {groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><CalendarDays size={28} /></div>
            <div className="empty-title">No appointments</div>
            <div className="empty-desc">Schedule a new appointment to get started</div>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/appointments/new')}>
              <Plus size={16} /> New Appointment
            </button>
          </div>
        ) : (
          groups.map(([date, appts]) => (
            <div key={date}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 8,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: date === today ? 'var(--primary)' : 'var(--text-secondary)',
                }}>
                  {formatDate(date)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{appts.length} appt{appts.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {appts.map(a => <AppointmentCard key={a.id} appointment={a} showActions={date === today} />)}
              </div>
            </div>
          ))
        )}

        <div style={{ height: 8 }} />
      </div>

      <button className="fab" onClick={() => navigate('/appointments/new')}>
        <Plus size={22} />
      </button>
    </div>
  );
};

export default Appointments;

