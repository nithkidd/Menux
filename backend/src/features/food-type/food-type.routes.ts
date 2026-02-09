import { Router } from 'express';
import { verifyAuth } from '../../shared/middleware/auth.middleware.js';
import { foodTypeController } from './food-type.controller.js';

const router = Router({ mergeParams: true });

router.post('/', verifyAuth, (req, res) => foodTypeController.create(req as any, res));
router.get('/', verifyAuth, (req, res) => foodTypeController.getAll(req as any, res));
router.delete('/:id', verifyAuth, (req, res) => foodTypeController.delete(req as any, res));

export const foodTypeRoutes = router;
