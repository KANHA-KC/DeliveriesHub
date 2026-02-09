
import React, { useState, useRef, useEffect } from 'react';
import { Order, OrderStatus, PODMethod, CustomerConfig, Parcel } from '../types';
import { Camera, QrCode, MapPin, Package, CheckCircle2, ChevronRight, ChevronLeft, X, User, Truck, Eraser, CameraIcon, RotateCcw, AlertCircle, AlertTriangle, ShieldCheck, Hash, Circle, CheckCircle, Bell, ScanLine } from 'lucide-react';
import { Lock } from 'lucide-react';
import { POD_LABELS, ALPHALAKE_LOGO_URL, CARA_LOGO_URL } from '../constants';
import { ScanningView } from './ScanningView';

interface DriverViewProps {
  orders: Order[];
  onCompleteDelivery: (orderId: string) => void;
  onUpdateParcel: (parcelId: string, updates: Partial<Parcel>) => void;
  customerConfigs: Record<string, CustomerConfig>;
}

type PODFlowStep = 'DETAILS' | 'OTP' | 'RECIPIENT_NAME' | 'SIGNATURE' | 'PHOTO' | 'QR_SCAN' | 'SUCCESS';
type DriverViewMode = 'ROUTE' | 'WAREHOUSE_SCAN' | 'DELIVERY_SCAN' | 'POD';

export const DriverView: React.FC<DriverViewProps> = ({ orders, onCompleteDelivery, onUpdateParcel, customerConfigs }) => {
  const [viewMode, setViewMode] = useState<DriverViewMode>('ROUTE');
  const [activeScan, setActiveScan] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [podStep, setPodStep] = useState<PODFlowStep>('DETAILS');
  const [flowSteps, setFlowSteps] = useState<PODFlowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // POD Data
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [recipientName, setRecipientName] = useState('');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [scannedParcelIds, setScannedParcelIds] = useState<Set<string>>(new Set());
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showLocationWarning, setShowLocationWarning] = useState<boolean>(false);
  const [pendingOrderSelection, setPendingOrderSelection] = useState<Order | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Get current GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Demo: Force 'No GPS' state by not setting location
          // setCurrentLocation({
          //   latitude: position.coords.latitude,
          //   longitude: position.coords.longitude
          // });
        },
        (error) => {
          console.error('GPS Error:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
  }, []);

  const pendingOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED);

  // Calculate required steps when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      const config = customerConfigs[selectedOrder.recipientId];
      const steps: PODFlowStep[] = ['DETAILS'];

      if (config.requiredPOD.includes(PODMethod.OTP)) steps.push('OTP');
      if (config.requiredPOD.includes(PODMethod.SIGNATURE)) {
        steps.push('RECIPIENT_NAME');
        steps.push('SIGNATURE');
      }
      if (config.requiredPOD.includes(PODMethod.QR_SCAN)) steps.push('QR_SCAN');
      if (config.requiredPOD.includes(PODMethod.PHOTO)) steps.push('PHOTO');

      setFlowSteps(steps);
      setCurrentStepIndex(0);
      setPodStep('DETAILS');
    }
  }, [selectedOrder, customerConfigs]);

  const goToNextStep = () => {
    if (currentStepIndex < flowSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setPodStep(flowSteps[nextIdx]);
    } else {
      finalizeDelivery();
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setPodStep(flowSteps[prevIdx]);
    }
  };

  const handleScanSimulated = (order: Order) => {
    setSelectedOrder(order);
    setActiveScan(false);
  };

  const resetPOD = () => {
    setRecipientName('');
    setSignatureImage(null);
    setCapturedPhoto(null);
    setCameraError(null);
    setOtpValue(['', '', '', '']);
    setScannedParcelIds(new Set());
    setScanError(null);
    setPodStep('DETAILS');
    setSelectedOrder(null);
    setCurrentStepIndex(-1);
  };

  const finalizeDelivery = () => {
    if (selectedOrder) {
      onCompleteDelivery(selectedOrder.id);
      setPodStep('SUCCESS');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    if (value !== '' && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    draw(e);
  };

  const endDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
      setSignatureImage(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#005961';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureImage(null);
    }
  };

  const initCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError("Camera permission is required for verification.");
    }
  };

  useEffect(() => {
    const allParcelsScanned = selectedOrder && selectedOrder.parcels.every(p => scannedParcelIds.has(p.id));
    if ((podStep === 'PHOTO' || podStep === 'QR_SCAN') && !capturedPhoto && !allParcelsScanned) {
      initCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [podStep, capturedPhoto, scannedParcelIds, selectedOrder]);

  const simulateScan = (parcelId: string) => {
    if (!selectedOrder) return;

    setScanError(null);

    // Check if parcel belongs to current delivery
    const isValidParcel = selectedOrder.parcels.some(p => p.id === parcelId);

    if (isValidParcel) {
      setScannedParcelIds(prev => {
        const newSet = new Set(prev);
        newSet.add(parcelId);
        return newSet;
      });
    } else {
      setScanError(`⚠️ Wrong Box! This box belongs to a different delivery.`);
      // Auto-clear error after 3s
      setTimeout(() => setScanError(null), 3000);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (video) {
      // ... existing photo logic ...
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      if (podStep === 'PHOTO') {
        setCapturedPhoto(canvas.toDataURL('image/jpeg'));
      }
      // QR_SCAN is handled by simulateScan for now as we can't real-scan

      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    }
  };

  const handleStartDelivery = (order: Order) => {
    // Simulate GPS warning for specific orders or random
    // For demo: Order IDs starting with 'ORD-003' or similar mock simulation
    // Let's assume the 2nd order in the list (index 1) has a GPS mismatch
    const isWrongLocation = order.id === 'ORD-002';

    if (isWrongLocation) {
      setPendingOrderSelection(order);
      setShowLocationWarning(true);
    } else {
      setSelectedOrder(order);
    }
  };

  const confirmLocationWarning = () => {
    if (pendingOrderSelection) {
      setSelectedOrder(pendingOrderSelection);
      setShowLocationWarning(false);
      setPendingOrderSelection(null);
    }
  };

  if (activeScan) {
    return (
      <div className="absolute inset-0 bg-black z-50 flex flex-col">
        <div className="p-6 flex justify-between items-center text-white">
          <h2 className="font-bold">Scan Label</h2>
          <button onClick={() => setActiveScan(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full"><X size={20} /></button>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-64 h-64 border-2 border-[#0097a7] rounded-2xl relative">
            <div className="absolute inset-0 bg-[#0097a7]/20 animate-pulse rounded-2xl"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#0097a7] rounded-tl-xl -ml-1 -mt-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#0097a7] rounded-tr-xl -mr-1 -mt-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0097a7] rounded-bl-xl -ml-1 -mb-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#0097a7] rounded-br-xl -mr-1 -mb-1"></div>
          </div>
        </div>
        <div className="p-8 bg-slate-900 overflow-y-auto max-h-[40vh]">
          <p className="text-white/60 text-center text-xs font-bold uppercase tracking-widest mb-4">Simulate Order Scan:</p>
          <div className="space-y-3">
            {pendingOrders.map(o => (
              <button
                key={o.id}
                onClick={() => handleScanSimulated(o)}
                className="w-full bg-slate-800 text-white p-4 rounded-xl text-left flex justify-between items-center border border-slate-700"
              >
                <div>
                  <p className="text-xs font-bold text-[#0097a7]">{o.id}</p>
                  <p className="font-bold">{o.recipientName}</p>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    const isStepActive = (step: PODFlowStep) => podStep === step;
    const progressPercent = ((currentStepIndex + 1) / flowSteps.length) * 100;

    return (
      <div className="p-0 flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        <div className="pt-6 pb-2 px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 min-w-[40px]">
              {currentStepIndex > 0 && podStep !== 'SUCCESS' && (
                <button onClick={goToPrevStep} className="p-2 bg-[#f0f9fa] text-[#0097a7] rounded-xl hover:bg-[#e0f2f4] transition-colors">
                  <ChevronLeft size={22} strokeWidth={3} />
                </button>
              )}
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                STEP {currentStepIndex + 1} OF {flowSteps.length}
              </p>
              <h2 className="text-sm font-black text-[#005961] tracking-tight">
                {podStep === 'DETAILS' ? 'Verify Delivery' :
                  podStep === 'OTP' ? 'Secure PIN' :
                    podStep === 'RECIPIENT_NAME' ? 'Recipient Info' :
                      podStep === 'SIGNATURE' ? 'Digital POD' :
                        podStep === 'QR_SCAN' ? 'Scan Boxes' :
                          podStep === 'PHOTO' ? 'Proof Photo' : 'Finished'}
              </h2>
            </div>

            <div className="flex items-center min-w-[40px] justify-end">
              <button onClick={resetPOD} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0097a7] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!currentLocation && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 relative animate-in slide-in-from-top-2">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-600 pr-6 leading-relaxed">
                No GPS found, geo assistance features disabled. Carefully check addresses.
              </p>
            </div>
          )}
          {isStepActive('DETAILS') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Delivery ID</p>
                    <p className="text-sm font-black text-slate-700">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Driver</p>
                    <p className="text-sm font-black text-slate-700">Alan Smith</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recipient</p>
                  <h3 className="text-xl font-black text-[#005961]">{selectedOrder.recipientName}</h3>
                </div>
                <div className="flex items-start gap-2 text-slate-600 text-sm">
                  <MapPin size={16} className="mt-0.5 text-[#0097a7] shrink-0" />
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm pt-4 border-t border-slate-200">
                  <Package size={16} className="text-[#0097a7]" />
                  <p className="font-bold">{selectedOrder.items} Box(es) to Deliver</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#d9f2f2] flex items-center justify-center border border-[#b8e4e4] text-[#0097a7]">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#005961]">Required Proofs</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Complete all steps</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {customerConfigs[selectedOrder.recipientId]?.requiredPOD.map((method) => {
                    const isMandatory = method === 'SIGNATURE' || method === 'PHOTO';
                    return (
                      <span
                        key={method}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 border ${isMandatory
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-white border-slate-200 text-slate-600'
                          }`}
                      >
                        {isMandatory ? <Lock size={12} className="text-amber-600" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#0097a7]"></span>}
                        {POD_LABELS[method]}
                        {isMandatory && <span className="text-[9px] uppercase tracking-wider opacity-70 ml-0.5 font-black">Req</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isStepActive('OTP') && (
            <div className="space-y-10 py-8 animate-in slide-in-from-bottom-4 duration-300 text-center">
              <div>
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-sm">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Enter Recipient PIN</h3>
                <p className="text-sm text-slate-400 font-medium px-4 mt-2">Ask for the 4-digit code sent to their device.</p>
              </div>
              <div className="flex justify-center gap-4">
                {otpValue.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-14 h-18 text-center text-3xl font-black text-[#005961] bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0097a7] focus:outline-none transition-all"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>
          )}

          {isStepActive('RECIPIENT_NAME') && (
            <div className="space-y-8 py-8 animate-in slide-in-from-right-4 duration-300 text-center">
              <div>
                <div className="w-20 h-20 bg-cyan-50 text-[#0097a7] rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Who is accepting?</h3>
                <p className="text-sm text-slate-400 font-medium">Type the name of the person receiving the parcel.</p>
              </div>
              <div className="relative text-left">
                <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  autoFocus
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient Full Name"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-lg font-bold focus:border-[#005961] transition-all outline-none"
                />
              </div>
            </div>
          )}

          {isStepActive('SIGNATURE') && (
            <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300 text-center">
              <div className="px-2">
                <h3 className="text-lg font-bold text-slate-700 leading-tight mb-2">
                  Hold the app to the customer and ask to sign in the box using their finger.
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Exact signature not required, goods at doorstep will be photographed.
                </p>
              </div>
              <div className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] relative overflow-hidden min-h-[380px] shadow-inner-sm">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseOut={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur shadow-xl rounded-full text-slate-400 hover:text-red-500 transition-all active:scale-90 border border-slate-100"
                >
                  <Eraser size={24} />
                </button>
              </div>
            </div>
          )}

          {isStepActive('QR_SCAN') && (
            <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300 text-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800">Scan Label</h3>
                <p className="text-sm text-slate-400 font-medium">Align the QR code within the frame to verify.</p>
              </div>
              <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col items-center justify-center min-h-[350px]">
                {cameraError ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                    <AlertCircle size={48} className="text-amber-400" />
                    <p className="text-sm font-medium">{cameraError}</p>
                    <button onClick={initCamera} className="bg-[#0097a7] text-white px-6 py-2 rounded-xl text-sm font-bold">Enable Camera</button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 w-full px-6 flex flex-col h-full py-6">
                      {/* Status Header */}
                      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Scanning Boxes</span>
                          <span className="text-[#00d4e9] font-black text-lg">{scannedParcelIds.size}/{selectedOrder.parcels.length}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00d4e9] transition-all duration-300" style={{ width: `${(scannedParcelIds.size / selectedOrder.parcels.length) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Scan Frame */}
                      <div className="flex-1 flex items-center justify-center relative my-4">
                        <div className="w-64 h-64 border-2 border-[#0097a7] rounded-3xl relative">
                          <div className="absolute inset-0 bg-[#0097a7]/10 animate-pulse rounded-3xl"></div>
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#0097a7] rounded-tl-xl -ml-1 -mt-1"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#0097a7] rounded-tr-xl -mr-1 -mt-1"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0097a7] rounded-bl-xl -ml-1 -mb-1"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#0097a7] rounded-br-xl -mr-1 -mb-1"></div>
                          {scanError && (
                            <div className="absolute inset-0 bg-red-500/80 rounded-3xl flex items-center justify-center p-4 text-center animate-in zoom-in duration-200">
                              <p className="text-white font-bold text-lg">{scanError}</p>
                            </div>
                          )}
                          {scannedParcelIds.size === selectedOrder.parcels.length && (
                            <div className="absolute inset-0 bg-emerald-500/90 rounded-3xl flex items-center justify-center p-4 text-center animate-in zoom-in duration-200">
                              <div className="flex flex-col items-center">
                                <CheckCircle size={48} className="text-white mb-2" />
                                <p className="text-white font-bold text-lg">All Scanned!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Simulation Controls */}
                      <div className="space-y-2">
                        <p className="text-center text-white/50 text-[10px] uppercase tracking-widest font-bold">Simulate</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedOrder.parcels.map(p => (
                            <button
                              key={p.id}
                              onClick={() => simulateScan(p.id)}
                              disabled={scannedParcelIds.has(p.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${scannedParcelIds.has(p.id)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                }`}
                            >
                              {scannedParcelIds.has(p.id) ? '✓ ' : ''}Box {p.boxNumber}
                            </button>
                          ))}
                          {/* Wrong box simulation */}
                          <button
                            onClick={() => simulateScan('WRONG-BOX-123')}
                            className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                          >
                            Wrong Box
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {isStepActive('PHOTO') && (
            <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300 text-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800">Delivery of a parcel at a doorstep</h3>
                {/* <p className="text-sm text-slate-400 font-medium">Photograph package at drop-off location.</p> */}
              </div>
              <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex items-center justify-center min-h-[350px]">
                {!capturedPhoto ? (
                  <>
                    {cameraError ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                        <AlertCircle size={48} className="text-amber-400" />
                        <p className="text-sm font-medium">{cameraError}</p>
                        <button onClick={initCamera} className="bg-[#0097a7] text-white px-6 py-2 rounded-xl text-sm font-bold">Enable Camera</button>
                      </div>
                    ) : (
                      <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 border-[30px] border-black/20 pointer-events-none" />
                      </>
                    )}
                  </>
                ) : (
                  <img src={capturedPhoto} className="w-full h-full object-cover animate-in fade-in duration-500" />
                )}
              </div>
            </div>
          )}

          {isStepActive('SUCCESS') && (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 text-center py-10">
              <div className="relative">
                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 border-8 border-white">
                  <CheckCircle size={64} strokeWidth={3} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#005961] tracking-tighter">Delivery Complete</h3>
                <p className="text-slate-400 font-bold mt-4 px-12 uppercase text-[10px] tracking-[0.2em] leading-relaxed">Delivery documented and successfully completed.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
          <div className="flex gap-4">
            {podStep === 'PHOTO' && capturedPhoto && (
              <button
                onClick={() => setCapturedPhoto(null)}
                className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-[2rem] font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <RotateCcw size={20} /> Retake
              </button>
            )}

            <button
              disabled={
                (podStep === 'OTP' && otpValue.some(d => d === '')) ||
                (podStep === 'RECIPIENT_NAME' && !recipientName.trim()) ||
                (podStep === 'QR_SCAN' && selectedOrder && scannedParcelIds.size < selectedOrder.parcels.length) ||
                (podStep === 'PHOTO' && !capturedPhoto && cameraError === null && podStep !== 'PHOTO')
              }
              onClick={
                podStep === 'SUCCESS' ? resetPOD :
                  (podStep === 'PHOTO' && !capturedPhoto) ? takePhoto :
                    goToNextStep
              }
              className={`flex-[2] py-5 rounded-[2rem] font-black text-lg shadow-[0_15px_30px_-5px_rgba(0,89,97,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 bg-[#005961] text-white disabled:opacity-30`}
            >
              <Package size={22} className="opacity-80" />
              {podStep === 'DETAILS' ? 'Start with PODs' :
                podStep === 'PHOTO' && !capturedPhoto ? 'Capture' :
                  podStep === 'PHOTO' && capturedPhoto ? 'Confirm Delivery' :
                    podStep === 'SUCCESS' ? 'Return to Route' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Warehouse Scanning View
  if (viewMode === 'WAREHOUSE_SCAN') {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-[#005961] flex items-center gap-3">
          <button
            onClick={() => setViewMode('ROUTE')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-white font-bold">Warehouse Loading</h2>
        </div>
        <ScanningView
          orders={pendingOrders}
          onUpdateParcel={onUpdateParcel}
          scanMode="WAREHOUSE"
        />
      </div>
    );
  }



  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="px-6 py-3 bg-[#005961] flex justify-between items-center relative z-10 transition-all duration-300">

        {/* Location Warning Modal */}
        {showLocationWarning && pendingOrderSelection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-center text-slate-800 mb-2">Wrong Location?</h3>
              <p className="text-center text-slate-500 text-sm font-medium mb-6">
                You seem to be far from the delivery address for <span className="text-slate-900 font-bold">{pendingOrderSelection.recipientName}</span>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLocationWarning(false);
                    setPendingOrderSelection(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 font-bold text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLocationWarning}
                  className="flex-1 py-3 bg-[#005961] font-bold text-white rounded-xl hover:bg-[#004a50] transition-colors shadow-lg shadow-cyan-900/20"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <div className="h-6">
            <img
              src={ALPHALAKE_LOGO_URL}
              alt="Alphalake Ai"
              className="h-full object-contain"
            />
          </div>
          <div className="h-5 w-[1px] bg-white/20 ml-0 mr-2" />
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-bold text-white tracking-tight leading-none">Pharmacy Cloud</h1>
            <p className="text-white/60 text-[10px] font-light tracking-wide">Deliveries Hub</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#22d3ee] border border-white/10 shadow-lg cursor-pointer hover:bg-white/10 transition-all">
          <Truck size={20} strokeWidth={1.5} />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-32">
        {!currentLocation && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 relative animate-in slide-in-from-top-2">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-600 pr-6 leading-relaxed">
              No GPS found, geo assistance features disabled. Carefully check addresses.
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#005961] tracking-tight">Today's Route</h2>
        </div>
        {pendingOrders.map(order => {
          const loadedCount = order.parcels.filter(p => p.scannedOnVan).length;
          const totalCount = order.parcels.length;
          const isFullyLoaded = loadedCount === totalCount && totalCount > 0;
          const isPartiallyLoaded = loadedCount > 0 && !isFullyLoaded;

          return (
            <div key={order.id} className={`p-4 rounded-[2rem] border shadow-sm transition-all active:shadow-lg group ${isFullyLoaded
              ? 'bg-[#f0f9ff] border-[#bae6fd] hover:border-[#38bdf8]' // Blue theme for loaded
              : 'bg-white border-slate-100 hover:border-[#0097a7]/40'
              }`}>
              <div className="flex justify-between items-center mb-3">
                <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isFullyLoaded
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-[#d9f2f2] text-[#005961] border-[#005961]/5'
                  }`}>
                  <Hash size={10} /> {order.id}
                </div>
              </div>
              <div className="space-y-0.5 mb-4">
                <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-[#005961] transition-colors">{order.recipientName}</h3>
                <div className="flex items-start gap-1.5 text-slate-400 font-medium">
                  <MapPin size={12} className="shrink-0 mt-0.5" />
                  <p className="text-xs leading-snug">
                    {order.address}
                    {order.eireCode && <span className="font-bold text-slate-500 ml-1">{order.eireCode}</span>}
                  </p>
                </div>
              </div>
              <div className={`flex justify-between items-center pt-3 border-t ${isFullyLoaded ? 'border-blue-100' : 'border-slate-50'
                }`}>
                <div className={`flex items-center gap-1.5 ${isFullyLoaded ? 'text-blue-600' : 'text-slate-400'}`}>
                  <Package size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isFullyLoaded
                      ? `${loadedCount}/${totalCount} Boxes loaded`
                      : isPartiallyLoaded
                        ? `${loadedCount}/${totalCount} boxes loaded`
                        : `Load ${totalCount} boxes onto van`}
                  </span>
                </div>

                {/* Only show Drop Off button if fully loaded */}
                {isFullyLoaded && (
                  <button onClick={() => handleStartDelivery(order)} className="flex items-center gap-1.5 text-xs font-black transition-all bg-[#005961] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-900/10 hover:bg-[#004a50] active:scale-95">
                    Drop off <ChevronRight size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-4 right-4 z-40 space-y-2">
        {(() => {
          const totalBoxes = pendingOrders.reduce((acc, order) => acc + order.parcels.length, 0);
          const loadedBoxes = pendingOrders.reduce((acc, order) => acc + order.parcels.filter(p => p.scannedOnVan).length, 0);

          let btnText = "Scan to start loading";
          let btnClass = "bg-blue-600 text-white";
          let Icon = Truck;

          if (loadedBoxes > 0 && loadedBoxes < totalBoxes) {
            btnText = "Continue loading";
          } else if (loadedBoxes > 0 && loadedBoxes === totalBoxes) {
            btnText = `All ${totalBoxes} Boxes on van`;
            btnClass = "bg-emerald-600 text-white";
            Icon = CheckCircle;
          }

          return (
            <button
              onClick={() => setViewMode('WAREHOUSE_SCAN')}
              className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${btnClass}`}
            >
              <Icon size={18} /> {btnText.toUpperCase()}
            </button>
          );
        })()}
      </div>
    </div>
  );
};
