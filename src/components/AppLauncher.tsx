import React from 'react';
import { useAuth } from '../context/AuthContext';

interface AppLauncherProps {
  onSelect: (id: string) => void;
}

const APPS = [
  { id: 'dashboard', name: 'OVERVIEW', color: '#4f46e5' },
  { id: 'students', name: 'STUDENTS', color: '#875A7B' },
  { id: 'faculty', name: 'FACULTY', color: '#10b981' },
  { id: 'courses', name: 'COURSES', color: '#f59e0b' },
  { id: 'fees', name: 'FEES', color: '#ef4444' },
  { id: 'admissions', name: 'ADMISSIONS', color: '#2563eb' },
  { id: 'attendance', name: 'ATTENDANCE', color: '#7c3aed' },
  { id: 'timetable', name: 'TIMETABLE', color: '#db2777' },
  { id: 'settings', name: 'SETTINGS', color: '#111827' },
];

const AppLauncher: React.FC<AppLauncherProps> = ({ onSelect }) => {
  const { canAccessModule } = useAuth();
  
  const visibleApps = APPS.filter(app => canAccessModule(app.id));

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '60px', color: '#111827' }}>
        OPENEDUCAT ERP SYSTEM
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '32px' 
      }}>
        {visibleApps.map((app) => (
          <div 
            key={app.id}
            onClick={() => onSelect(app.id)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '40px 20px',
              borderRadius: '28px',
              backgroundColor: 'white',
              cursor: 'pointer',
              border: '2px solid #f1f5f9'
            }}
          >
            <div style={{ 
              width: '85px', 
              height: '85px', 
              borderRadius: '22px', 
              backgroundColor: app.color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'white'
            }}>
              <span style={{ fontSize: '24px', fontWeight: 900 }}>{app.name[0]}</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155' }}>
              {app.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppLauncher;
