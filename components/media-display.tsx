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

    // If no images are loaded yet, show a loading state instead of null
    if (!publicImages.length) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-xl text-primary animate-pulse">Loading media...</div>
            </div>
        );
    }

    // Ensure currentMediaIndex loops back to 0 when it exceeds array length
    const safeIndex = currentMediaIndex % publicImages.length;
    const currentMedia = publicImages[safeIndex];
    const progress = (viewTimer / 20) * 100;

    return (
        <div className={`w-full h-screen bg-gradient-to-br from-background via-background to-card flex flex-col transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <BrandLogos animate={false} />

            <div className="w-full max-w-6xl mx-auto p-4 flex-1">
                <Card className="relative h-[90vh] gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl">
                    <div className="relative w-full h-full overflow-hidden">
                        <div className="min-h-full">
                            {currentMedia.type === 'video' ? (
                                <video
                                    src={currentMedia.url}
                                    className="w-full h-full object-contain"
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
                                    className="w-full h-full object-contain bg-black/5"
                                />
                            )}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
