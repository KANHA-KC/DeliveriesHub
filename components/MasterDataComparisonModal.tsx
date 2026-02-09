import React, { useState, useEffect } from 'react';
import { Address } from '../types';
import { X, Save, Edit2, AlertCircle, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import { ALPHALAKE_LOGO_URL } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export type MasterDataViewMode = 'MCLERNONS' | 'SAGE' | 'ALL';

interface MasterDataComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAddress: Address;
    viewMode: MasterDataViewMode;
    onSave: (updatedAddress: Address) => void;
}

interface ExternalData extends Partial<Address> {
    source: string;
}

export const MasterDataComparisonModal: React.FC<MasterDataComparisonModalProps> = ({
    isOpen,
    onClose,
    currentAddress,
    viewMode,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState<Address>(currentAddress);

    // Mock Data for external systems - initialized in state below
    const [mcLernonsData, setMcLernonsData] = useState<ExternalData>({
        source: 'McLernons',
        label: currentAddress.label,
        contactName: 'John McLernon (Mock)',
        phones: ['+353 1 234 5678'],
        emails: ['john.mclernon@example.com'],
        line1: '123 McLernon St',
        city: 'Dublin',
        eireCode: 'D01 XYZ1',
        nextOfKin: 'Mary McLernon'
    });

    const [sageData, setSageData] = useState<ExternalData>({
        source: 'Sage',
        label: currentAddress.label,
        contactName: 'Jane Sage (Mock)',
        phones: ['+353 1 987 6543'],
        emails: ['accounts@example.com'],
        line1: 'Sage Business Park',
        city: 'Cork',
        eireCode: 'T12 ABC2',
        nextOfKin: 'John Sage'
    });

    const [showAutoSyncModal, setShowAutoSyncModal] = useState(false);
    const [selectedSyncSystem, setSelectedSyncSystem] = useState<'MCLERNONS' | 'SAGE' | 'ALPHALAKE'>('MCLERNONS');

    const handleSetupAutoSync = () => {
        setShowAutoSyncModal(true);
    };

    const confirmAutoSync = () => {
        const updatedAddress = {
            ...editedAddress,
            autoSync: {
                enabled: true,
                primarySystem: selectedSyncSystem,
                approved: false // Pending approval
            }
        };
        setEditedAddress(updatedAddress);
        setShowAutoSyncModal(false);
        alert("Auto Sync request sent for Admin Approval. You will be notified once approved.");
    };

    useEffect(() => {
        setEditedAddress(currentAddress);
        // Reset external data based on new address if needed, or keep mock static
        setMcLernonsData(prev => ({ ...prev, label: currentAddress.label }));
        setSageData(prev => ({ ...prev, label: currentAddress.label }));
        setIsEditing(false);
    }, [currentAddress, isOpen]);

    const handleSave = () => {
        // Show Warning
        alert("This will save any changes here and in the connected application. It can take up to 1 hour for contact/address details to be updated in connected application(s).");
        onSave(editedAddress);
        setIsEditing(false);
    };

    const updateExternalData = (source: 'MCLERNONS' | 'SAGE', field: keyof ExternalData, value: any) => {
        if (source === 'MCLERNONS') {
            setMcLernonsData({ ...mcLernonsData, [field]: value });
        } else {
            setSageData({ ...sageData, [field]: value });
        }
    };

    const renderField = (label: string, value: string | string[] | undefined, fieldKey?: keyof Address, isEditable: boolean = false, onChange?: (val: any) => void) => (
        <div className="mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{label}</label>
            {isEditable && isEditing && fieldKey ? (
                Array.isArray(value) ? (
                    <div className="space-y-2">
                        {value.map((v, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-full p-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0097a7]"
                                    value={v}
                                    onChange={(e) => {
                                        const newArray = [...value];
                                        newArray[i] = e.target.value;
                                        onChange && onChange(newArray);
                                    }}
                                />
                                {value.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const newArray = value.filter((_, idx) => idx !== i);
                                            onChange && onChange(newArray);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newArray = [...value, ''];
                                onChange && onChange(newArray);
                            }}
                            className="text-[10px] font-bold text-[#0097a7] hover:underline"
                        >
                            + Add another
                        </button>
                    </div>
                ) : (
                    <input
                        className="w-full p-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0097a7]"
                        value={value as string || ''}
                        onChange={(e) => onChange && onChange(e.target.value)}
                    />
                )
            ) : (
                <div className="text-sm font-medium text-slate-700 break-words min-h-[1.25rem]">
                    {Array.isArray(value) ? (
                        value.length > 0 ? value.map((v, i) => <div key={i}>{v}</div>) : '-'
                    ) : (
                        value || '-'
                    )}
                </div>
            )}
        </div>
    );

    const renderColumn = (title: string, data: Partial<Address> | ExternalData, isEditable: boolean = false, onChange?: (field: keyof Address, val: any) => void, bgColor: string = 'bg-white', logo?: string, customLabels: Record<string, string> = {}) => (
        <div className={`flex-1 min-w-[300px] p-4 rounded-xl border border-slate-200 ${bgColor} flex flex-col`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    {logo && (
                        <img
                            src={logo}
                            alt={title}
                            className="h-7 w-auto object-contain"
                            style={title === 'Deliveries Hub' ? { filter: 'brightness(0) saturate(100%) invert(28%) sepia(91%) saturate(543%) hue-rotate(143deg) brightness(91%) contrast(100%)' } : {}}
                        />
                    )}
                    <h3 className="font-black text-slate-700">{title}</h3>
                    {title === 'Deliveries Hub' && data.autoSync?.enabled && (
                        <div className="ml-2 flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                            <RefreshCw size={10} className="animate-spin-slow" />
                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                {data.autoSync.approved ? 'Primary Sync On' : 'Sync Pending'}
                            </span>
                        </div>
                    )}
                </div>
                {isEditable && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0097a7] transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                )}
            </div>

            <div className="space-y-1">
                {renderField(customLabels.contactName || 'Contact Name', (data as any).contactName, 'contactName', isEditable, (v) => onChange && onChange('contactName', v))}
                {renderField(customLabels.phones || 'Phones', (data as any).phones || (data as any).phone ? [(data as any).phone] : [], 'phones', isEditable, (v) => onChange && onChange('phones', v))}
                {renderField(customLabels.emails || 'Emails', (data as any).emails || (data as any).email ? [(data as any).email] : [], 'emails', isEditable, (v) => onChange && onChange('emails', v))}

                <div className="my-4 border-t border-slate-100"></div>

                {renderField(customLabels.label || 'Label', data.label, 'label', isEditable, (v) => onChange && onChange('label', v))}
                {renderField(customLabels.line1 || 'Line 1', data.line1, 'line1', isEditable, (v) => onChange && onChange('line1', v))}
                {renderField(customLabels.line2 || 'Line 2', data.line2, 'line2', isEditable, (v) => onChange && onChange('line2', v))}
                {renderField(customLabels.city || 'City', data.city, 'city', isEditable, (v) => onChange && onChange('city', v))}
                {renderField(customLabels.country || 'Country', data.country, 'country', isEditable, (v) => onChange && onChange('country', v))}
                {renderField(customLabels.eireCode || 'Eirecode', data.eireCode, 'eireCode', isEditable, (v) => onChange && onChange('eireCode', v))}

                <div className="my-4 border-t border-slate-100"></div>

                {renderField(customLabels.nextOfKin || 'Next of Kin', (data as any).nextOfKin, 'nextOfKin', isEditable, (v) => onChange && onChange('nextOfKin', v))}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white group rounded-3xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-xl font-black text-[#005961]">Master Data Comparison</h2>
                            <p className="text-sm text-slate-500 font-medium">Compare and sync contact details across systems</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-slate-50/50">
                        <div className="flex gap-4 min-w-max">
                            {/* Always show Deliveries Hub with Alphalake Logo */}
                            {renderColumn('Deliveries Hub', (isEditing ? editedAddress : currentAddress) as any, true, (k, v) => setEditedAddress({ ...editedAddress, [k]: v } as Address), 'bg-white shadow-sm ring-1 ring-slate-200', ALPHALAKE_LOGO_URL)}

                            {/* Show McLernons if selected or ALL */}
                            {(viewMode === 'MCLERNONS' || viewMode === 'ALL') && (
                                renderColumn('McLernons', mcLernonsData, true, (k, v) => updateExternalData('MCLERNONS', k as any, v), 'bg-[#e0f7fa]/30', 'assets/mclernons-logo.png', {
                                    label: 'Company name',
                                    contactName: 'Contact name',
                                    phones: 'Telephone',
                                    emails: 'Email 1',
                                    line1: 'Street1',
                                    line2: 'Street2',
                                    city: 'Town',
                                    eireCode: 'Post Code'
                                })
                            )}

                            {/* Show Sage if selected or ALL */}
                            {(viewMode === 'SAGE' || viewMode === 'ALL') && (
                                renderColumn('Sage', sageData, true, (k, v) => updateExternalData('SAGE', k as any, v), 'bg-[#f3f4f6]', 'assets/Sage-logo_svg.svg.png')
                            )}
                        </div>
                    </div>

                    {/* Auto Sync Modal Overlay */}
                    {showAutoSyncModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-200">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200 m-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#d9f2f2] flex items-center justify-center text-[#005961]">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-[#005961]">Setup Auto Sync</h3>
                                        <p className="text-xs text-slate-500 font-medium">Select primary source of truth</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Primary System</label>
                                    {[
                                        { id: 'MCLERNONS', label: 'McLernons', logo: 'assets/mclernons-logo.png' },
                                        { id: 'SAGE', label: 'Sage', logo: 'assets/Sage-logo_svg.svg.png' },
                                        { id: 'ALPHALAKE', label: 'Deliveries Hub', logo: ALPHALAKE_LOGO_URL }
                                    ].map((sys) => (
                                        <button
                                            key={sys.id}
                                            onClick={() => setSelectedSyncSystem(sys.id as any)}
                                            className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${selectedSyncSystem === sys.id
                                                ? 'border-[#0097a7] bg-[#e0f7fa] text-[#005961]'
                                                : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1">
                                                    <img src={sys.logo} alt={sys.label} className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <span className="font-bold text-sm">{sys.label}</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSyncSystem === sys.id ? 'border-[#0097a7] bg-[#0097a7] text-white' : 'border-slate-300'}`}>
                                                {selectedSyncSystem === sys.id && <CheckCircle size={12} strokeWidth={4} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 flex gap-3">
                                    <ShieldCheck size={20} className="text-amber-600 shrink-0" />
                                    <p className="text-xs text-amber-800 font-medium">
                                        Enabling Auto Sync requires <strong>Admin Approval</strong>.
                                        Changes will be pending until authorized by an organization administrator.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowAutoSyncModal(false)}
                                        className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmAutoSync}
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#005961] shadow-lg hover:bg-[#004a50] transition-colors"
                                    >
                                        Request Approval
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {isEditing && (
                        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                            <div className="flex-1 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-xs font-bold mr-auto">
                                <AlertCircle size={16} />
                                <span>Changes sync to connected apps (approx. 1 hour)</span>
                            </div>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 rounded-xl bg-[#005961] text-white font-bold shadow-lg hover:bg-[#004a50] transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    )}

                    {!isEditing && (
                        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                            {!editedAddress.autoSync?.enabled && (
                                <button
                                    onClick={handleSetupAutoSync}
                                    className="px-4 py-2 rounded-xl text-[#005961] bg-[#e0f7fa] font-bold hover:bg-[#b2ebf2] transition-colors flex items-center gap-2 ml-auto"
                                >
                                    <RefreshCw size={16} /> Setup Auto Sync
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
};
