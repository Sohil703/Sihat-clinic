import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Phone, MapPin, Edit, Trash2, Plus, CalendarDays,
  FileText, Stethoscope, Activity, ChevronRight, AlertCircle, Droplets, Weight
} from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import AppointmentCard from '../components/appointments/AppointmentCard.jsx';

const colors = ['#0F766E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#22C55E'];
const getColor = (name) => colors[(name || 'A').charCodeAt(0) % colors.length];

const Section = ({ title, icon, children, onAdd, addLabel }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 12px', borderRadius: 8,
            background: 'var(--primary-bg)', color: 'var(--primary)',
            border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}
        >
          <Plus size={13} />
          {addLabel || 'Add'}
        </button>
      )}
    </div>
    {children}
  </div>
);

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, appointments, consultations, reports, followups, removePatient } = useStore();
  const [showDelete, setShowDelete] = useState(false);

  const patient = patients.find(p => p.id === id);
  if (!patient) return (
    <div className="page"><Header title="Patient" showBack />
      <div className="page-content"><div className="empty-state">
        <div className="empty-icon"><AlertCircle size={28} /></div>
        <div className="empty-title">Patient not found</div>
      </div></div>
    </div>
  );

  const patientAppts = appointments.filter(a => a.patientId === id).sort((a, b) => b.date.localeCompare(a.date));
  const patientConsults = consultations.filter(c => c.patientId === id).sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  const patientReports = reports.filter(r => r.patientId === id).sort((a, b) => b.reportDate.localeCompare(a.reportDate));
  const patientFollowups = followups.filter(f => f.patientId === id).sort((a, b) => b.followUpDate.localeCompare(a.followUpDate));

  const color = getColor(patient.name);
  const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleDelete = () => {
    removePatient(id);
    navigate('/patients');
  };

  return (
    <div className="page page-enter">
      <Header
        title="Patient Profile"
        showBack
        rightAction={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-icon btn-secondary"
              onClick={() => navigate(`/patients/${id}/edit`)}
            >
              <Edit size={16} />
            </button>
            <button
              className="btn btn-icon btn-danger"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        }
      />

      <div className="page-content">

        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
          borderRadius: 20, padding: 20, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 18, flexShrink: 0,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 22,
              border: '2px solid rgba(255,255,255,0.4)',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                {patient.name}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                {patient.patientId} • {patient.age}y • {patient.gender}
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                  padding: '4px 10px', borderRadius: 8,
                  fontSize: 12, color: 'white', fontWeight: 600,
                }}>
                  {patient.doctorName}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { icon: <Phone size={12} />, text: patient.mobile },
              { icon: <Droplets size={12} />, text: patient.bloodGroup },
              patient.weight && { icon: <Weight size={12} />, text: `${patient.weight} kg` },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.15)',
                padding: '5px 10px', borderRadius: 8,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          {[
            { label: 'Total Visits', value: patientAppts.length, color: 'var(--primary)' },
            { label: 'Consultations', value: patientConsults.length, color: 'var(--secondary)' },
            { label: 'Reports', value: patientReports.length, color: 'var(--success)' },
            { label: 'Follow-ups', value: patientFollowups.length, color: 'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, borderRadius: 12 }}
            onClick={() => navigate(`/appointments/new?patientId=${id}`)}
          >
            <CalendarDays size={15} />
            Appointment
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, borderRadius: 12 }}
            onClick={() => navigate(`/consultation/new?patientId=${id}`)}
          >
            <Stethoscope size={15} />
            Consult
          </button>
          <button
            className="btn"
            style={{ flex: 1, borderRadius: 12, background: '#EDE9FE', color: 'var(--purple)', border: 'none' }}
            onClick={() => navigate(`/reports/new?patientId=${id}`)}
          >
            <FileText size={15} />
            Report
          </button>
        </div>

        {/* Appointments */}
        <Section
          title={`Appointments (${patientAppts.length})`}
          icon={<CalendarDays size={16} color="var(--secondary)" />}
          onAdd={() => navigate(`/appointments/new?patientId=${id}`)}
        >
          {patientAppts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>No appointments yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patientAppts.slice(0, 3).map(a => <AppointmentCard key={a.id} appointment={a} compact />)}
            </div>
          )}
        </Section>

        {/* Consultations */}
        <Section
          title={`Consultations (${patientConsults.length})`}
          icon={<Stethoscope size={16} color="var(--primary)" />}
          onAdd={() => navigate(`/consultation/new?patientId=${id}`)}
        >
          {patientConsults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>No consultations recorded</div>
          ) : (
            <div className="timeline">
              {patientConsults.map(c => (
                <div key={c.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="card" style={{ padding: 14 }}
                    onClick={() => navigate(`/consultation/${c.id}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                        {format(new Date(c.visitDate), 'MMM d, yyyy')}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{c.doctorName}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>{c.diagnosis}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.symptoms}</div>
                    {c.medicines && (
                      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--success)', background: '#DCFCE7', padding: '4px 8px', borderRadius: 6 }}>
                        💊 {c.medicines}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Reports */}
        <Section
          title={`Reports (${patientReports.length})`}
          icon={<FileText size={16} color="var(--purple)" />}
          onAdd={() => navigate(`/reports/new?patientId=${id}`)}
        >
          {patientReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>No reports yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patientReports.map(r => (
                <div key={r.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{r.reportName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{r.reportType} • {format(new Date(r.reportDate), 'MMM d, yyyy')}</div>
                    </div>
                    <span className="badge badge-purple">{r.reportType}</span>
                  </div>
                  {r.result && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '6px 10px', background: 'var(--bg)', borderRadius: 8 }}>
                      {r.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Notes */}
        {patient.notes && (
          <div className="card card-p" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>CLINICAL NOTES</div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{patient.notes}</div>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      {/* Delete Confirm */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-header">
              <div className="modal-title">Delete Patient</div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>{patient.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDelete(false)}>Cancel</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;

