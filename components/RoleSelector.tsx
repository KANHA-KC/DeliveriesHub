
import React from 'react';
import { UserRole } from '../types';
import { Users, Truck, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">Demo Role:</span>
      <button
        onClick={() => onRoleChange(UserRole.ADMIN)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentRole === UserRole.ADMIN ? 'bg-[#005961] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <ShieldCheck size={16} /> Office User
      </button>
      <button
        onClick={() => onRoleChange(UserRole.DRIVER)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentRole === UserRole.DRIVER ? 'bg-[#005961] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <Truck size={16} /> Driver
      </button>
      <button
        onClick={() => onRoleChange(UserRole.RECIPIENT)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentRole === UserRole.RECIPIENT ? 'bg-[#005961] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <Users size={16} /> Recipient
      </button>
    </div>
  );
};
