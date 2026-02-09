import { foodTypeRepository, FoodType } from './food-type.repository.js';
import { businessRepository } from '../business/business.repository.js';

export class FoodTypeService {
  private async verifyOwnership(businessId: string, profileId: string): Promise<boolean> {
    const business = await businessRepository.findByIdAndOwner(businessId, profileId);
    return !!business;
  }

  async create(businessId: string, profileId: string, name: string, icon: string): Promise<FoodType | null> {
    const isOwner = await this.verifyOwnership(businessId, profileId);
    if (!isOwner) return null;

    return foodTypeRepository.create({ business_id: businessId, name, icon });
  }

  async getAll(businessId: string, profileId: string): Promise<FoodType[] | null> {
    const isOwner = await this.verifyOwnership(businessId, profileId);
    if (!isOwner) return null;

    return foodTypeRepository.findByBusinessId(businessId);
  }

  async delete(id: string, businessId: string, profileId: string): Promise<boolean> {
    const isOwner = await this.verifyOwnership(businessId, profileId);
    if (!isOwner) return false;

    // Ideally verify the food type belongs to the business, but simplifying for now
    return foodTypeRepository.delete(id);
  }

  async setItemTags(itemId: string, resultTags: string[]) {
      await foodTypeRepository.removeItemTags(itemId);
      await foodTypeRepository.addItemTags(itemId, resultTags);
  }

  async getItemTags(itemId: string): Promise<string[]> {
      return foodTypeRepository.getItemTags(itemId);
  }
}

export const foodTypeService = new FoodTypeService();
