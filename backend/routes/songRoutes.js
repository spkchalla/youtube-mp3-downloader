import express from 'express';
import { getUserSongs, deleteSong } from '../controller/songController.js';
import { protect } from '../utils/authUtils.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserSongs);

router.route('/:id')
    .delete(protect, deleteSong);

export default router;
