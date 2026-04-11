import Song from '../model/Song.js';

export const getUserSongs = async (req, res) => {
    try {
        const songs = await Song.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
        if (song) {
            await song.deleteOne();
            res.json({ message: 'Song removed from history' });
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
