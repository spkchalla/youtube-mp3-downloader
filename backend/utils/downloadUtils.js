import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFilePath = () => {
    const fileName = `${Date.now()}.mp3`;
    return path.join('temp', fileName);
};

export const runYtDlp = (url, filePath) => {
    return new Promise((resolve, reject) => {
        // Extract metadata first
        const metadataCommand = `yt-dlp --print "%(title)s|%(thumbnail)s|%(duration_string)s" "${url}"`;

        exec(metadataCommand, (metaErr, metaStdout) => {
            const [title, thumbnail, duration] = metaStdout ? metaStdout.trim().split('|') : ['Unknown Title', '', ''];

            const downloadCommand = `yt-dlp -x --audio-format mp3 --embed-thumbnail --add-metadata -o "${filePath}" "${url}"`;

            exec(downloadCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error('yt-dlp error:', error);
                    return reject(error);
                }
                resolve({ title, thumbnail, duration, stdout });
            });
        });
    });
};
