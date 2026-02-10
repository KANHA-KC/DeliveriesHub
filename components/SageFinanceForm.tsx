import React, { useState } from 'react';
import {
    Building2,
    User,
    MapPin,
    Share2,
    Mail,
    Phone,
    Globe,
    HelpCircle,
    ExternalLink,
    DollarSign,
    Hash,
    FileText,
    Twitter,
    Linkedin,
    Facebook,
    ChevronDown,
    Info
} from 'lucide-react';

interface SageFinanceData {
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

interface SageFinanceFormProps {
    data?: Partial<SageFinanceData>;
    onSave: (data: SageFinanceData) => void;
    onCancel?: () => void;
    onAddressContactsClick?: () => void;
}

export const SageFinanceForm: React.FC<SageFinanceFormProps> = ({
    data,
    onSave,
    onCancel,
    onAddressContactsClick
}) => {
    const [formData, setFormData] = useState<SageFinanceData>({
        account: data?.account || '',
        companyName: data?.companyName || '',
        companyRegNumber: data?.companyRegNumber || '',
        balance: data?.balance || 0,
        currency: data?.currency || 'EUR',
        inactive: data?.inactive || false,
        contactName: data?.contactName || '',
        tradeContact: data?.tradeContact || '',
        telephone: data?.telephone || '',
        telephone2: data?.telephone2 || '',
        fax: data?.fax || '',
        website: data?.website || '',
        street1: data?.street1 || '',
        street2: data?.street2 || '',
        town: data?.town || '',
        county: data?.county || '',
        postCode: data?.postCode || '',
        country: data?.country || 'IE',
        vatNumber: data?.vatNumber || '',
        eoriNumber: data?.eoriNumber || '',
        twitter: data?.twitter || '',
        linkedin: data?.linkedin || '',
        facebook: data?.facebook || '',
        email1: data?.email1 || '',
        email2: data?.email2 || '',
        email3: data?.email3 || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const updateField = (field: keyof SageFinanceData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const currencies = ['EUR', 'USD', 'GBP'];
    const countries = [
        { code: 'IE', name: 'Ireland' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'US', name: 'United States' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' }
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl w-full">
            <div className="mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-[#00e396] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00e396]/20">
                    <svg width="40" height="40" viewBox="0 0 50 50" fill="white">
                        <text x="5" y="35" fontSize="28" fontWeight="900" fontFamily="Arial">Sage</text>
                    </svg>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-[#005961] tracking-tight">Sage (Finance)</h2>
                    <p className="text-slate-400 font-medium">Integrate accounting and financial data</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Account Details */}
                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#d9f2f2] rounded-xl flex items-center justify-center text-[#005961]">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Account Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                A/C <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.account}
                                    onChange={(e) => updateField('account', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent appearance-none pr-10"
                                >
                                    <option value="">Select Account</option>
                                    <option value="ACC001">ACC001 - Main Account</option>
                                    <option value="ACC002">ACC002 - Trading Account</option>
                                    <option value="ACC003">ACC003 - Receivables</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => updateField('companyName', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="Enter company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Company Reg. Number
                            </label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.companyRegNumber}
                                    onChange={(e) => updateField('companyRegNumber', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="123456"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Balance
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.balance}
                                        onChange={(e) => updateField('balance', parseFloat(e.target.value) || 0)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => updateField('currency', e.target.value)}
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                >
                                    {currencies.map(curr => (
                                        <option key={curr} value={curr}>{curr}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.inactive}
                                        onChange={(e) => updateField('inactive', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-[#005961] peer-checked:border-[#005961] transition-all flex items-center justify-center">
                                        {formData.inactive && (
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-[#005961] transition-colors">
                                    Inactive
                                </span>
                                <div className="group/tooltip relative">
                                    <HelpCircle size={16} className="text-slate-400 hover:text-[#0097a7] transition-colors" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        Mark this account as inactive
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* 2. Contact Information */}
                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#0097a7]">
                            <User size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Contact Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => updateField('contactName', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Trade Contact
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.tradeContact}
                                    onChange={(e) => updateField('tradeContact', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="Jane Smith"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Telephone
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) => updateField('telephone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="+353 1 234 5678"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Telephone 2 <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.telephone2}
                                    onChange={(e) => updateField('telephone2', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="+353 1 234 5679"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Fax
                            </label>
                            <div className="relative">
                                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.fax}
                                    onChange={(e) => updateField('fax', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="+353 1 234 5680"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Website
                            </label>
                            <div className="relative">
                                <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => updateField('website', e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                                {formData.website && (
                                    <a
                                        href={formData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0097a7] hover:text-[#005961] transition-colors"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Registered Address */}
                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                            <MapPin size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Registered Address</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Street 1
                            </label>
                            <input
                                type="text"
                                value={formData.street1}
                                onChange={(e) => updateField('street1', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Street 2
                            </label>
                            <input
                                type="text"
                                value={formData.street2}
                                onChange={(e) => updateField('street2', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="Apartment, suite, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Town
                            </label>
                            <input
                                type="text"
                                value={formData.town}
                                onChange={(e) => updateField('town', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="Dublin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                County
                            </label>
                            <input
                                type="text"
                                value={formData.county}
                                onChange={(e) => updateField('county', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="County Dublin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Post Code
                            </label>
                            <input
                                type="text"
                                value={formData.postCode}
                                onChange={(e) => updateField('postCode', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="D01 F5P2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Country
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.country}
                                    onChange={(e) => updateField('country', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent appearance-none pr-10"
                                >
                                    {countries.map(country => (
                                        <option key={country.code} value={country.code}>
                                            {country.name} ({country.code})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                VAT Number
                            </label>
                            <input
                                type="text"
                                value={formData.vatNumber}
                                onChange={(e) => updateField('vatNumber', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                placeholder="IE1234567X"
                            />
                        </div>

                        <div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    EORI Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.eoriNumber}
                                    onChange={(e) => updateField('eoriNumber', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="IE1234567"
                                />
                            </div>

                            <div className="md:col-span-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onAddressContactsClick}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:bg-slate-50 hover:border-[#0097a7] hover:text-[#0097a7] transition-all flex items-center justify-center gap-2 group"
                                >
                                    <MapPin size={18} className="group-hover:scale-110 transition-transform" />
                                    Addresses & Contacts...
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Social Media */}
                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Share2 size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Social Media</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Twitter
                            </label>
                            <div className="relative">
                                <Twitter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1DA1F2]" />
                                <input
                                    type="url"
                                    value={formData.twitter}
                                    onChange={(e) => updateField('twitter', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="www.twitter.com/"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                LinkedIn
                            </label>
                            <div className="relative">
                                <Linkedin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A66C2]" />
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => updateField('linkedin', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="www.linkedin.com/"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Facebook
                            </label>
                            <div className="relative">
                                <Facebook size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1877F2]" />
                                <input
                                    type="url"
                                    value={formData.facebook}
                                    onChange={(e) => updateField('facebook', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="www.facebook.com/"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Email Settings & Addresses */}
                <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <Mail size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Email Settings & Addresses</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Email 1
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email1}
                                    onChange={(e) => updateField('email1', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="contact@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Email 2 <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email2}
                                    onChange={(e) => updateField('email2', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="sales@example.com"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Email 3 <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email3}
                                    onChange={(e) => updateField('email3', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent"
                                    placeholder="support@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex justify-end gap-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-[#005961] text-white px-12 py-4 rounded-xl font-black text-lg shadow-xl shadow-[#005961]/20 hover:bg-[#004a50] transition-all active:scale-95"
                >
                    Save Sage Integration
                </button>
            </div>
        </form>
    );
};
