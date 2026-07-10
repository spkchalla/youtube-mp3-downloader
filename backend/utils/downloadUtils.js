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
 * Focused on local execution.
 */
export const runYtDlp = async (url, filePath) => {
    try {
        const args = [
            '-m', 'yt_dlp',
            '--no-warnings',
            '-x',
            '--audio-format', 'mp3',
            '-o', filePath,
            url
        ];
        if (process.env.YT_COOKIES) {
            args.splice(2, 0, '--cookies', '/tmp/cookies.txt');
        }
        await execFilePromise('python3', args);
    } catch (error) {
        console.error('yt-dlp error:', error.message);
        throw error;
    }
};
