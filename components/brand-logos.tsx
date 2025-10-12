"use client";

interface BrandLogosProps {
    animate?: boolean;
}

export function BrandLogos({ animate = true }: BrandLogosProps) {
    return (
        <>
            <div className="fixed top-1 sm:top-1 md:top-1 left-1 sm:left-1 md:left-1 z-50">
                <div className={`w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-xl sm:rounded-2xl flex items-center justify-center ${animate ? 'float-effect' : ''} overflow-hidden`}>
                    <img
                        src="/images/design-mode/academy-logo.png"
                        alt="Sports Clan Badminton Academy logo"
                        className="w-full h-full object-contain p-1"
                    />
                </div>
            </div>
            <div className="fixed top-1 sm:top-1 md:top-1 right-1 sm:right-1 md:right-1 z-50">
                <div className={`w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-xl sm:rounded-2xl flex items-center justify-center ${animate ? 'float-effect' : ''} overflow-hidden`}>
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
