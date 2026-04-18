import React, { useState, createContext, useContext, useEffect } from 'react';

// --- TYPES ---
type Role = 'SUPER_ADMIN' | 'SUPER_SUB_ADMIN' | 'ADMIN' | 'ACCOUNTING' | 'COORDINATOR';
type School = 'NORTH CAMPUS' | 'SOUTH CAMPUS' | 'EAST CAMPUS' | 'WEST CAMPUS';

interface User {
  username: string;
  role: Role;
  assignedSchool: School | 'ALL';
}

interface FeeStructure {
    className: string;
    tuition: number;
    admission: number;
    books: number;
    van: number;
}

interface DynamicField {
    id: string;
    name: string;
    type: string;
    module: string;
}

interface Student {
    id: string;
    name: string;
    class: string;
    branch: School;
    phone: string;
    statsNumber: string;
    apaarNumber: string;
    dob: string;
    bloodGroup: string;
    fatherName: string;
    motherName: string;
    customData: { [key: string]: string };
}

interface AuthContextType {
  user: User;
  setUser: (u: User) => void;
  selectedSchool: School | 'ALL';
  setSelectedSchool: (s: School | 'ALL') => void;
  canEdit: () => boolean;
  canAccessModule: (id: string) => boolean;
  feesMaster: FeeStructure[];
  updateFeesMaster: (fees: FeeStructure[]) => void;
  students: Student[];
  setStudents: (s: Student[]) => void;
  dynamicFields: DynamicField[];
  setDynamicFields: (f: DynamicField[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- SAFE ICONS ---
const Icon = ({ name, size = 24, style = {} }: { name: string, size?: number, style?: any }) => {
  const icons: Record<string, JSX.Element> = {
    grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    cap: <><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    card: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    userplus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></>,
    check: <><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    layers: <><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    dashboard: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

// --- MOCK DATA ---
const CLASS_LIST = ['GRADE 1', 'GRADE 2', 'GRADE 3', 'GRADE 4', 'GRADE 5'];
const BRANCH_LIST: School[] = ['NORTH CAMPUS', 'SOUTH CAMPUS', 'EAST CAMPUS', 'WEST CAMPUS'];
const APPS = [
  { id: 'dashboard', name: 'DASHBOARD', icon: 'dashboard', color: '#6366f1' },
  { id: 'students', name: 'STUDENTS', icon: 'users', color: '#875A7B' },
  { id: 'faculty', name: 'FACULTY', icon: 'cap', color: '#10b981' },
  { id: 'academic', name: 'ACADEMIC', icon: 'layers', color: '#7c3aed' },
  { id: 'courses', name: 'COURSES', icon: 'book', color: '#f59e0b' },
  { id: 'fees', name: 'FEES', icon: 'card', color: '#ef4444' },
  { id: 'admissions', name: 'ADMISSIONS', icon: 'userplus', color: '#2563eb' },
  { id: 'attendance', name: 'ATTENDANCE', icon: 'check', color: '#f97316' },
  { id: 'reports', name: 'REPORTS', icon: 'chart', color: '#334155' },
  { id: 'settings', name: 'SETTINGS', icon: 'settings', color: '#111827' },
];

// --- STUDENT REGISTRY ---
const StudentForm: React.FC<{ student?: Student | null, onSave: (s: Student) => void, onCancel: () => void }> = ({ student, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Student>>(student || {
        name: '', phone: '', statsNumber: '', apaarNumber: '', dob: '', bloodGroup: 'A+', fatherName: '', motherName: '',
        class: 'GRADE 1', branch: 'NORTH CAMPUS', customData: {}
    });

    return (
        <div style={{ padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #dee2e6', maxWidth: '900px', margin: '40px auto' }}>
            <h2 style={{ marginBottom: '30px', fontWeight: 900 }}>{student ? 'UPDATE PROFILE' : 'ENROLL NEW STUDENT'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800 }}>FULL NAME</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/>
                </div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>PHONE</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>STATS NO.</label><input type="text" value={formData.statsNumber} onChange={(e) => setFormData({...formData, statsNumber: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>APAAR NO.</label><input type="text" value={formData.apaarNumber} onChange={(e) => setFormData({...formData, apaarNumber: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>DOB</label><input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>BLOOD</label><select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}>{['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                <div><label style={{ fontSize: '10px', fontWeight: 800 }}>CLASS</label><select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}>{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div style={{ gridColumn: 'span 1.5' }}><label style={{ fontSize: '10px', fontWeight: 800 }}>FATHER NAME</label><input type="text" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
                <div style={{ gridColumn: 'span 1.5' }}><label style={{ fontSize: '10px', fontWeight: 800 }}>MOTHER NAME</label><input type="text" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/></div>
            </div>
            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                <button onClick={() => onSave(formData as Student)} className="odoo-btn btn-primary" style={{ padding: '12px 40px' }}>SAVE RECORD</button>
                <button onClick={onCancel} className="odoo-btn btn-secondary">DISCARD</button>
            </div>
        </div>
    );
};

const StudentView: React.FC = () => {
    const { students, setStudents, selectedSchool } = useContext(AuthContext)!;
    const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [classFilter, setClassFilter] = useState('ALL');

    const filtered = (students || []).filter(s => {
        const matchesSchool = selectedSchool === 'ALL' || s.branch === selectedSchool;
        const matchesClass = classFilter === 'ALL' || s.class === classFilter;
        const query = searchQuery.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(query) || s.phone.includes(query) || s.statsNumber.toLowerCase().includes(query) || s.apaarNumber.toLowerCase().includes(query);
        return matchesSchool && matchesClass && matchesSearch;
    });

    if (viewMode === 'FORM') {
        return <StudentForm student={editingStudent} onCancel={() => setViewMode('LIST')} onSave={(s) => {
            if(editingStudent) { setStudents(students.map(i => i.id === editingStudent.id ? s : i)); }
            else { setStudents([...students, {...s, id: Date.now().toString(), branch: selectedSchool === 'ALL' ? 'NORTH CAMPUS' : selectedSchool}]); }
            setViewMode('LIST'); setEditingStudent(null);
        }} />;
    }

    return (
        <div style={{ padding: '30px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 900 }}>STUDENT REGISTRY</h1>
                <button onClick={() => {setEditingStudent(null); setViewMode('FORM');}} className="odoo-btn btn-primary">ADD NEW STUDENT</button>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <input type="text" placeholder="SEARCH (NAME, PHONE, STATS, APAAR)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}/>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 800 }}>
                    <option value="ALL">ALL CLASSES</option>{CLASS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                <thead>
                    <tr style={{ background: '#111827', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>NAME</th><th style={{ padding: '15px' }}>CLASS</th><th style={{ padding: '15px' }}>STATS NO.</th><th style={{ padding: '15px' }}>DOB</th><th style={{ padding: '15px' }}>BLOOD</th><th style={{ padding: '15px' }}>FATHER</th><th style={{ padding: '15px' }}>MOTHER</th><th style={{ padding: '15px' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px', fontWeight: 900 }}>{s.name}</td>
                            <td style={{ padding: '15px', color: '#875A7B' }}>{s.class}</td>
                            <td style={{ padding: '15px' }}>{s.statsNumber}</td>
                            <td style={{ padding: '15px' }}>{s.dob}</td>
                            <td style={{ padding: '15px' }}>{s.bloodGroup}</td>
                            <td style={{ padding: '15px' }}>{s.fatherName}</td>
                            <td style={{ padding: '15px' }}>{s.motherName}</td>
                            <td style={{ padding: '15px' }}>
                                <button onClick={() => {setEditingStudent(s); setViewMode('FORM');}} style={{ background:'none', border:'none', cursor:'pointer', color:'#875A7B' }}><Icon name="edit" size={16}/></button>
                                <button onClick={() => setStudents(students.filter(i => i.id !== s.id))} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', marginLeft:'10px' }}><Icon name="trash" size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- SETTINGS MODULE ---
const ModuleConfigView: React.FC = () => {
    const { feesMaster, updateFeesMaster } = useContext(AuthContext)!;
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    if (!selectedModule) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {APPS.filter(a => a.id !== 'settings' && a.id !== 'dashboard').map(app => (
                    <div key={app.id} onClick={() => setSelectedModule(app.id)} style={{ padding: '20px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name={app.icon} size={20} /></div>
                        <span style={{ fontWeight: 800, fontSize: '11px' }}>{app.name}</span>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => setSelectedModule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="chevronLeft" size={20} /></button>
                <h3 style={{ fontWeight: 900, fontSize: '14px' }}>MANAGING: {selectedModule.toUpperCase()}</h3>
            </div>
            {selectedModule === 'fees' && (
                <div style={{ padding: '30px' }}>
                    {feesMaster.map((f, idx) => (
                        <div key={idx} style={{ background: '#fcfcfc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                            <div style={{ fontWeight: 900, marginBottom: '15px' }}>{f.className} FEES (INR)</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                {['tuition', 'admission', 'books', 'van'].map(type => (
                                    <div key={type}>
                                        <label style={{ fontSize: '9px', fontWeight: 800, color: '#64748b' }}>{type.toUpperCase()}</label>
                                        <input type="number" value={(f as any)[type]} onChange={(e) => updateFeesMaster(feesMaster.map(item => item.className === f.className ? { ...item, [type]: Number(e.target.value) } : item))} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ddd', fontWeight: 800 }}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- MAIN APP ---
const AppInner: React.FC = () => {
    const { user } = useContext(AuthContext)!;
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const renderView = () => {
        if (!activeModule) return (
            <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '60px', fontWeight: 900, fontSize: '32px' }}>OPENEDUCAT ERP</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
                    {APPS.map(app => (
                        <div key={app.id} onClick={() => setActiveModule(app.id)} style={{ padding: '40px 20px', borderRadius: '28px', backgroundColor: 'white', cursor: 'pointer', border: '2px solid #f1f5f9', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ width: '85px', height: '85px', borderRadius: '22px', backgroundColor: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name={app.icon} size={40} /></div>
                            <span style={{ fontWeight: 900, fontSize: '11px', mt: '20px', marginTop: '20px', display: 'block' }}>{app.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
        if (activeModule === 'students') return <StudentView />;
        if (activeModule === 'settings') return <div style={{ padding: '30px' }}><ModuleConfigView/></div>;
        return <div style={{ padding: '100px', textAlign: 'center' }}><h1 style={{ fontWeight: 900 }}>{activeModule.toUpperCase()}</h1><button onClick={() => setActiveModule(null)} className="odoo-btn btn-primary" style={{ mt: '20px' }}>BACK</button></div>;
    };

    return (
        <div className="odoo-web-client" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <nav className="odoo-navbar" style={{ background: activeModule ? '#875A7B' : '#111827' }}>
                <div className="odoo-navbar-left">
                    <div className="odoo-menu-item" onClick={() => setActiveModule(null)}><Icon name="grid" size={18} /></div>
                    <div className="odoo-brand" onClick={() => setActiveModule(null)}>OPENEDUCAT ERP</div>
                </div>
                <div className="odoo-navbar-right" style={{ paddingRight: '20px', color: 'white', fontSize: '10px', fontWeight: 900 }}>{user.username}</div>
            </nav>
            <main style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                {renderView()}
            </main>
        </div>
    );
};

export const App: React.FC = () => {
    const getSaved = (k: string, d: any) => { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; };
    const [user] = useState<User>({ username: 'ADMINISTRATOR', role: 'SUPER_ADMIN', assignedSchool: 'ALL' });
    const [selectedSchool, setSelectedSchool] = useState<School | 'ALL'>('ALL');
    const [students, setStudents] = useState<Student[]>(() => getSaved('erp_students_v3', []));
    const [feesMaster, setFeesMaster] = useState<FeeStructure[]>(() => getSaved('erp_fees_v3', CLASS_LIST.map(c => ({ className: c, tuition: 45000, admission: 0, books: 3500, van: 12000 }))));
    const [dynamicFields, setDynamicFields] = useState<DynamicField[]>(() => getSaved('erp_fields_v3', []));

    useEffect(() => { localStorage.setItem('erp_students_v3', JSON.stringify(students)); }, [students]);
    useEffect(() => { localStorage.setItem('erp_fees_v3', JSON.stringify(feesMaster)); }, [feesMaster]);
    useEffect(() => { localStorage.setItem('erp_fields_v3', JSON.stringify(dynamicFields)); }, [dynamicFields]);

    return (
        <AuthContext.Provider value={{ user, setUser: () => {}, selectedSchool, setSelectedSchool, canEdit: () => true, canAccessModule: () => true, feesMaster, updateFeesMaster: setFeesMaster, students, setStudents, dynamicFields, setDynamicFields }}>
            <AppInner />
        </AuthContext.Provider>
    );
};

export default App;
