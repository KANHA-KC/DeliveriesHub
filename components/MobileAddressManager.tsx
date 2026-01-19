import React, { useState } from 'react';
import { Address, AddressHistory, CustomerConfig } from '../types';
import { MapPin, Plus, Edit2, Trash2, Save, X, History, Clock, User } from 'lucide-react';

interface MobileAddressManagerProps {
    customer: CustomerConfig;
    onUpdate: (updatedCustomer: CustomerConfig) => void;
    currentUser?: string;
    onShowHistory?: () => void;
}

export const MobileAddressManager: React.FC<MobileAddressManagerProps> = ({
    customer,
    onUpdate,
    currentUser = 'Client User',
    onShowHistory
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempAddress, setTempAddress] = useState<Partial<Address>>({});

    const handleEdit = (address: Address) => {
        setEditingId(address.id);
        setTempAddress({ ...address });
    };

    const handleAdd = () => {
        const newId = `A-${Date.now()}`;
        setTempAddress({
            id: newId,
            label: '',
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
        if (!tempAddress.line1 || !tempAddress.city || !tempAddress.eireCode || !tempAddress.label) {
            alert('Please fill in all required fields');
            return;
        }

        const isNew = !customer.addresses.find(a => a.id === tempAddress.id);
        let newAddresses = [...customer.addresses];

        if (isNew) {
            newAddresses.push(tempAddress as Address);
        } else {
            newAddresses = newAddresses.map(a => a.id === tempAddress.id ? tempAddress as Address : a);
        }

        const historyEntry: AddressHistory = {
            id: `H-${Date.now()}`,
            addressId: tempAddress.id!,
            changedBy: currentUser,
            changedAt: new Date().toISOString(),
            action: isNew ? 'CREATED' : 'UPDATED',
            details: isNew ? 'New address added' : `Updated ${tempAddress.label}`
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
        if (window.confirm('Delete this address?')) {
            const address = customer.addresses.find(a => a.id === id);
            const newAddresses = customer.addresses.filter(a => a.id !== id);

            const historyEntry: AddressHistory = {
                id: `H-${Date.now()}`,
                addressId: id,
                changedBy: currentUser,
                changedAt: new Date().toISOString(),
                action: 'DELETED',
                details: `Deleted ${address?.label}`
            };

            onUpdate({
                ...customer,
                addresses: newAddresses,
                addressHistory: [historyEntry, ...customer.addressHistory]
            });
        }
    };

    if (editingId) {
        return (
            <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#0097a7] p-4 shadow-lg">
                    <h3 className="text-base font-black text-[#005961] mb-4">
                        {customer.addresses.find(a => a.id === tempAddress.id) ? 'Edit Address' : 'New Address'}
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Label *</label>
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                value={tempAddress.label || ''}
                                onChange={e => setTempAddress({ ...tempAddress, label: e.target.value })}
                                placeholder="e.g. Home, Office"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Address Line 1 *</label>
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                value={tempAddress.line1 || ''}
                                onChange={e => setTempAddress({ ...tempAddress, line1: e.target.value })}
                                placeholder="Street address"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Address Line 2</label>
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                value={tempAddress.line2 || ''}
                                onChange={e => setTempAddress({ ...tempAddress, line2: e.target.value })}
                                placeholder="Apartment, suite (optional)"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">City *</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                    value={tempAddress.city || ''}
                                    onChange={e => setTempAddress({ ...tempAddress, city: e.target.value })}
                                    placeholder="City"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Eire Code *</label>
                                <input
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                    value={tempAddress.eireCode || ''}
                                    onChange={e => setTempAddress({ ...tempAddress, eireCode: e.target.value })}
                                    placeholder="Required"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Country</label>
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] text-sm"
                                value={tempAddress.country || ''}
                                onChange={e => setTempAddress({ ...tempAddress, country: e.target.value })}
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-3 rounded-xl text-slate-600 font-bold bg-slate-100 active:scale-95 transition-transform"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#005961] text-white font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleAdd}
                className="w-full bg-[#005961] text-white px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
                <Plus size={18} /> Add New Address
            </button>

            {customer.addresses.length === 0 ? (
                <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-400">No addresses yet</p>
                    <p className="text-xs text-slate-300 mt-1">Add your first delivery address</p>
                </div>
            ) : (
                customer.addresses.map(address => (
                    <div
                        key={address.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#d9f2f2] flex items-center justify-center text-[#005961] shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-black text-slate-800">{address.label}</h3>
                                    {address.isDefault && (
                                        <span className="text-[9px] font-bold bg-[#0097a7] text-white px-2 py-0.5 rounded-full">DEFAULT</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {address.line1}
                                    {address.line2 && `, ${address.line2}`}
                                    <br />
                                    {address.city}
                                    <br />
                                    <span className="text-[#005961] font-bold">{address.eireCode}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                            <button
                                onClick={() => handleEdit(address)}
                                className="flex-1 px-3 py-2 text-xs font-bold text-[#005961] bg-cyan-50 rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-1"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="flex-1 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-1"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
