import React, { useState } from 'react';
import { Address, AddressHistory, CustomerConfig, PostalCodeLabel } from '../types';
import { ALPHALAKE_LOGO_URL } from '../constants';
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
import { MasterDataComparisonModal, MasterDataViewMode } from './MasterDataComparisonModal';

interface AddressManagementViewProps {
    customer: CustomerConfig;
    onUpdate: (updatedCustomer: CustomerConfig) => void;
    currentUser?: string; // For history tracking
    postalCodeLabel: PostalCodeLabel;
}

export const AddressManagementView: React.FC<AddressManagementViewProps> = ({
    customer,
    onUpdate,
    currentUser = 'System Admin',
    postalCodeLabel
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(true);
    const [tempAddress, setTempAddress] = useState<Partial<Address>>({});

    // Master Data State
    const [mdModalOpen, setMdModalOpen] = useState(false);
    const [mdViewMode, setMdViewMode] = useState<MasterDataViewMode>('ALL');
    const [mdAddress, setMdAddress] = useState<Address | null>(null);

    const openMasterData = (address: Address, mode: MasterDataViewMode) => {
        setMdAddress(address);
        setMdViewMode(mode);
        setMdModalOpen(true);
    };

    const handleMasterDataSave = (updatedAddress: Address) => {
        const newAddresses = customer.addresses.map(a => a.id === updatedAddress.id ? updatedAddress : a);

        // Update History
        const historyEntry: AddressHistory = {
            id: `H-${Date.now()}`,
            addressId: updatedAddress.id,
            changedBy: currentUser,
            changedAt: new Date().toISOString(),
            action: 'UPDATED',
            details: `Updated Master Data details for ${updatedAddress.label}`
        };

        onUpdate({
            ...customer,
            addresses: newAddresses,
            addressHistory: [historyEntry, ...customer.addressHistory]
        });

        setMdModalOpen(false);
        setMdAddress(null);
    };

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
            isDefault: false,
            phones: [],
            emails: []
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{postalCodeLabel}</label>
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

            <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Name</label>
                        <input
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                            value={tempAddress.contactName || ''}
                            onChange={e => setTempAddress({ ...tempAddress, contactName: e.target.value })}
                            placeholder="Primary Contact"
                        />
                    </div>
                </div>

                {/* Phones */}
                <div className="mt-4 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                        Phone Numbers
                        <button
                            onClick={() => setTempAddress({ ...tempAddress, phones: [...(tempAddress.phones || []), ''] })}
                            className="text-[#005961] hover:text-[#0097a7] flex items-center gap-1"
                        >
                            <Plus size={12} /> Add
                        </button>
                    </label>
                    {(tempAddress.phones?.length ? tempAddress.phones : ['']).map((phone, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                                value={phone}
                                onChange={e => {
                                    const newPhones = [...(tempAddress.phones || [''])];
                                    newPhones[idx] = e.target.value;
                                    setTempAddress({ ...tempAddress, phones: newPhones });
                                }}
                                placeholder="+353 ..."
                            />
                            {(tempAddress.phones?.length || 0) > 1 && (
                                <button
                                    onClick={() => {
                                        const newPhones = tempAddress.phones?.filter((_, i) => i !== idx);
                                        setTempAddress({ ...tempAddress, phones: newPhones });
                                    }}
                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Emails */}
                <div className="mt-4 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                        Email Addresses
                        <button
                            onClick={() => setTempAddress({ ...tempAddress, emails: [...(tempAddress.emails || []), ''] })}
                            className="text-[#005961] hover:text-[#0097a7] flex items-center gap-1"
                        >
                            <Plus size={12} /> Add
                        </button>
                    </label>
                    {(tempAddress.emails?.length ? tempAddress.emails : ['']).map((email, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0097a7] font-medium"
                                value={email}
                                onChange={e => {
                                    const newEmails = [...(tempAddress.emails || [''])];
                                    newEmails[idx] = e.target.value;
                                    setTempAddress({ ...tempAddress, emails: newEmails });
                                }}
                                placeholder="name@example.com"
                            />
                            {(tempAddress.emails?.length || 0) > 1 && (
                                <button
                                    onClick={() => {
                                        const newEmails = tempAddress.emails?.filter((_, i) => i !== idx);
                                        setTempAddress({ ...tempAddress, emails: newEmails });
                                    }}
                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
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
            <div className="flex-1 flex flex-col min-w-0 relative">
                <div className="absolute right-2 -top-12 z-10">
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
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm group hover:border-[#0097a7]/30 hover:shadow-md transition-all relative overflow-hidden"
                            >
                                {/* Row 1: Deliveries Hub (Primary) */}
                                <div className="px-6 py-4 flex items-center gap-4">
                                    <div className="w-20 h-20 flex items-center justify-center shrink-0 bg-slate-50 rounded-xl">
                                        <img
                                            src="assets/AL Non white all.png"
                                            alt="Alphalake AI"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm font-black text-slate-700 leading-tight">Deliveries Hub</span>
                                                    {address.isDefault && (
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">• Default</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-bold text-[#0097a7] uppercase tracking-widest">Primary System</span>
                                            </div>

                                            {/* Top Right Actions */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(address)}
                                                    className="p-1.5 text-slate-400 hover:text-[#005961] hover:bg-slate-50 rounded-lg transition-all"
                                                    title="Edit Address"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(address.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5 mt-2">
                                            <p className="text-xs text-slate-500 font-medium">
                                                <span className="font-bold text-slate-700">123 Deliveries Hub St</span>, Unit 1A, Town, County Dublin
                                            </p>
                                            <p className="text-xs font-bold text-[#0097a7]">
                                                D01 ABC1 <span className="text-slate-400 font-normal uppercase tracking-wider text-[10px] ml-1">• Ireland (IE)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: McLernons */}
                                <div
                                    onClick={() => openMasterData(address, 'MCLERNONS')}
                                    className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:pl-7 transition-all cursor-pointer group/row flex items-center gap-4"
                                >
                                    <div className="w-20 h-20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform bg-slate-50 rounded-xl">
                                        <img src="assets/mclernons-logo.png" alt="McLernons" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 leading-tight">McLernons</span>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Patient Meds Records</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">View Details</span>
                                                <ArrowRight size={14} className="text-indigo-400" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5 mt-2">
                                            <p className="text-xs text-slate-500 font-medium">
                                                <span className="font-bold text-slate-700">123 McLernon St</span>, Unit 4B, Town, County Dublin
                                            </p>
                                            <p className="text-xs font-bold text-indigo-600">
                                                D01 XYZ1 <span className="text-slate-400 font-normal uppercase tracking-wider text-[10px] ml-1">• Ireland (IE)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Sage */}
                                <div
                                    onClick={() => openMasterData(address, 'SAGE')}
                                    className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:pl-7 transition-all cursor-pointer group/row flex items-center gap-4"
                                >
                                    <div className="w-20 h-20 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform bg-slate-50 rounded-xl">
                                        <img src="assets/Sage-logo_svg.svg.png" alt="Sage" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 leading-tight">Sage</span>
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Financial Data</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">View Details</span>
                                                <ArrowRight size={14} className="text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5 mt-2">
                                            <p className="text-xs text-slate-500 font-medium">
                                                <span className="font-bold text-slate-700">123 Sage St</span>, Unit 10C, Town, County Dublin
                                            </p>
                                            <p className="text-xs font-bold text-emerald-600">
                                                D01 1234 <span className="text-slate-400 font-normal uppercase tracking-wider text-[10px] ml-1">• Ireland (IE)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end items-center">
                                    <button
                                        onClick={() => openMasterData(address, 'ALL')}
                                        className="px-6 py-2 rounded-xl bg-[#005961] text-white text-xs font-bold shadow-md hover:bg-[#00424a] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        title="Compare All"
                                    >
                                        Compare
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {
                showHistory && (
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
                )
            }
            {
                mdModalOpen && mdAddress && (
                    <MasterDataComparisonModal
                        isOpen={mdModalOpen}
                        onClose={() => setMdModalOpen(false)}
                        currentAddress={mdAddress}
                        viewMode={mdViewMode}
                        onSave={handleMasterDataSave}
                    />
                )
            }

        </div >
    );
};
