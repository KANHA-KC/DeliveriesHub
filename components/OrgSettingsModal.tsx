import React from 'react';
import { X, Settings, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostalCodeLabel } from '../types';

interface OrgSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postalCodeLabel: PostalCodeLabel;
    onUpdatePostalCodeLabel: (label: PostalCodeLabel) => void;
}

export const OrgSettingsModal: React.FC<OrgSettingsModalProps> = ({
    isOpen,
    onClose,
    postalCodeLabel,
    onUpdatePostalCodeLabel
}) => {
    if (!isOpen) return null;

    const options: PostalCodeLabel[] = ['Post Code', 'Eire Code', 'Zip Code', 'Postal Index Number'];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#001a1d]/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl p-0"
            >
                <div className="bg-[#003B46] p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <Settings className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Organisation Settings</h2>
                            <p className="text-[#A5F3FC] text-xs">Manage your organization preferences</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
                            Format / Region Label for Postal Codes
                        </label>
                        <div className="space-y-3">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => onUpdatePostalCodeLabel(option)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${postalCodeLabel === option
                                            ? 'bg-[#E0F2F1] border-[#0097a7] text-[#005961] shadow-sm ring-1 ring-[#0097a7]'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                >
                                    <span className="font-bold text-md">{option}</span>
                                    {postalCodeLabel === option && (
                                        <div className="bg-[#0097a7] text-white p-1 rounded-full">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="bg-[#005961] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#00424a] transition-all"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
