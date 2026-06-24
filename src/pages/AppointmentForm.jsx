import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { patients, appointments, addAppointment, editAppointment } = useStore();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    patientId: params.get('patientId') || '',
    patientName: '',
    doctorId: 'dr-raiyan',
    doctorName: 'Dr. Raiyan',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    reason: '',
    notes: '',
    status: 'upcoming',
  });

  useEffect(() => {
    if (isEdit) {
      const a = appointments.find(a => a.id === id);
      if (a) setForm(a);
    } else if (params.get('patientId')) {
      const p = patients.find(p => p.id === params.get('patientId'));
      if (p) {
        setForm(prev => ({
          ...prev,
          patientId: p.id,
          patientName: p.name,
          doctorId: p.doctorId,
          doctorName: p.doctorName,
        }));
      }
    }
  }, [id, appointments, params, patients]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const selectPatient = (p) => {
    setForm(prev => ({
      ...prev,
      patientId: p.id,
      patientName: p.name,
      doctorId: p.doctorId,
      doctorName: p.doctorName,
    }));
  };

  const setDoctor = (doctorId) => {
    const name = doctorId === 'dr-raiyan' ? 'Dr. Raiyan' : 'Dr. Fahim';
    setForm(prev => ({ ...prev, doctorId, doctorName: name }));
  };

  const handleSubmit = () => {
    if (!form.patientId || !form.date || !form.time) return;
    if (isEdit) editAppointment(id, form);
    else addAppointment(form);
    navigate(-1);
  };

  const sortedPatients = [...patients].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page page-enter">
      <Header title={isEdit ? 'Edit Appointment' : 'New Appointment'} showBack />

      <div className="page-content">

        {/* Patient Selector */}
        <div className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Select Patient</div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select
              className="input"
              value={form.patientId}
              onChange={e => {
                const p = patients.find(p => p.id === e.target.value);
                if (p) selectPatient(p);
              }}
            >
              <option value="">-- Choose patient --</option>
              {sortedPatients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor */}
        <div className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Doctor</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: 'dr-raiyan', name: 'Dr. Raiyan', color: '#0F766E' },
              { id: 'dr-fahim', name: 'Dr. Fahim', color: '#3B82F6' },
            ].map(doc => (
              <div
                key={doc.id}
                onClick={() => setDoctor(doc.id)}
                style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12, textAlign: 'center',
                  border: `2px solid ${form.doctorId === doc.id ? doc.color : 'var(--border)'}`,
                  background: form.doctorId === doc.id ? `${doc.color}15` : 'var(--surface)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: form.doctorId === doc.id ? doc.color : 'var(--text-primary)' }}>
                  {doc.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Schedule</div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Date *</label>
              <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Time *</label>
              <input className="input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Reason for Visit</label>
            <input className="input" placeholder="e.g. Regular checkup, Follow-up..." value={form.reason} onChange={e => set('reason', e.target.value)} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes</label>
            <textarea className="input" placeholder="Any special notes..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ height: 52, fontSize: 16, borderRadius: 14 }}
          onClick={handleSubmit}
        >
          <Save size={18} />
          {isEdit ? 'Update Appointment' : 'Schedule Appointment'}
        </button>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
};

export default AppointmentForm;

