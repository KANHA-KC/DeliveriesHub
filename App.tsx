
import React, { useState } from 'react';
import { UserRole, Order, OrderStatus, CustomerConfig, PODMethod, CommMethod } from './types';
import { RoleSelector } from './components/RoleSelector';
import { DriverView } from './components/DriverView';
import { RecipientView } from './components/RecipientView';
import { RecipientViewDesktop } from './components/RecipientViewDesktop';
import { AdminView } from './components/AdminView';
import { MobileFrame, LaptopFrame } from './components/DeviceFrames';

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
    connectedSystems: ['MCLERNONS', 'SAGE'],
    contactName: 'Sarah Smith',
    contactEmail: 'sarah@sunnyside.com',
    contactPhone: '+353 1 234 5678',
    contactAddress: '123 Care Lane, Dublin 4, D04 K7X2',
    addresses: [
      {
        id: 'A-001',
        label: 'Main Entrance',
        line1: '123 Care Lane',
        city: 'Dublin',
        eireCode: 'D04 K7X2',
        country: 'Ireland',
        isDefault: true,
        contactName: 'Sarah Smith',
        phones: ['+353 1 234 5678'],
        emails: ['sarah@sunnyside.com']
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
    connectedSystems: ['MCLERNONS'],
    contactName: 'John Doe',
    contactEmail: 'john.doe@meadowview.com',
    contactPhone: '+353 87 654 3210',
    contactAddress: '45 Health Way, Naas, W91 X2R3',
    addresses: [
      {
        id: 'A-002',
        label: 'Delivery Bay',
        line1: '45 Health Way',
        city: 'Naas',
        eireCode: 'W91 X2R3',
        country: 'Ireland',
        isDefault: true,
        phones: [],
        emails: []
      }
    ],
    addressHistory: []
  }
];

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [configs, setConfigs] = useState<CustomerConfig[]>(INITIAL_CONFIGS);
  const [isDesktopCustomerView, setIsDesktopCustomerView] = useState(false);
  const [postalCodeLabel, setPostalCodeLabel] = useState<import('./types').PostalCodeLabel>('Post Code');

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
  if (currentRole === UserRole.ADMIN && !isDesktopCustomerView) {
    return (
      <div className="relative h-screen w-screen overflow-hidden">
        <div className="h-full w-full overflow-hidden flex flex-col bg-slate-50">
          <AdminView
            configs={configs}
            orders={orders}
            onUpdateConfig={handleUpdateConfig}
            onSwitchToCustomerView={() => setIsDesktopCustomerView(true)}
            postalCodeLabel={postalCodeLabel}
            onUpdatePostalCodeLabel={setPostalCodeLabel}
          />
        </div>
        <div className="fixed bottom-8 right-8 z-[100] shadow-2xl rounded-full">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </div>
    );
  }

  // Desktop Customer View - triggered from Admin panel
  if (isDesktopCustomerView) {
    return (
      <div className="relative h-screen w-screen overflow-hidden">
        <RecipientViewDesktop
          orders={orders}
          customerConfig={configs[0]}
          onUpdateConfig={handleUpdateConfig}
        />
        <div className="fixed bottom-8 right-8 z-[100] shadow-2xl rounded-full">
          <button
            onClick={() => setIsDesktopCustomerView(false)}
            className="bg-white text-[#005961] px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            ← Back to Admin
          </button>
        </div>
      </div>
    );
  }

  // Driver view - with mobile frame only
  if (currentRole === UserRole.DRIVER) {
    return (
      <div className="relative">
        <MobileFrame>
          <div className="h-full w-full bg-white flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <DriverView
                orders={orders}
                onCompleteDelivery={handleCompleteDelivery}
                onUpdateParcel={handleUpdateParcel}
                customerConfigs={configMap}
              />
            </div>
          </div>
        </MobileFrame>
        <div className="fixed bottom-8 right-32 z-[100] shadow-2xl rounded-full scale-75 origin-bottom-right">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </div>
    );
  }

  // Recipient view - mobile version only (from role selector)
  return (
    <div className="relative">
      <MobileFrame>
        <div className="h-full w-full bg-white flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            <RecipientView
              orders={orders}
              customerConfig={configs[0]}
              onUpdateConfig={handleUpdateConfig}
            />
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
