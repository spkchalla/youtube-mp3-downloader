import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`User ${email} has been promoted to admin`);
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: node scripts/makeAdmin.js <email>');
    process.exit(1);
}

promoteToAdmin(email);
