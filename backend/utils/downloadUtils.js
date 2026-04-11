import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
export const runYtDlp = (url, filePath) => {
    return new Promise((resolve, reject) => {
        // Use local if global not found
        const command = `(command -v yt-dlp > /dev/null 2>&1 && yt-dlp || ./yt-dlp) --no-warnings -x --audio-format mp3 -o "${filePath}" "${url}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('yt-dlp error:', error);
                console.error('yt-dlp stderr:', stderr);
                return reject(error);
            }
            resolve();
        });
    });
};
