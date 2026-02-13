import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadController } from './upload.controller.js';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../shared/middleware/rbac.middleware.js';

const router = Router();

// Configure multer for memory storage
import { uploadMiddleware } from './upload.middleware.js';

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload/logo:
 *   post:
 *     summary: Upload a business logo
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 */
// Upload routes (all protected for Business Owners and Platform Admin)
router.post('/logo', requireRole('user', 'admin'), uploadMiddleware.single('file'), (req: Request, res: Response) => 
  uploadController.uploadLogo(req as unknown as AuthRequest, res)
);

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload a menu item image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/image', requireRole('user', 'admin'), uploadMiddleware.single('file'), (req: Request, res: Response) => 
  uploadController.uploadImage(req as unknown as AuthRequest, res)
);

/**
 * @swagger
 * /upload/url:
 *   post:
 *     summary: Upload a menu item image from URL
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/url', requireRole('user', 'admin'), (req: Request, res: Response) => 
  uploadController.uploadImageFromUrl(req as unknown as AuthRequest, res)
);

/**
 * @swagger
 * /upload/{publicId}:
 *   delete:
 *     summary: Delete an uploaded image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The public ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Invalid public ID
 *       401:
 *         description: Unauthorized
 */
// Use regex to match any path after /upload/
router.delete(/^\/(.*)/, requireRole('user', 'admin'), (req: Request, res: Response) => 
    uploadController.deleteImage(req as unknown as AuthRequest, res)
);

export default router;
