export enum UserRole {
  DRIVER = 'DRIVER',
  RECIPIENT = 'RECIPIENT',
  ADMIN = 'ADMIN'
}

export type PostalCodeLabel = 'Post Code' | 'Eire Code' | 'Zip Code' | 'Postal Index Number';

export enum PODMethod {
  PHOTO = 'PHOTO',
  SIGNATURE = 'SIGNATURE',
  OTP = 'OTP',
  REVERSE_SCAN = 'REVERSE_SCAN',
  QR_SCAN = 'QR_SCAN'
}

export enum CommMethod {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  IN_APP = 'IN_APP'
}

export enum OrderStatus {
  ENTRY = 'ENTRY',
  DISPATCH = 'DISPATCH',
  PICKING = 'PICKING',
  PACKING = 'PACKING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED'
}

export interface CustomerConfig {
  id: string;
  name: string;
  requiredPOD: PODMethod[];
  commMethods: CommMethod[];
  logoUrl?: string;
  addresses: Address[];
  addressHistory: AddressHistory[];
  hasCustomerPortal?: boolean; // Whether customer has paid for Customer Portal access
  connectedSystems?: string[];
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  eireCode: string; // Specific requirement
  country: string;
  isDefault?: boolean;
  contactName?: string;
  phones?: string[];
  emails?: string[];
  nextOfKin?: string;
  autoSync?: {
    enabled: boolean;
    primarySystem: 'MCLERNONS' | 'SAGE' | 'ALPHALAKE';
    approved: boolean; // Requires admin approval
  };
}

export interface AddressHistory {
  id: string;
  addressId: string;
  changedBy: string;
  changedAt: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  details: string; // Description of changes
}

export interface Parcel {
  id: string; // QR code on the box
  orderId: string; // Which order/consignment this belongs to
  boxNumber: number; // Box 1 of 3, etc.
  scannedOnVan: boolean;
  scannedOffVan: boolean;
  scannedOnAt?: string;
  scannedOffAt?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface Order {
  id: string;
  recipientId: string;
  recipientName: string;
  address: string;
  eireCode?: string;
  geoLocation?: GeoLocation; // Expected delivery location
  status: OrderStatus;
  updatedAt: string;
  items: number;
  qrCode: string;
  parcels: Parcel[]; // Individual boxes in this order
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
}
