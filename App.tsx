
import React, { useState } from 'react';
import { UserRole, Order, OrderStatus, CustomerConfig, PODMethod, CommMethod } from './types';
import { RoleSelector } from './components/RoleSelector';
import { DriverView } from './components/DriverView';
import { RecipientView } from './components/RecipientView';
import { AdminView } from './components/AdminView';
import { MobileFrame } from './components/DeviceFrames';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'AL-1001',
    recipientId: 'C-001',
    recipientName: 'Maynooth Lodge',
    address: 'Maynooth Lodge, Main Street, Maynooth, Co. Kildare',
    eireCode: 'W23 V1P9',
    geoLocation: { latitude: 53.3817, longitude: -6.5927, accuracy: 10 },
    status: OrderStatus.OUT_FOR_DELIVERY,
    updatedAt: new Date().toISOString(),
    items: 3,
    qrCode: 'AL-1001-QR',
    parcels: [
      { id: 'BOX-1001-1', orderId: 'AL-1001', boxNumber: 1, scannedOnVan: false, scannedOffVan: false },
      { id: 'BOX-1001-2', orderId: 'AL-1001', boxNumber: 2, scannedOnVan: false, scannedOffVan: false },
      { id: 'BOX-1001-3', orderId: 'AL-1001', boxNumber: 3, scannedOnVan: false, scannedOffVan: false }
    ]
  },
  {
    id: 'AL-1002',
    recipientId: 'C-002',
    recipientName: 'Maynooth Nursing Home',
    address: 'Maynooth Nursing Home, Straffan Road, Maynooth, Co. Kildare',
    eireCode: 'W23 X2Y4',
    geoLocation: { latitude: 53.3818, longitude: -6.5928, accuracy: 10 }, // Very close to Lodge
    status: OrderStatus.DISPATCH,
    updatedAt: new Date().toISOString(),
    items: 2,
    qrCode: 'AL-1002-QR',
    parcels: [
      { id: 'BOX-1002-1', orderId: 'AL-1002', boxNumber: 1, scannedOnVan: false, scannedOffVan: false },
      { id: 'BOX-1002-2', orderId: 'AL-1002', boxNumber: 2, scannedOnVan: false, scannedOffVan: false }
    ]
  },
  {
    id: 'AL-1003',
    recipientId: 'C-001',
    recipientName: 'Sunnyside Care Home',
    address: '123 Care Lane, Dublin 4',
    eireCode: 'D04 K7X2',
    geoLocation: { latitude: 53.3298, longitude: -6.2603, accuracy: 10 },
    status: OrderStatus.DELIVERED,
    updatedAt: new Date().toISOString(),
    items: 1,
    qrCode: 'AL-1003-QR',
    parcels: [
      { id: 'BOX-1003-1', orderId: 'AL-1003', boxNumber: 1, scannedOnVan: true, scannedOffVan: true }
    ]
  }
];

const INITIAL_CONFIGS: CustomerConfig[] = [
  {
    id: 'C-001',
    name: 'Sunnyside Nursing Home',
    requiredPOD: [PODMethod.SIGNATURE, PODMethod.PHOTO],
    commMethods: [CommMethod.EMAIL],
    hasCustomerPortal: true, // Customer has paid for portal access
    addresses: [
      {
        id: 'A-001',
        label: 'Main Entrance',
        line1: '123 Care Lane',
        city: 'London',
        eireCode: 'D04 K7X2',
        country: 'UK',
        isDefault: true
      }
    ],
    addressHistory: [
      {
        id: 'H-001',
        addressId: 'A-001',
        changedBy: 'System Admin',
        changedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        action: 'CREATED',
        details: 'Initial address created'
      }
    ]
  },
  {
    id: 'C-002',
    name: 'Meadow View Residencies',
    requiredPOD: [PODMethod.PHOTO],
    commMethods: [CommMethod.EMAIL, CommMethod.SMS],
    addresses: [
      {
        id: 'A-002',
        label: 'Delivery Bay',
        line1: '45 Health Way',
        city: 'Watford',
        eireCode: 'W91 X2R3',
        country: 'UK',
        isDefault: true
      }
    ],
    addressHistory: []
  }
];

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [configs, setConfigs] = useState<CustomerConfig[]>(INITIAL_CONFIGS);

  const handleCompleteDelivery = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.DELIVERED } : o));
  };

  const handleUpdateConfig = (newConfig: CustomerConfig) => {
    setConfigs(prev => prev.map(c => c.id === newConfig.id ? newConfig : c));
  };

  const handleUpdateParcel = (parcelId: string, updates: Partial<import('./types').Parcel>) => {
    setOrders(prev => prev.map(order => ({
      ...order,
      parcels: order.parcels.map(parcel =>
        parcel.id === parcelId ? { ...parcel, ...updates } : parcel
      )
    })));
  };

  const configMap = configs.reduce((acc, c) => ({ ...acc, [c.id]: c }), {} as Record<string, CustomerConfig>);

  // Admin view - no frame
  if (currentRole === UserRole.ADMIN) {
    return (
      <div className="relative h-screen w-screen overflow-hidden">
        <div className="h-full w-full overflow-hidden flex flex-col bg-slate-50">
          <AdminView
            configs={configs}
            onUpdateConfig={handleUpdateConfig}
            onSwitchToCustomerView={() => setCurrentRole(UserRole.RECIPIENT)}
          />
        </div>
        <div className="fixed bottom-8 right-8 z-[100] shadow-2xl rounded-full">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </div>
    );
  }

  // Driver and Recipient views - with mobile frame
  return (
    <div className="relative">
      <MobileFrame>
        <div className="h-full w-full bg-white flex flex-col">
          {/* Spacer for notch */}
          <div className="h-[44px] bg-white w-full shrink-0" />

          <div className="flex-1 overflow-hidden relative">
            {currentRole === UserRole.DRIVER ? (
              <DriverView
                orders={orders}
                onCompleteDelivery={handleCompleteDelivery}
                onUpdateParcel={handleUpdateParcel}
                customerConfigs={configMap}
              />
            ) : (
              <RecipientView
                orders={orders}
                customerConfig={configs[0]}
                onUpdateConfig={handleUpdateConfig}
              />
            )}
          </div>
        </div>
      </MobileFrame>
      <div className="fixed bottom-8 right-32 z-[100] shadow-2xl rounded-full scale-75 origin-bottom-right">
        <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
      </div>
    </div>
  );
};

export default App;
