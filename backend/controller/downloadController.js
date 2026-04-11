import fs from 'fs';
import path from 'path';
import { generateFilePath, runYtDlp } from '../utils/downloadUtils.js';
import { getMetadata } from '../utils/metadataUtils.js';
import Song from '../model/Song.js';

let isDownloading = false;

export const downloadMp3 = async (req, res) => {
    const { url } = req.body;
    const userId = req.user._id;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    if (isDownloading) {
        return res.status(429).json({ message: 'Another download in progress. Try later.' });
    }

    isDownloading = true;

    const filePath = generateFilePath();

    try {
        console.log(`Extracting metadata: ${url}`);
        const metadata = await getMetadata(url);
        const { title, thumbnail, duration, uploader, videoId } = metadata;

        console.log(`Starting download: ${title}`);
        await runYtDlp(url, filePath);

        // Save to history
        await Song.findOneAndUpdate(
            { user: userId, url: url },
            {
                title,
                thumbnail,
                duration,
                uploader,
                videoId,
                $inc: { downloadCount: 1 }
            },
            { upsert: true, new: true }
        );

        res.download(filePath, `${title.replace(/[^\w\s]/gi, '')}.mp3`, (err) => {
            // Cleanup
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Cleanup error:', unlinkErr);
            });

            isDownloading = false;

            if (err) {
                console.error('Download send error:', err);
            }
        });
    } catch (error) {
        isDownloading = false;
        console.error('Download failed:', error);
        res.status(500).json({ message: 'Download failed' });
    }
};
