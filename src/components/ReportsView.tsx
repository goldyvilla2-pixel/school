import React from 'react';
import { BarChart, PieChart, LineChart, Download, FileText } from 'lucide-react';

const ReportsView: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <div className="odoo-group">
                <div className="panel" style={{ padding: '30px', background: 'white', borderRadius: '12px', border: '1px solid #dee2e6' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--odoo-purple)', paddingBottom: '10px' }}>
                        ACADEMIC PERFORMANCE REPORT
                    </h2>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', height: '200px', background: '#f8f9fa', justifyContent: 'center', border: '1px dashed #ccc' }}>
                        <BarChart size={48} color="var(--odoo-purple)" />
                        <span style={{ fontWeight: 800 }}>GROWTH ANALYTICS VISUALIZATION</span>
                    </div>
                </div>

                <div className="panel" style={{ padding: '30px', background: 'white', borderRadius: '12px', border: '1px solid #dee2e6' }}>
                    <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--odoo-purple)', paddingBottom: '10px' }}>
                        FINANCIAL REVENUE SUMMARY
                    </h2>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', height: '200px', background: '#f8f9fa', justifyContent: 'center', border: '1px dashed #ccc' }}>
                        <PieChart size={48} color="#ef4444" />
                        <span style={{ fontWeight: 800 }}>FEE COLLECTION DISTRIBUTION</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ marginBottom: '15px' }}>AVAILABLE DOWNLOADS</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {[
                        'STUDENT ATTENDANCE RECORD',
                        'FACULTY PAYROLL SUMMARY',
                        'ANNUAL EXAMINATION RESULTS',
                        'COLLECTION SETTLEMENT REPORT'
                    ].map(report => (
                        <div key={report} style={{ 
                            padding: '20px', 
                            background: 'white', 
                            border: '1px solid #eee', 
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileText size={20} color="#666" />
                                <span style={{ fontSize: '11px', fontWeight: 800 }}>{report}</span>
                            </div>
                            <button className="odoo-btn btn-secondary">
                                <Download size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
