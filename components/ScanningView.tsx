import React, { useState, useEffect } from 'react';
import { Order, Parcel, GeoLocation } from '../types';
import {
    QrCode,
    CheckCircle,
    XCircle,
    MapPin,
    AlertTriangle,
    Package,
    Truck,
    Navigation,
    X,
    ArrowRight,
    ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanningViewProps {
    orders: Order[];
    onUpdateParcel: (parcelId: string, updates: Partial<Parcel>) => void;
    scanMode: 'WAREHOUSE' | 'DELIVERY';
}

export const ScanningView: React.FC<ScanningViewProps> = ({
    orders,
    onUpdateParcel,
    scanMode
}) => {
    const [scannedCode, setScannedCode] = useState<string>('');
    const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
    const [scanResult, setScanResult] = useState<{
        success: boolean;
        parcel?: Parcel;
        order?: Order;
        message: string;
        gpsWarning?: boolean;
        isComplete?: boolean;
    } | null>(null);
    const [showAddressConfirm, setShowAddressConfirm] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Get current GPS location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    console.error('GPS Error:', error);
                },
                { enableHighAccuracy: true, maximumAge: 10000 }
            );
        }
    }, []);

    // Calculate distance between two GPS coordinates (Haversine formula)
    const calculateDistance = (loc1: GeoLocation, loc2: GeoLocation): number => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = loc1.latitude * Math.PI / 180;
        const φ2 = loc2.latitude * Math.PI / 180;
        const Δφ = (loc2.latitude - loc1.latitude) * Math.PI / 180;
        const Δλ = (loc2.longitude - loc1.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    };

    const handleScan = (code: string) => {
        // ... (existing search logic)
        let foundParcel: Parcel | undefined;
        let foundOrder: Order | undefined;

        for (const order of orders) {
            foundParcel = order.parcels.find(p => p.id === code);
            if (foundParcel) {
                foundOrder = order;
                break;
            }
        }

        if (!foundParcel || !foundOrder) {
            setScanResult({
                success: false,
                message: 'Parcel not found in system'
            });
            return;
        }

        // Warehouse scanning (loading onto van)
        if (scanMode === 'WAREHOUSE') {
            if (foundParcel.scannedOnVan) {
                setScanResult({
                    success: false,
                    parcel: foundParcel,
                    order: foundOrder,
                    message: 'Already scanned onto van'
                });
            } else {
                onUpdateParcel(foundParcel.id, {
                    scannedOnVan: true,
                    scannedOnAt: new Date().toISOString()
                });

                // Check if this was the last parcel
                const totalParcels = orders.reduce((acc, o) => acc + o.parcels.length, 0);
                const unscannedCount = orders.reduce((acc, o) => acc + o.parcels.filter(p => !p.scannedOnVan).length, 0);
                const isLastItem = unscannedCount === 1;

                setScanResult({
                    success: true,
                    parcel: foundParcel,
                    order: foundOrder,
                    message: isLastItem
                        ? `All ${totalParcels} boxes scanned and loaded on van`
                        : `Box ${foundParcel.boxNumber} loaded for ${foundOrder.recipientName}`,
                    isComplete: isLastItem
                });
            }
            return;
        }
        // ... (rest of function)

        // Delivery scanning (unloading at customer)
        if (scanMode === 'DELIVERY') {
            if (!foundParcel.scannedOnVan) {
                setScanResult({
                    success: false,
                    parcel: foundParcel,
                    order: foundOrder,
                    message: 'Parcel not scanned onto van at warehouse!'
                });
                return;
            }

            if (foundParcel.scannedOffVan) {
                setScanResult({
                    success: false,
                    parcel: foundParcel,
                    order: foundOrder,
                    message: 'Already delivered'
                });
                return;
            }

            // Special demo mode for Box 2 - auto-deliver with success message
            if (foundParcel.id === 'BOX-1002-2') {
                onUpdateParcel(foundParcel.id, {
                    scannedOffVan: true,
                    scannedOffAt: new Date().toISOString()
                });
                setScanResult({
                    success: true,
                    parcel: foundParcel,
                    order: foundOrder,
                    message: `✓ Parcel delivered at doorstep`,
                    gpsWarning: false
                });
                // In delivery mode for this specific demo case, we use timeout
                // But generally we might want the "Next" flow. 
                // Creating a consistent experience:
                // setTimeout(() => setScanResult(null), 3000); // Remove timeout to rely on Next button
                return;
            }

            // GPS validation
            let gpsWarning = false;
            // Skip GPS check for Box 2 (demo purposes)
            if (foundParcel.id !== 'BOX-1002-2' && currentLocation && foundOrder.geoLocation) {
                const distance = calculateDistance(currentLocation, foundOrder.geoLocation);
                if (distance > 100) { // More than 100 meters away
                    gpsWarning = true;
                }
            }

            setScanResult({
                success: true,
                parcel: foundParcel,
                order: foundOrder,
                message: gpsWarning
                    ? `⚠️ GPS Warning: You may be at the wrong location!`
                    : `Delivering to ${foundOrder.recipientName}`,
                gpsWarning
            });
            setShowAddressConfirm(true);
        }
    };

    const confirmDelivery = () => {
        if (scanResult?.parcel) {
            onUpdateParcel(scanResult.parcel.id, {
                scannedOffVan: true,
                scannedOffAt: new Date().toISOString()
            });
            setShowAddressConfirm(false);
            // In delivery confirm, we can simulate the Next press or let them see success
            setScanResult({
                success: true,
                parcel: scanResult.parcel,
                order: scanResult.order,
                message: 'Delivery Confirmed',
                gpsWarning: false
            });
        }
    };

    const simulateScan = (parcelId: string) => {
        setScannedCode(parcelId);
        handleScan(parcelId);
    };

    const handleNext = () => {
        if (scanResult?.isComplete) {
            setIsScanning(false);
        }
        setScanResult(null);
    };

    // ... (rest of the file)


    // Filter parcels for display
    const getScannedParcels = () => {
        return orders.flatMap(order => order.parcels.filter(p =>
            scanMode === 'WAREHOUSE' ? p.scannedOnVan : p.scannedOffVan
        ).map(p => ({ ...p, order })));
    };

    const getUnscannedParcels = () => {
        return orders.flatMap(order => order.parcels.filter(p =>
            scanMode === 'WAREHOUSE' ? !p.scannedOnVan : !p.scannedOffVan
        ).map(p => ({ ...p, order })));
    };

    const scannedList = getScannedParcels();
    const unscannedList = getUnscannedParcels();

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3 mb-2">
                    {scanMode === 'WAREHOUSE' ? (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Truck size={24} className="text-blue-600" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <MapPin size={24} className="text-emerald-600" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-black text-[#005961]">
                            {scanMode === 'WAREHOUSE' ? 'Load all deliveries' : 'Delivery Scan'}
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                            {scanMode === 'WAREHOUSE'
                                ? 'Scan boxes at warehouse'
                                : 'Scan to confirm delivery location'}
                        </p>
                    </div>
                </div>
                {currentLocation && scanMode === 'DELIVERY' && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg mt-2">
                        <Navigation size={14} />
                        <span className="font-bold">GPS Active</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                {/* Scan Trigger Area */}
                <button
                    onClick={() => setIsScanning(true)}
                    className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 mb-6 hover:border-[#0097a7] hover:bg-[#0097a7]/5 transition-all group active:scale-95"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <QrCode size={40} className="text-[#0097a7]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#005961] mb-2">Scan QR Code on box</h3>
                        <p className="text-sm text-slate-400">
                            {scanMode === 'WAREHOUSE'
                                ? 'Point camera at box to scan onto van'
                                : 'Tap to scan parcel at delivery address'}
                        </p>
                    </div>
                </button>

                {/* Scanned Items List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                            {scannedList.length > 0 ? 'Scanned Items' : 'No Items Scanned Yet'}
                        </p>
                        {scannedList.length > 0 && (
                            <span className="text-xs font-bold text-[#0097a7] bg-[#e0f7fa] px-2 py-1 rounded-md">
                                {scannedList.length} Box{scannedList.length !== 1 ? 'es' : ''}
                            </span>
                        )}
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {scannedList.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`w-full p-4 rounded-xl text-left border-l-4 shadow-sm bg-white ${scanMode === 'WAREHOUSE' ? 'border-l-blue-500' : 'border-l-emerald-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400">
                                            {item.order.id} - Box {item.boxNumber}
                                        </p>
                                        <p className="font-bold text-slate-800">{item.order.recipientName}</p>
                                    </div>
                                    <div className={`p-2 rounded-full ${scanMode === 'WAREHOUSE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        <CheckCircle size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanner Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-0 z-50 bg-black flex flex-col"
                    >
                        <div className="p-4 bg-black/50 backdrop-blur-md absolute top-0 left-0 right-0 z-30 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <ScanLine size={20} className="text-[#00d4e9]" />
                                    {scanMode === 'WAREHOUSE' ? 'Scan to load' : 'Scan to deliver'}
                                </h2>
                                <button
                                    onClick={() => setIsScanning(false)}
                                    className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {!currentLocation && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 relative animate-in slide-in-from-top-2 shadow-lg">
                                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-red-600 pr-6 leading-relaxed">
                                        No GPS found, geo assistance features disabled. Carefully check addresses.
                                    </p>
                                    <button className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                                </div>
                            )}
                        </div>

                        {/* Camera Simulation Area */}
                        <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-slate-900">
                            {/* Background Pattern or Video Placeholder */}
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                                    backgroundSize: '30px 30px'
                                }}
                            />

                            {/* Status Overlay (Top) */}
                            <div className="absolute top-20 left-6 right-6 z-20">
                                <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold text-sm">
                                            {scanMode === 'WAREHOUSE' ? 'Loading Van' : 'Scanning for Delivery'}
                                        </span>
                                        <span className="text-[#00d4e9] font-black text-lg">
                                            {scannedList.length}/{scannedList.length + unscannedList.length}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#00d4e9] transition-all duration-300"
                                            style={{ width: `${(scannedList.length / (scannedList.length + unscannedList.length)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Scanning Frame (Centered) */}
                            <div className="w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] border-2 border-[#00d4e9] rounded-3xl relative z-10 shadow-[0_0_100px_rgba(0,212,233,0.1)]">
                                <div className="absolute inset-0 bg-[#00d4e9]/5 animate-pulse rounded-3xl" />
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00d4e9] rounded-tl-xl -ml-1 -mt-1" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00d4e9] rounded-tr-xl -mr-1 -mt-1" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00d4e9] rounded-bl-xl -ml-1 -mb-1" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00d4e9] rounded-br-xl -mr-1 -mb-1" />
                                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#00d4e9] shadow-[0_0_15px_rgba(0,212,233,0.8)] animate-pulse" />
                            </div>

                            <p className="mt-8 text-white/70 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm relative z-10">
                                Align QR code within frame
                            </p>

                            {/* Simulation Controls (Bottom Overlay) */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent z-20">
                                <p className="text-center text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">Simulate:</p>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                                    {unscannedList.length === 0 ? (
                                        <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                                            <CheckCircle size={14} /> All items scanned
                                        </div>
                                    ) : (
                                        unscannedList.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => simulateScan(item.id)}
                                                className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-95 transition-all text-xs font-bold whitespace-nowrap flex items-center gap-2"
                                            >
                                                <ScanLine size={14} className="text-[#00d4e9]" />
                                                <span>Box {item.boxNumber}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scan Result Result Overlay (Appears on top of Scanner) */}
            <AnimatePresence>
                {scanResult && !showAddressConfirm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        {/* Success Card */}
                        {scanResult.success ? (
                            <div className="w-full max-w-sm bg-[#10b981] rounded-[2.5rem] p-8 shadow-2xl text-center text-white relative overflow-hidden flex flex-col items-center">
                                {/* Success Icon */}
                                <div className="mb-6 mt-2">
                                    <CheckCircle size={80} strokeWidth={2.5} className="text-white drop-shadow-md" />
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl font-black leading-tight mb-8 drop-shadow-sm">
                                    {scanResult.isComplete ? scanResult.message : (
                                        <>
                                            Box {scanResult.parcel?.boxNumber || '1'} loaded for<br />
                                            {scanResult.order?.recipientName}
                                        </>
                                    )}
                                </h3>

                                {/* Address Details Box */}
                                {!scanResult.isComplete && (
                                    <div className="w-full bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6">
                                        <p className="font-bold text-lg mb-1">{scanResult.order?.recipientName}</p>
                                        <p className="text-sm font-medium opacity-90 leading-snug">
                                            {scanResult.order?.address}
                                        </p>
                                    </div>
                                )}

                                {/* Next Button */}
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 rounded-2xl bg-white text-[#10b981] font-black text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {scanResult.isComplete ? 'Go back' : 'Next'} <ArrowRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            // Error Fallback
                            <div className="w-full max-w-sm bg-rose-500 rounded-[2.5rem] p-8 shadow-2xl text-center text-white">
                                <div className="mb-6 flex justify-center">
                                    <XCircle size={80} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Scan Failed</h3>
                                <p className="font-medium text-lg opacity-90 mb-8">{scanResult.message}</p>
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 rounded-2xl bg-white text-rose-500 font-black text-xl shadow-lg active:scale-95 transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Address Confirmation Modal (For Delivery Mode) */}
            <AnimatePresence>
                {showAddressConfirm && scanResult?.order && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full"
                        >
                            <div className="text-center mb-5">
                                {scanResult.gpsWarning ? (
                                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                        <AlertTriangle size={32} className="text-amber-600" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                        <MapPin size={32} className="text-emerald-600" />
                                    </div>
                                )}
                                <h3 className="text-xl font-black text-slate-800">
                                    {scanResult.gpsWarning ? 'Wrong Location?' : 'Confirm Delivery'}
                                </h3>
                                {scanResult.gpsWarning && (
                                    <p className="text-sm text-amber-700 font-medium mt-2">
                                        GPS shows you're far from this address
                                    </p>
                                )}
                            </div>

                            <div className={`rounded-2xl p-4 mb-4 ${scanResult.gpsWarning
                                ? 'bg-amber-50 border-2 border-amber-300'
                                : 'bg-slate-50'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <Package size={24} className={scanResult.gpsWarning ? 'text-amber-600' : 'text-[#0097a7]'} />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Delivering To:</p>
                                        <p className="text-lg font-black text-slate-800 mt-1">
                                            {scanResult.order.recipientName}
                                        </p>
                                        <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                                            {scanResult.order.address}
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-xs font-bold text-slate-400">
                                                Box {scanResult.parcel?.boxNumber} of {scanResult.order.parcels.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddressConfirm(false);
                                        setScanResult(null);
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold active:scale-95 transition-transform"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelivery}
                                    className={`flex-2 px-6 py-3 rounded-xl text-white font-bold active:scale-95 transition-transform ${scanResult.gpsWarning ? 'bg-amber-600' : 'bg-emerald-500'
                                        }`}
                                >
                                    {scanResult.gpsWarning ? '⚠️ Deliver Anyway' : '✓ Confirm Delivery'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
