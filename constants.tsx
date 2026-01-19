
import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Boxes, 
  FileText,
  Mail,
  MessageSquare,
  Smartphone,
  QrCode,
  Bell
} from 'lucide-react';
import { OrderStatus, PODMethod, CommMethod } from './types';

export const COLORS = {
  primary: '#005961', // Alphalake Dark Teal
  sidebar: '#001a1d',  // Even darker teal for sidebar
  accent: '#0097a7',  // Alphalake Medium Teal
  light: '#d9f2f2',   // Alphalake Light Teal
  success: '#10b981', 
  danger: '#ef4444', 
};

export const STATUS_METADATA: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  [OrderStatus.ENTRY]: { label: 'Order Entered', icon: <FileText size={18} />, color: 'text-slate-500' },
  [OrderStatus.DISPATCH]: { label: 'Dispatched', icon: <Truck size={18} />, color: 'text-cyan-600' },
  [OrderStatus.PICKING]: { label: 'Picking', icon: <Package size={18} />, color: 'text-amber-500' },
  [OrderStatus.PACKING]: { label: 'Packing', icon: <Boxes size={18} />, color: 'text-teal-600' },
  [OrderStatus.OUT_FOR_DELIVERY]: { label: 'Out for Delivery', icon: <Truck size={18} />, color: 'text-[#005961]' },
  [OrderStatus.DELIVERED]: { label: 'Delivered', icon: <CheckCircle2 size={18} />, color: 'text-emerald-500' },
};

export const POD_LABELS: Record<PODMethod, string> = {
  [PODMethod.PHOTO]: 'Photo Capture',
  [PODMethod.SIGNATURE]: 'Digital Signature',
  [PODMethod.OTP]: 'Secure OTP',
  [PODMethod.REVERSE_SCAN]: 'Reverse Scan',
  [PODMethod.QR_SCAN]: 'QR Code Scan',
};

export const COMM_LABELS: Record<CommMethod, { label: string; icon: React.ReactNode }> = {
  [CommMethod.EMAIL]: { label: 'Email', icon: <Mail size={14} /> },
  [CommMethod.SMS]: { label: 'SMS', icon: <MessageSquare size={14} /> },
  [CommMethod.WHATSAPP]: { label: 'WhatsApp', icon: <Smartphone size={14} /> },
  [CommMethod.IN_APP]: { label: 'In-App', icon: <Bell size={14} /> },
};

// Updated Local Asset Paths
export const ALPHALAKE_LOGO_URL = '/assets/Copy of typeface white.png';
export const CARA_LOGO_URL = './assets/cara-logo-white.png';

export const AlphalakeLogo: React.FC<{ light?: boolean, size?: 'sm' | 'md' | 'lg', collapsed?: boolean }> = ({ light, size = 'md', collapsed }) => {
  const hSize = size === 'lg' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';
  
  if (collapsed) {
    return (
      <div className={`flex items-center justify-center`}>
        <img 
          src={ALPHALAKE_LOGO_URL} 
          alt="A" 
          className="w-10 h-10 object-contain" 
          style={{ filter: light ? 'none' : 'brightness(0)' }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <img 
        src={ALPHALAKE_LOGO_URL} 
        alt="Alphalake Ai" 
        className={`${hSize} object-contain`} 
        style={{ filter: light ? 'none' : 'brightness(0)' }}
      />
    </div>
  );
};
