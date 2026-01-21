import React, { useState } from 'react';
import { Order, OrderStatus, CustomerConfig } from '../types';
import { STATUS_METADATA } from '../constants';
import { MapPin, Bell, Package, Calendar, Search, ExternalLink, Settings, CheckCircle, Clock, Info, ArrowRight, FileText, Truck, AlertCircle, ShoppingBag, Home, History, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressManagementView } from './AddressManagementView';

interface RecipientViewDesktopProps {
    orders: Order[];
    customerConfig: CustomerConfig;
    onUpdateConfig: (config: CustomerConfig) => void;
}

type ViewState = 'HOME' | 'DETAILS' | 'NOTIFICATIONS' | 'PREFERENCES' | 'ADDRESSES' | 'HISTORY';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'order' | 'system' | 'alert';
    read: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        title: 'Out for Delivery',
        message: 'Order #AL-1001 is on its way to Sunnyside Nursing Home. ETA: 12:30 PM.',
        time: '10 mins ago',
        type: 'order',
        read: false
    },
    {
        id: 'n2',
        title: 'Order Confirmed',
        message: 'Your request for Meadow View Residencies has been successfully processed.',
        time: '2 hours ago',
        type: 'system',
        read: true
    },
    {
        id: 'n3',
        title: 'Delivery Successful',
        message: 'Order #AL-1003 was signed for by Sarah J. at 09:15 AM today.',
        time: '5 hours ago',
        type: 'order',
        read: true
    },
    {
        id: 'n4',
        title: 'Address Verified',
        message: 'Account address update for Meadow View has been confirmed by our staff.',
        time: 'Yesterday',
        type: 'system',
        read: true
    }
];

export const RecipientViewDesktop: React.FC<RecipientViewDesktopProps> = ({ orders, customerConfig, onUpdateConfig }) => {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [preferences, setPreferences] = useState({
        orderPlaced: true,
        orderShipped: true,
        deliveredToday: true,
        outForDelivery: true,
        orderDelivered: true,
        failedAttempt: true,
        accountAlerts: false
    });

    const activeOrder = orders.find(o => o.id === selectedOrderId);

    const statusList = [
        OrderStatus.ENTRY,
        OrderStatus.DISPATCH,
        OrderStatus.PICKING,
        OrderStatus.PACKING,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED
    ];

    const handleOrderClick = (id: string) => {
        setSelectedOrderId(id);
        setView('DETAILS');
    };

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const prefConfig: Record<keyof typeof preferences, { label: string; icon: React.ReactNode; desc: string }> = {
        orderPlaced: {
            label: 'Order Placed',
            icon: <ShoppingBag size={20} />,
            desc: 'Receive confirmation when your order is first entered.'
        },
        orderShipped: {
            label: 'Order Dispatched',
            icon: <Truck size={20} />,
            desc: 'Get notified as soon as your parcel leaves our pharmacy.'
        },
        deliveredToday: {
            label: 'Scheduled for Today',
            icon: <Calendar size={20} />,
            desc: 'Daily reminder for orders arriving within the next 24 hours.'
        },
        outForDelivery: {
            label: 'Out for Delivery',
            icon: <MapPin size={20} />,
            desc: 'Real-time alert when the driver starts their route to you.'
        },
        orderDelivered: {
            label: 'Successfully Delivered',
            icon: <CheckCircle size={20} />,
            desc: 'Final confirmation including digital signature or photo POD.'
        },
        failedAttempt: {
            label: 'Failed Delivery Attempt',
            icon: <AlertCircle size={20} />,
            desc: 'Urgent notification if the driver cannot complete delivery.'
        },
        accountAlerts: {
            label: 'General System Updates',
            icon: <Info size={20} />,
            desc: 'Non-delivery related news and maintenance windows.'
        }
    };

    return (
        <div className="flex h-full bg-slate-50">
            {/* Sidebar Navigation */}
            <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12">
                            <img
                                src="/assets/cara-logo.png"
                                alt="Cara"
                                className="h-12 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Cara Portal</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">powered by Alphalake Ai</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => setView('HOME')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'HOME' ? 'bg-[#005961] text-white shadow-lg shadow-[#005961]/20' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Home size={20} />
                        <span className="font-bold text-sm">My Orders</span>
                    </button>

                    <button
                        onClick={() => setView('NOTIFICATIONS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${view === 'NOTIFICATIONS' ? 'bg-[#005961] text-white shadow-lg shadow-[#005961]/20' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Bell size={20} />
                        <span className="font-bold text-sm">Notifications</span>
                        <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    </button>

                    <button
                        onClick={() => setView('ADDRESSES')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'ADDRESSES' ? 'bg-[#005961] text-white shadow-lg shadow-[#005961]/20' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <MapPin size={20} />
                        <span className="font-bold text-sm">My Addresses</span>
                    </button>

                    <button
                        onClick={() => setView('PREFERENCES')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'PREFERENCES' ? 'bg-[#005961] text-white shadow-lg shadow-[#005961]/20' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Settings size={20} />
                        <span className="font-bold text-sm">Preferences</span>
                    </button>

                    <button
                        onClick={() => setView('HISTORY')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'HISTORY' ? 'bg-[#005961] text-white shadow-lg shadow-[#005961]/20' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <History size={20} />
                        <span className="font-bold text-sm">History</span>
                    </button>
                </nav>

                {/* Footer CTA */}
                <div className="p-4 border-t border-slate-100">
                    <div className="bg-[#005961] rounded-2xl p-5 text-white">
                        <h4 className="font-bold mb-2 text-sm">Need Help?</h4>
                        <p className="text-xs text-cyan-100 opacity-90 leading-relaxed mb-3">
                            Contact our pharmacy team for assistance with your orders.
                        </p>
                        <button className="w-full bg-white text-[#005961] px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                            Contact Support <ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'HOME' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            {/* Top Bar */}
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-6xl mx-auto">
                                    <h2 className="text-2xl font-black text-[#005961] mb-4">My Active Orders</h2>
                                    <div className="relative max-w-xl">
                                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by order number or location..."
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Orders Grid */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-6xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {orders.map(order => (
                                            <button
                                                key={order.id}
                                                onClick={() => handleOrderClick(order.id)}
                                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left hover:shadow-lg hover:border-[#005961]/30 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="text-xs font-bold text-[#0097a7] mb-2 block">#{order.id}</span>
                                                        <h3 className="font-bold text-lg text-[#005961] line-clamp-1 group-hover:text-[#0097a7] transition-colors">{order.recipientName}</h3>
                                                    </div>
                                                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase ${order.status === OrderStatus.DELIVERED
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-cyan-100 text-[#005961]'
                                                        }`}>
                                                        {order.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
                                                    <MapPin size={16} className="shrink-0 mt-0.5" />
                                                    <p className="line-clamp-2">{order.address}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                        <Package size={16} />
                                                        <span className="font-medium">{order.items} {order.items === 1 ? 'Parcel' : 'Parcels'}</span>
                                                    </div>
                                                    <ArrowRight size={18} className="text-[#0097a7] group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* CTA Card */}
                                    <div className="mt-8 bg-gradient-to-br from-[#005961] to-[#0097a7] rounded-3xl p-8 text-white shadow-xl">
                                        <div className="max-w-2xl">
                                            <h4 className="text-xl font-bold mb-3">Managing multiple sites?</h4>
                                            <p className="text-sm text-cyan-100 opacity-90 leading-relaxed mb-6">
                                                Bulk register your homes for priority notifications and custom delivery notes. Streamline your operations with our advanced address management system.
                                            </p>
                                            <button
                                                onClick={() => setView('ADDRESSES')}
                                                className="bg-white text-[#005961] px-6 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
                                            >
                                                Manage Addresses <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'DETAILS' && activeOrder && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col overflow-hidden bg-white"
                        >
                            {/* Header */}
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-4xl mx-auto">
                                    <button
                                        onClick={() => setView('HOME')}
                                        className="flex items-center gap-2 text-slate-600 hover:text-[#005961] mb-4 font-medium transition-colors"
                                    >
                                        <ArrowRight size={20} className="rotate-180" />
                                        Back to Orders
                                    </button>
                                    <h2 className="text-2xl font-black text-[#005961]">Order #{activeOrder.id}</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {/* Order Info */}
                                    <div className="bg-slate-50 rounded-2xl p-6">
                                        <h3 className="text-xl font-black text-[#005961] mb-3">{activeOrder.recipientName}</h3>
                                        <div className="flex items-start gap-2 text-slate-600">
                                            <MapPin size={20} className="text-[#0097a7] shrink-0 mt-0.5" />
                                            <p className="text-sm">{activeOrder.address}</p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                                            <Package className="text-[#0097a7] mb-3" size={24} />
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Items</p>
                                            <p className="text-xl font-bold text-slate-800">{activeOrder.items} Parcels</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                                            <Calendar className="text-[#0097a7] mb-3" size={24} />
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Last Update</p>
                                            <p className="text-xl font-bold text-slate-800">Today, 10:45</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                                            <Truck className="text-[#0097a7] mb-3" size={24} />
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                                            <p className="text-xl font-bold text-[#005961]">{activeOrder.status.replace(/_/g, ' ')}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-8">
                                        <h4 className="text-lg font-bold text-slate-800 mb-6">Delivery Timeline</h4>
                                        <div className="space-y-6 pl-6 border-l-2 border-[#d9f2f2] relative">
                                            {statusList.map((status, index) => {
                                                const currentIndex = statusList.indexOf(activeOrder.status || OrderStatus.ENTRY);
                                                const isActive = index <= currentIndex;
                                                const isCurrent = index === currentIndex;
                                                const meta = STATUS_METADATA[status];

                                                return (
                                                    <div key={status} className="relative">
                                                        <div className={`absolute -left-9 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md ${isActive ? 'bg-[#005961] text-white' : 'bg-slate-200 text-slate-400'
                                                            }`}>
                                                            {isActive && <CheckCircle2 size={16} />}
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className={`text-base font-bold ${isActive ? 'text-[#005961]' : 'text-slate-300'}`}>
                                                                    {meta.label}
                                                                </p>
                                                                <p className="text-sm text-slate-400 mt-1">
                                                                    {isActive ? 'Process confirmed' : 'Pending completion'}
                                                                </p>
                                                            </div>
                                                            {isCurrent && (
                                                                <span className="text-xs font-bold text-[#0097a7] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                                                                    LIVE
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button className="w-full bg-[#005961] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#005961]/20 hover:shadow-xl transition-all">
                                        Need Help? Contact Pharmacy <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'NOTIFICATIONS' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex flex-col overflow-hidden bg-white"
                        >
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-4xl mx-auto flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-[#005961]">Notifications</h2>
                                    <button className="text-sm font-bold text-[#0097a7] hover:text-[#005961] transition-colors">
                                        Mark all as read
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {DUMMY_NOTIFICATIONS.map(n => (
                                        <div
                                            key={n.id}
                                            className={`p-6 rounded-2xl border transition-all ${n.read
                                                    ? 'bg-white border-slate-200 opacity-70'
                                                    : 'bg-cyan-50/30 border-cyan-200 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-[#005961] text-white' :
                                                        n.type === 'alert' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {n.type === 'order' ? <Package size={20} /> : n.type === 'alert' ? <Info size={20} /> : <Clock size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-base font-bold text-slate-800">{n.title}</h4>
                                                        <span className="text-xs text-slate-400 font-medium">{n.time}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'PREFERENCES' && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col overflow-hidden bg-white"
                        >
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-2xl font-black text-[#005961] mb-2">Notification Preferences</h2>
                                    <p className="text-sm text-slate-500">Choose exactly which delivery milestones you want to be alerted about.</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(Object.keys(preferences) as Array<keyof typeof preferences>).map((key) => {
                                            const config = prefConfig[key];
                                            return (
                                                <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2.5 rounded-xl bg-white text-[#005961] shadow-sm">
                                                                {config.icon}
                                                            </div>
                                                            <span className="text-base font-bold text-slate-700">{config.label}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => togglePreference(key)}
                                                            className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${preferences[key] ? 'bg-[#0097a7]' : 'bg-slate-300'
                                                                }`}
                                                        >
                                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${preferences[key] ? 'left-8' : 'left-1'
                                                                }`}></div>
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-slate-500 leading-relaxed">{config.desc}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 flex gap-4">
                                        <div className="text-emerald-600 shrink-0"><CheckCircle size={24} /></div>
                                        <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                                            Milestone preferences are global and apply to all active orders on your account.
                                        </p>
                                    </div>

                                    <button className="w-full bg-[#005961] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#005961]/20 hover:shadow-xl transition-all">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'ADDRESSES' && (
                        <motion.div
                            key="addresses"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col overflow-hidden bg-slate-50"
                        >
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-6xl mx-auto">
                                    <h2 className="text-2xl font-black text-[#005961]">Address Management</h2>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-6xl mx-auto">
                                    <AddressManagementView
                                        customer={customerConfig}
                                        onUpdate={onUpdateConfig}
                                        currentUser="Client User"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'HISTORY' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col overflow-hidden bg-white"
                        >
                            <div className="bg-white border-b border-slate-100 px-8 py-6">
                                <div className="max-w-4xl mx-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#d9f2f2] flex items-center justify-center">
                                            <History size={24} className="text-[#0097a7]" />
                                        </div>
                                        <h2 className="text-2xl font-black text-[#005961]">Version History</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto">
                                    {customerConfig.addressHistory?.length > 0 ? (
                                        <div className="space-y-8">
                                            {customerConfig.addressHistory.map((history) => (
                                                <div key={history.id} className="relative pl-10 pb-8 border-l-2 border-slate-200 last:border-0 last:pb-0">
                                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-md ${history.action === 'CREATED' ? 'bg-[#0097a7]' :
                                                            history.action === 'DELETED' ? 'bg-rose-500' : 'bg-amber-500'
                                                        }`} />

                                                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">
                                                            {new Date(history.changedAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })} • {new Date(history.changedAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                        <p className="text-lg font-bold text-slate-800 leading-tight mb-3">
                                                            {history.details}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                                <User size={16} />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-600">{history.changedBy}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <Clock size={80} className="mx-auto mb-6 text-slate-300" />
                                            <p className="text-xl font-bold text-slate-400 mb-2">No history available</p>
                                            <p className="text-sm text-slate-300">Changes will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const CheckCircle2 = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
