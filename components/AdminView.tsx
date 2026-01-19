
import React, { useState } from 'react';
import { CustomerConfig, PODMethod, CommMethod } from '../types';
import {
  Settings,
  Plus,
  Search,
  Building2,
  Bell,
  TrendingUp,
  Users,
  LayoutDashboard,
  ClipboardList,
  PieChart,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Check,
  CheckCircle,
  Menu,
  MoreVertical,
  ChevronDown,
  Lock
} from 'lucide-react';
import { POD_LABELS, COMM_LABELS, AlphalakeLogo, ALPHALAKE_LOGO_URL, CARA_LOGO_URL } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserManagementView } from './UserManagementView';
import { AddressManagementView } from './AddressManagementView';

interface AdminViewProps {
  configs: CustomerConfig[];
  onUpdateConfig: (config: CustomerConfig) => void;
}

const STAT_DATA = [
  { name: 'Mon', count: 420 },
  { name: 'Tue', count: 560 },
  { name: 'Wed', count: 480 },
  { name: 'Thu', count: 720 },
  { name: 'Fri', count: 680 },
  { name: 'Sat', count: 320 },
  { name: 'Sun', count: 180 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
        <p className="text-sm font-black text-[#005961]">{payload[0].value} Deliveries</p>
      </div>
    );
  }
  return null;
};

export const AdminView: React.FC<AdminViewProps> = ({ configs, onUpdateConfig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'addresses'>('general');

  const activeCustomer = configs.find(c => c.id === editingCustomerId);

  const toggleMethod = (id: string, method: any, field: 'requiredPOD' | 'commMethods') => {
    const config = configs.find(c => c.id === id);
    if (!config) return;

    const currentValues = config[field] as any[];
    const newValues = currentValues.includes(method)
      ? currentValues.filter(v => v !== method)
      : [...currentValues, method];

    onUpdateConfig({ ...config, [field]: newValues });
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Total Deliveries</span>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-5xl font-black text-[#005961]">1,284</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={10} /> +12%
              </span>
            </div>
            <p className="text-base font-bold text-[#0097a7]">Current month</p>
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Active Customers</span>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-[#005961]">{configs.length}</span>
              <span className="text-[10px] font-bold text-[#0097a7] flex items-center gap-1 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                <Users size={10} /> Live
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Delivery Performance</h3>
              <p className="text-lg font-black text-[#005961]">Weekly trend</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500"><MoreVertical size={16} /></button>
          </div>
          <div className="flex-1 w-full h-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STAT_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0097a7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0097a7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }}
                  dy={10}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0097a7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#005961] tracking-tight">Client Directory</h2>
            <p className="text-sm text-slate-400 font-medium">Manage POD requirements and communication channels</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#005961] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#00424a] shadow-lg shadow-[#005961]/20 transition-all">
              <Plus size={18} /> Add Client
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Client Name</th>
                <th className="px-8 py-5">Required POD Methods</th>
                <th className="px-8 py-5">Communication</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {configs.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((config) => (
                <tr key={config.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 group-hover:border-[#0097a7] group-hover:text-[#0097a7] transition-all">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="font-black text-lg text-[#005961] tracking-tight leading-tight">{config.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {config.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {config.requiredPOD.map(p => (
                        <span key={p} className="text-[10px] font-black bg-[#d9f2f2] text-[#005961] px-3 py-1 rounded-full border border-[#b8e4e4] uppercase tracking-tighter">
                          {POD_LABELS[p]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {config.commMethods.map(m => (
                        <span key={m} className="flex items-center gap-1.5 text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-tighter">
                          {COMM_LABELS[m].icon} {COMM_LABELS[m].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => setEditingCustomerId(config.id)}
                      className="text-slate-300 hover:text-[#005961] transition-all p-3 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200 shadow-sm"
                    >
                      <Settings size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const renderSettings = (customer: CustomerConfig) => (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-6xl w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setEditingCustomerId(null); setSettingsTab('general'); }}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-[#005961] transition-all shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-[#005961] tracking-tight">Client Configuration</h2>
            <p className="text-slate-400 font-medium">Fine-tune delivery rules for <span className="font-bold text-[#0097a7]">{customer.name}</span></p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setSettingsTab('general')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${settingsTab === 'general' ? 'bg-white text-[#005961] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            General
          </button>
          <button
            onClick={() => setSettingsTab('addresses')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${settingsTab === 'addresses' ? 'bg-white text-[#005961] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Addresses
          </button>
        </div>
      </div>

      {settingsTab === 'general' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#d9f2f2] rounded-2xl flex items-center justify-center text-[#005961]">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Required POD</h3>
                  <p className="text-xs font-medium text-slate-400">Driver mandatory verification steps</p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.values(PODMethod).map((method) => {
                  const isMandatory = method === 'SIGNATURE' || method === 'PHOTO';
                  const isSelected = isMandatory || customer.requiredPOD.includes(method);

                  return (
                    <button
                      key={method}
                      onClick={() => !isMandatory && toggleMethod(customer.id, method, 'requiredPOD')}
                      disabled={isMandatory}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected
                        ? isMandatory
                          ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm cursor-not-allowed'
                          : 'bg-[#d9f2f2] border-[#0097a7] text-[#005961] shadow-sm'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {isMandatory && <Lock size={16} className="text-amber-600/70" />}
                        <span className="text-sm font-bold">{POD_LABELS[method]}</span>
                      </div>
                      {isSelected ? (
                        <div className={`${isMandatory ? 'bg-amber-500' : 'bg-[#005961]'} text-white rounded-full p-1.5 shadow-md`}>
                          {isMandatory ? <Lock size={14} strokeWidth={2.5} /> : <Check size={14} strokeWidth={4} />}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0097a7]">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Alert Channels</h3>
                  <p className="text-xs font-medium text-slate-400">Order milestone automated notifications</p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.values(CommMethod).map((method) => (
                  <button
                    key={method}
                    onClick={() => toggleMethod(customer.id, method, 'commMethods')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${customer.commMethods.includes(method)
                      ? 'bg-[#d9f2f2] border-[#0097a7] text-[#005961] shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${customer.commMethods.includes(method) ? 'bg-[#005961] text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {COMM_LABELS[method].icon}
                      </div>
                      <span className="text-sm font-bold">{COMM_LABELS[method].label}</span>
                    </div>
                    {customer.commMethods.includes(method) ? (
                      <div className="bg-[#005961] text-white rounded-full p-1.5 shadow-md"><Check size={14} strokeWidth={4} /></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => { setEditingCustomerId(null); }}
              className="bg-[#005961] text-white px-12 py-4 rounded-[1.5rem] font-black text-lg shadow-xl shadow-[#005961]/20 active:scale-95 transition-all"
            >
              Confirm Settings
            </button>
          </div>
        </>
      ) : (
        <div className="h-[600px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <AddressManagementView
            customer={customer}
            onUpdate={onUpdateConfig}
            currentUser="System Admin"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="h-16 bg-[#005961] px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm shrink-0 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6 ml-2">
            <div className="h-8">
              <img src={ALPHALAKE_LOGO_URL} alt="Alphalake Ai" className="h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">Pharmacy Cloud</h1>
              <p className="text-white/50 text-xs font-medium tracking-wide">Deliveries Hub</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                <Bell size={20} />
              </button>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#001a1d]">2</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="h-10 flex items-center gap-3 bg-white/10 rounded-full pl-1 pr-4 hover:bg-white/20 transition-all border border-white/20"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden border border-white/50">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#005961] rounded-full"></div>
                </div>
                <ChevronDown size={16} className="text-white/80" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-sm font-black text-slate-800">Sarah Connor</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Office User</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#005961] flex items-center gap-3 transition-colors"
                  >
                    <Settings size={16} /> Profile Settings
                  </button>
                  <button
                    onClick={() => { setActiveTab('users'); setIsProfileMenuOpen(false); setEditingCustomerId(null); }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#005961] flex items-center gap-3 transition-colors"
                  >
                    <Users size={16} /> User Management
                  </button>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#005961] flex items-center gap-3 transition-colors"
                  >
                    <Bell size={16} /> Notification Settings
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>

            <div className="h-8 w-[2px] bg-white/20" />

            <div className="h-10">
              <img src="/assets/cara-logo-white.png" alt="Cara" className="h-full object-contain" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-[#001a1d] text-white flex flex-col h-full z-40 transition-all duration-300 shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
        >
          <nav className="flex-1 px-4 space-y-2 mt-8">
            <button
              onClick={() => { setActiveTab('dashboard'); setEditingCustomerId(null); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'dashboard' && !editingCustomerId ? 'bg-[#005961] text-white shadow-xl shadow-[#005961]/20' : 'text-slate-500 hover:text-white hover:bg-[#002f33]'}`}
            >
              <LayoutDashboard size={20} className="shrink-0" /> {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button
              onClick={() => { setActiveTab('customers'); setEditingCustomerId(null); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'customers' || editingCustomerId ? 'bg-[#005961] text-white shadow-xl shadow-[#005961]/20' : 'text-slate-500 hover:text-white hover:bg-[#002f33]'}`}
            >
              <Users size={20} className="shrink-0" /> {!isSidebarCollapsed && <span>Customers</span>}
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black text-slate-500 hover:text-white hover:bg-[#002f33] transition-all">
              <ClipboardList size={20} className="shrink-0" /> {!isSidebarCollapsed && <span>Deliveries</span>}
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black text-slate-500 hover:text-white hover:bg-[#002f33] transition-all">
              <PieChart size={20} className="shrink-0" /> {!isSidebarCollapsed && <span>Analytics</span>}
            </button>
          </nav>



        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Platform</span>
              <ChevronRight size={14} className="text-slate-200" />
              <h1 className="text-[#005961] text-[10px] font-black uppercase tracking-[0.2em]">{activeTab}</h1>
              {editingCustomerId && (
                <>
                  <ChevronRight size={14} className="text-slate-200" />
                  <span className="text-[#0097a7] text-[10px] font-black uppercase tracking-[0.2em]">{activeCustomer?.name}</span>
                </>
              )}
            </div>
          </div>

          <main className="flex-1 p-10 overflow-y-auto">
            {activeTab === 'users' ? (
              <UserManagementView />
            ) : editingCustomerId && activeCustomer ? (
              renderSettings(activeCustomer)
            ) : (
              renderDashboard()
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
