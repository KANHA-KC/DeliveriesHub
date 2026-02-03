import React, { useState } from 'react';
import { Order, OrderStatus, CustomerConfig } from '../types';
import { STATUS_METADATA, ALPHALAKE_LOGO_URL, CARA_LOGO_URL } from '../constants';
import { MapPin, Bell, ChevronLeft, Package, Calendar, Search, ExternalLink, Settings, CheckCircle, Clock, Info, ArrowRight, FileText, Truck, AlertCircle, ShoppingBag, Home, History, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileAddressManager } from './MobileAddressManager';

interface RecipientViewProps {
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

export const RecipientView: React.FC<RecipientViewProps> = ({ orders, customerConfig, onUpdateConfig }) => {
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
      icon: <ShoppingBag size={18} />,
      desc: 'Receive confirmation when your order is first entered.'
    },
    orderShipped: {
      label: 'Order Dispatched',
      icon: <Truck size={18} />,
      desc: 'Get notified as soon as your parcel leaves our pharmacy.'
    },
    deliveredToday: {
      label: 'Scheduled for Today',
      icon: <Calendar size={18} />,
      desc: 'Daily reminder for orders arriving within the next 24 hours.'
    },
    outForDelivery: {
      label: 'Out for Delivery',
      icon: <MapPin size={18} />,
      desc: 'Real-time alert when the driver starts their route to you.'
    },
    orderDelivered: {
      label: 'Successfully Delivered',
      icon: <CheckCircle size={18} />,
      desc: 'Final confirmation including digital signature or photo POD.'
    },
    failedAttempt: {
      label: 'Failed Delivery Attempt',
      icon: <AlertCircle size={18} />,
      desc: 'Urgent notification if the driver cannot complete delivery.'
    },
    accountAlerts: {
      label: 'General System Updates',
      icon: <Info size={18} />,
      desc: 'Non-delivery related news and maintenance windows.'
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <AnimatePresence mode="wait">
        {view === 'HOME' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <div className="p-6 bg-white border-b border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-10">
                    <img
                      src="assets/cara-logo.png"
                      alt="Cara"
                      className="h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-black text-slate-800 tracking-tight leading-none">Cara Order Tracking Portal</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">powered by Alphalake Ai</p>
                  </div>
                </div>
                <button
                  onClick={() => setView('NOTIFICATIONS')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 relative active:scale-90 transition-all"
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                </button>
              </div>

              <div className="relative mb-2">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter an order no. to track"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">My Active Orders</h2>
              {orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-[#0097a7] mb-1 block">#{order.id}</span>
                      <h3 className="font-bold text-[#005961] line-clamp-1">{order.recipientName}</h3>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-[#005961]'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <MapPin size={12} />
                    <p className="line-clamp-1">{order.address}</p>
                  </div>
                </button>
              ))}

              <div className="bg-[#005961] rounded-3xl p-6 text-white mt-4 shadow-xl shadow-[#005961]/20">
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Manage site details</h4>
                  <p className="text-xs text-cyan-100 opacity-90 leading-relaxed max-w-[90%]">Add new and edit existing site contact details and addresses</p>
                </div>
                <button
                  onClick={() => setView('ADDRESSES')}
                  className="bg-white text-[#005961] px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Addresses and Contacts <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'DETAILS' && activeOrder && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-white"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <button
                onClick={() => setView('HOME')}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-bold text-[#005961]">Track Order #{activeOrder?.id}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#005961] tracking-tight">{activeOrder?.recipientName}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={16} className="text-[#0097a7] shrink-0" />
                  <p>{activeOrder?.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Package className="text-slate-400 mb-2" size={20} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Items</p>
                  <p className="text-sm font-bold text-slate-800">{activeOrder?.items} Parcels</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <Calendar className="text-slate-400 mb-2" size={20} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Last Update</p>
                  <p className="text-sm font-bold text-slate-800">Today, 10:45</p>
                </div>
              </div>

              <div className="space-y-8 pl-4 border-l-2 border-[#d9f2f2] relative">
                {statusList.map((status, index) => {
                  const currentIndex = statusList.indexOf(activeOrder?.status || OrderStatus.ENTRY);
                  const isActive = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const meta = STATUS_METADATA[status];

                  return (
                    <div key={status} className="relative">
                      <div className={`absolute -left-7 top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${isActive ? 'bg-[#005961] text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {isActive && <CheckCircle2 size={12} />}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-bold ${isActive ? 'text-[#005961]' : 'text-slate-300'}`}>{meta.label}</p>
                          <p className="text-xs text-slate-400">{isActive ? 'Process confirmed' : 'Pending completion'}</p>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#0097a7] bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">LIVE</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button className="w-full bg-[#005961] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#005961]/20">
                Need Help? Contact Pharmacy <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {view === 'NOTIFICATIONS' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col h-full bg-white"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView('HOME')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="font-bold text-[#005961]">Notifications</h2>
              </div>
              <button className="text-xs font-bold text-[#0097a7]">Mark all as read</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {DUMMY_NOTIFICATIONS.map(n => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all ${n.read ? 'bg-white border-slate-100 opacity-70' : 'bg-cyan-50/30 border-cyan-100 shadow-sm'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-[#005961] text-white' :
                      n.type === 'alert' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      {n.type === 'order' ? <Package size={18} /> : n.type === 'alert' ? <Info size={18} /> : <Clock size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setView('PREFERENCES')}
                className="w-full bg-white border border-slate-200 text-[#005961] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <Settings size={18} /> Notification Preferences
              </button>
            </div>
          </motion.div>
        )}

        {view === 'PREFERENCES' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-white"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <button
                onClick={() => setView('NOTIFICATIONS')}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-bold text-[#005961]">Activity Alerts</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Stay updated</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Choose exactly which delivery milestones you want to be alerted about.</p>
              </div>

              <div className="space-y-3 pb-8">
                {(Object.keys(preferences) as Array<keyof typeof preferences>).map((key) => {
                  const config = prefConfig[key];
                  return (
                    <div key={key} className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-white text-[#005961] shadow-sm`}>
                            {config.icon}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{config.label}</span>
                        </div>
                        <button
                          onClick={() => togglePreference(key)}
                          className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${preferences[key] ? 'bg-[#0097a7]' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${preferences[key] ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium pl-11">{config.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                <div className="text-emerald-500 shrink-0"><CheckCircle size={20} /></div>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">Milestone preferences are global and apply to all active orders on your account.</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setView('NOTIFICATIONS')}
                className="w-full bg-[#005961] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#005961]/20"
              >
                Apply Preferences
              </button>
            </div>
          </motion.div>
        )}

        {view === 'ADDRESSES' && (
          <motion.div
            key="addresses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-slate-50"
          >
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('HOME')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-black text-[#005961]">My Addresses</h2>
              </div>
              <button
                onClick={() => setView('HISTORY')}
                className="w-10 h-10 rounded-full bg-[#d9f2f2] flex items-center justify-center text-[#005961] active:scale-95 transition-transform"
              >
                <History size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MobileAddressManager
                customer={customerConfig}
                onUpdate={onUpdateConfig}
                currentUser="Client User"
                onShowHistory={() => setView('HISTORY')}
              />
            </div>
          </motion.div>
        )}

        {view === 'HISTORY' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full bg-slate-50"
          >
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('ADDRESSES')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d9f2f2] flex items-center justify-center">
                    <History size={20} className="text-[#0097a7]" />
                  </div>
                  <h2 className="text-lg font-black text-[#005961]">Version History</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {customerConfig.addressHistory?.length > 0 ? (
                <div className="space-y-6">
                  {customerConfig.addressHistory.map((history) => (
                    <div key={history.id} className="relative pl-8 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${history.action === 'CREATED' ? 'bg-[#0097a7]' :
                        history.action === 'DELETED' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          {new Date(history.changedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} • {new Date(history.changedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <p className="text-base font-bold text-slate-800 leading-tight">
                          {history.details}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User size={12} />
                          </div>
                          <span className="text-sm font-medium text-slate-500">{history.changedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Clock size={64} className="mx-auto mb-4 text-slate-300" />
                  <p className="text-base font-bold text-slate-400">No history available</p>
                  <p className="text-sm text-slate-300 mt-2">Changes will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckCircle2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
