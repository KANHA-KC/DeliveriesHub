import React, { useState, useEffect } from 'react';
import { Address } from '../types';
import { X, Save, Edit2, AlertCircle, RefreshCw, CheckCircle, ShieldCheck, Building2, User, MapPin, Share2, Mail, Phone, Globe, ExternalLink, Hash, FileText, ChevronDown, HelpCircle } from 'lucide-react';
import { ALPHALAKE_LOGO_URL } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface SageExtendedData {
    source: string;
    // Account Details
    account: string;
    companyName: string;
    companyRegNumber: string;
    balance: number;
    currency: string;
    inactive: boolean;
    // Contact Information
    contactName: string;
    tradeContact: string;
    telephone: string;
    telephone2: string;
    fax: string;
    website: string;
    // Registered Address
    label: string;
    street1: string;
    street2: string;
    town: string;
    county: string;
    postCode: string;
    country: string;
    vatNumber: string;
    eoriNumber: string;
    // Social Media
    twitter: string;
    linkedin: string;
    facebook: string;
    // Email Settings
    email1: string;
    email2: string;
    email3: string;
}

interface McLernonsExtendedData {
    source: string;
    // Personal Details
    surname: string;
    forenames: string;
    title: string;
    sex: string;
    // Address Details
    street: string;
    town: string;
    county: string;
    eircode: string;
    country: string;
    // Storage Information
    storage: string;
}

export type MasterDataViewMode = 'MCLERNONS' | 'SAGE' | 'DELIVERIES_HUB' | 'ALL';

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
    const [mcLernonsData, setMcLernonsData] = useState<McLernonsExtendedData>({
        source: 'McLernons',
        // Personal Details
        surname: 'McLernon',
        forenames: 'John',
        title: 'Mr',
        sex: 'Male',
        // Address Details
        street: '123 McLernon St\nUnit 4B',
        town: 'Dublin',
        county: 'County Dublin',
        eircode: 'D01 XYZ1',
        country: 'IE',
        // Storage Information
        storage: 'LOC-NW-042'
    });

    const [sageData, setSageData] = useState<SageExtendedData>({
        source: 'Sage',
        // Account Details
        account: 'ACC001',
        companyName: 'Sunnyside Nursing Home',
        companyRegNumber: '567890',
        balance: 12450.00,
        currency: 'EUR',
        inactive: false,
        // Contact Information
        contactName: 'Jane Sage (Mock)',
        tradeContact: 'Michael Trade',
        telephone: '+353 1 987 6543',
        telephone2: '',
        fax: '+353 1 987 6544',
        website: 'https://www.sunnyside.ie',
        // Registered Address
        label: currentAddress.label,
        street1: 'Sage Business Park',
        street2: '',
        town: 'Cork',
        county: 'County Cork',
        postCode: 'T12 ABC2',
        country: 'IE',
        vatNumber: 'IE1234567X',
        eoriNumber: 'IE1234567',
        // Social Media
        twitter: '',
        linkedin: '',
        facebook: '',
        // Email Settings
        email1: 'accounts@sunnyside.ie',
        email2: '',
        email3: ''
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
        <div className="group/field mb-4 last:mb-0">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-1.5 group-hover/field:text-[#0097a7] transition-colors">
                {label}
            </label>
            {isEditable && isEditing && fieldKey ? (
                Array.isArray(value) ? (
                    <div className="space-y-2">
                        {value.map((v, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7]/20 focus:border-[#0097a7] transition-all"
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
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                            className="text-[10px] font-black text-[#0097a7] hover:text-[#005961] flex items-center gap-1 transition-colors uppercase tracking-wider"
                        >
                            + Add another
                        </button>
                    </div>
                ) : (
                    <input
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7]/20 focus:border-[#0097a7] transition-all"
                        value={value as string || ''}
                        onChange={(e) => onChange && onChange(e.target.value)}
                    />
                )
            ) : (
                <div className="text-sm font-bold text-slate-700 break-words min-h-[1.25rem] leading-relaxed">
                    {Array.isArray(value) ? (
                        value.length > 0 ? (
                            <div className="space-y-0.5">
                                {value.map((v, i) => <div key={i} className="flex items-center gap-2">{v}</div>)}
                            </div>
                        ) : <span className="text-slate-300 font-medium">Not provided</span>
                    ) : (
                        value || <span className="text-slate-300 font-medium">—</span>
                    )}
                </div>
            )}
        </div>
    );

    const renderColumn = (title: string, data: Partial<Address> | ExternalData, isEditable: boolean = false, onChange?: (field: keyof Address, val: any) => void, accentColor: string = '#0097a7', logo?: string, customLabels: Record<string, string> = {}) => (
        <div className="flex-1 min-w-[340px] group/card">
            <div className={`h-full bg-white rounded-[2rem] border border-slate-100 shadow-sm group-hover/card:shadow-xl group-hover/card:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden relative`}>


                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            {logo && (
                                <img
                                    src={logo}
                                    alt={title}
                                    className="h-10 w-auto object-contain"
                                    style={title === 'Deliveries Hub' ? { filter: 'brightness(0) saturate(100%) invert(28%) sepia(91%) saturate(543%) hue-rotate(143deg) brightness(91%) contrast(100%)' } : {}}
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
                                {title === 'Deliveries Hub' && (
                                    <span className="text-[10px] font-bold text-[#0097a7] uppercase tracking-wider">Primary System</span>
                                )}
                            </div>
                        </div>
                        {isEditable && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2.5 bg-slate-50 hover:bg-[#0097a7] text-slate-400 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-4">
                            {renderField(customLabels.contactName || 'Contact Name', (data as any).contactName, 'contactName', isEditable, (v) => onChange && onChange('contactName', v))}
                            {renderField(customLabels.phones || 'Phones', (data as any).phones || (data as any).phone ? [(data as any).phone] : [], 'phones', isEditable, (v) => onChange && onChange('phones', v))}
                            {renderField(customLabels.emails || 'Emails', (data as any).emails || (data as any).email ? [(data as any).email] : [], 'emails', isEditable, (v) => onChange && onChange('emails', v))}
                        </div>

                        <div className="px-4 py-2">
                            <div className="h-px w-full bg-slate-100"></div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 space-y-4">
                            {renderField(customLabels.label || 'Label', data.label, 'label', isEditable, (v) => onChange && onChange('label', v))}
                            {renderField(customLabels.line1 || 'Line 1', data.line1, 'line1', isEditable, (v) => onChange && onChange('line1', v))}
                            {renderField(customLabels.line2 || 'Line 2', data.line2, 'line2', isEditable, (v) => onChange && onChange('line2', v))}
                            {renderField(customLabels.city || 'City', data.city, 'city', isEditable, (v) => onChange && onChange('city', v))}
                            {renderField(customLabels.country || 'Country', data.country, 'country', isEditable, (v) => onChange && onChange('country', v))}
                            {renderField(customLabels.eireCode || 'Eircode', data.eireCode, 'eireCode', isEditable, (v) => onChange && onChange('eireCode', v))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50">
                            {renderField(customLabels.nextOfKin || 'Next of Kin', (data as any).nextOfKin, 'nextOfKin', isEditable, (v) => onChange && onChange('nextOfKin', v))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMcLernonsField = (label: string, value: string, fieldKey: string, type: string = 'text') => (
        <div className="group/field mb-4 last:mb-0">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-1.5 group-hover/field:text-indigo-600 transition-colors">
                {label}
            </label>
            {isEditing ? (
                type === 'title' ? (
                    <select
                        value={value}
                        onChange={(e) => setMcLernonsData({ ...mcLernonsData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                    </select>
                ) : type === 'sex' ? (
                    <select
                        value={value}
                        onChange={(e) => setMcLernonsData({ ...mcLernonsData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                ) : type === 'country' ? (
                    <select
                        value={value}
                        onChange={(e) => setMcLernonsData({ ...mcLernonsData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                        <option value="IE">Ireland (IE)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="US">United States (US)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="FR">France (FR)</option>
                    </select>
                ) : type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => setMcLernonsData({ ...mcLernonsData, [fieldKey]: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setMcLernonsData({ ...mcLernonsData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                )
            ) : (
                <div className="text-sm font-bold text-slate-700 break-words min-h-[1.25rem] whitespace-pre-line leading-relaxed">
                    {type === 'country' ? (
                        value === 'IE' ? 'Ireland (IE)' :
                            value === 'GB' ? 'United Kingdom (GB)' :
                                value === 'US' ? 'United States (US)' :
                                    value === 'DE' ? 'Germany (DE)' :
                                        value === 'FR' ? 'France (FR)' : (value || <span className="text-slate-300 font-medium">—</span>)
                    ) : (value || <span className="text-slate-300 font-medium">—</span>)}
                </div>
            )}
        </div>
    );

    const renderMcLernonsColumn = () => (
        <div className="flex-1 min-w-[360px] group/card">
            <div className="h-full bg-white rounded-[2rem] border border-slate-100 shadow-sm group-hover/card:shadow-xl group-hover/card:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden">


                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <img src="assets/mclernons-logo.png" alt="McLernons" className="h-10 w-auto object-contain" />
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">McLernons</h3>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Patient Meds Records</span>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-2">
                        {/* 1. Personal Details */}
                        <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-indigo-100">
                                    <User size={12} className="text-indigo-600" />
                                </div>
                                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Personal Details</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4">
                                {renderMcLernonsField('Surname', mcLernonsData.surname, 'surname')}
                                {renderMcLernonsField('Forenames', mcLernonsData.forenames, 'forenames')}
                                {renderMcLernonsField('Title', mcLernonsData.title, 'title', 'title')}
                                {renderMcLernonsField('Sex', mcLernonsData.sex, 'sex', 'sex')}
                            </div>
                        </div>

                        {/* 2. Address Details */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-slate-50 rounded-lg shadow-sm border border-slate-100">
                                    <MapPin size={12} className="text-orange-600" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Address Details</span>
                            </div>
                            {renderMcLernonsField('Street', mcLernonsData.street, 'street', 'textarea')}
                            <div className="grid grid-cols-2 gap-x-4">
                                {renderMcLernonsField('Town', mcLernonsData.town, 'town')}
                                {renderMcLernonsField('County', mcLernonsData.county, 'county')}
                                {renderMcLernonsField('Eircode', mcLernonsData.eircode, 'eircode')}
                                {renderMcLernonsField('Country', mcLernonsData.country, 'country', 'country')}
                            </div>
                        </div>

                        {/* 3. Storage Information */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                                    <Building2 size={12} className="text-[#005961]" />
                                </div>
                                <span className="text-[10px] font-black text-[#005961] uppercase tracking-widest">Storage Information</span>
                            </div>
                            {renderMcLernonsField('Storage', mcLernonsData.storage, 'storage')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSageField = (label: string, value: string | number | boolean, fieldKey: string, type: string = 'text') => (
        <div className="group/field mb-4 last:mb-0">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-1.5 group-hover/field:text-emerald-600 transition-colors">
                {label}
            </label>
            {isEditing ? (
                type === 'checkbox' ? (
                    <label className="flex items-center gap-3 cursor-pointer px-3 py-2 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20 transition-all w-full h-[38px]">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => setSageData({ ...sageData, [fieldKey]: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                            />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{value ? 'Active' : 'Inactive'}</span>
                        <HelpCircle size={14} className="text-slate-400 ml-auto" />
                    </label>
                ) : type === 'select' ? (
                    <select
                        value={value as string}
                        onChange={(e) => setSageData({ ...sageData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-[38px]"
                    >
                        <option value="ACC001">ACC001 - Main Account</option>
                        <option value="ACC002">ACC002 - Trading Account</option>
                        <option value="ACC003">ACC003 - Receivables</option>
                    </select>
                ) : type === 'country' ? (
                    <select
                        value={value as string}
                        onChange={(e) => setSageData({ ...sageData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-[38px]"
                    >
                        <option value="IE">Ireland (IE)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="US">United States (US)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="FR">France (FR)</option>
                    </select>
                ) : type === 'number' ? (
                    <div className="flex bg-white rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden h-[38px]">
                        <input
                            type="number"
                            step="0.01"
                            value={value as number}
                            onChange={(e) => setSageData({ ...sageData, [fieldKey]: parseFloat(e.target.value) || 0 })}
                            className="flex-1 px-3 py-2 bg-transparent text-sm font-medium focus:outline-none"
                        />
                        <div className="h-full w-px bg-slate-100"></div>
                        <select
                            value={sageData.currency}
                            onChange={(e) => setSageData({ ...sageData, currency: e.target.value })}
                            className="px-2 bg-slate-50 text-xs font-bold text-slate-600 focus:outline-none hover:bg-slate-100 transition-colors cursor-pointer border-l border-slate-100"
                        >
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                ) : (
                    <input
                        type={type}
                        value={value as string}
                        onChange={(e) => setSageData({ ...sageData, [fieldKey]: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-[38px]"
                        placeholder={type === 'url' ? 'https://' : ''}
                    />
                )
            ) : (
                <div className="text-sm font-bold text-slate-700 break-words min-h-[1.25rem] leading-relaxed">
                    {type === 'checkbox' ? (
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${value ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            {value ? 'Active' : 'Inactive'}
                        </div>
                    ) : type === 'number' ? (
                        <span className="text-slate-900 font-black">{sageData.currency} {Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    ) : type === 'country' ? (
                        value === 'IE' ? 'Ireland (IE)' :
                            value === 'GB' ? 'United Kingdom (GB)' :
                                value === 'US' ? 'United States (US)' :
                                    value === 'DE' ? 'Germany (DE)' :
                                        value === 'FR' ? 'France (FR)' : (value as string || <span className="text-slate-300 font-medium">—</span>)
                    ) :
                        (value as string) || <span className="text-slate-300 font-medium">—</span>}
                </div>
            )}
        </div>
    );

    const renderSageColumn = () => (
        <div className="flex-1 min-w-[380px] group/card">
            <div className="h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm group-hover/card:shadow-xl group-hover/card:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden">


                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <img src="assets/Sage-logo_svg.svg.png" alt="Sage" className="h-10 w-auto object-contain" />
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">Sage</h3>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Financial Data</span>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2.5 bg-slate-50 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* 1. Account Details */}
                        <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-emerald-100">
                                    <Building2 size={12} className="text-emerald-600" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Account Details</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderSageField('A/C *', sageData.account, 'account', 'select')}
                                {renderSageField('Balance', sageData.balance, 'balance', 'number')}
                            </div>
                            {renderSageField('Company Name', sageData.companyName, 'companyName')}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {renderSageField('Reg Number', sageData.companyRegNumber, 'companyRegNumber')}
                                {renderSageField('Status', sageData.inactive, 'inactive', 'checkbox')}
                            </div>
                        </div>

                        {/* 2. Contact Information */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-slate-50 rounded-lg shadow-sm border border-slate-100">
                                    <User size={12} className="text-[#0097a7]" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Information</span>
                            </div>
                            {renderSageField('Contact Name', sageData.contactName, 'contactName')}
                            {renderSageField('Trade Contact', sageData.tradeContact, 'tradeContact')}
                            <div className="grid grid-cols-2 gap-x-4 mt-2">
                                {renderSageField('Phone 1', sageData.telephone, 'telephone', 'tel')}
                                {renderSageField('Phone 2', sageData.telephone2, 'telephone2', 'tel')}
                            </div>
                        </div>

                        {/* 3. Registered Address */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-slate-50 rounded-lg shadow-sm border border-slate-100">
                                    <MapPin size={12} className="text-orange-600" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered Address</span>
                            </div>
                            {renderSageField('Street 1', sageData.street1, 'street1')}
                            <div className="grid grid-cols-2 gap-x-4">
                                {renderSageField('Town', sageData.town, 'town')}
                                {renderSageField('County', sageData.county, 'county')}
                            </div>
                        </div>

                        {/* 4. Social & Email */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100">
                            <div className="space-y-6">
                                {/* Email */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Mail size={12} className="text-purple-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Addresses</span>
                                    </div>
                                    <div className="space-y-2">
                                        {renderSageField('Email 1', sageData.email1, 'email1', 'email')}
                                        {renderSageField('Email 2', sageData.email2, 'email2', 'email')}
                                        {renderSageField('Email 3', sageData.email3, 'email3', 'email')}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                {/* Social */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Share2 size={12} className="text-blue-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Media</span>
                                    </div>
                                    <div className="space-y-2">
                                        {renderSageField('Twitter', sageData.twitter, 'twitter', 'url')}
                                        {renderSageField('LinkedIn', sageData.linkedin, 'linkedin', 'url')}
                                        {renderSageField('Facebook', sageData.facebook, 'facebook', 'url')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div className="flex-1 overflow-x-auto overflow-y-auto p-8 bg-slate-50/30">
                        <div className="flex gap-8 min-w-max pb-4">
                            {/* Show Deliveries Hub in Comparison Mode (ALL) or when specifically selected */}
                            {(viewMode === 'DELIVERIES_HUB' || viewMode === 'ALL') && renderColumn('Deliveries Hub', (isEditing ? editedAddress : currentAddress) as any, true, (k, v) => setEditedAddress({ ...editedAddress, [k]: v } as Address), '#005961', ALPHALAKE_LOGO_URL)}

                            {/* Show McLernons if selected or ALL */}
                            {(viewMode === 'MCLERNONS' || viewMode === 'ALL') && (
                                renderMcLernonsColumn()
                            )}

                            {/* Show Sage if selected or ALL */}
                            {(viewMode === 'SAGE' || viewMode === 'ALL') && (
                                renderSageColumn()
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
