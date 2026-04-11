import { execFile } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

export const getMetadata = async (url) => {
    // Docker ensures 'yt-dlp' is in the system PATH
    const command = 'yt-dlp';

    try {
        console.log(`Extracting metadata for: ${url}`);

        // Execute globally
        const { stdout } = await execFilePromise(command, [
            '--no-warnings',
            '-j',
            '--no-playlist',
            url
        ]);

        return JSON.parse(stdout);
    } catch (error) {
        console.error('Execution Error:', error.message);

        // This helps you debug if the binary is truly missing or just failing
        if (error.code === 'ENOENT') {
            throw new Error("yt-dlp not found in Docker PATH. Check Dockerfile installation.");
        }

        throw new Error(`yt-dlp failed: ${error.message}`);
    }
};