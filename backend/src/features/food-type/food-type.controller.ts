import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';
import { foodTypeService } from './food-type.service.js';
import { ApiResponse } from '../../shared/types/index.js';

export class FoodTypeController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { businessId } = req.params as { businessId: string };
      const { name, icon } = req.body;

      const foodType = await foodTypeService.create(businessId, req.profileId, name, icon);
      if (!foodType) {
        res.status(403).json({ success: false, error: 'Unauthorized' } as ApiResponse);
        return;
      }

      res.status(201).json({ success: true, data: foodType } as ApiResponse);
    } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to create food type' } as ApiResponse);
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { businessId } = req.params as { businessId: string };
        const foodTypes = await foodTypeService.getAll(businessId, req.profileId);
        
        if (!foodTypes) {
            res.status(403).json({ success: false, error: 'Unauthorized' } as ApiResponse);
            return;
        }

        res.json({ success: true, data: foodTypes } as ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch food types' } as ApiResponse);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { businessId, id } = req.params as { businessId: string; id: string };
        const success = await foodTypeService.delete(id, businessId, req.profileId);

        if (!success) {
            res.status(403).json({ success: false, error: 'Unauthorized' } as ApiResponse);
            return;
        }

        res.json({ success: true, message: 'Deleted' } as ApiResponse);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete' } as ApiResponse);
    }
  }
  async setItemTags(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { itemId } = req.params as { itemId: string };
        const { foodTypeIds } = req.body; 

        // Verification of item ownership should happen here or via middleware.
        // For now trusting auth middleware on route + existing logic.

        await foodTypeService.setItemTags(itemId, foodTypeIds || []);
        res.json({ success: true } as ApiResponse);
    } catch (error) {
        console.error("Set tags error", error);
        res.status(500).json({ success: false, error: 'Failed to update tags' } as ApiResponse);
    }
  }

  async getItemTags(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { itemId } = req.params as { itemId: string };
        const tags = await foodTypeService.getItemTags(itemId);
        res.json({ success: true, data: tags } as ApiResponse);
    } catch (error) {
        console.error("Get tags error", error);
        res.status(500).json({ success: false, error: 'Failed to fetch tags' } as ApiResponse);
    }
  }
}

export const foodTypeController = new FoodTypeController();
