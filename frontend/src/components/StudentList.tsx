import React from 'react';
import { Mail, Phone, MoreVertical, CreditCard } from 'lucide-react';

interface StudentListProps {
  viewMode: 'kanban' | 'list' | 'form';
}

const students = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', gr_no: 'GR-2024-001', course: 'Computer Science', active: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', gr_no: 'GR-2024-002', course: 'Business Admin', active: true },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '+91 9876543212', gr_no: 'GR-2024-003', course: 'Physics', active: true },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 9876543213', gr_no: 'GR-2024-004', course: 'Fine Arts', active: false },
];

const StudentList: React.FC<StudentListProps> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <table className="odoo-list-view">
        <thead>
          <tr>
            <th style={{ width: '40px' }}><input type="checkbox" /></th>
            <th>Name</th>
            <th>GR Number</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {students.map(st => (
            <tr key={st.id}>
              <td><input type="checkbox" /></td>
              <td style={{ fontWeight: 600, color: '#111' }}>{st.name}</td>
              <td style={{ color: 'var(--odoo-purple)' }}>{st.gr_no}</td>
              <td>{st.email}</td>
              <td>{st.phone}</td>
              <td>{st.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (viewMode === 'form') {
    return (
      <div className="odoo-form-sheet">
        <div className="oe_title">
          <h1>New Student</h1>
        </div>
        <div className="odoo-group">
          <div className="group-col">
            <div className="odoo-field-row">
              <span className="field-label">Name</span>
              <input type="text" className="field-value" placeholder="e.g. Brandon Freeman" style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }} />
            </div>
            <div className="odoo-field-row">
              <span className="field-label">GR Number</span>
              <input type="text" className="field-value" style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }} />
            </div>
          </div>
          <div className="group-col">
            <div className="odoo-field-row">
              <span className="field-label">Email</span>
              <input type="email" className="field-value" style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }} />
            </div>
            <div className="odoo-field-row">
              <span className="field-label">Phone</span>
              <input type="tel" className="field-value" style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: '32px', borderBottom: '1px solid #dee2e6' }}>
          <div style={{ padding: '8px 16px', borderBottom: '2px solid var(--odoo-purple)', display: 'inline-block', fontWeight: 600 }}>Other Information</div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div className="odoo-field-row">
            <span className="field-label">Course</span>
            <select className="field-value" style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}>
              <option>Computer Science</option>
              <option>Business Admin</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="odoo-kanban-container">
      {students.map(st => (
        <div key={st.id} className="odoo-kanban-card" style={{ flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="kanban-image" style={{ width: '80px', height: '80px' }}>
               <img src={`https://ui-avatars.com/api/?name=${st.name}&background=random`} alt={st.name} />
            </div>
            <div className="kanban-details">
              <div className="kanban-name" style={{ fontSize: '14px' }}>{st.name}</div>
              <div className="kanban-subtext">
                <Mail size={14} style={{ color: 'var(--odoo-purple)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.email}</span>
              </div>
              <div className="kanban-subtext">
                <Phone size={14} style={{ color: 'var(--odoo-purple)' }} />
                {st.phone}
              </div>
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#999', fontWeight: 800 }}>
                {st.gr_no}
              </div>
            </div>
          </div>
          
          {/* INTERCONNECTIVITY LINK */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="odoo-btn btn-secondary" 
              style={{ width: '100%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <CreditCard size={14} /> VIEW FEES
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default StudentList;
