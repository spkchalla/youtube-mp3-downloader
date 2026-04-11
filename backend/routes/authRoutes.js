import express from 'express';
import {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controller/authController.js';
import { protect, admin } from '../utils/authUtils.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// CRUD routes
router.route('/users')
    .get(protect, admin, getUsers);

router.route('/users/:id')
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
