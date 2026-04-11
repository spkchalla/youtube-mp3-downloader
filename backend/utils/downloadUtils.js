import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFilePromise = promisify(execFile);

export const generateFilePath = () => {
    const fileName = `${Date.now()}.mp3`;
    return path.join('temp', fileName);
};

/**
 * Executes yt-dlp to download and convert to mp3
 * @param {string} url 
 * @param {string} filePath 
 * @returns {Promise<void>}
 */
export const runYtDlp = async (url, filePath) => {
    // Determine binary (fallback for local dev)
    const localPath = path.join(process.cwd(), 'yt-dlp');
    const importFs = await import('fs');
    const command = importFs.default.existsSync(localPath) ? localPath : 'yt-dlp';

    try {
        await execFilePromise(command, [
            '--no-warnings',
            '-x',
            '--audio-format', 'mp3',
            '-o', filePath,
            url
        ]);
    } catch (error) {
        console.error('yt-dlp download error:', error.message);
        throw error;
    }
};
