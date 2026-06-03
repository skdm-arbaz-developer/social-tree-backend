import express from 'express';
import { getPublicProfile } from '../controllers/public.controller.js';

const router = express.Router();

router.get('/client/:unique_id', getPublicProfile);

export default router;
