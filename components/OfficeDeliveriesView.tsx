import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, CustomerConfig } from '../types';
import { STATUS_METADATA } from '../constants';
import { MapPin, Search, Package, Calendar, ArrowRight, Truck, CheckCircle, ExternalLink, Filter, X, ChevronLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfficeDeliveriesViewProps {
    orders: Order[];
    configs: CustomerConfig[];
    onViewAsCustomer?: (customerId?: string | null) => void;
}

export const OfficeDeliveriesView: React.FC<OfficeDeliveriesViewProps> = ({ orders, configs, onViewAsCustomer }) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const activeOrder = orders.find(o => o.id === selectedOrderId);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCustomer = selectedCustomer ? order.recipientId === selectedCustomer : true;
            return matchesSearch && matchesCustomer;
        });
    }, [orders, searchTerm, selectedCustomer]);

    const handleOrderClick = (id: string) => {
        setSelectedOrderId(id);
    };

    const statusList = [
        OrderStatus.ENTRY,
        OrderStatus.DISPATCH,
        OrderStatus.PICKING,
        OrderStatus.PACKING,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED
    ];

    const CheckCircle2 = ({ size }: { size: number }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    );

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {!selectedOrderId ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="bg-slate-50 px-8 py-6 shrink-0">
                            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#005961] mb-2 tracking-tight">Active Deliveries</h2>
                                        <p className="text-slate-400 font-medium">Track and manage orders across all customer accounts.</p>
                                    </div>
                                    {onViewAsCustomer && (
                                        <button
                                            onClick={() => onViewAsCustomer(selectedCustomer)}
                                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#E0F2F1] text-[#005961] rounded-xl font-bold text-sm hover:bg-[#B2DFDB] transition-colors border border-[#80CBC4] shadow-sm ml-auto"
                                        >
                                            <User size={18} />
                                            View as Customer
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search orders by ID, recipient, or address..."
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30 shadow-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                            className={`px-4 py-3.5 rounded-2xl border font-bold text-sm flex items-center gap-2 transition-all ${selectedCustomer || isFilterOpen ? 'bg-[#005961] text-white border-[#005961]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Filter size={18} />
                                            {selectedCustomer ? configs.find(c => c.id === selectedCustomer)?.name : 'Filter Customer'}
                                            {selectedCustomer && (
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); setSelectedCustomer(null); }}
                                                    className="ml-2 w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center"
                                                >
                                                    <X size={12} />
                                                </div>
                                            )}
                                        </button>

                                        {isFilterOpen && (
                                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Account</p>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    <button
                                                        onClick={() => { setSelectedCustomer(null); setIsFilterOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-slate-50 transition-colors ${!selectedCustomer ? 'text-[#005961] bg-[#d9f2f2]' : 'text-slate-600'}`}
                                                    >
                                                        All Customers
                                                    </button>
                                                    {configs.map(config => (
                                                        <button
                                                            key={config.id}
                                                            onClick={() => { setSelectedCustomer(config.id); setIsFilterOpen(false); }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-slate-50 transition-colors ${selectedCustomer === config.id ? 'text-[#005961] bg-[#d9f2f2]' : 'text-slate-600'}`}
                                                        >
                                                            {config.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* List Content */}
                        <div className="flex-1 overflow-y-auto px-8 pb-8">
                            <div className="max-w-7xl mx-auto">
                                {filteredOrders.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredOrders.map(order => (
                                            <button
                                                key={order.id}
                                                onClick={() => handleOrderClick(order.id)}
                                                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-left hover:shadow-lg hover:border-[#005961]/30 transition-all group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-4 relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-black text-[#0097a7] bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100">#{order.id}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                {configs.find(c => c.id === order.recipientId)?.name}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-black text-lg text-[#005961] line-clamp-1 group-hover:text-[#0097a7] transition-colors">{order.recipientName}</h3>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2 text-slate-500 text-sm mb-6 relative z-10">
                                                    <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                                                    <p className="line-clamp-2 font-medium">{order.address}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide border ${order.status === OrderStatus.DELIVERED
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-[#d9f2f2] text-[#005961] border-[#b8e4e4]'
                                                            }`}>
                                                            {order.status.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                                        <Package size={14} />
                                                        <span>{order.items} Items</span>
                                                    </div>
                                                </div>

                                                {/* Decorative gradient blob */}
                                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br from-[#0097a7]/10 to-transparent rounded-full blur-2xl group-hover:from-[#0097a7]/20 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                            <Search size={32} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-2">No orders found</h3>
                                        <p className="text-slate-400 max-w-md mx-auto">
                                            We couldn't find any orders matching your search criteria. Try adjusting your filters or search terms.
                                        </p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setSelectedCustomer(null); }}
                                            className="mt-6 text-[#005961] font-bold text-sm hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 flex flex-col h-full bg-white relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-slate-50/50" />

                        {/* Detail View Container */}
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Detail Header */}
                            <div className="bg-white px-8 py-6 border-b border-slate-100 shadow-sm shrink-0">
                                <div className="max-w-5xl mx-auto flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedOrderId(null)}
                                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#d9f2f2] hover:text-[#005961] transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-2xl font-black text-[#005961] tracking-tight">Order #{activeOrder?.id}</h2>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide border ${activeOrder?.status === OrderStatus.DELIVERED
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-[#d9f2f2] text-[#005961] border-[#b8e4e4]'
                                                    }`}>
                                                    {activeOrder?.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">
                                                Recipient: <span className="text-slate-600">{activeOrder?.recipientName}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-all">
                                            Download POD
                                        </button>
                                        <button className="px-4 py-2 rounded-xl bg-[#005961] text-white font-bold text-sm shadow-lg shadow-[#005961]/20 hover:bg-[#00424a] transition-all">
                                            Contact Driver
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-5xl mx-auto space-y-8">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl bg-[#d9f2f2] flex items-center justify-center text-[#005961] mb-4">
                                                <MapPin size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Address</p>
                                            <p className="font-bold text-slate-800 leading-relaxed">{activeOrder?.address}</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                                                <Package size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Package Details</p>
                                            <p className="font-bold text-slate-800">{activeOrder?.items} Parcels</p>
                                            <p className="text-xs font-medium text-slate-400 mt-1">Standard Medical Supplies</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                                                <Truck size={24} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Arrival</p>
                                            <p className="font-bold text-slate-800">Today, 14:30 - 15:30</p>
                                            <p className="text-xs font-medium text-slate-400 mt-1">On Schedule</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Tracking Timeline</h3>
                                        <div className="space-y-8 pl-8 border-l-2 border-slate-100 relative">
                                            {statusList.map((status, index) => {
                                                const currentIndex = statusList.indexOf(activeOrder?.status || OrderStatus.ENTRY);
                                                const isActive = index <= currentIndex;
                                                const isCurrent = index === currentIndex;
                                                const meta = STATUS_METADATA[status];

                                                return (
                                                    <div key={status} className="relative group">
                                                        <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm transition-all ${isActive ? 'bg-[#005961] text-white scale-110' : 'bg-slate-200 text-slate-400'
                                                            }`}>
                                                            {isActive && <CheckCircle2 size={14} />}
                                                        </div>

                                                        <div className={`flex flex-col transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-base font-bold ${isActive ? 'text-[#005961]' : 'text-slate-400'}`}>{meta.label}</span>
                                                                {isCurrent && (
                                                                    <span className="text-[10px] bg-cyan-50 text-[#0097a7] px-2 py-0.5 rounded-full border border-cyan-100 font-bold uppercase tracking-wider animate-pulse">Live Status</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-400 mt-1 font-medium">
                                                                {isActive ? 'Completed successfully' : 'Pending...'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
