import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFilePromise = promisify(execFile);

export const getMetadata = async (url) => {
    // 1. Determine which binary to use
    // Check if the local ./yt-dlp we downloaded in the bash script exists
    const localPath = path.join(process.cwd(), 'yt-dlp');
    const command = fs.existsSync(localPath) ? localPath : 'yt-dlp';

    try {
        console.log(`Extracting metadata using: ${command} for URL: ${url}`);

        // 2. Execute directly (no shell involved, no "word unexpected" errors)
        const { stdout } = await execFilePromise(command, [
            '--no-warnings',
            '-j',            // Output JSON metadata
            '--no-playlist', // Ensure we only get one video
            url
        ]);

        return JSON.parse(stdout);
    } catch (error) {
        console.error('yt-dlp execution error:', error.message);
        throw new Error(`Failed to extract metadata: ${error.message}`);
    }
};