import express from 'express';
import { getPlaylistInfo } from '../controller/playlistController.js';
import { protect } from '../utils/authUtils.js';

const router = express.Router();

router.post('/', protect, getPlaylistInfo);

export default router;
