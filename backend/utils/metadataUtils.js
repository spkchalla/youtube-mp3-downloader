import { execFile } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

/**
 * Extracts metadata from a YouTube URL using yt-dlp.
 * Focused on local execution.
 */
export const getMetadata = async (url) => {
    try {
        const { stdout } = await execFilePromise('yt-dlp', [
            '--no-warnings',
            '-j',
            '--no-playlist',
            url
        ]);

        return JSON.parse(stdout);
    } catch (error) {
        console.error('yt-dlp error:', error.message);
        throw new Error(`Failed to extract metadata: ${error.message}`);
    }
};