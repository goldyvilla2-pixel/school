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
    formType: string; // E.g. "GENERAL", "ACADEMIC", "MEDICAL"
    globalListId?: string;
    required: boolean;
}

interface GenericRecord {
    id: string;
    name: string;
    module: string;
    customData: { [key: string]: any };
}

interface AuthContextType {
  records: GenericRecord[];
  setRecords: (r: GenericRecord[]) => void;
  dynamicFields: DynamicField[];
  setDynamicFields: (f: DynamicField[]) => void;
  globalLists: GlobalList[];
  setGlobalLists: (l: GlobalList[]) => void;
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
    finance: <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01M12 15h.01M17 15h.01"/></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    layers: <><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    check: <><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

const APPS = [
  { id: 'dashboard', name: 'DASHBOARD', icon: 'grid', color: '#111827' },
  { id: 'students', name: 'STUDENTS', icon: 'users', color: '#875A7B' },
  { id: 'faculty', name: 'FACULTY', icon: 'user', color: '#10b981' },
  { id: 'academic', name: 'ACADEMIC', icon: 'layers', color: '#7c3aed' },
  { id: 'courses', name: 'COURSES', icon: 'book', color: '#f59e0b' },
  { id: 'fees', name: 'FEES', icon: 'finance', color: '#ef4444' },
  { id: 'admissions', name: 'ADMISSIONS', icon: 'plus', color: '#2563eb' },
  { id: 'attendance', name: 'ATTENDANCE', icon: 'check', color: '#f97316' },
  { id: 'reports', name: 'REPORTS', icon: 'chart', color: '#334155' },
  { id: 'settings', name: 'SETTINGS', icon: 'settings', color: '#64748b' },
];

const FORM_TYPES = ['GENERAL', 'ACADEMIC', 'MEDICAL', 'FINANCIAL'];

// --- SETTINGS VIEW ---
const SettingsView: React.FC = () => {
    const { dynamicFields, setDynamicFields, globalLists, setGlobalLists } = useContext(AuthContext)!;
    const [selectedTab, setSelectedTab] = useState<'FIELDS' | 'LISTS'>('FIELDS');
    const [selectedMod, setSelectedMod] = useState<string | null>(null);
    const [activeFormType, setActiveFormType] = useState(FORM_TYPES[0]);
    const [newField, setNewField] = useState<Partial<DynamicField>>({ label: '', type: 'TEXT', required: false });
    const [newList, setNewList] = useState({ name: '', itemsT: '' });

    if (!selectedMod && selectedTab === 'FIELDS') {
        return (
            <div style={{ padding: '60px' }}>
                <h1 style={{ fontWeight: 950, marginBottom: '50px' }}>MODULE CONFIGURATION</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                    {APPS.filter(a => a.id !== 'dashboard' && a.id !== 'settings').map(app => (
                        <div key={app.id} onClick={() => setSelectedMod(app.id)} style={{ padding: '35px', background: 'white', borderRadius: '35px', border: '2px solid #f1f5f9', cursor: 'pointer', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: app.color, margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name={app.icon} size={32}/></div>
                            <span style={{ fontWeight: 950, fontSize: '13px' }}>{app.name}</span>
                        </div>
                    ))}
                    <div onClick={() => setSelectedTab('LISTS')} style={{ padding: '35px', background: '#111827', borderRadius: '35px', cursor: 'pointer', textAlign: 'center', color: 'white' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#374151', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chart" size={32}/></div>
                        <span style={{ fontWeight: 950, fontSize: '13px' }}>GLOBAL LISTS</span>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedTab === 'LISTS') {
        return (
            <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', mb: '30px', marginBottom: '30px' }}>
                    <button onClick={() => setSelectedTab('FIELDS')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="chevronLeft" size={24}/></button>
                    <h2 style={{ fontWeight: 950 }}>GLOBAL DATA LISTS</h2>
                </div>
                <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '24px', border: '1.5px solid #eee', marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px', gap: '20px', alignItems: 'end' }}>
                        <div><label style={{ fontSize: '10px', fontWeight: 950 }}>LIST NAME</label><input value={newList.name} onChange={e => setNewList({...newList, name: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}/></div>
                        <div><label style={{ fontSize: '10px', fontWeight: 950 }}>OPTIONS (CSV)</label><input value={newList.itemsT} onChange={e => setNewList({...newList, itemsT: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}/></div>
                        <button onClick={() => { if(newList.name) { setGlobalLists([...globalLists, {id: Date.now().toString(), name: newList.name, items: newList.itemsT.split(',').map(s => s.trim().toUpperCase())}]); setNewList({name:'', itemsT:''}); }}} className="odoo-btn btn-primary" style={{ padding:'15px' }}>SAVE LIST</button>
                    </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'20px' }}>
                    {globalLists.map(l => (
                        <div key={l.id} style={{ padding:'20px', background:'white', borderRadius:'18px', border:'1.5px solid #eee' }}>
                            <h5 style={{ fontWeight: 950 }}>{l.name}</h5>
                            <button onClick={() => setGlobalLists(globalLists.filter(i => i.id !== l.id))} style={{ color: '#ef4444', border:'none', background:'none', cursor:'pointer', mt:'10px' }}>DELETE</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ background: 'white', borderRadius: '35px', overflow: 'hidden', border: '2px solid #f1f5f9' }}>
                <div style={{ padding: '25px 40px', background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => setSelectedMod(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="chevronLeft" size={24}/></button>
                    <h2 style={{ fontWeight: 950 }}>CONFIGURING: {selectedMod?.toUpperCase()}</h2>
                </div>
                <div style={{ padding: '30px 40px', borderBottom: '1.5px solid #f1f5f9', display: 'flex', gap: '15px' }}>
                    {FORM_TYPES.map(t => (
                        <button key={t} onClick={() => setActiveFormType(t)} style={{ padding: '10px 25px', borderRadius: '12px', border: 'none', background: activeFormType === t ? '#111827' : '#f9fafb', color: activeFormType === t ? 'white' : '#64748b', fontWeight: 950, cursor: 'pointer' }}>{t}</button>
                    ))}
                </div>
                <div style={{ padding: '40px' }}>
                    <div style={{ background: '#f9fafb', padding: '30px', borderRadius: '24px', border: '1.5px solid #eee', mb: '40px', marginBottom: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 150px', gap: '15px', alignItems: 'end' }}>
                            <div><label style={{ fontSize: '10px', fontWeight: 950 }}>FIELD LABEL</label><input value={newField.label} onChange={e => setNewField({...newField, label: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}/></div>
                            <div>
                                <label style={{ fontSize: '10px', fontWeight: 950 }}>ELEMENT TYPE</label>
                                <select value={newField.type} onChange={e => setNewField({...newField, type: e.target.value as FieldType})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}>
                                    <option value="TEXT">TEXT INPUT</option><option value="NUMBER">NUMBER INPUT</option><option value="DROPDOWN">DROPDOWN MENU</option><option value="CHECKBOX">CHECKBOX</option><option value="DATE">DATE PICKER</option>
                                </select>
                            </div>
                            {newField.type === 'DROPDOWN' && (
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 950 }}>DATA LIST</label>
                                    <select value={newField.globalListId} onChange={e => setNewField({...newField, globalListId: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}>
                                        <option value="">-- SELECT --</option>{globalLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <button onClick={() => { if(newField.label && selectedMod) { setDynamicFields([...dynamicFields, {...newField, id: Date.now().toString(), module: selectedMod, formType: activeFormType} as DynamicField]); setNewField({label: '', type: 'TEXT'}); }}} className="odoo-btn btn-primary" style={{ padding: '15px' }}>ADD TO FORM</button>
                        </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' }}>
                        {dynamicFields.filter(f => f.module === selectedMod && f.formType === activeFormType).map(f => (
                            <div key={f.id} style={{ padding: '25px', background: 'white', borderRadius: '22px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div><p style={{ fontWeight: 950 }}>{f.label}</p><p style={{ fontSize: '9px', fontWeight: 950, color: '#875A7B' }}>{f.type} | {activeFormType}</p></div>
                                <button onClick={() => setDynamicFields(dynamicFields.filter(i => i.id !== f.id))} style={{ color: '#ef4444', background:'none', border:'none', cursor:'pointer' }}><Icon name="trash" size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MODULE REGISTRY (UPLOADS & CSV) ---
const ModuleRegistry: React.FC<{ module: string }> = ({ module }) => {
    const { records, setRecords, dynamicFields, globalLists } = useContext(AuthContext)!;
    const [view, setView] = useState<'GRID' | 'PROFILE' | 'FORM'>('GRID');
    const [sel, setSel] = useState<GenericRecord | null>(null);
    const modFields = dynamicFields.filter(f => f.module === module).sort((a,b) => a.id.localeCompare(b.id));

    const downloadTemplate = () => {
        const headers = ["NAME", ...modFields.map(f => f.label)].join(",");
        const blob = new Blob([headers], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${module}_template.csv`; a.click();
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const lines = text.split('\n');
            const newRecs: GenericRecord[] = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                const vals = lines[i].split(',');
                const custom: any = {};
                modFields.forEach((f, idx) => { custom[f.id] = vals[idx+1]; });
                newRecs.push({ id: Date.now().toString() + i, name: vals[0], module, customData: custom });
            }
            setRecords([...records, ...newRecs]);
        };
        reader.readAsText(file);
    };

    if (view === 'FORM') return (
        <div style={{ padding: '50px', background: 'white', borderRadius: '40px', maxWidth: '1000px', margin: '40px auto', border: '1.5px solid #f1f5f9' }}>
            <h2 style={{ fontWeight: 950, marginBottom: '40px' }}>ENROLLMENT: {module.toUpperCase()}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', fontWeight: 950, color: '#64748b' }}>FULL NAME</label>
                    <input defaultValue={sel?.name} id="rec-name" style={{ width: '100%', padding: '15px', borderRadius: '14px', border: '1.5px solid #ddd', fontWeight: 900, fontSize: '18px' }}/>
                </div>
                {modFields.map(f => (
                    <div key={f.id}>
                        <label style={{ fontSize: '11px', fontWeight: 950, color: '#64748b' }}>{f.label}</label>
                        {f.type === 'TEXT' && <input defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'NUMBER' && <input type="number" defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'DROPDOWN' && (
                            <select id={`f-${f.id}`} defaultValue={sel?.customData[f.id]} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }}>
                                <option value="">SELECT</option>{globalLists.find(l => l.id === f.globalListId)?.items.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        )}
                        {f.type === 'DATE' && <input type="date" defaultValue={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #ddd', fontWeight: 900 }} />}
                        {f.type === 'CHECKBOX' && <div style={{ mt: '10px' }}><input type="checkbox" defaultChecked={sel?.customData[f.id]} id={`f-${f.id}`} style={{ width: '22px', height: '22px' }}/></div>}
                    </div>
                ))}
            </div>
            <div style={{ mt: '50px', marginTop:'50px', display: 'flex', gap: '20px' }}>
                <button onClick={() => {
                    const name = (document.getElementById('rec-name') as HTMLInputElement).value;
                    const c: any = {}; modFields.forEach(f => {
                        const el = document.getElementById(`f-${f.id}`) as any;
                        c[f.id] = f.type === 'CHECKBOX' ? el.checked : el.value;
                    });
                    const d = { id: sel?.id || Date.now().toString(), name, module, customData: c };
                    setRecords(sel ? records.map(i => i.id === sel.id ? d : i) : [...records, d]); setView('GRID');
                }} className="odoo-btn btn-primary" style={{ padding: '15px 60px' }}>SAVE</button>
                <button onClick={() => setView('GRID')} className="odoo-btn btn-secondary" style={{ padding: '15px 30px' }}>CANCEL</button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', alignItems: 'center' }}>
                <h1 style={{ fontWeight: 950 }}>{module.toUpperCase()} DIRECTORY</h1>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={downloadTemplate} className="odoo-btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="download" size={18}/> TEMPLATE</button>
                    <label className="odoo-btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Icon name="upload" size={18}/> UPLOAD CSV <input type="file" hidden onChange={handleUpload}/></label>
                    <button onClick={() => { setSel(null); setView('FORM'); }} className="odoo-btn btn-primary" style={{ padding: '15px 40px', borderRadius: '18px' }}>+ NEW RECORD</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {records.filter(r => r.module === module).map(r => (
                    <div key={r.id} onClick={() => { setSel(r); setView('FORM'); }} style={{ padding: '35px', background: 'white', borderRadius: '32px', border: '1.5px solid #f1f5f9', cursor: 'pointer' }}>
                        <h3 style={{ fontWeight: 950, color: '#875A7B' }}>{r.name}</h3>
                        <p style={{ fontWeight: 900, fontSize: '11px', color: '#64748b' }}>MOD: {module.toUpperCase()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN HUB ---
const AppInner: React.FC = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const renderContent = () => {
        if (!activeId || activeId === 'dashboard') return (
            <div style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', fontWeight: 950, fontSize: '48px', marginBottom: '80px' }}>EDUCATIONAL ERP</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px' }}>
                    {APPS.map(a => (
                        <div key={a.id} onClick={() => setActiveId(a.id)} style={{ padding: '45px 20px', borderRadius: '45px', background: 'white', cursor: 'pointer', border: '2px solid #f1f5f9', textAlign: 'center' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '32px', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 25px' }}><Icon name={a.icon} size={48} /></div>
                            <span style={{ fontWeight: 950 }}>{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
        if (activeId === 'settings') return <SettingsView />;
        return <ModuleRegistry module={activeId} />;
    };
    return (
        <div className="odoo-web-client" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <nav className="odoo-navbar" style={{ background: '#111827', height: '60px', padding: '0 40px', display: 'flex', alignItems: 'center' }}>
                <div onClick={() => setActiveId('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', cursor: 'pointer' }}>
                    <Icon name="grid" size={24}/> <span style={{ fontWeight: 950 }}>OPENEDUCAT</span>
                </div>
            </nav>
            <main style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>{renderContent()}</main>
        </div>
    );
};

export const App: React.FC = () => {
    const s = (k:string, d:any) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
    const [rec, setRec] = useState<GenericRecord[]>(() => s('erp_rec_v10', []));
    const [df, setDf] = useState<DynamicField[]>(() => s('erp_df_v10', []));
    const [gl, setGl] = useState<GlobalList[]>(() => s('erp_gl_v10', []));

    useEffect(() => { localStorage.setItem('erp_rec_v10', JSON.stringify(rec)); }, [rec]);
    useEffect(() => { localStorage.setItem('erp_df_v10', JSON.stringify(df)); }, [df]);
    useEffect(() => { localStorage.setItem('erp_gl_v10', JSON.stringify(gl)); }, [gl]);

    return (
        <AuthContext.Provider value={{ records: rec, setRecords: setRec, dynamicFields: df, setDynamicFields: setDf, globalLists: gl, setGlobalLists: setGl }}>
            <AppInner />
        </AuthContext.Provider>
    );
};

export default App;
