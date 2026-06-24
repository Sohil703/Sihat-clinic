import React from 'react';

const StatCard = ({ icon, label, value, color = 'var(--primary)', bg, onClick, trend }) => {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        padding: 16,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseDown={e => onClick && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => onClick && (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={e => onClick && (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={e => onClick && (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 13,
          background: bg || `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { size: 21, color })}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            {value}
          </div>
          {trend !== undefined && (
            <div style={{ fontSize: 11, color: trend >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 2 }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)} this week
            </div>
          )}
        </div>
      </div>
      <div style={{
        marginTop: 10,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-secondary)',
      }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
