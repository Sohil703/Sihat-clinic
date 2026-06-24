import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ChevronRight, User } from 'lucide-react';

const colors = ['#0F766E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#22C55E'];

const getColor = (name) => colors[name.charCodeAt(0) % colors.length];

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  const color = getColor(patient.name);
  const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div
      className="card"
      style={{ padding: '14px 16px', cursor: 'pointer', transition: 'transform 0.15s' }}
      onClick={() => navigate(`/patients/${patient.id}`)}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="avatar" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }} className="truncate">
              {patient.name}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>
              {patient.patientId}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {patient.age}y • {patient.gender}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: patient.doctorId === 'dr-raiyan' ? 'var(--primary)' : 'var(--secondary)',
              background: patient.doctorId === 'dr-raiyan' ? 'var(--primary-bg)' : '#DBEAFE',
              padding: '2px 8px', borderRadius: 99,
            }} className="truncate">
              {patient.doctorName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Phone size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.mobile}</span>
          </div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
      </div>
    </div>
  );
};

export default PatientCard;
