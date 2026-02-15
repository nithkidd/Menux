import { Router, Request, Response } from "express";
import { businessController } from "./business.controller.js";
import { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { can } from "../../shared/middleware/rbac.middleware.js";
import { businessCreateLimiter } from "../../shared/middleware/rateLimit.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Business management
 */

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Create a new business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - business_type
 *             properties:
 *               name:
 *                 type: string
 *               business_type:
 *                 type: string
 *                 enum: [restaurant, gaming_gear]
 *               slug:
 *                 type: string
 *                 description: Unique URL slug for the business
 *               primary_color:
 *                 type: string
 *                 description: Hex color code (e.g., #FF5733)
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               instagram_url:
 *                 type: string
 *               facebook_url:
 *                 type: string
 *               twitter_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business created successfully
 */
router.post(
  "/",
  can("create", "business"),
  businessCreateLimiter,
  (req: Request, res: Response) =>
    businessController.create(req as unknown as AuthRequest, res),
);

/**
 * @swagger
 * /business:
 *   get:
 *     summary: Get all businesses for the authenticated user
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of businesses
 */
router.get("/", can("read", "business"), (req: Request, res: Response) =>
  businessController.getAll(req as unknown as AuthRequest, res),
);

/**
 * @swagger
 * /business/{id}:
 *   get:
 *     summary: Get a business by ID
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business details
 *       404:
 *         description: Business not found
 */
router.get("/:id", (req: Request, res: Response) =>
  businessController.getById(req as unknown as AuthRequest, res),
);

/**
 * @swagger
 * /business/{id}:
 *   put:
 *     summary: Update a business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *                 description: Unique URL slug
 *               description:
 *                 type: string
 *               primary_color:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               is_published:
 *                 type: boolean
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               instagram_url:
 *                 type: string
 *               facebook_url:
 *                 type: string
 *               twitter_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 */
router.put("/:id", can("update", "business"), (req: Request, res: Response) =>
  businessController.update(req as unknown as AuthRequest, res),
);

/**
 * @swagger
 * /business/{id}:
 *   delete:
 *     summary: Delete a business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found
 */
router.delete(
  "/:id",
  can("delete", "business"),
  (req: Request, res: Response) =>
    businessController.delete(req as unknown as AuthRequest, res),
);

export default router;
