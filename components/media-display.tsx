"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BrandLogos } from "./brand-logos";

interface MediaItem {
    filename: string;
    type: "image" | "video";
    title: string;
    url: string;
}

interface MediaDisplayProps {
    isTransitioning: boolean;
    viewTimer: number;
    currentMediaIndex: number;
}

export function MediaDisplay({ isTransitioning, viewTimer, currentMediaIndex }: MediaDisplayProps) {
    const [publicImages, setPublicImages] = useState<MediaItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMediaFiles = async () => {
            try {
                const response = await fetch('/api/media');
                if (!response.ok) throw new Error('Failed to fetch media files');

                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setPublicImages(result.data);
                } else {
                    throw new Error('Invalid media data format');
                }
            } catch (error) {
                console.error('Error loading media files:', error);
                setError('Failed to load media files');
            }
        };

        loadMediaFiles();
    }, []);

    if (!publicImages.length || currentMediaIndex >= publicImages.length) {
        return null;
    }

    const currentMedia = publicImages[currentMediaIndex];
    const progress = (viewTimer / 20) * 100;

    return (
        <div className={`w-full h-screen bg-gradient-to-br from-background via-background to-card flex flex-col overflow-hidden transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <BrandLogos animate={false} />

            <div className="flex items-center justify-center mb-2 px-2 flex-shrink-0">
                <div className="text-center">
                    <div className="relative">
                        <h1 className="whitespace-nowrap text-3xl md:text-6xl font-extrabold text-accent uppercase font-sans">
                            Super Cup - Season 03
                        </h1>
                        <div className="w-24 h-1 mx-auto mt-2 bg-accent rounded-full opacity-90"></div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto p-4 flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Card className="relative overflow-hidden gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl max-w-6xl w-full">
                        <div className="relative">
                            {currentMedia.type === 'video' ? (
                                <video
                                    src={currentMedia.url}
                                    className="w-full h-[600px] object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    onError={(e) => console.error('Video error:', e)}
                                />
                            ) : (
                                <img
                                    src={currentMedia.url || "/placeholder.svg"}
                                    alt={currentMedia.title}
                                    className="w-full h-[600px] object-cover"
                                />
                            )}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}