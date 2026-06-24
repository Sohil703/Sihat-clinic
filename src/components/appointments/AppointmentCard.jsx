import React from 'react';
import { Clock, User, Phone, CheckCircle, XCircle, Stethoscope } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../../hooks/useStore.jsx';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  upcoming: { label: 'Upcoming', className: 'badge-primary' },
  completed: { label: 'Completed', className: 'badge-success' },
  cancelled: { label: 'Cancelled', className: 'badge-danger' },
};

const AppointmentCard = ({ appointment, showActions = false, compact = false }) => {
  const { updateAppointmentStatus } = useStore();
  const navigate = useNavigate();
  const status = statusConfig[appointment.status] || statusConfig.upcoming;

  const patientInitials = appointment.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: appointment.doctorId === 'dr-raiyan' ?
            'linear-gradient(135deg, #0F766E, #14B8A6)' :
            'linear-gradient(135deg, #3B82F6, #60A5FA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 15,
        }}>
          {patientInitials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }} className="truncate">
              {appointment.patientName}
            </div>
            <span className={`badge ${status.className}`} style={{ flexShrink: 0, marginLeft: 8 }}>
              {status.label}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                {appointment.time}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {appointment.doctorName}
              </span>
            </div>
          </div>

          {appointment.reason && !compact && (
            <div style={{
              marginTop: 8, padding: '6px 10px',
              background: 'var(--bg)', borderRadius: 8,
              fontSize: 12, color: 'var(--text-secondary)',
            }}>
              {appointment.reason}
            </div>
          )}
        </div>
      </div>

      {showActions && appointment.status === 'upcoming' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
          <button
            className="btn btn-sm"
            style={{ flex: 1, background: 'var(--primary-bg)', color: 'var(--primary)', border: 'none' }}
            onClick={() => navigate(`/consultation/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}`)}
          >
            <Stethoscope size={13} />
            Consult
          </button>
          <button
            className="btn btn-sm btn-success"
            style={{ flex: 1 }}
            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
          >
            <CheckCircle size={13} />
            Done
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
          >
            <XCircle size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;

