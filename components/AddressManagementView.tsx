import React, { useState } from 'react';
import { Address, AddressHistory, CustomerConfig } from '../types';
import {
    MapPin,
    Plus,
    History,
    Edit2,
    Trash2,
    Check,
    X,
    Clock,
    User,
    Save,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddressManagementViewProps {
    customer: CustomerConfig;
    onUpdate: (updatedCustomer: CustomerConfig) => void;
    currentUser?: string; // For history tracking
}

export const AddressManagementView: React.FC<AddressManagementViewProps> = ({
    customer,
    onUpdate,
    currentUser = 'System Admin'
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(true);
    const [tempAddress, setTempAddress] = useState<Partial<Address>>({});

    const handleEdit = (address: Address) => {
        setEditingId(address.id);
        setTempAddress({ ...address });
    };

    const handleAdd = () => {
        const newId = `A-${Date.now()}`;
        setTempAddress({
            id: newId,
            label: 'New Address',
            line1: '',
            line2: '',
            city: '',
            eireCode: '',
            country: 'Ireland',
            isDefault: false
        });
        setEditingId(newId);
    };

    const handleCancel = () => {
        setEditingId(null);
        setTempAddress({});
    };

    const handleSave = () => {
        if (!tempAddress.line1 || !tempAddress.city || !tempAddress.eireCode) {
            alert('Please fill in all required fields (Line 1, City, Eire Code)');
            return;
        }

        const isNew = !customer.addresses.find(a => a.id === tempAddress.id);
        let newAddresses = [...customer.addresses];

        if (isNew) {
            newAddresses.push(tempAddress as Address);
        } else {
            newAddresses = newAddresses.map(a => a.id === tempAddress.id ? tempAddress as Address : a);
        }

        // Update History
        const historyEntry: AddressHistory = {
            id: `H-${Date.now()}`,
            addressId: tempAddress.id!,
            changedBy: currentUser,
            changedAt: new Date().toISOString(),
            action: isNew ? 'CREATED' : 'UPDATED',
            details: isNew ? 'New address added' : `Updated details for ${tempAddress.label}`
        };

        onUpdate({
            ...customer,
            addresses: newAddresses,
            addressHistory: [historyEntry, ...customer.addressHistory]
        });

        setEditingId(null);
        setTempAddress({});
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const address = customer.addresses.find(a => a.id === id);
            const newAddresses = customer.addresses.filter(a => a.id !== id);

            const historyEntry: AddressHistory = {
                id: `H-${Date.now()}`,
                addressId: id,
                changedBy: currentUser,
                changedAt: new Date().toISOString(),
                action: 'DELETED',
                details: `Deleted address: ${address?.label}`
            };

            onUpdate({
                ...customer,
                addresses: newAddresses,
                addressHistory: [historyEntry, ...customer.addressHistory]
            });
        }
    };

    const renderAddressForm = () => (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#0097a7] shadow-xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-[#005961] mb-4">
                {customer.addresses.find(a => a.id === tempAddress.id) ? 'Edit Address' : 'New Address'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                        value={tempAddress.label}
                        onChange={e => setTempAddress({ ...tempAddress, label: e.target.value })}
                        placeholder="e.g. Main Office"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Eire Code</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium placeholder:text-slate-300"
                        value={tempAddress.eireCode}
                        onChange={e => setTempAddress({ ...tempAddress, eireCode: e.target.value })}
                        placeholder="Required"
                    />
                </div>

                <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address Line 1</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                        value={tempAddress.line1}
                        onChange={e => setTempAddress({ ...tempAddress, line1: e.target.value })}
                        placeholder="Street address"
                    />
                </div>

                <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address Line 2</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                        value={tempAddress.line2 || ''}
                        onChange={e => setTempAddress({ ...tempAddress, line2: e.target.value })}
                        placeholder="Apartment, suite, etc. (Optional)"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                        value={tempAddress.city}
                        onChange={e => setTempAddress({ ...tempAddress, city: e.target.value })}
                        placeholder="City"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Country</label>
                    <input
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                        value={tempAddress.country}
                        onChange={e => setTempAddress({ ...tempAddress, country: e.target.value })}
                        placeholder="Country"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl bg-[#005961] text-white font-bold shadow-lg hover:bg-[#00424a] transition-all flex items-center gap-2"
                >
                    <Save size={18} /> Save Address
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6">
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-[#005961] tracking-tight">Delivery Addresses</h2>
                        <p className="text-xs lg:text-sm text-slate-400 font-medium">Manage authorized drop-off locations</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!!editingId}
                        className="bg-[#005961] text-white px-4 py-2 lg:px-5 lg:py-3 rounded-2xl text-xs lg:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#005961]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Add New Address</span><span className="sm:hidden">Add</span>
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto pb-6 pr-2">
                    {editingId && renderAddressForm()}

                    {customer.addresses.map(address => {
                        if (address.id === editingId) return null;
                        return (
                            <motion.div
                                layout
                                key={address.id}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-[#0097a7]/30 hover:shadow-md transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#d9f2f2] flex items-center justify-center text-[#005961] shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-black text-slate-800 tracking-tight">{address.label}</h3>
                                                {address.isDefault && (
                                                    <span className="text-[10px] font-bold bg-[#0097a7] text-white px-2 py-0.5 rounded-full">DEFAULT</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mt-1">
                                                {address.line1}
                                                {address.line2 && `, ${address.line2}`}<br />
                                                {address.city}<br />
                                                <span className="text-[#005961] font-bold">{address.eireCode}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action buttons - always visible on mobile, hover on desktop */}
                                    <div className="flex items-center gap-1 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="p-2 text-slate-400 hover:text-[#005961] hover:bg-[#d9f2f2] rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {showHistory && (
                <div className="hidden lg:flex w-80 border-l border-slate-200 pl-6 flex-col shrink-0 bg-slate-50/50 -my-6 py-6 scrollbar-hide">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs flex items-center gap-2">
                            <History size={14} /> Version History
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {customer.addressHistory?.length > 0 ? (
                            customer.addressHistory.map((history) => (
                                <div key={history.id} className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${history.action === 'CREATED' ? 'bg-[#0097a7]' :
                                        history.action === 'DELETED' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`} />

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {new Date(history.changedAt).toLocaleDateString()} • {new Date(history.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">
                                            {history.details}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                                <User size={10} />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500">{history.changedBy}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Clock size={32} className="mx-auto mb-2 text-slate-300" />
                                <p className="text-xs font-bold text-slate-400">No history available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
