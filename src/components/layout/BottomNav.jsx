import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Clock, Settings } from 'lucide-react';
import { useStore } from '../../hooks/useStore.jsx';
import { format } from 'date-fns';

const tabs = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/appointments', label: 'Schedule', icon: CalendarDays },
  { path: '/today', label: 'Today', icon: Clock },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointments } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCount = appointments.filter(a => a.date === today && a.status === 'upcoming').length;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      height: 'var(--nav-height)',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
      zIndex: 500,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
    }}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = isActive(path);
        const isTodayTab = path === '/today';
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              height: 56,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 12,
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            {active && (
              <span style={{
                position: 'absolute',
                top: 8,
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'var(--primary-bg)',
              }} />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              <Icon
                size={20}
                color={active ? 'var(--primary)' : 'var(--text-muted)'}
                strokeWidth={active ? 2.2 : 1.8}
              />
            </span>
            {isTodayTab && todayCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 6, right: '50%',
                transform: 'translateX(8px)',
                background: 'var(--danger)',
                color: 'white',
                width: 16, height: 16,
                borderRadius: '50%',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--surface)',
                zIndex: 2,
              }}>
                {todayCount}
              </span>
            )}
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '0.01em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

