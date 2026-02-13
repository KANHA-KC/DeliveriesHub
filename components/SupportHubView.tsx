import React, { useState } from 'react';
import { Search, Plus, Ticket, MessageSquare, Clock, CheckCircle, AlertCircle, X, ChevronRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    updatedAt: string;
    category: string;
}

const INITIAL_TICKETS: SupportTicket[] = [
    {
        id: 'T-1001',
        subject: 'Cannot access invoice history',
        description: 'I am trying to view my invoices for last month but the page keeps loading indefinitely.',
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        category: 'Billing'
    },
    {
        id: 'T-1002',
        subject: 'Update delivery address',
        description: 'We have a new drop-off point at the back entrance. Can you add this to our profile?',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.MEDIUM,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        category: 'Account Management'
    },
    {
        id: 'T-0998',
        subject: 'Feature request: Export to CSV',
        description: 'It would be great if we could export the delivery report to CSV.',
        status: TicketStatus.RESOLVED,
        priority: TicketPriority.LOW,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        category: 'Feature Request'
    }
];

export const SupportHubView: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

    // New Ticket Form State
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketCategory, setNewTicketCategory] = useState('General');
    const [newTicketDescription, setNewTicketDescription] = useState('');
    const [newTicketPriority, setNewTicketPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const newTicket: SupportTicket = {
            id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: newTicketSubject,
            description: newTicketDescription,
            category: newTicketCategory,
            priority: newTicketPriority,
            status: TicketStatus.OPEN,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setTickets([newTicket, ...tickets]);
        setIsNewTicketModalOpen(false);
        // Reset form
        setNewTicketSubject('');
        setNewTicketCategory('General');
        setNewTicketDescription('');
        setNewTicketPriority(TicketPriority.MEDIUM);
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.OPEN: return 'bg-blue-50 text-blue-700 border-blue-100';
            case TicketStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-700 border-amber-100';
            case TicketStatus.RESOLVED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case TicketStatus.CLOSED: return 'bg-slate-50 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case TicketPriority.CRITICAL: return 'text-rose-600 bg-rose-50 border-rose-100';
            case TicketPriority.HIGH: return 'text-orange-600 bg-orange-50 border-orange-100';
            case TicketPriority.MEDIUM: return 'text-blue-600 bg-blue-50 border-blue-100';
            case TicketPriority.LOW: return 'text-slate-500 bg-slate-50 border-slate-200';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden relative">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Section */}
                <div className="bg-slate-50 px-8 py-6 shrink-0">
                    <div className="max-w-7xl mx-auto flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black text-[#005961] mb-2 tracking-tight">Support Hub</h2>
                                <p className="text-slate-400 font-medium">View and manage your support requests.</p>
                            </div>
                            <button
                                onClick={() => setIsNewTicketModalOpen(true)}
                                className="bg-[#005961] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#00424a] shadow-lg shadow-[#005961]/20 transition-all active:scale-95"
                            >
                                <Plus size={18} /> New Ticket
                            </button>
                        </div>

                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tickets by ID, subject, or category..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30 shadow-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Ticket List */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="max-w-7xl mx-auto">
                        {filteredTickets.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#005961]/30 transition-all group relative overflow-hidden flex flex-col">
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-[#0097a7] bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100">#{ticket.id}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wide border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <h3 className="font-black text-lg text-slate-800 mb-2 group-hover:text-[#005961] transition-colors line-clamp-2">{ticket.subject}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">{ticket.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10 mt-auto">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <FileText size={12} />
                                                </div>
                                                <span>{ticket.category}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                                <Clock size={12} />
                                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <Ticket size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">No tickets found</h3>
                                <p className="text-slate-400 max-w-md mx-auto">
                                    You haven't submitted any support tickets yet, or none match your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {isNewTicketModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#001a1d]/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#F9FAFB]">
                                <div>
                                    <h3 className="text-2xl font-black text-[#005961] tracking-tight">Submit New Ticket</h3>
                                    <p className="text-slate-400 font-medium text-sm">Describe your issue and we'll help you resolve it.</p>
                                </div>
                                <button
                                    onClick={() => setIsNewTicketModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30 appearance-none"
                                            value={newTicketCategory}
                                            onChange={(e) => setNewTicketCategory(e.target.value)}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Technical Issue</option>
                                            <option>Billing</option>
                                            <option>Account Management</option>
                                            <option>Feature Request</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30 appearance-none"
                                            value={newTicketPriority}
                                            onChange={(e) => setNewTicketPriority(e.target.value as TicketPriority)}
                                        >
                                            <option value={TicketPriority.LOW}>Low</option>
                                            <option value={TicketPriority.MEDIUM}>Medium</option>
                                            <option value={TicketPriority.HIGH}>High</option>
                                            <option value={TicketPriority.CRITICAL}>Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30"
                                        placeholder="Brief summary of the issue"
                                        value={newTicketSubject}
                                        onChange={(e) => setNewTicketSubject(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005961]/20 focus:border-[#005961]/30 resize-none"
                                        placeholder="Please provide details about the issue..."
                                        value={newTicketDescription}
                                        onChange={(e) => setNewTicketDescription(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsNewTicketModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#005961] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00424a] shadow-lg shadow-[#005961]/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        Submit Ticket <ChevronRight size={16} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
