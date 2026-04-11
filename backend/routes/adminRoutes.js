import express from 'express';
import { listUsers, updateUserRole, deleteUser } from '../controller/adminController.js';
import { protect, admin } from '../utils/authUtils.js';

const router = express.Router();

router.route('/users')
    .get(protect, admin, listUsers);

router.route('/users/:id')
    .put(protect, admin, updateUserRole)
    .delete(protect, admin, deleteUser);

export default router;
