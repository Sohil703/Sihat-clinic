import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const ConsultationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { patients, appointments, consultations, addConsultation, editConsultation, addFollowup } = useStore();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    patientId: params.get('patientId') || '',
    patientName: '',
    doctorId: 'dr-raiyan',
    doctorName: 'Dr. Raiyan',
    visitDate: format(new Date(), 'yyyy-MM-dd'),
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medicines: '',
    instructions: '',
    followUpDate: '',
    notes: '',
  });

  useEffect(() => {
    if (isEdit) {
      const c = consultations.find(c => c.id === id);
      if (c) setForm(c);
    } else {
      const apptId = params.get('appointmentId');
      const patientId = params.get('patientId');

      if (apptId) {
        const a = appointments.find(a => a.id === apptId);
        if (a) setForm(prev => ({ ...prev, patientId: a.patientId, patientName: a.patientName, doctorId: a.doctorId, doctorName: a.doctorName }));
      } else if (patientId) {
        const p = patients.find(p => p.id === patientId);
        if (p) setForm(prev => ({ ...prev, patientId: p.id, patientName: p.name, doctorId: p.doctorId, doctorName: p.doctorName }));
      }
    }
  }, [id, consultations, params, appointments, patients]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.patientId || !form.diagnosis) return;
    const data = { ...form };

    if (isEdit) {
      editConsultation(id, data);
    } else {
      const c = addConsultation(data);
      if (form.followUpDate) {
        addFollowup({
          patientId: form.patientId,
          patientName: form.patientName,
          doctorId: form.doctorId,
          doctorName: form.doctorName,
          followUpDate: form.followUpDate,
          reason: `Follow-up: ${form.diagnosis}`,
          notes: '',
        });
      }
    }
    navigate(-1);
  };

  const sortedPatients = [...patients].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page page-enter">
      <Header title={isEdit ? 'Edit Consultation' : 'New Consultation'} showBack />

      <div className="page-content">

        {/* Patient */}
        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Patient Details</div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Patient *</label>
              <select
                className="input"
                value={form.patientId}
                onChange={e => {
                  const p = patients.find(p => p.id === e.target.value);
                  if (p) setForm(prev => ({ ...prev, patientId: p.id, patientName: p.name, doctorId: p.doctorId, doctorName: p.doctorName }));
                }}
              >
                <option value="">Select...</option>
                {sortedPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Visit Date</label>
              <input className="input" type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Doctor</label>
            <select className="input" value={form.doctorId} onChange={e => {
              const n = e.target.value === 'dr-raiyan' ? 'Dr. Raiyan' : 'Dr. Fahim';
              setForm(prev => ({ ...prev, doctorId: e.target.value, doctorName: n }));
            }}>
              <option value="dr-raiyan">Dr. Raiyan</option>
              <option value="dr-fahim">Dr. Fahim</option>
            </select>
          </div>
        </div>

        {/* Clinical */}
        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Clinical Details</div>

          <div className="input-group">
            <label className="input-label">Symptoms</label>
            <textarea className="input" placeholder="Patient's presenting symptoms..." value={form.symptoms} onChange={e => set('symptoms', e.target.value)} rows={2} />
          </div>

          <div className="input-group">
            <label className="input-label">Diagnosis *</label>
            <input className="input" placeholder="Primary diagnosis..." value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Treatment Given</label>
            <textarea className="input" placeholder="Treatment procedures performed..." value={form.treatment} onChange={e => set('treatment', e.target.value)} rows={2} />
          </div>
        </div>

        {/* Prescription */}
        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Prescription & Instructions</div>

          <div className="input-group">
            <label className="input-label">Medicines</label>
            <textarea className="input" placeholder="List of medicines with dosage..." value={form.medicines} onChange={e => set('medicines', e.target.value)} rows={3} />
          </div>

          <div className="input-group">
            <label className="input-label">Patient Instructions</label>
            <textarea className="input" placeholder="Diet, lifestyle, care instructions..." value={form.instructions} onChange={e => set('instructions', e.target.value)} rows={2} />
          </div>
        </div>

        {/* Follow-up */}
        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Follow-up & Notes</div>

          <div className="input-group">
            <label className="input-label">Next Follow-up Date</label>
            <input className="input" type="date" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes</label>
            <textarea className="input" placeholder="Additional clinical notes..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ height: 52, fontSize: 16, borderRadius: 14, marginBottom: 24 }}
          onClick={handleSubmit}
        >
          <Save size={18} />
          {isEdit ? 'Update Consultation' : 'Save Consultation'}
        </button>
      </div>
    </div>
  );
};

export default ConsultationForm;

