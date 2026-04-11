import { exec } from 'child_process';

/**
 * Wraps child_process.exec in a Promise
 * @param {string} command 
 * @returns {Promise<string>}
 */
const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            resolve(stdout.trim());
        });
    });
};

/**
 * Extracts metadata from a YouTube URL using yt-dlp
 * @param {string} url 
 * @returns {Promise<{title: string, uploader: string, duration: number, videoId: string, thumbnail: string}>}
 */
        : metadata.thumbnail;

return {
    title: metadata.title,
    uploader: metadata.uploader,
    duration: metadata.duration,
    videoId: metadata.id,
    thumbnail: thumbnail
};
} catch (error) {
    if (error instanceof SyntaxError) {
        throw new Error('Failed to parse yt-dlp output');
    }
    throw new Error(`yt-dlp metadata extraction failed: ${error.message}`);
}
}
