
import React from "react";
import { X, Building2, Package, Settings, RefreshCw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { CARA_LOGO_URL } from "../constants";

interface HubSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenOrgSettings: () => void;
}

export const HubSelectionModal: React.FC<HubSelectionModalProps> = ({ isOpen, onClose, onOpenOrgSettings }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001a1d]/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-5xl overflow-hidden shadow-2xl flex md:flex-row flex-col mx-4 h-[600px]"
            >
                {/* Left Side: Branding / Visuals */}
                <div className="md:w-1/3 w-full bg-[#003B46] p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="z-10 relative space-y-8">
                        {/* Logo */}
                        <div className="h-12 w-auto">
                            <img src="assets/cara-logo-white.png" alt="Cara Allcare Pharmacy" className="h-full object-contain" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Select Hub</h2>
                            <p className="text-[#A5F3FC] text-md leading-relaxed">Access your operational workspaces.</p>
                        </div>
                    </div>

                    <div className="z-10 relative">
                        <p className="text-[#A5F3FC]/60 text-xs">© 2024 Cara Allcare Pharmacy</p>
                    </div>

                    {/* Decorative Glows */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#005961] opacity-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#005961] opacity-30 rounded-full blur-3xl -ml-24 -mb-24"></div>

                </div>

                {/* Right Side: Options Grid */}
                <div className="md:w-2/3 w-full p-12 bg-[#F9FAFB] flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-200"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col justify-center h-full gap-6">

                        {/* Top Grid: Hubs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hub Option Card 1 */}
                            <div
                                onClick={onClose}
                                className="cursor-pointer bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003B46]/30 hover:-translate-y-1 transition-all group h-[220px] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-14 h-14 bg-[#E0F2F1] rounded-2xl flex items-center justify-center text-[#003B46] mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <RefreshCw size={28} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#003B46]">Inpatient Hub</h3>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Manage patient prescriptions and dispensing workflows.</p>
                                </div>
                            </div>

                            {/* Hub Option Card 2 */}
                            <div
                                onClick={onClose}
                                className="cursor-pointer bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003B46]/30 hover:-translate-y-1 transition-all group h-[220px] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-14 h-14 bg-[#E0F2F1] rounded-2xl flex items-center justify-center text-[#003B46] mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <CreditCard size={28} />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#003B46]">Deliveries Hub</h3>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Track deliveries and logistics.</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Card: Admin Console */}
                        <div
                            onClick={() => {
                                onClose();
                                onOpenOrgSettings();
                            }}
                            className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#003B46]/30 transition-all group flex items-start gap-6"
                        >
                            <div className="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-gray-600 shrink-0 group-hover:bg-[#E0F2F1] group-hover:text-[#003B46] transition-colors">
                                <Settings size={22} />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#003B46]">Organisation Admin Console</h3>
                                <p className="text-sm text-gray-500 mt-1">Manage users, settings, and organisation-wide configurations.</p>
                            </div>
                        </div>


                    </div>
                </div>
            </motion.div>
        </div>
    );
};
