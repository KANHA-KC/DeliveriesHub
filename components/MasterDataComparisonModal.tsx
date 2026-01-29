import React, { useState, useEffect } from 'react';
import { Address } from '../types';
import { X, Save, Edit2, AlertCircle } from 'lucide-react';
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

    // Mock Data for external systems
    const mcLernonsData: ExternalData = {
        source: 'McLernons',
        label: currentAddress.label,
        contactName: 'John McLernon (Mock)',
        phones: ['+353 1 234 5678'],
        emails: ['john.mclernon@example.com'],
        line1: '123 McLernon St',
        city: 'Dublin',
        eireCode: 'D01 XYZ1'
    };

    const sageData: ExternalData = {
        source: 'Sage',
        label: currentAddress.label,
        contactName: 'Jane Sage (Mock)',
        phones: ['+353 1 987 6543'],
        emails: ['accounts@example.com'],
        line1: 'Sage Business Park',
        city: 'Cork',
        eireCode: 'T12 ABC2'
    };

    useEffect(() => {
        setEditedAddress(currentAddress);
        setIsEditing(false);
    }, [currentAddress, isOpen]);

    const handleSave = () => {
        // Show Warning
        alert("This will save any changes here and in the connected application. It can take up to 1 hour for contact/address details to be updated in connected application(s).");
        onSave(editedAddress);
        setIsEditing(false);
    };

    const renderField = (label: string, value: string | string[] | undefined, fieldKey?: keyof Address, isEditable: boolean = false) => (
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
                                        setEditedAddress({ ...editedAddress, [fieldKey]: newArray });
                                    }}
                                />
                                {value.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const newArray = value.filter((_, idx) => idx !== i);
                                            setEditedAddress({ ...editedAddress, [fieldKey]: newArray });
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
                                setEditedAddress({ ...editedAddress, [fieldKey]: newArray });
                            }}
                            className="text-[10px] font-bold text-[#0097a7] hover:underline"
                        >
                            + Add another
                        </button>
                    </div>
                ) : (
                    <input
                        className="w-full p-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0097a7]"
                        value={editedAddress[fieldKey] as string || ''}
                        onChange={(e) => setEditedAddress({ ...editedAddress, [fieldKey]: e.target.value })}
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

    const renderColumn = (title: string, data: Partial<Address> | ExternalData, isEditable: boolean = false, bgColor: string = 'bg-white') => (
        <div className={`flex-1 min-w-[300px] p-4 rounded-xl border border-slate-200 ${bgColor} flex flex-col`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-black text-slate-700">{title}</h3>
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
                {renderField('Contact Name', (data as any).contactName, 'contactName', isEditable)}
                {renderField('Phones', (data as any).phones || (data as any).phone ? [(data as any).phone] : [], 'phones', isEditable)}
                {renderField('Emails', (data as any).emails || (data as any).email ? [(data as any).email] : [], 'emails', isEditable)}

                <div className="my-4 border-t border-slate-100"></div>

                {renderField('Label', data.label, 'label', isEditable)}
                {renderField('Line 1', data.line1, 'line1', isEditable)}
                {renderField('Line 2', data.line2, 'line2', isEditable)}
                {renderField('City', data.city, 'city', isEditable)}
                {renderField('Country', data.country, 'country', isEditable)}
                {renderField('Eirecode', data.eireCode, 'eireCode', isEditable)}
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
                            {/* Always show Deliveries Hub */}
                            {renderColumn('Deliveries Hub', isEditing ? editedAddress : currentAddress, true, 'bg-white shadow-sm ring-1 ring-slate-200')}

                            {/* Show McLernons if selected or ALL */}
                            {(viewMode === 'MCLERNONS' || viewMode === 'ALL') && (
                                renderColumn('McLernons', mcLernonsData, false, 'bg-[#e0f7fa]/30')
                            )}

                            {/* Show Sage if selected or ALL */}
                            {(viewMode === 'SAGE' || viewMode === 'ALL') && (
                                renderColumn('Sage', sageData, false, 'bg-[#f3f4f6]')
                            )}
                        </div>
                    </div>

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
                                className="px-6 py-2 rounded-xl bg-[#005961] text-white font-bold shadow-lg hover:bg-[#00424a] transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
