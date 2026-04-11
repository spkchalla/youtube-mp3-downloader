import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFilePromise = promisify(execFile);

/**
 * Extracts metadata from a YouTube URL using yt-dlp.
 * Designed to work seamlessly in Docker and local environments.
 */
export const getMetadata = async (url) => {
    // 1. Path Resolution
    // In Docker, we use the global command. 
    // Locally, we check if a binary exists in the project root.
    const localBinary = path.join(process.cwd(), 'yt-dlp');
    const command = fs.existsSync(localBinary) ? localBinary : 'yt-dlp';

    try {
        console.log(`[Metadata] Extracting for: ${url}`);
        console.log(`[Metadata] Using binary: ${command}`);

        // 2. Execute yt-dlp
        // -j: Output JSON
        // --no-playlist: Only get the specific video
        // --no-warnings: Keep logs clean
        const { stdout } = await execFilePromise(command, [
            '--no-warnings',
            '-j',
            '--no-playlist',
            url
        ]);

        // 3. Parse and return JSON
        if (!stdout) {
            throw new Error('No metadata output received from yt-dlp');
        }

        return JSON.parse(stdout);

    } catch (error) {
        console.error('[Metadata] Error details:', error.message);

        // Handle the specific "Command Not Found" error
        if (error.code === 'ENOENT') {
            throw new Error(
                `yt-dlp not found. Verify that your Dockerfile installs python3 and yt-dlp_linux to /usr/bin/.`
            );
        }

        // Handle cases where YouTube blocks the request or URL is invalid
        throw new Error(`yt-dlp metadata extraction failed: ${error.message}`);
    }
};