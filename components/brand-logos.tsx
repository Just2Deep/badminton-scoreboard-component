"use client";

interface BrandLogosProps {
    animate?: boolean;
}

export function BrandLogos({ animate = true }: BrandLogosProps) {
    return (
        <>
            <div className="fixed top-4 left-4 z-50">
                <div className={`w-32 h-32 md:w-40 md:h-40 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl ${animate ? 'float-effect' : ''} overflow-hidden`}>
                    <img
                        src="/images/design-mode/academy-logo.png"
                        alt="Sports Clan Badminton Academy logo"
                        className="w-full h-full object-contain p-1"
                    />
                </div>
            </div>
            <div className="fixed top-4 right-4 z-50">
                <div className={`w-32 h-32 md:w-40 md:h-40 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl ${animate ? 'float-effect' : ''} overflow-hidden`}>
                    <img
                        src="/images/design-mode/other-logo.png"
                        alt="Super Park Sports logo"
                        className="w-full h-full object-contain p-1"
                    />
                </div>
            </div>
        </>
    );
}