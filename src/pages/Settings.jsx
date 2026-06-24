import React, { useRef } from 'react';
import {
  Moon, Sun, Download, Upload, Trash2, Info,
  ChevronRight, Shield, Heart, Users, Stethoscope
} from 'lucide-react';
import { useStore } from '../hooks/useStore.jsx';
import Header from '../components/layout/Header.jsx';
import { exportData, importData } from '../services/storage.js';

const Settings = () => {
  const { patients, appointments, consultations, reports, followups, settings, toggleDarkMode, showToast, refresh } = useStore();
  const importRef = useRef();

  const handleExport = () => {
    exportData();
    showToast('Data exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importData(ev.target.result);
      if (ok) {
        refresh();
        showToast('Data imported successfully');
      } else {
        showToast('Import failed — invalid file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (!window.confirm('This will delete ALL patient data. This cannot be undone. Are you sure?')) return;
    ['sihat_patients', 'sihat_appointments', 'sihat_consultations', 'sihat_reports', 'sihat_followups'].forEach(k => localStorage.removeItem(k));
    refresh();
    showToast('All data cleared', 'warning');
  };

  const SettingRow = ({ icon, label, desc, right, onClick, danger }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: danger ? '#FEE2E2' : 'var(--primary-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { size: 17, color: danger ? 'var(--danger)' : 'var(--primary)' })}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{desc}</div>}
      </div>
      {right || (onClick && <ChevronRight size={16} color="var(--text-muted)" />)}
    </div>
  );

  return (
    <div className="page page-enter">
      <Header title="Settings" />

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Clinic Info */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          borderRadius: 20, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 22,
            }}>
              S
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Sihat Clinic</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Healthcare Management System</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {[
              { label: 'Patients', value: patients.length, icon: <Users size={12} /> },
              { label: 'Appointments', value: appointments.length, icon: <Stethoscope size={12} /> },
              { label: 'Reports', value: reports.length, icon: <Heart size={12} /> },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: 'rgba(255,255,255,0.18)',
                padding: '8px 4px', borderRadius: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Appearance
          </div>
          <SettingRow
            icon={settings.darkMode ? <Moon /> : <Sun />}
            label="Dark Mode"
            desc={settings.darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
            right={
              <div
                onClick={toggleDarkMode}
                style={{
                  width: 46, height: 26, borderRadius: 13,
                  background: settings.darkMode ? 'var(--primary)' : 'var(--border)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: settings.darkMode ? 23 : 3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
            }
          />
        </div>

        {/* Data Management */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Data Management
          </div>
          <SettingRow
            icon={<Download />}
            label="Export Data"
            desc="Download all clinic data as JSON backup"
            onClick={handleExport}
          />
          <SettingRow
            icon={<Upload />}
            label="Import Backup"
            desc="Restore data from a JSON backup file"
            onClick={() => importRef.current?.click()}
          />
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          <div style={{ borderBottom: 'none' }}>
            <SettingRow
              icon={<Trash2 />}
              label="Clear All Data"
              desc="Permanently delete all clinic data"
              onClick={handleClearAll}
              danger
            />
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            About
          </div>
          <SettingRow
            icon={<Info />}
            label="Sihat Clinic HMS v1.0"
            desc="Mobile-first hospital management system"
          />
          <div style={{ padding: '8px 16px 14px' }}>
            <div style={{
              background: 'var(--bg)', borderRadius: 10, padding: 12,
              fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
            }}>
              💾 All data is stored locally on this device using browser storage. No internet connection required.
              <br /><br />
              🔒 Your patient data never leaves your device.
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Doctors on Staff
          </div>
          {[
            { name: 'Dr. Raiyan', specialty: 'Chronic Disease & Pain Management', color: '#0F766E' },
            { name: 'Dr. Fahim', specialty: 'Face & Hair Treatment', color: '#3B82F6' },
          ].map((doc, i) => (
            <div key={doc.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderBottom: i === 0 ? '1px solid var(--border-light)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 13,
              }}>
                {doc.name.split(' ')[1][0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.specialty}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

export default Settings;

