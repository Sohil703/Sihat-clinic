import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { useStore } from '../../hooks/useStore.jsx';
import { format } from 'date-fns';

const Header = ({ title, showBack = false, rightAction, transparent = false }) => {
  const navigate = useNavigate();
  const { appointments } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCount = appointments.filter(a => a.date === today && a.status === 'upcoming').length;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 500,
      background: transparent ? 'transparent' : 'var(--surface)',
      borderBottom: transparent ? 'none' : '1px solid var(--border-light)',
      backdropFilter: transparent ? 'none' : 'blur(12px)',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
    }}>
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="var(--text-primary)" />
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>S</span>
          </div>
        </div>
      )}

      <h1 style={{
        flex: 1,
        fontSize: showBack ? 17 : 18,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>

      {rightAction || (
        !showBack && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate('/search')}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Search size={17} color="var(--text-secondary)" />
            </button>
            <button
              onClick={() => navigate('/notifications')}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: todayCount > 0 ? 'var(--primary-bg)' : 'var(--bg)',
                border: todayCount > 0 ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}
            >
              <Bell size={17} color={todayCount > 0 ? 'var(--primary)' : 'var(--text-secondary)'} />
              {todayCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--danger)', color: 'white',
                  width: 17, height: 17, borderRadius: '50%',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--surface)',
                }}>
                  {todayCount}
                </span>
              )}
            </button>
          </div>
        )
      )}
    </header>
  );
};

export default Header;

