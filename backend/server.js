import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import songRoutes from './routes/songRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';

const app = express();

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

const __filename = fileURLToPath(import.meta.url);

// Ensure temp directory exists
if (!fs.existsSync('temp')) {
    fs.mkdirSync('temp');
    console.log('Created temp directory');
}

if (process.env.YT_COOKIES) {
    const cookiesPath = path.join('/tmp', 'cookies.txt');
    try {
        fs.writeFileSync(cookiesPath, process.env.YT_COOKIES, { encoding: 'utf-8' });
        console.log('Successfully wrote YT_COOKIES to /tmp/cookies.txt');
    } catch (err) {
        console.error('Failed to write YT_COOKIES:', err);
    }
}

app.use(cors({
    origin: ['http://music.spkumarchalla.com', 'https://music.spkumarchalla.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
} else {
    console.error('CRITICAL: MONGO_URI not found in environment variables');
}

app.use('/api/auth', authRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/playlist', playlistRoutes);

// Serve frontend static files
app.get('/', (req, res) => {
    res.send(`Server running at ${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started running at port ${PORT}`);
});
