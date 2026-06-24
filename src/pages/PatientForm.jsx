import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import { generatePatientId } from '../services/storage.js';
import { format } from 'date-fns';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { patients, addPatient, editPatient } = useStore();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', mobile: '', age: '', gender: 'Male',
    address: '', bloodGroup: 'B+', weight: '',
    doctorId: 'dr-raiyan', doctorName: 'Dr. Raiyan',
    registrationDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    if (isEdit) {
      const p = patients.find(p => p.id === id);
      if (p) setForm(p);
    }
  }, [id, patients]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const setDoctor = (doctorId) => {
    const name = doctorId === 'dr-raiyan' ? 'Dr. Raiyan' : 'Dr. Fahim';
    setForm(prev => ({ ...prev, doctorId, doctorName: name }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.age) return;
    const data = {
      ...form,
      age: Number(form.age),
      weight: form.weight ? Number(form.weight) : '',
      patientId: isEdit ? form.patientId : generatePatientId(),
    };
    if (isEdit) {
      editPatient(id, data);
    } else {
      addPatient(data);
    }
    navigate(-1);
  };

  return (
    <div className="page page-enter">
      <Header title={isEdit ? 'Edit Patient' : 'New Patient'} showBack />

      <div className="page-content">
        <div className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Personal Information
          </div>

          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input className="input" placeholder="Enter patient's full name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Age *</label>
              <input className="input" type="number" placeholder="Years" value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Gender</label>
              <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Mobile Number *</label>
            <input className="input" type="tel" placeholder="10-digit mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <input className="input" placeholder="Full address" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Blood Group</label>
              <select className="input" value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Weight (kg)</label>
              <input className="input" type="number" placeholder="kg" value={form.weight} onChange={e => set('weight', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Doctor Assignment
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'dr-raiyan', name: 'Dr. Raiyan', specialty: 'Chronic Disease & Pain Management', color: '#0F766E' },
              { id: 'dr-fahim', name: 'Dr. Fahim', specialty: 'Face & Hair Treatment', color: '#3B82F6' },
            ].map(doc => (
              <div
                key={doc.id}
                onClick={() => setDoctor(doc.id)}
                style={{
                  padding: 14, borderRadius: 12,
                  border: `2px solid ${form.doctorId === doc.id ? doc.color : 'var(--border)'}`,
                  background: form.doctorId === doc.id ? `${doc.color}10` : 'var(--surface)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14,
                }}>
                  {doc.name.split(' ')[1][0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.specialty}</div>
                </div>
                {form.doctorId === doc.id && (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: doc.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'white', fontSize: 12 }}>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card card-p" style={{ marginBottom: 24 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes</label>
            <textarea className="input" placeholder="Any additional notes about the patient..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ height: 52, fontSize: 16, borderRadius: 14 }}
          onClick={handleSubmit}
        >
          <Save size={18} />
          {isEdit ? 'Save Changes' : 'Add Patient'}
        </button>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
};

export default PatientForm;

