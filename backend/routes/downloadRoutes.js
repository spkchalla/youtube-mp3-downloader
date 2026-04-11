import express from 'express';
import { downloadMp3 } from '../controller/downloadController.js';
import { protect } from '../utils/authUtils.js';

const router = express.Router();

router.post('/', protect, downloadMp3);

export default router;
