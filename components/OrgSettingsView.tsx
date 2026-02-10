import React, { useState, useEffect } from 'react';
import { Settings, Check, ArrowLeft, Plug, Printer, Mail, MoreVertical, RefreshCw, AlertCircle, Plus, Package, Truck, Search, Filter, LayoutDashboard, X } from 'lucide-react';
import { PostalCodeLabel } from '../types';

interface OrgSettingsViewProps {
    postalCodeLabel: PostalCodeLabel;
    onUpdatePostalCodeLabel: (label: PostalCodeLabel) => void;
    onBack?: () => void;
    initialTab?: 'general' | 'connectors' | 'printing' | 'notifications' | 'addresses';
    viewMode?: 'ORG' | 'HUB';
}

export const OrgSettingsView: React.FC<OrgSettingsViewProps> = ({
    postalCodeLabel,
    onUpdatePostalCodeLabel,
    onBack,
    initialTab,
    viewMode = 'ORG'
}) => {
    // Determine default tab based on viewMode if initialTab is not provided or invalid for the mode
    const getDefaultTab = () => {
        if (initialTab) return initialTab;
        return viewMode === 'ORG' ? 'general' : 'addresses';
    };

    const [activeTab, setActiveTab] = useState<'general' | 'connectors' | 'printing' | 'notifications' | 'addresses'>(
        initialTab || (viewMode === 'ORG' ? 'general' : 'addresses')
    );
    const [sentNotifications, setSentNotifications] = useState<string[]>([]);

    // Reset activeTab when viewMode changes
    useEffect(() => {
        const defaultTab = viewMode === 'ORG' ? 'general' : 'addresses';
        setActiveTab(initialTab || defaultTab);
    }, [viewMode, initialTab]);

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

    // Request Access Modal State
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestConnector, setRequestConnector] = useState<{ name: string; logo: string } | null>(null);

    const handleRequestAccess = (connector: { name: string; logo: string }) => {
        setRequestConnector(connector);
        setRequestModalOpen(true);
    };

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedConnector, setSelectedConnector] = useState<any>(null);

    const handleOpenDetail = (connector: any) => {
        setSelectedConnector(connector);
        setDetailModalOpen(true);
    };

    const submitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            alert(`Request sent for ${requestConnector?.name}! We will be in touch shortly.`);
            setRequestModalOpen(false);
            setRequestConnector(null);
        }, 1000);
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

    /* Detail Modal */
    const renderDetailModal = () => {
        if (!detailModalOpen || !selectedConnector) return null;

        const isConnected = connectedConnectors.includes(selectedConnector.name);

        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 p-8 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                    {/* Close Button - Moved slightly higher and right to spacing */}
                    <button
                        onClick={() => setDetailModalOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all z-50 shadow-sm border border-slate-100"
                    >
                        <X size={20} />
                    </button>

                    <div className="overflow-y-auto custom-scrollbar space-y-4 px-1 mt-2">
                        {/* Top Grid: Logo + Status/Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Logo Box - Faint white/grey background */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center h-[140px] shadow-sm">
                                <img
                                    src={selectedConnector.logo}
                                    alt={selectedConnector.name}
                                    className="h-full w-auto object-contain mix-blend-multiply"
                                    style={{ filter: 'contrast(1.1) brightness(1.1)' }}
                                />
                            </div>

                            {/* Status and Tags Box - No Background/Border */}
                            <div className="md:col-span-2 p-2 flex flex-col justify-start h-[140px]">
                                <div>
                                    {/* Name and Status on same row */}
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tight truncate pr-4">{selectedConnector.name}</h2>
                                        {isConnected ? (
                                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-wide">Active</span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 bg-white px-3 py-1.5 rounded-full shadow-sm shrink-0">
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar pr-2 content-start mt-2">
                                    {selectedConnector.tags?.map((tag: string) => {
                                        const flags: { [key: string]: string } = {
                                            'UK': '🇬🇧', 'USA': '🇺🇸', 'US': '🇺🇸', 'IRE': '🇮🇪', 'FR': '🇫🇷',
                                            'DE': '🇩🇪', 'IN': '🇮🇳', 'EU': '🇪🇺', 'CAN': '🇨🇦', 'AUS': '🇦🇺'
                                        };
                                        const isFlag = flags[tag];
                                        return (
                                            <span key={tag} className={`px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-sm bg-white ${isFlag ? 'text-lg leading-none' : 'text-[11px]'}`}>
                                                {isFlag || tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* About Section - Removed bg-slate-50 and border */}
                        <div className="p-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About this Integration</h4>
                            <p className="text-slate-600 leading-relaxed text-sm mb-3">
                                {selectedConnector.description}. Seamlessly integrate {selectedConnector.name} with your workspace to unlock advanced capabilities.
                                This connector enables secure data exchange, real-time synchronization, and enhanced workflow automation tailored for your needs.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Our integration is designed to be robust and compliant, ensuring that your data flows efficiently between systems without manual intervention.
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Key Features</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    'Real-time data synchronization',
                                    'Secure end-to-end encryption',
                                    'Automated workflow triggers',
                                    'Detailed audit logging',
                                    'Role-based access control',
                                    'Customizable data mapping'
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0097a7] shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (isConnected) {
                                            handleDisconnect(selectedConnector.name);
                                        } else {
                                            handleConnect(selectedConnector.name);
                                        }
                                    }}
                                    disabled={connecting === selectedConnector.name}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isConnected
                                        ? 'bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 shadow-sm'
                                        : 'bg-[#005961] text-white shadow-lg hover:shadow-xl hover:bg-[#004a50]'
                                        }`}
                                >
                                    {connecting === selectedConnector.name ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : isConnected ? (
                                        'Disconnect'
                                    ) : (
                                        'Connect Integration'
                                    )}
                                </button>
                                {isConnected && (
                                    <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                                        Manage Settings
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* Request Modal */
    const renderRequestModal = () => {
        if (!requestModalOpen || !requestConnector) return null;

        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-8 relative animate-in zoom-in-95 duration-200">
                    <button
                        onClick={() => setRequestModalOpen(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3">
                            <img
                                src={requestConnector.logo}
                                alt={requestConnector.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                                style={{ filter: 'contrast(1.1) brightness(1.1)' }}
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Request Access</h3>
                            <p className="text-sm font-medium text-slate-500">Get {requestConnector.name} for your organization</p>
                        </div>
                    </div>

                    <form onSubmit={submitRequest} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#0097a7] font-medium" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Email</label>
                                <input required type="email" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#0097a7] font-medium" placeholder="john@company.com" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
                            <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#0097a7] font-medium" placeholder="Company Ltd" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Use Case / Requirements</label>
                            <textarea required rows={3} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#0097a7] font-medium resize-none" placeholder="Briefly describe how you plan to use this integration..." />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRequestModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl font-bold bg-[#005961] text-white shadow-lg hover:bg-[#004a50] hover:shadow-xl transition-all"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
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

    const filterCategories = [
        {
            title: "Tags",
            options: [
                "Patient Med Records / PMR", "Electronic Meds Admin Records / eMAR", "Elect. Patient Records / EPR",
                "Finance", "Accounts", "Invoicing", "Payments", "Electronic Health Records / EHR",
                "Diagnostics", "Logistics", "Workforce", "Collaboration", "Lifestyle", "Prevention",
                "Pathways", "Primary Care", "Community Care", "Nursing Homes", "Care Homes", "NHS",
                "Pharmacy", "Dentistry", "Ophthalmology", "Opticians", "Insurance", "Secondary Care",
                "Cancer", "Orthopaedics", "Private", "Patient Communications", "Radiology", "Referrals",
                "Prescribing", "Health Coach", "Personal Health", "Physio", "Fitness", "Wearables",
                "Clinical health monitoring", "Mental Health", "CBT", "ADHD", "Anxiety", "Chiropody",
                "Chiropractic", "Cardiovascular", "Neurology", "Endocrinology", "Thyroid", "Hormonal",
                "Women's Health", "Menopause", "Menstruation", "Pregnancy", "Sexual Health",
                "Family Planning", "Psychology", "Psychiatry", "Sleep"
            ]
        },
        {
            title: "Data Standard",
            options: ["Open EHR", "FHIR", "DICOM"]
        },
        {
            title: "Integration",
            options: ["Rest API", "SOAP", "Browser Control", "PC Control"]
        },
        {
            title: "Sovereignty",
            options: ["UK", "USA", "IRE", "FR", "DE", "IN"],
            isCountry: true
        },
        {
            title: "Hosting",
            options: ["UK", "EU", "IN", "US", "CAN", "AUS"],
            isCountry: true
        },
        {
            title: "Markets",
            options: ["UK", "IRE", "EU", "IN", "US", "CAN", "AUS"],
            isCountry: true
        },
        {
            title: "Compliance",
            options: ["NHS DTAC", "NHS DSPT", "SaMD Class I", "SaMD Class IIa", "SaMD Class IIb", "SaMD Class III", "GDPR", "HIPAA"]
        },
        {
            title: "Access",
            options: [
                "Open API", "Sandbox, application req.", "Sandbox, no application req.",
                "£ - Price online", "£ - POA", "Free, application req."
            ]
        }
    ];

    // State for filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // State for Addresses moved from AdminView
    const [enabledAddressSystems, setEnabledAddressSystems] = useState<string[]>(['MCLERNONS', 'SAGE']);

    const toggleFilter = (filter: string) => {
        setSelectedFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const renderConnectors = () => {
        const connectors = [
            {
                name: 'McLernons',
                logo: 'assets/mclernons-logo.png',
                description: 'Pharmacy Patient Medication Record System',
                tags: ['Patient Med Records / PMR', 'Pharmacy', 'IRE', 'UK', 'Rest API']
            },
            {
                name: 'Sage',
                logo: 'assets/Sage-logo_svg.svg.png',
                description: 'Financial & Accounting Integration',
                tags: ['Finance', 'Accounts', 'Invoicing', 'UK', 'Rest API', 'GDPR']
            },
            {
                name: 'Stripe',
                logo: 'assets/stripe.svg',
                description: 'Payment Processing Platform',
                tags: ['Payments', 'Finance', 'Global', 'Rest API', 'Open API']
            },
            {
                name: 'Digicare',
                logo: 'assets/digicare.png',
                description: 'Digital Care Records',
                tags: ['Electronic Health Records / EHR', 'Care Homes', 'Nursing Homes', 'UK']
            },
            {
                name: 'eNova',
                logo: 'assets/eNova.jpg',
                description: 'Energy Management Systems',
                tags: ['Logistics', 'Workforce', 'Sustainability']
            },
            {
                name: 'Allcare Pharmacy',
                logo: 'assets/cara-logo.png',
                description: 'Customer portal for pharmacy operations and prescriptions',
                tags: ['Pharmacy', 'Prescriptions', 'UK', 'Rest API']
            },
            {
                name: 'PatientSource',
                logo: 'assets/PatientSource .webp',
                description: 'Cloud-based EPR used across NHS and private healthcare',
                tags: ['Electronic Health Records / EHR', 'NHS', 'UK', 'Private']
            },
            {
                name: 'Cerner',
                logo: 'assets/Cerner.webp',
                description: 'Enterprise electronic patient record (EPR) system',
                tags: ['Electronic Health Records / EHR', 'Global', 'USA', 'FHIR']
            },
            {
                name: 'EPIC',
                logo: 'assets/Epic.webp',
                description: 'FHIR-based electronic patient record platform',
                tags: ['Electronic Health Records / EHR', 'FHIR', 'Global', 'USA']
            },
            {
                name: 'EIDO',
                logo: 'assets/EIDO.webp',
                description: 'Electronic patient consent management platform',
                tags: ['Patient Communications', 'Compliance', 'UK']
            },
            {
                name: 'Floki Health',
                logo: 'assets/Floki Health.webp',
                description: 'Asset and health tracking integration platform',
                tags: ['Logistics', 'Workforce', 'Diagnostics']
            },
            {
                name: 'NHS ESR',
                logo: 'assets/NHS ESR.webp',
                description: 'Electronic Staff Record system for workforce data',
                tags: ['NHS', 'Workforce', 'UK']
            },
            {
                name: 'Hero Health',
                logo: 'assets/Hero Health.png',
                description: 'Patient triage, bookings, and messaging for GP practices',
                tags: ['Patient Communications', 'Primary Care', 'Rest API']
            },
            {
                name: 'Me Learning',
                logo: 'assets/me learning.png',
                description: 'Digital and face-to-face healthcare training platform',
                tags: ['Workforce', 'Training', 'UK']
            },
            {
                name: 'Metriport',
                logo: 'assets/metriport.webp',
                description: 'Unified healthcare data integration platform',
                tags: ['Diagnostics', 'Integration', 'Rest API', 'USA']
            },
            {
                name: 'Thriva',
                logo: 'assets/thriva.webp',
                description: 'At-home diagnostics and blood testing services',
                tags: ['Diagnostics', 'Personal Health', 'UK']
            },
            {
                name: 'SigmaView',
                logo: 'assets/Sigma view.webp',
                description: 'Patient waiting list and care pathway management',
                tags: ['Pathways', 'Patient Communications', 'UK']
            },
            {
                name: 'Sigma Intelligence',
                logo: 'assets/Sigma intellegence.png',
                description: 'Automation engine for patient pathway rules',
                tags: ['Pathways', 'Automation', 'Integration']
            },
            {
                name: 'RateMyShift',
                logo: 'assets/Rate my shift.webp',
                description: 'Shift feedback and wellbeing app for nursing teams',
                tags: ['Workforce', 'Mental Health', 'UK']
            },
            {
                name: 'Employee Onboarding',
                logo: 'assets/Employee onbording.webp',
                description: 'Digital workforce onboarding and HR process tracking',
                tags: ['Workforce', 'HR', 'Efficiency']
            },
            {
                name: 'Pharmacy Customer Portal',
                logo: 'assets/Pharmacy Customer Portal.webp',
                description: 'Web portal for pharmacy customers to view and manage prescriptions',
                tags: ['Pharmacy', 'Patient Communications', 'Prescribing']
            },
            {
                name: 'Automated Drug Invoicing',
                logo: 'assets/Automated Drug Invoicing.webp',
                description: 'Automated invoice generation from pharmacy prescriptions',
                tags: ['Finance', 'Invoicing', 'Pharmacy', 'Automation']
            }
        ];

        const filteredConnectors = connectors.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilters = selectedFilters.length === 0 ||
                selectedFilters.some(f => c.tags?.includes(f));
            return matchesSearch && matchesFilters;
        });

        return (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-start gap-6 mb-8">
                    <div className="w-14 h-14 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-[#1E88E5] shrink-0">
                        <Plug size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800">Integration Store</h3>
                        <p className="text-slate-400 text-sm mt-1">Connect your workspace with external tools and services.</p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search integrations..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0097a7] outline-none transition-all font-medium text-slate-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`px-4 py-3 rounded-xl border flex items-center gap-2 font-bold transition-all ${isFiltersOpen ? 'bg-[#E0F2F1] border-[#0097a7] text-[#006064]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Filter size={20} />
                            Filters
                            {selectedFilters.length > 0 && (
                                <span className="bg-[#0097a7] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                    {selectedFilters.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Expandable Filter Panel */}
                    {isFiltersOpen && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-in slide-in-from-top-2 duration-200 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {filterCategories.map((category, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{category.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {category.options.map((option) => {
                                                const getCountryFlag = (code: string) => {
                                                    const flags: { [key: string]: string } = {
                                                        'UK': '🇬🇧', 'USA': '🇺🇸', 'US': '🇺🇸', 'IRE': '🇮🇪', 'FR': '🇫🇷',
                                                        'DE': '🇩🇪', 'IN': '🇮🇳', 'EU': '🇪🇺', 'CAN': '🇨🇦', 'AUS': '🇦🇺'
                                                    };
                                                    return flags[code] || code;
                                                };

                                                const isCountry = (category as any).isCountry;

                                                return (
                                                    <button
                                                        key={option}
                                                        onClick={() => toggleFilter(option)}
                                                        title={isCountry ? option : undefined}
                                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${selectedFilters.includes(option)
                                                            ? 'bg-[#0097a7] border-[#0097a7] text-white shadow-sm'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-[#0097a7] hover:text-[#0097a7]'
                                                            }`}
                                                    >
                                                        {isCountry ? <span className="text-lg leading-none">{getCountryFlag(option)}</span> : option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConnectors.map((connector, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleOpenDetail(connector)}
                            className="p-6 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-[#0097a7]/30 transition-all group flex flex-col justify-between h-[220px] cursor-pointer bg-white"
                        >
                            <div> {/* This div wraps the logo/status and text content */}
                                <div className="flex justify-between items-start mb-4">
                                    {/* Fixed 80x80px logo container with faint grey fill */}
                                    <div className="w-[50px] h-[50px] bg-slate-50 rounded-xl flex items-center justify-center shrink-0 p-1">
                                        <img
                                            src={connector.logo}
                                            alt={connector.name}
                                            className="w-full h-full object-contain object-center mix-blend-multiply"
                                            style={{ filter: 'contrast(1.1) brightness(1.1)' }}
                                        />
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
                                <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">{connector.description}</p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
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
                    {/* Extra Connectors rendered in the same grid flow */}
                    {[
                        {
                            name: 'Alphabot for Teams',
                            logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg',
                            description: 'AI-powered assistant integrated with Microsoft Teams.',
                            tags: ['AI', 'Communication', 'Teams']
                        },
                        {
                            name: 'Oracle',
                            logo: 'assets/oracle.png',
                            description: 'Comprehensive cloud computing and database solutions.',
                            tags: ['Enterprise', 'Cloud', 'Database']
                        },
                        {
                            name: 'ServiceNow',
                            logo: 'assets/service now.webp',
                            description: 'Digital workflow and IT service management platform.',
                            tags: ['ITSM', 'Workflow', 'Enterprise']
                        },
                        {
                            name: 'Okta',
                            logo: 'assets/okta-logo-onblue.webp',
                            description: 'Identity and access management for secure connections.',
                            tags: ['Security', 'IAM', 'Enterprise']
                        }
                    ].map((connector, idx) => (
                        <div key={`extra-${idx}`} className="p-6 rounded-3xl border border-slate-100 bg-white relative group overflow-hidden h-[220px] flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-[50px] h-[50px] bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 p-1">
                                        <img
                                            src={connector.logo}
                                            alt={connector.name}
                                            className="w-full h-full object-contain object-center mix-blend-multiply"
                                            style={{ filter: 'contrast(1.1) brightness(1.1)' }}
                                        />
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{connector.name}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">{connector.description}</p>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-10">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-3 shadow-sm scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                    <AlertCircle size={24} />
                                </div>
                                <h5 className="font-black text-slate-800 mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">Not Available Yet</h5>
                                <button
                                    onClick={() => handleRequestAccess(connector)}
                                    className="mt-3 bg-[#005961] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl hover:bg-[#004a50] transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-200"
                                >
                                    Request Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredConnectors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <p>No integrations found matching your filters.</p>
                    </div>
                )}

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

    const renderAddresses = () => (
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Addresses and Contacts</h3>
                    <p className="text-xs font-medium text-slate-400">Choose which additional systems to show in Addresses & Contacts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['MCLERNONS', 'SAGE'].map((system) => {
                    const isConnected = enabledAddressSystems.includes(system);
                    return (
                        <button
                            key={system}
                            onClick={() => {
                                setEnabledAddressSystems(prev =>
                                    isConnected ? prev.filter(s => s !== system) : [...prev, system]
                                );
                            }}
                            className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${isConnected
                                ? 'bg-[#eef2ff] border-[#c7d2fe] text-indigo-900 shadow-sm'
                                : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center w-14 h-10 shrink-0">
                                    <img
                                        src={system === 'MCLERNONS' ? 'assets/mclernons-logo.png' : 'assets/Sage-logo_svg.svg.png'}
                                        alt={system === 'MCLERNONS' ? 'McLernons' : 'Sage'}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <span className="font-black text-sm tracking-tight">{system === 'MCLERNONS' ? 'McLernons' : 'Sage'}</span>
                            </div>
                            {isConnected ? (
                                <div className="bg-indigo-600 text-white rounded-full p-1.5 shadow-md flex items-center justify-center">
                                    <Check size={14} strokeWidth={4} />
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

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
                        <h2 className="text-3xl font-black text-[#005961] tracking-tight">
                            {viewMode === 'ORG' ? 'Organisation Settings' : 'Hub Settings'}
                        </h2>
                        <p className="text-slate-400 font-medium">
                            {viewMode === 'ORG'
                                ? 'Manage user settings, integrations and Org wise configurations'
                                : 'Manage hub-specific configurations for printing and notifications'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
                    {(viewMode === 'ORG' ? [
                        { id: 'general', label: 'General', icon: Settings },
                        { id: 'connectors', label: 'Connectors', icon: Plug }
                    ] : [
                        { id: 'addresses', label: 'Addresses', icon: LayoutDashboard },
                        { id: 'printing', label: 'Labels & Print', icon: Printer },
                        { id: 'notifications', label: 'Notifications', icon: Mail }
                    ]).map((tab) => (
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
            {activeTab === 'addresses' && renderAddresses()}
            {activeTab === 'printing' && renderPrinting()}
            {activeTab === 'notifications' && renderNotifications()}
            {renderRequestModal()}
            {renderDetailModal()}
        </div>
    );
};
