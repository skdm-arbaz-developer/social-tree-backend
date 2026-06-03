import express from 'express';
import { createClient, getClients, getProfile, updateProfile, updateClientStatus, updateClientByAdmin } from '../controllers/client.controller.js';
import { verifySuperadmin, verifyClient } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Client routes
router.get('/profile', verifyClient, getProfile);
router.put('/profile', verifyClient, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), updateProfile);

// Superadmin routes
router.post('/', verifySuperadmin, createClient);
router.get('/', verifySuperadmin, getClients);
router.put('/:id/status', verifySuperadmin, updateClientStatus);
router.put('/:id', verifySuperadmin, updateClientByAdmin);

export default router;
