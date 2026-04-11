import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
} else {
    console.warn('MONGO_URI not found in .env');
}

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send(`Server running at ${PORT}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started running at port ${PORT}`);
});
