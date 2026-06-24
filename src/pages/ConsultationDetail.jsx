import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, User, Stethoscope, Pill, FileText, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';

const InfoRow = ({ label, value, color }) => (
  value ? (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: color || 'var(--text-primary)', lineHeight: 1.5 }}>{value}</div>
    </div>
  ) : null
);

const ConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { consultations } = useStore();

  const c = consultations.find(c => c.id === id);
  if (!c) return (
    <div className="page"><Header title="Consultation" showBack />
      <div className="empty-state"><div className="empty-title">Not found</div></div>
    </div>
  );

  return (
    <div className="page page-enter">
      <Header
        title="Consultation Record"
        showBack
        rightAction={
          <button className="btn btn-icon btn-secondary" onClick={() => navigate(`/consultation/${id}/edit`)}>
            <Edit size={16} />
          </button>
        }
      />
      <div className="page-content">

        {/* Header card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          borderRadius: 16, padding: 18, marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
            {format(new Date(c.visitDate), 'EEEE, MMMM d, yyyy')}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginTop: 4, letterSpacing: '-0.02em' }}>
            {c.diagnosis}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
            {c.patientName} • {c.doctorName}
          </div>
        </div>

        <div className="card card-p" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Stethoscope size={16} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Clinical Details</span>
          </div>
          <InfoRow label="Symptoms" value={c.symptoms} />
          <InfoRow label="Diagnosis" value={c.diagnosis} color="var(--primary)" />
          <InfoRow label="Treatment Given" value={c.treatment} />
        </div>

        {(c.medicines || c.instructions) && (
          <div className="card card-p" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Pill size={16} color="var(--success)" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Prescription</span>
            </div>
            {c.medicines && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Medicines</div>
                <div style={{ background: '#DCFCE7', padding: 12, borderRadius: 10, fontSize: 14, color: '#15803D', lineHeight: 1.6 }}>
                  💊 {c.medicines}
                </div>
              </div>
            )}
            {c.instructions && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Instructions</div>
                <div style={{ background: '#DBEAFE', padding: 12, borderRadius: 10, fontSize: 14, color: '#1D4ED8', lineHeight: 1.6 }}>
                  📋 {c.instructions}
                </div>
              </div>
            )}
          </div>
        )}

        {(c.followUpDate || c.notes) && (
          <div className="card card-p" style={{ marginBottom: 16 }}>
            {c.followUpDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: c.notes ? '1px solid var(--border-light)' : 'none' }}>
                <CalendarDays size={16} color="var(--warning)" />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Follow-up</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--warning)' }}>
                    {format(new Date(c.followUpDate), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
            )}
            {c.notes && (
              <div style={{ paddingTop: c.followUpDate ? 10 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.notes}</div>
              </div>
            )}
          </div>
        )}

        <button
          className="btn btn-secondary btn-full"
          style={{ borderRadius: 12, marginBottom: 24 }}
          onClick={() => navigate(`/patients/${c.patientId}`)}
        >
          <User size={15} />
          View Patient Profile
        </button>
      </div>
    </div>
  );
};

export default ConsultationDetail;

