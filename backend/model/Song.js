import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    uploader: {
        type: String
    },
    videoId: {
        type: String
    },
    duration: {
        type: Number
    },
    downloadCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const Song = mongoose.model('Song', songSchema);
export default Song;
