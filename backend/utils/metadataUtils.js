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

/**
 * Extracts playlist metadata using yt-dlp.
 * Returns an array of items in the playlist.
 */
export const getPlaylistMetadata = async (url) => {
    try {
        const { stdout } = await execFilePromise('yt-dlp', [
            '--no-warnings',
            '--flat-playlist',
            '-J',
            url
        ]);

        const parsed = JSON.parse(stdout);
        // YouTube playlists returned by yt-dlp -J have an 'entries' array
        if (parsed.entries) {
            return parsed.entries.map(entry => ({
                title: entry.title,
                url: entry.url,
                duration: entry.duration,
                id: entry.id
            }));
        }
        
        // Fallback for single videos passed accidentally
        return [{
            title: parsed.title,
            url: parsed.webpage_url || url,
            duration: parsed.duration,
            id: parsed.id
        }];
    } catch (error) {
        console.error('yt-dlp playlist error:', error.message);
        throw new Error(`Failed to extract playlist: ${error.message}`);
    }
};