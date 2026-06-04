import express from 'express';
import { getServices, addService, updateService, deleteService, reorderServices } from '../controllers/service.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getServices);
router.post('/', addService);
router.put('/reorder', reorderServices);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
