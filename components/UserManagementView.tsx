
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Search, Plus, User as UserIcon, Shield, Truck, Users, MoreVertical, Trash2, Edit2, Mail, Phone } from 'lucide-react';

interface UserManagementViewProps {
    onBack?: () => void;
}

// Dummy data
const DUMMY_USERS: (User & { email: string; phone: string; avatar?: string })[] = [
    { id: 'u1', name: 'Alan Smith', role: UserRole.ADMIN, organization: 'Cara Pharmacy', email: 'alan@carapharmacy.com', phone: '+353 87 123 4567' },
    { id: 'u2', name: 'John Doe', role: UserRole.DRIVER, organization: 'Cara Logistics', email: 'john.d@caralogistics.com', phone: '+353 87 234 5678' },
    { id: 'u3', name: 'Sarah Connor', role: UserRole.RECIPIENT, organization: 'Sunnyside Nursing Home', email: 'sarah@sunnyside.ie', phone: '+353 87 345 6789' },
    { id: 'u4', name: 'Mike Ross', role: UserRole.DRIVER, organization: 'Cara Logistics', email: 'mike.r@caralogistics.com', phone: '+353 87 456 7890' },
    { id: 'u5', name: 'Emily Blunt', role: UserRole.RECIPIENT, organization: 'Meadow View', email: 'admin@meadowview.ie', phone: '+353 87 567 8901' },
];

export const UserManagementView: React.FC<UserManagementViewProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<UserRole | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(DUMMY_USERS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || user.role === activeTab;
        return matchesSearch && matchesTab;
    });

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return <Shield size={16} />;
            case UserRole.DRIVER: return <Truck size={16} />;
            case UserRole.RECIPIENT: return <Users size={16} />;
            default: return <UserIcon size={16} />;
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200';
            case UserRole.DRIVER: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case UserRole.RECIPIENT: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#005961] tracking-tight">User Management</h2>
                    <p className="text-sm text-slate-400 font-medium">Manage permissions and access for all platform users</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#005961] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#00424a] shadow-lg shadow-[#005961]/20 transition-all"
                    >
                        <Plus size={18} /> Add User
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs and Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex bg-slate-100/50 p-1.5 rounded-xl gap-1">
                        {(['ALL', UserRole.ADMIN, UserRole.DRIVER, UserRole.RECIPIENT] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-[#005961] shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab === 'ALL' ? 'All Users' : tab === 'ADMIN' ? 'Office Users' : tab.charAt(0) + tab.slice(1).toLowerCase() + 's'}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                <th className="px-8 py-5">User Details</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Contact Info</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#005961]/10 rounded-xl flex items-center justify-center text-[#005961] font-black text-sm">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{user.organization}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                                            {getRoleIcon(user.role)}
                                            {user.role === UserRole.ADMIN ? 'OFFICE USER' : user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Mail size={12} className="text-slate-300" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Phone size={12} className="text-slate-300" /> {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#005961] transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="opacity-50" />
                            </div>
                            <p className="font-bold">No users found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
