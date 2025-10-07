import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const mediaDirectory = path.join(process.cwd(), 'public', 'media');
        const files = fs.readdirSync(mediaDirectory)
            .filter(file => file.endsWith('.jpg'));  // Filter for jpg files

        return NextResponse.json(files);
    } catch (error) {
        console.error('Error reading media directory:', error);
        return NextResponse.json({ error: 'Failed to read media files' }, { status: 500 });
    }
}