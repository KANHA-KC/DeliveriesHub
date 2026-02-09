import React, { useState } from 'react';
import { Settings, Check, ArrowLeft, Plug, Printer, Mail, MoreVertical, RefreshCw, AlertCircle, Plus, Package, Truck } from 'lucide-react';
import { PostalCodeLabel } from '../types';

interface OrgSettingsViewProps {
    postalCodeLabel: PostalCodeLabel;
    onUpdatePostalCodeLabel: (label: PostalCodeLabel) => void;
    onBack?: () => void;
    initialTab?: 'general' | 'connectors' | 'printing' | 'notifications';
}

export const OrgSettingsView: React.FC<OrgSettingsViewProps> = ({
    postalCodeLabel,
    onUpdatePostalCodeLabel,
    onBack,
    initialTab = 'general'
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'connectors' | 'printing' | 'notifications'>(initialTab);
    const [sentNotifications, setSentNotifications] = useState<string[]>([]);

    const handleSendNotification = (title: string) => {
        setSentNotifications(prev => [...prev, `${title}-sending`]);
        setTimeout(() => {
            setSentNotifications(prev =>
                prev.filter(id => id !== `${title}-sending`).concat(title)
            );
        }, 2000);
    };
    const [connecting, setConnecting] = useState<string | null>(null);
    const [connectedConnectors, setConnectedConnectors] = useState<string[]>(['McLernons', 'Sage']);

    const options: PostalCodeLabel[] = ['Post Code', 'Eire Code', 'Zip Code', 'Postal Index Number'];

    const handleConnect = (name: string) => {
        setConnecting(name);
        // Simulate API call
        setTimeout(() => {
            setConnectedConnectors(prev => [...prev, name]);
            setConnecting(null);
        }, 1500);
    };

    const handleDisconnect = (name: string) => {
        if (window.confirm(`Disconnect ${name}?`)) {
            setConnectedConnectors(prev => prev.filter(c => c !== name));
        }
    };

    const handlePrintLabel = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Label Print</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        .label { width: 105mm; height: 148mm; border: 1px solid #000; padding: 10mm; box-sizing: border-box; position: relative; }
                        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                        .sender { font-size: 10px; }
                        .qr { width: 60px; height: 60px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; }
                        .divider { border-top: 2px dashed #000; margin: 20px 0; }
                        .recipient h1 { margin: 0; font-size: 24px; }
                        .footer { position: absolute; bottom: 10mm; left: 10mm; right: 10mm; display: flex; justify-content: space-between; align-items: flex-end; border-top: 4px solid #000; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="label">
                        <div class="header">
                            <div class="sender">
                                <strong>SENDER:</strong><br/>
                                Cara Allcare Pharmacy<br/>
                                Distribution Centre, Dublin
                            </div>
                            <div class="qr">QR CODE</div>
                        </div>
                        <div class="divider"></div>
                        <div class="recipient">
                            <p style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Deliver To:</p>
                            <h1>Maynooth Lodge Nursing Home</h1>
                            <p>Main Street, Maynooth, Co. Kildare</p>
                            <h2 style="margin-top: 10px;">W23 V1P9</h2>
                        </div>
                        <div style="margin-top: 20px;">
                            <p style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Contact:</p>
                            <p>Sarah Smith - 01 628 9999</p>
                        </div>
                        <div class="footer">
                            <div>
                                <p style="font-weight: bold; font-size: 12px; margin: 0;">BOX 1 OF 3</p>
                                <p style="font-family: monospace; font-size: 10px; margin: 0;">ID: BOX-1001-1</p>
                            </div>
                            <h1 style="margin: 0; font-size: 32px;">AL-1001</h1>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const renderGeneral = () => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start gap-6 mb-8">
                <div className="w-14 h-14 bg-[#E0F2F1] rounded-2xl flex items-center justify-center text-[#0097a7] shrink-0">
                    <Settings size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Regional Settings</h3>
                    <p className="text-slate-400 text-sm mt-1">Configure how address formats and regional specifics are displayed across the platform.</p>
                </div>
            </div>

            <div className="pl-20">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                    Format / Region Label for Postal Codes
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => onUpdatePostalCodeLabel(option)}
                            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${postalCodeLabel === option
                                ? 'bg-[#E0F2F1] border-[#0097a7] text-[#005961] shadow-md ring-1 ring-[#0097a7]/20'
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200'
                                }`}
                        >
                            <span className="font-bold text-md">{option}</span>
                            {postalCodeLabel === option ? (
                                <div className="bg-[#0097a7] text-white p-1.5 rounded-full shadow-lg">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderConnectors = () => {
        const connectors = [
            {
                name: 'McLernons',
                logo: 'assets/mclernons-logo.png',
                description: 'Pharmacy Patient Medication Record System'
            },
            {
                name: 'Sage',
                logo: 'assets/Sage-logo_svg.svg.png',
                description: 'Financial & Accounting Integration'
            },
            {
                name: 'Stripe',
                logo: 'assets/stripe.svg',
                description: 'Payment Processing Platform'
            },
            {
                name: 'Digicare',
                logo: 'assets/digicare.png',
                description: 'Digital Care Records'
            },
            {
                name: 'eNova',
                logo: 'assets/eNova.jpg',
                description: 'Energy Management Systems'
            },
            {
                name: 'Zapier',
                logo: 'assets/zapier.svg',
                description: 'Automation Workflow Platform'
            },
            {
                name: 'n8n',
                logo: 'assets/n8n.png',
                description: 'Workflow Automation Tool'
            },
            {
                name: 'Workato',
                logo: 'assets/workato.png',
                description: 'Enterprise Integration Platform'
            }
        ];

        return (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-14 h-14 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-[#1E88E5] shrink-0">
                        <Plug size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Integration Store</h3>
                        <p className="text-slate-400 text-sm mt-1">Connect your workspace with external tools and services.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connectors.map((connector, idx) => (
                        <div key={idx} className="p-6 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-[#0097a7]/30 transition-all group flex flex-col justify-between h-[220px]">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-auto max-w-[100px] flex items-center">
                                        <img src={connector.logo} alt={connector.name} className="h-full w-full object-contain object-left" />
                                    </div>
                                    {connectedConnectors.includes(connector.name) ? (
                                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Connected</span>
                                        </div>
                                    ) : (
                                        <button className="text-slate-300 hover:text-slate-500">
                                            <MoreVertical size={16} />
                                        </button>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{connector.name}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{connector.description}</p>
                            </div>

                            <button
                                onClick={() => {
                                    if (connectedConnectors.includes(connector.name)) {
                                        handleDisconnect(connector.name);
                                    } else {
                                        handleConnect(connector.name);
                                    }
                                }}
                                disabled={connecting === connector.name}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${connectedConnectors.includes(connector.name)
                                    ? 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                    : 'bg-[#005961] text-white shadow-lg hover:shadow-xl hover:bg-[#004a50]'
                                    }`}
                            >
                                {connecting === connector.name ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Connecting...
                                    </>
                                ) : connectedConnectors.includes(connector.name) ? (
                                    'Manage'
                                ) : (
                                    'Connect'
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPrinting = () => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start gap-6 mb-8">
                <div className="w-14 h-14 bg-[#FFF3E0] rounded-2xl flex items-center justify-center text-[#FB8C00] shrink-0">
                    <Printer size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Label Printing</h3>
                    <p className="text-slate-400 text-sm mt-1">Design and manage shipping labels.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <h4 className="text-sm font-bold text-slate-600 mb-4">Preview (A6 Standard)</h4>
                    <div className="aspect-[105/148] w-full max-w-sm bg-white border border-slate-300 shadow-md p-6 relative mx-auto lg:mx-0">
                        {/* Label Content */}
                        <div className="h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500">Sender:</p>
                                        <p className="text-xs font-bold">Cara Allcare Pharmacy</p>
                                        <p className="text-[10px] text-slate-600">Distribution Centre, Dublin</p>
                                    </div>
                                    <div className="w-16 h-16 bg-black">
                                        {/* QR Placeholder */}
                                        <div className="w-full h-full text-white text-[8px] flex items-center justify-center text-center p-1">QR CODE</div>
                                    </div>
                                </div>
                                <div className="border-t-2 border-dashed border-black my-4"></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-500">Deliver To:</p>
                                    <h2 className="text-xl font-black leading-tight">Maynooth Lodge Nursing Home</h2>
                                    <p className="text-sm font-bold mt-1">Main Street, Maynooth</p>
                                    <p className="text-sm font-bold">Co. Kildare</p>
                                    <p className="text-lg font-black mt-2">W23 V1P9</p>
                                </div>
                                <div className="pt-4">
                                    <p className="text-[10px] uppercase font-bold text-slate-500">Contact:</p>
                                    <p className="text-sm font-bold">Sarah Smith</p>
                                    <p className="text-sm">01 628 9999</p>
                                </div>
                            </div>
                            <div className="border-t-4 border-black pt-2 flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold">BOX 1 OF 3</p>
                                    <p className="text-[10px] font-mono">ID: BOX-1001-1</p>
                                </div>
                                <h1 className="text-4xl font-black tracking-tighter">AL-1001</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h4 className="text-sm font-bold text-[#005961] mb-2 flex items-center gap-2">
                            <Settings size={16} /> Label Configuration
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Paper Size</label>
                                <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-bold outline-none focus:border-[#0097a7]">
                                    <option>A6 (105 x 148 mm)</option>
                                    <option>A4 (4 labels per sheet)</option>
                                    <option>Thermal Roll (4x6 inch)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Orientation</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-[#E0F2F1] text-[#005961] font-bold rounded-lg text-xs border border-[#0097a7]">Portrait</button>
                                    <button className="flex-1 py-2 bg-white text-slate-500 font-bold rounded-lg text-xs border border-slate-200">Landscape</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h4 className="text-sm font-bold text-[#005961] mb-2">Actions</h4>
                        <button
                            onClick={handlePrintLabel}
                            className="w-full py-3 bg-[#005961] text-white font-bold rounded-xl shadow-lg hover:bg-[#004a50] transition-all flex items-center justify-center gap-2 mb-3">
                            <Printer size={18} /> Print Test Label
                        </button>
                        <button className="w-full py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            Download PDF Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => {
        const notifications = [
            {
                title: 'Order Picked & Packed',
                subject: 'Your order is being picked and packed for delivery',
                time: '10:30 AM',
                status: 'Sent',
                color: 'bg-blue-500'
            },
            {
                title: 'Order Despatched',
                subject: 'Your order has been despatched for delivery',
                time: '11:45 AM',
                status: 'Scheduled',
                color: 'bg-amber-500'
            },
            {
                title: 'Order Delivered',
                subject: 'Your order has been delivered and signed for',
                time: '2:15 PM',
                status: 'Active',
                color: 'bg-emerald-500'
            }
        ];

        return (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-14 h-14 bg-[#F3E5F5] rounded-2xl flex items-center justify-center text-[#AB47BC] shrink-0">
                        <Mail size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Email Notifications</h3>
                        <p className="text-slate-400 text-sm mt-1">Manage automated customer communications and tracking notifications.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {notifications.map((notif, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-3xl p-2 border border-slate-100 hover:shadow-lg transition-all group flex flex-col h-[400px]">
                            {/* Email Preview Header */}
                            <div className="bg-white rounded-2xl p-4 shadow-sm mb-2 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${notif.color} opacity-80 uppercase tracking-wide`}>
                                        {notif.title}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold">{notif.time}</p>
                                </div>
                                <p className="text-xs font-bold text-slate-800 mb-0.5">Subject:</p>
                                <p className="text-xs text-slate-600 font-medium leading-tight">{notif.subject}</p>
                            </div>

                            {/* Email Mock Body */}
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col relative">
                                <div className="bg-[#003B46] h-12 flex items-center px-4">
                                    <div className="w-20 h-4 bg-white/20 rounded-md"></div>
                                </div>
                                <div className="p-4 flex-1">
                                    <div className="w-16 h-2 bg-slate-100 rounded mb-4"></div>
                                    <div className="space-y-2 mb-6">
                                        <div className="w-full h-2 bg-slate-100 rounded"></div>
                                        <div className="w-5/6 h-2 bg-slate-100 rounded"></div>
                                        <div className="w-4/6 h-2 bg-slate-100 rounded"></div>
                                    </div>

                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-center">
                                        <p className="text-[10px] font-bold text-[#005961] mb-2 uppercase tracking-wide">Order Status Update</p>
                                        <div className="w-8 h-8 mx-auto bg-[#e0f7fa] rounded-full flex items-center justify-center text-[#0097a7] mb-1">
                                            {idx === 0 ? <Package size={14} /> : idx === 1 ? <Truck size={14} /> : <Check size={14} />}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSendNotification(notif.title)}
                                        disabled={sentNotifications.includes(`${notif.title}-sending`) || sentNotifications.includes(notif.title)}
                                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${sentNotifications.includes(notif.title)
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : sentNotifications.includes(`${notif.title}-sending`)
                                                ? 'bg-slate-100 text-slate-400'
                                                : 'bg-[#005961] text-white shadow-md hover:bg-[#004a50]'
                                            }`}
                                    >
                                        {sentNotifications.includes(`${notif.title}-sending`) ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : sentNotifications.includes(notif.title) ? (
                                            <>
                                                <Check size={14} /> Test Sent
                                            </>
                                        ) : (
                                            <>
                                                <Mail size={14} /> Send Test Email
                                            </>
                                        )}
                                    </button>

                                    {/* Footer Requirement */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-slate-100 p-3 mt-auto border-t border-slate-200">
                                        <p className="text-[8px] text-center text-slate-500 font-medium leading-relaxed">
                                            Manage updates, contact information and order tracking -
                                            <span className="text-[#005961] font-bold hover:underline cursor-pointer"> register here for the Cara Order Tracking Portal</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl w-full mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-[#005961] transition-all shadow-sm"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-3xl font-black text-[#005961] tracking-tight">Organisation Settings</h2>
                        <p className="text-slate-400 font-medium">Manage your organization preferences and configurations</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
                    {[
                        { id: 'general', label: 'General', icon: Settings },
                        { id: 'connectors', label: 'Connectors', icon: Plug },
                        { id: 'printing', label: 'Labels & Print', icon: Printer },
                        { id: 'notifications', label: 'Notifications', icon: Mail }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-[#005961] shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'general' && renderGeneral()}
            {activeTab === 'connectors' && renderConnectors()}
            {activeTab === 'printing' && renderPrinting()}
            {activeTab === 'notifications' && renderNotifications()}
        </div>
    );
};
