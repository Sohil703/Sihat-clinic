import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users, Filter, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import PatientCard from '../components/patients/PatientCard.jsx';

const Patients = () => {
  const navigate = useNavigate();
  const { patients } = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...patients];
    if (filter !== 'all') list = list.filter(p => p.doctorId === filter);
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(lq) ||
        p.mobile.includes(q) ||
        p.patientId?.toLowerCase().includes(lq)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [patients, q, filter]);

  return (
    <div className="page page-enter">
      <Header title="Patients" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Search */}
        <div className="search-bar">
          <Search size={17} color="var(--text-muted)" />
          <input
            placeholder="Search by name, mobile, ID..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          {q && (
            <button
              onClick={() => setQ('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { value: 'all', label: `All (${patients.length})` },
            { value: 'dr-raiyan', label: 'Dr. Raiyan' },
            { value: 'dr-fahim', label: 'Dr. Fahim' },
          ].map(f => (
            <span
              key={f.value}
              className={`chip ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
              style={{ flexShrink: 0 }}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* Count */}
        {q && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{q}"
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Users size={28} /></div>
            <div className="empty-title">{q ? 'No patients found' : 'No patients yet'}</div>
            <div className="empty-desc">
              {q ? `Try a different search term` : 'Add your first patient to get started'}
            </div>
            {!q && (
              <button className="btn btn-primary mt-4" onClick={() => navigate('/patients/new')}>
                <UserPlus size={16} />
                Add Patient
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => <PatientCard key={p.id} patient={p} />)}
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      <button className="fab" onClick={() => navigate('/patients/new')}>
        <UserPlus size={22} />
      </button>
    </div>
  );
};

export default Patients;

