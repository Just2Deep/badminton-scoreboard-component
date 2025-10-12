import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Supported media types
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

function getMediaType(filename: string): 'image' | 'video' | null {
    const ext = path.extname(filename).toLowerCase();
    if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
    if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
    return null;
}

function formatTitle(filename: string): string {
    // Remove extension and replace dashes/underscores with spaces
    const nameWithoutExt = filename.split('.')[0];
    return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function GET() {
    try {
        const mediaDirectory = path.join(process.cwd(), 'public', 'media');
        if (!fs.existsSync(mediaDirectory)) {
            fs.mkdirSync(mediaDirectory, { recursive: true });
        }

        const files = fs.readdirSync(mediaDirectory);
        const mediaFiles = files
            .map(file => {
                const mediaType = getMediaType(file);
                if (!mediaType) return null;

                return {
                    filename: file,
                    type: mediaType,
                    title: formatTitle(file),
                    url: `/media/${encodeURIComponent(file)}`
                };
            })
            .filter(Boolean);

        return NextResponse.json({
            success: true,
            data: mediaFiles,
            total: mediaFiles.length
        });
    } catch (error) {
        console.error('Error reading media directory:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to read media files',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
