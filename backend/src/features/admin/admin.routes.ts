/**
 * Admin Routes
 *
 * All routes require admin or super_admin role.
 * User management routes require super_admin.
 */

import { Router } from "express";
import { can, requireRole } from "../../shared/middleware/rbac.middleware.js";
import * as adminController from "./admin.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and management (requires admin or super_admin role)
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics including business count, user count, etc.
 *       403:
 *         description: Forbidden - admin role required
 */
// ─── Dashboard (admin+) ────────────────────────────────────────────
router.get("/stats", can("read", "admin_dashboard"), adminController.getStats);

/**
 * @swagger
 * /admin/businesses:
 *   get:
 *     summary: List all businesses (super_admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all businesses
 *       403:
 *         description: Forbidden - super_admin role required
 */
// ─── Business Management (admin+) ──────────────────────────────────
router.get(
  "/businesses",
  requireRole("super_admin"),
  adminController.listBusinesses,
);

/**
 * @swagger
 * /admin/businesses/{id}/toggle:
 *   patch:
 *     summary: Toggle business active status
 *     tags: [Admin]
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
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Business status updated
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/businesses/:id/toggle",
  can("update", "business"),
  adminController.toggleBusiness,
);

/**
 * @swagger
 * /admin/businesses/{id}:
 *   delete:
 *     summary: Delete a business (admin)
 *     tags: [Admin]
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
 *         description: Business deleted
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/businesses/:id",
  can("delete", "business"),
  adminController.deleteBusiness,
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (super_admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users with roles
 *       403:
 *         description: Forbidden - super_admin role required
 */
// ─── User Management (super_admin only) ─────────────────────────────
router.get("/users", requireRole("super_admin"), adminController.listUsers);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (super_admin only)
 *     tags: [Admin]
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
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, super_admin]
 *     responses:
 *       200:
 *         description: User role updated
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/users/:id/role",
  requireRole("super_admin"),
  adminController.updateRole,
);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (super_admin only)
 *     tags: [Admin]
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
 *         description: User deleted
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/users/:id",
  requireRole("super_admin"),
  adminController.deleteUser,
);

/**
 * @swagger
 * /admin/users/invite:
 *   post:
 *     summary: Invite a new user (super_admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin, super_admin]
 *     responses:
 *       200:
 *         description: User invited successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  "/users/invite",
  requireRole("super_admin"),
  adminController.inviteUser,
);

export default router;
