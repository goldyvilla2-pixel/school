import React, { useState, createContext, useContext, useEffect } from 'react';

// --- TYPES ---
type FieldType = 'TEXT' | 'NUMBER' | 'DROPDOWN' | 'CHECKBOX' | 'DATE';

interface GlobalList {
    id: string;
    name: string;
    items: string[];
}

interface DynamicField {
    id: string;
    label: string;
    type: FieldType;
    module: string;
    formType: string;
    globalListId?: string;
    required: boolean;
}

interface GenericRecord {
    id: string;
    module: string;
    customData: { [key: string]: any };
}

interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    className: string;
}

interface AuthContextType {
  records: GenericRecord[];
  setRecords: (r: GenericRecord[]) => void;
  dynamicFields: DynamicField[];
  setDynamicFields: (f: DynamicField[]) => void;
  globalLists: GlobalList[];
  setGlobalLists: (l: GlobalList[]) => void;
  attendance: AttendanceRecord[];
  setAttendance: (a: AttendanceRecord[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- SAFE ICONS ---
const Icon = ({ name, size = 24, style = {} }: { name: string, size?: number, style?: any }) => {
  const icons: Record<string, JSX.Element> = {
    grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    layers: <><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    finance: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01M12 15h.01M17 15h.01"/></>,
    check: <><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

const APPS = [
  { id: 'dashboard', name: 'DASHBOARD', icon: 'grid', color: '#111827', addText: 'NEW ENTRY' },
  { id: 'students', name: 'STUDENTS', icon: 'users', color: '#875A7B', addText: 'ADD NEW STUDENT' },
  { id: 'faculty', name: 'FACULTY', icon: 'user', color: '#10b981', addText: 'ADD NEW FACULTY' },
  { id: 'academic', name: 'ACADEMIC', icon: 'layers', color: '#7c3aed', addText: 'NEW ACADEMIC ENTRY' },
  { id: 'courses', name: 'book', icon: 'book', color: '#f59e0b', addText: 'CREATE NEW COURSE' },
  { id: 'fees', name: 'FEES', icon: 'finance', color: '#ef4444', addText: 'COLLECT NEW FEES' },
  { id: 'admissions', name: 'ADMISSIONS', icon: 'plus', color: '#2563eb', addText: 'NEW ADMISSION' },
  { id: 'attendance', name: 'ATTENDANCE', icon: 'check', color: '#f97316', addText: 'MARK ATTENDANCE' },
  { id: 'reports', name: 'REPORTS', icon: 'chart', color: '#334155', addText: 'CREATE NEW REPORT' },
  { id: 'settings', name: 'SETTINGS', icon: 'settings', color: '#64748b', addText: 'CONFIG' },
];

const FORM_TYPES = ['PERSONAL INFO', 'FINANCIAL', 'ACADEMIC', 'COMPLAINTS'];

// --- SETTINGS ---
const SettingsView: React.FC = () => {
    const { dynamicFields, setDynamicFields, globalLists, setGlobalLists } = useContext(AuthContext)!;
    const [tab, setTab] = useState<'FIELDS' | 'LISTS'>('FIELDS');
    const [mod, setMod] = useState<string | null>(null);
    const [activeT, setActiveT] = useState(FORM_TYPES[0]);
    const [newF, setNewF] = useState<Partial<DynamicField>>({ label: '', type: 'TEXT', required: false, globalListId: '' });
    const [newLN, setNewLN] = useState('');
    const [newLI, setNewLI] = useState('');

    if (tab === 'LISTS') {
        return (
            <div style={{ padding: '40px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'20px', mb:'40px' }}><button onClick={() => setTab('FIELDS')} style={{ border:'none', background:'none', cursor:'pointer' }}><Icon name="chevronLeft" size={28}/></button><h2 style={{ fontWeight: 950 }}>MASTER DATA LISTS</h2></div>
                <div style={{ background: '#f9fafb', padding: '35px', borderRadius: '24px', border: '1.5px solid #eee', mb: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 150px', gap: '20px', alignItems: 'end' }}>
                        <div><label style={{ fontSize:'10px', fontWeight:950 }}>LIST NAME</label><input value={newLN} onChange={e => setNewLN(e.target.value.toUpperCase())} style={{ width:'100%', padding:'12px', borderRadius:'12px', border:'1.5px solid #ddd', fontWeight:900 }}/></div>
                        <div><label style={{ fontSize:'10px', fontWeight:950 }}>ITEMS (CSV)</label><input value={newLI} onChange={e => setNewLI(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:'12px', border:'1.5px solid #ddd', fontWeight:900 }}/></div>
                        <button onClick={() => { if(newLN) { setGlobalLists([...globalLists, {id: Date.now().toString(), name: newLN, items: newLI.split(',').map(s => s.trim().toUpperCase())}]); setNewLN(''); setNewLI(''); }}} className="odoo-btn btn-primary" style={{ padding:'15px' }}>SAVE LIST</button>
                    </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px' }}>
                    {globalLists.map(l => (
                        <div key={l.id} style={{ padding:'30px', background:'white', borderRadius:'24px', border:'1.5px solid #f1f5f9' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', mb:'15px' }}><h5 style={{ fontWeight:950 }}>{l.name}</h5><button onClick={() => setGlobalLists(globalLists.filter(i => i.id !== l.id))} style={{ color: '#ef4444', border:'none', background:'none', cursor:'pointer' }}><Icon name="trash" size={16}/></button></div>
                            <select style={{ width:'100%', padding:'10px', borderRadius:'10px', border:'1px solid #eee', fontWeight:800 }}>{l.items.map(o => <option key={o}>{o}</option>)}</select>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!mod) return (
        <div style={{ padding: '60px' }}>
            <h1 style={{ fontWeight: 950, marginBottom: '50px' }}>SYSTEM SETTINGS</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                {APPS.filter(a => a.id !== 'dashboard' && a.id !== 'settings').map(app => (
                    <div key={app.id} onClick={() => setMod(app.id)} style={{ padding: '35px', background: 'white', borderRadius: '35px', border: '2px solid #f1f5f9', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: app.color, margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name={app.icon} size={32}/></div>
                        <span style={{ fontWeight: 950 }}>{app.name}</span>
                    </div>
                ))}
                <div onClick={() => setTab('LISTS')} style={{ padding:'35px', background:'#111827', borderRadius:'35px', cursor:'pointer', textAlign:'center', color:'white' }}>
                    <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'#374151', margin:'0 auto 25px', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="layers" size={32}/></div>
                    <span style={{ fontWeight: 950 }}>MASTER DROPDOWNS</span>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ background: 'white', borderRadius: '35px', border: '2px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '25px 40px', background: '#f8fafc', display:'flex', alignItems:'center', gap:'20px' }}>
                    <button onClick={() => setMod(null)} style={{ border:'none', background:'none', cursor:'pointer' }}><Icon name="chevronLeft" size={24}/></button>
                    <h2 style={{ fontWeight: 950 }}>{mod.toUpperCase()} SCHEMA BUILDER</h2>
                </div>
                <div style={{ padding: '30px 40px', display: 'flex', gap: '15px' }}>{FORM_TYPES.map(t => (<button key={t} onClick={() => setActiveT(t)} style={{ padding: '10px 25px', borderRadius: '12px', border: 'none', background: activeT === t ? '#111827' : '#f9fafb', color: activeT === t ? 'white' : '#64748b', fontWeight: 950, cursor: 'pointer' }}>{t}</button>))}</div>
                <div style={{ padding: '40px' }}>
                    <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '24px', border: '1.5px solid #eee', mb: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 150px', gap: '15px', alignItems: 'end' }}>
                            <div><label style={{ fontSize: '10px', fontWeight: 950 }}>FIELD LABEL</label><input value={newF.label} onChange={e => setNewF({...newF, label: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}/></div>
                            <div><label style={{ fontSize: '10px', fontWeight: 950 }}>TYPE</label><select value={newF.type} onChange={e => setNewF({...newF, type: e.target.value as FieldType})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}><option value="TEXT">TEXT</option><option value="NUMBER">NUMBER</option><option value="DROPDOWN">DROPDOWN</option><option value="CHECKBOX">CHECKBOX</option><option value="DATE">DATE</option></select></div>
                            <div><label style={{ fontSize: '10px', fontWeight: 950 }}>MANDATORY?</label><select value={newF.required ? 'Y' : 'N'} onChange={e => setNewF({...newF, required: e.target.value === 'Y'})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}><option value="N">NO</option><option value="Y">YES</option></select></div>
                            {newF.type === 'DROPDOWN' && (<div><label style={{ fontSize: '10px', fontWeight: 950 }}>LINK LIST</label><select value={newF.globalListId} onChange={e => setNewF({...newF, globalListId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}><option value="">PICK LIST</option>{globalLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>)}
                            <button onClick={() => { if(newF.label) { setDynamicFields([...dynamicFields, {...newF, id: Date.now().toString(), module: mod, formType: activeT} as DynamicField]); setNewF({label:'', type:'TEXT', required:false, globalListId:''}); }}} className="odoo-btn btn-primary" style={{ padding:'15px' }}>ADD ELEMENT</button>
                        </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' }}>{dynamicFields.filter(f => f.module === mod && f.formType === activeT).map(f => (<div key={f.id} style={{ padding: '25px', background: 'white', borderRadius: '22px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><p style={{ fontWeight: 950 }}>{f.label}</p><p style={{ fontSize: '9px', fontWeight: 950, color: '#875A7B' }}>{f.type}</p></div><button onClick={() => setDynamicFields(dynamicFields.filter(i => i.id !== f.id))} style={{ color: '#ef4444', background:'none', border:'none', cursor:'pointer' }}><Icon name="trash" size={18}/></button></div>))}</div>
                </div>
            </div>
        </div>
    );
};

// --- ATTENDANCE MODULE ---
const AttendanceView: React.FC = () => {
    const { students, attendance, setAttendance, dynamicFields, globalLists } = useContext(AuthContext)!;
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Find "CLASS" dropdown from dynamic settings if exists
    const classField = dynamicFields.find(f => f.label.includes('CLASS') && f.module === 'students');
    const classList = globalLists.find(l => l.id === classField?.globalListId)?.items || [];

    const studentsInClass = students.filter(s => s.module === 'students' && (Object.values(s.customData).includes(selectedClass) || selectedClass === ''));

    const markAttendance = (sId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
        const existing = attendance.find(a => a.studentId === sId && a.date === date);
        if (existing) { setAttendance(attendance.map(a => a.id === existing.id ? { ...a, status } : a)); }
        else { setAttendance([...attendance, { id: Date.now().toString() + sId, studentId: sId, date, status, className: selectedClass }]); }
    };

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '45px', marginBottom:'40px' }}>
                <h1 style={{ fontWeight: 950 }}>ATTENDANCE REGISTRY</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '12px 20px', borderRadius: '14px', border: '2px solid #f1f5f9', fontWeight: 900 }} />
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '12px 20px', borderRadius: '14px', border: '2px solid #f1f5f9', fontWeight: 950 }}>
                        <option value="">ALL CLASSES</option>{classList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '32px', border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1.5px solid #f1f5f9' }}>
                        <tr><th style={{ padding: '20px', textAlign: 'left', fontWeight: 950 }}>STUDENT NAME</th><th style={{ padding: '20px', textAlign: 'center', fontWeight: 950 }}>PRESENT</th><th style={{ padding: '20px', textAlign: 'center', fontWeight: 950 }}>ABSENT</th><th style={{ padding: '20px', textAlign: 'center', fontWeight: 950 }}>LATE</th></tr>
                    </thead>
                    <tbody>
                        {studentsInClass.map(s => {
                            const att = attendance.find(a => a.studentId === s.id && a.date === date);
                            return (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '20px', fontWeight: 800 }}>{Object.values(s.customData)[0] || 'UNNAMED'}</td>
                                    <td style={{ textAlign: 'center' }}><button onClick={() => markAttendance(s.id, 'PRESENT')} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background: att?.status === 'PRESENT' ? '#10b981' : '#f3f4f6', color: att?.status === 'PRESENT' ? 'white' : '#64748b', fontWeight: 950, cursor:'pointer' }}>P</button></td>
                                    <td style={{ textAlign: 'center' }}><button onClick={() => markAttendance(s.id, 'ABSENT')} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background: att?.status === 'ABSENT' ? '#ef4444' : '#f3f4f6', color: att?.status === 'ABSENT' ? 'white' : '#64748b', fontWeight: 950, cursor:'pointer' }}>A</button></td>
                                    <td style={{ textAlign: 'center' }}><button onClick={() => markAttendance(s.id, 'LATE')} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background: att?.status === 'LATE' ? '#f59e0b' : '#f3f4f6', color: att?.status === 'LATE' ? 'white' : '#64748b', fontWeight: 950, cursor:'pointer' }}>L</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {studentsInClass.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontWeight: 800 }}>SELECT A CLASS TO BEGIN MARKING ATTENDANCE.</div>}
            </div>
        </div>
    );
};

// --- MODULE REGISTRY ---
const ModuleRegistry: React.FC<{ module: string }> = ({ module }) => {
    const { records, setRecords, dynamicFields, globalLists } = useContext(AuthContext)!;
    const [view, setView] = useState<'GRID' | 'PROFILE' | 'FORM'>('GRID');
    const [sel, setSel] = useState<GenericRecord | null>(null);
    const [activeT, setActiveT] = useState(FORM_TYPES[0]);
    const [search, setSearch] = useState('');
    
    const appInfo = APPS.find(a => a.id === module);
    const modFields = dynamicFields.filter(f => f.module === module);
    const filtered = records.filter(r => r.module === module && Object.values(r.customData).some(v => v?.toString().toLowerCase().includes(search.toLowerCase())));

    if (view === 'FORM') return (
        <div style={{ padding: '50px', background: 'white', borderRadius: '40px', maxWidth: '1000px', margin: '40px auto', border: '1.5px solid #f1f5f9' }}>
            <h2 style={{ fontWeight: 950, mb: '40px' }}>{appInfo?.addText}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                {modFields.map(f => (
                    <div key={f.id}>
                        <label style={{ fontSize:'11px', fontWeight:950 }}>{f.label} {f.required ? '*' : ''} ({f.formType})</label>
                        {f.type === 'TEXT' && <input defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'NUMBER' && <input type="number" defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'DROPDOWN' && (<select id={`f-${f.id}`} defaultValue={sel?.customData[f.id]} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #ddd', fontWeight: 900 }}><option value="">-- SELECT --</option>{globalLists.find(l => l.id === f.globalListId)?.items.map(o => <option key={o} value={o}>{o}</option>)}</select>)}
                        {f.type === 'DATE' && <input type="date" defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'CHECKBOX' && <div style={{ mt:'10px' }}><input type="checkbox" defaultChecked={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width:'24px', height:'24px' }}/></div>}
                    </div>
                ))}
            </div>
            <div style={{ mt:'60px', display:'flex', gap:'20px', marginTop:'40px' }}>
                <button onClick={() => {
                    const c: any = {}; let valid = true;
                    modFields.forEach(f => {
                        const el = document.getElementById(`f-${f.id}`) as any;
                        const val = f.type === 'CHECKBOX' ? el.checked : el.value;
                        if(f.required && !val) { valid = false; el.style.borderColor = 'red'; }
                        c[f.id] = val;
                    });
                    if(!valid) { alert('MANDATORY FIELDS MISSING'); return; }
                    const d = { id: sel?.id || Date.now().toString(), module, customData: c };
                    setRecords(sel ? records.map(i => i.id === sel.id ? d : i) : [...records, d]); setView('GRID');
                }} className="odoo-btn btn-primary" style={{ padding: '18px 60px' }}>SAVE RECORD</button><button onClick={() => setView('GRID')} className="odoo-btn btn-secondary">CANCEL</button>
            </div>
        </div>
    );

    if (view === 'PROFILE' && sel) return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', mb: '40px', marginBottom: '30px' }}>
                <button onClick={() => setView('GRID')} style={{ background:'none', border:'none', cursor:'pointer' }}><Icon name="chevronLeft" size={28}/></button>
                <div style={{ display: 'flex', gap:'15px' }}>
                    <button onClick={() => setView('FORM')} className="odoo-btn btn-secondary" style={{ display:'flex', alignItems:'center', gap:'10px' }}><Icon name="edit" size={18}/> EDIT</button>
                    <button onClick={() => { if(confirm('DELETE RECORD?')) { setRecords(records.filter(r => r.id !== sel.id)); setView('GRID'); }}} className="odoo-btn btn-secondary" style={{ color:'#ef4444' }}><Icon name="trash" size={18}/> DELETE</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
                <div style={{ background: '#111827', borderRadius: '32px', padding: '30px', color: 'white' }}>
                    <h3 style={{ fontWeight: 950, mb:'30px', marginBottom:'30px' }}>SECTIONS</h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                        {FORM_TYPES.map(t => (<button key={t} onClick={() => setActiveT(t)} style={{ textAlign:'left', padding:'15px', borderRadius:'15px', border:'none', background: activeT === t ? '#875A7B' : 'transparent', color: 'white', fontWeight: 950, cursor:'pointer' }}>{t}</button>))}
                    </div>
                </div>
                <div style={{ background: 'white', borderRadius: '32px', padding: '50px', border: '1.5px solid #f1f5f9' }}>
                    <h3 style={{ fontWeight: 950, mb: '30px', borderBottom: '2px solid #f8fafc', pb: '20px', marginBottom:'30px' }}>{activeT} DATA</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        {modFields.filter(f => f.formType === activeT).map(f => (<div key={f.id}><label style={{ fontSize: '10px', fontWeight: 950, color: '#94a3b8' }}>{f.label}</label><p style={{ fontWeight: 900 }}>{sel.customData?.[f.id]?.toString() || '—'}</p></div>))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', mb:'45px', alignItems:'center' }}>
                <h1 style={{ fontWeight: 950 }}>{module.toUpperCase()} DIRECTORY</h1>
                <div style={{ display:'flex', gap:'20px' }}>
                    <div style={{ position:'relative' }}><Icon name="search" size={18} style={{ position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} /><input placeholder="SEARCH..." onChange={e => setSearch(e.target.value)} style={{ padding:'14px 20px 14px 45px', borderRadius:'15px', border:'2.5px solid #f1f5f9', fontWeight:950, minWidth:'350px' }} /></div>
                    <button onClick={() => { setSel(null); setView('FORM'); }} className="odoo-btn btn-primary" style={{ padding: '15px 40px', borderRadius: '18px' }}>+ {appInfo?.addText}</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {filtered.map(r => (<div key={r.id} onClick={() => { setSel(r); setView('PROFILE'); }} style={{ padding: '40px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '35px', cursor: 'pointer' }}><h4 style={{ fontWeight: 950, color: '#875A7B', fontSize:'18px' }}>{Object.values(r.customData)[0] || 'RECORD'}</h4></div>))}
            </div>
        </div>
    );
};

// --- MAIN ---
const AppInner: React.FC = () => {
    const [a, setA] = useState<string | null>(null);
    const render = () => {
        if (!a || a === 'dashboard') return (
            <div style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', fontWeight: 950, fontSize: '48px', marginBottom: '80px', color: '#111827' }}>OPENEDUCAT ERP</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '35px' }}>{APPS.map(app => (<div key={app.id} onClick={() => setA(app.id)} style={{ padding: '45px 25px', borderRadius: '45px', background: 'white', cursor: 'pointer', border: '2px solid #f1f5f9', textAlign: 'center' }}><div style={{ width: '100px', height: '100px', borderRadius: '32px', background: app.color, margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name={app.icon} size={48}/></div><span style={{ fontWeight: 950 }}>{app.name}</span></div>))}</div>
            </div>
        );
        if (a === 'settings') return <SettingsView />;
        if (a === 'attendance') return <AttendanceView />;
        return <ModuleRegistry module={a} />;
    };
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <nav style={{ background: '#111827', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center', color:'white', fontWeight:950, cursor:'pointer' }} onClick={() => setA('dashboard')}><Icon name="grid" size={24} style={{ marginRight:'15px' }}/> OPENEDUCAT ERP</nav>
            <main style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{render()}</main>
        </div>
    );
};

export const App: React.FC = () => {
    const s = (k:string, d:any) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
    const [r, setR] = useState<GenericRecord[]>(() => s('erp_rec_v15', []));
    const [d, setD] = useState<DynamicField[]>(() => s('erp_df_v15', []));
    const [g, setG] = useState<GlobalList[]>(() => s('erp_gl_v15', []));
    const [at, setAt] = useState<AttendanceRecord[]>(() => s('erp_at_v15', []));
    useEffect(() => { localStorage.setItem('erp_rec_v15', JSON.stringify(r)); }, [r]);
    useEffect(() => { localStorage.setItem('erp_df_v15', JSON.stringify(d)); }, [d]);
    useEffect(() => { localStorage.setItem('erp_gl_v15', JSON.stringify(g)); }, [g]);
    useEffect(() => { localStorage.setItem('erp_at_v15', JSON.stringify(at)); }, [at]);
    return (<AuthContext.Provider value={{ records: r, setRecords: setR, dynamicFields: d, setDynamicFields: setD, globalLists: g, setGlobalLists: setG, attendance: at, setAttendance: setAt }}><AppInner /></AuthContext.Provider>);
};

export default App;
