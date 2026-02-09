import { Router } from "express";
import { verifyAuth } from "../../shared/middleware/auth.middleware.js";
import { foodTypeController } from "./food-type.controller.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: FoodTypes
 *   description: Food type/dietary tag management (Halal, Vegan, Spicy, etc.)
 */

/**
 * @swagger
 * /business/{businessId}/food-types:
 *   post:
 *     summary: Create a food type tag for a business
 *     tags: [FoodTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Halal
 *               icon:
 *                 type: string
 *                 example: 🥗
 *     responses:
 *       201:
 *         description: Food type created successfully
 *       403:
 *         description: Unauthorized
 */
router.post("/", verifyAuth, (req, res) =>
  foodTypeController.create(req as any, res),
);

/**
 * @swagger
 * /business/{businessId}/food-types:
 *   get:
 *     summary: Get all food types for a business
 *     tags: [FoodTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of food types
 *       403:
 *         description: Unauthorized
 */
router.get("/", verifyAuth, (req, res) =>
  foodTypeController.getAll(req as any, res),
);

/**
 * @swagger
 * /business/{businessId}/food-types/{id}:
 *   delete:
 *     summary: Delete a food type
 *     tags: [FoodTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food type deleted
 *       403:
 *         description: Unauthorized
 */
router.delete("/:id", verifyAuth, (req, res) =>
  foodTypeController.delete(req as any, res),
);

export const foodTypeRoutes = router;
