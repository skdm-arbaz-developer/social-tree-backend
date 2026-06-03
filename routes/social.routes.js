import express from 'express';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../controllers/social.controller.js';
import { verifyClient } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(verifyClient);

router.get('/', getSocialLinks);
router.post('/', upload.single('icon'), createSocialLink);
router.put('/:id', upload.single('icon'), updateSocialLink);
router.delete('/:id', deleteSocialLink);

export default router;
