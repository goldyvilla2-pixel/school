import React from 'react';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';

const TRANSACTION_DATA = [
  { id: 'T1', student: 'John Doe', type: 'Tuition Fee', amount: 1200, status: 'Paid', date: '2024-03-10' },
  { id: 'T2', student: 'Jane Smith', type: 'Library Fee', amount: 50, status: 'Paid', date: '2024-03-12' },
  { id: 'T3', student: 'Michael Brown', type: 'Tuition Fee', amount: 1200, status: 'Overdue', date: '2024-03-01' },
  { id: 'T4', student: 'Sarah Wilson', type: 'Lab Fee', amount: 200, status: 'Pending', date: '2024-03-15' },
];

const FeesDashboard: React.FC = () => {
  return (
    <div className="fade-in">
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Collected</h4>
            <p>$45,200</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Outstanding Fees</h4>
            <p>$12,850</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <h4>Pending Invoices</h4>
            <p>24</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="panel">
          <div className="panel-header">
            <h3>Fee Transactions</h3>
            <button style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={16} /> Create Invoice
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', color: '#64748b' }}>Transaction ID</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Student</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Category</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Amount</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Date</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTION_DATA.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{t.id}</td>
                  <td style={{ padding: '1rem' }}>{t.student}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{t.type}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>${t.amount}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: t.status === 'Paid' ? '#16a34a' : t.status === 'Overdue' ? '#dc2626' : '#ca8a04', fontWeight: 600, fontSize: '0.875rem' }}>
                      {t.status === 'Paid' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {t.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesDashboard;
