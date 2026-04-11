import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export const createUser = async ({ username, email, password }) => {
    const hashedPassword = await hashPassword(password);
    return await User.create({
        username,
        email,
        password: hashedPassword
    });
};

export const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await comparePassword(password, user.password))) {
        return user;
    }
    return null;
};

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyToken(token);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
