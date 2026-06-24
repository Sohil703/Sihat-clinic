import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const REPORT_TYPES = ['Blood Test', 'CBC', 'Thyroid', 'Vitamin D', 'MRI', 'CT Scan', 'X-Ray', 'Urine Test', 'Lipid Profile', 'Liver Function', 'Kidney Function', 'ECG', 'Ultrasound', 'Other'];

const ReportForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { patients, reports, addReport, removeReport } = useStore();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    patientId: params.get('patientId') || '',
    patientName: '',
    reportDate: format(new Date(), 'yyyy-MM-dd'),
    reportName: '',
    reportType: 'Blood Test',
    result: '',
    notes: '',
  });

  useEffect(() => {
    if (isEdit) {
      const r = reports.find(r => r.id === id);
      if (r) setForm(r);
    } else if (params.get('patientId')) {
      const p = patients.find(p => p.id === params.get('patientId'));
      if (p) setForm(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
    }
  }, [id, reports, params, patients]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.patientId || !form.reportName) return;
    addReport(form);
    navigate(-1);
  };

  const handleDelete = () => {
    removeReport(id);
    navigate(-1);
  };

  const sortedPatients = [...patients].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page page-enter">
      <Header
        title={isEdit ? 'Edit Report' : 'Add Report'}
        showBack
        rightAction={isEdit ? (
          <button className="btn btn-icon btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        ) : null}
      />

      <div className="page-content">
        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Patient & Date</div>

          <div className="input-group">
            <label className="input-label">Patient *</label>
            <select
              className="input"
              value={form.patientId}
              onChange={e => {
                const p = patients.find(p => p.id === e.target.value);
                if (p) setForm(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
              }}
            >
              <option value="">Select patient...</option>
              {sortedPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Report Date</label>
            <input className="input" type="date" value={form.reportDate} onChange={e => set('reportDate', e.target.value)} />
          </div>
        </div>

        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Report Details</div>

          <div className="input-group">
            <label className="input-label">Report Name *</label>
            <input className="input" placeholder="e.g. HbA1c Test, CBC, Thyroid Profile..." value={form.reportName} onChange={e => set('reportName', e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Report Type</label>
            <select className="input" value={form.reportType} onChange={e => set('reportType', e.target.value)}>
              {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Result / Summary</label>
            <textarea className="input" placeholder="Result summary, key values..." value={form.result} onChange={e => set('result', e.target.value)} rows={3} />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes</label>
            <textarea className="input" placeholder="Doctor's notes on this report..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ height: 52, fontSize: 16, borderRadius: 14, marginBottom: 24 }}
          onClick={handleSubmit}
        >
          <Save size={18} />
          {isEdit ? 'Update Report' : 'Save Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportForm;

