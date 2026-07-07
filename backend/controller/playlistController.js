import { getPlaylistMetadata } from '../utils/metadataUtils.js';

export const getPlaylistInfo = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        console.log(`Extracting playlist metadata: ${url}`);
        const playlistItems = await getPlaylistMetadata(url);
        
        res.json({
            message: 'Playlist fetched successfully',
            items: playlistItems
        });
    } catch (error) {
        console.error('Playlist fetch failed:', error.message);
        res.status(500).json({
            message: 'Failed to fetch playlist',
            details: error.message
        });
    }
};
