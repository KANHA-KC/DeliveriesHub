
import React, { useState } from "react";
import { ALPHALAKE_LOGO_URL } from "../constants";

interface LogoWithHoverMenuProps {
    onOpenHub: () => void;
    logoSrc?: string;
    isRightAligned?: boolean;
}

export function LogoWithHoverMenu({ onOpenHub, logoSrc = ALPHALAKE_LOGO_URL, isRightAligned = false }: LogoWithHoverMenuProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative inline-block z-50 group h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. The Logo Image */}
            <div className="flex flex-col justify-center h-full cursor-pointer px-2">
                <img
                    src={logoSrc}
                    alt="Logo"
                    className="object-contain h-8 w-auto"
                />
            </div>

            {/* 2. The Hover Popover (Tooltip) */}
            {isHovered && (
                <div
                    className={`absolute top-full ${isRightAligned ? 'right-0' : 'left-0'} w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
                >
                    {/* Tiny CSS Arrow pointing up */}
                    <div className={`absolute top-[-6px] ${isRightAligned ? 'right-6' : 'left-6'} w-3 h-3 bg-white border-t border-l border-slate-200 transform rotate-45 z-10`}></div>

                    <div className="flex flex-col gap-3 relative z-20">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Hub</p>
                            <p className="text-sm font-black text-[#005961] tracking-tight">Deliveries Hub</p>
                        </div>
                        {/* 3. The CTA Button */}
                        <button
                            className="w-full bg-[#003B46] hover:bg-[#0E7490] text-xs h-8 text-white font-medium rounded-md transition-colors"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent bubbling if needed
                                onOpenHub(); // Trigger the parent modal
                                setIsHovered(false);
                            }}
                        >
                            View Organisation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
