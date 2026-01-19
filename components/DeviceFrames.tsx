import React from 'react';

export const LaptopFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
            {/* Screen Assembly */}
            <div className="relative w-full max-w-[1200px] aspect-[16/10] bg-black rounded-t-[24px] border-[12px] border-black shadow-2xl flex flex-col ring-1 ring-white/5">
                {/* Camera Notch Area */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-black rounded-b-xl z-50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-gray-800"></div>
                </div>
                {/* Screen Content */}
                <div className="flex-1 bg-white overflow-hidden relative z-10 rounded-t-[12px] w-full h-full">
                    {children}
                </div>
            </div>
            {/* Laptop Base (Body) */}
            <div className="w-full max-w-[1400px] h-[16px] bg-[#d1d5db] rounded-b-[16px] shadow-xl relative mt-[-1px] z-20">
                {/* Indentation for opening */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[6px] bg-[#9ca3af] rounded-b-lg opacity-50"></div>
            </div>
            {/* Reflection / Table */}
            <div className="w-full max-w-[1200px] h-20 bg-gradient-to-b from-white/5 to-transparent mt-2 rounded-full blur-2xl opacity-20"></div>
        </div>
    );
};

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#111] flex items-center justify-center p-8 font-sans">
            <div className="relative w-[390px] h-[844px] bg-black rounded-[55px] border-[12px] border-black shadow-[0_0_0_2px_#333,0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 pointer-events-none"></div>

                {/* Status Bar Placeholder (optional, but helps push content if needed, though usually app handles it) */}

                {/* Screen Content */}
                <div className="flex-1 bg-white overflow-hidden relative z-10 w-full h-full rounded-[44px]">
                    {children}
                </div>
            </div>
        </div>
    );
};
