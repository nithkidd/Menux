import api from '../../../shared/utils/api';

export interface FoodType {
  id: string;
  business_id: string;
  name: string;
  icon: string;
}

export const foodTypeService = {
  getAll: async (businessId: string) => {
    const response = await api.get<{ success: boolean; data: FoodType[] }>(`/business/${businessId}/food-types`);
    return response.data.data;
  },

  create: async (businessId: string, name: string, icon: string) => {
    const response = await api.post<{ success: boolean; data: FoodType }>(`/business/${businessId}/food-types`, { name, icon });
    return response.data.data;
  },

  delete: async (businessId: string, id: string) => {
    await api.delete(`/business/${businessId}/food-types/${id}`);
  },

  setItemTags: async (itemId: string, foodTypeIds: string[]) => {
      // Backend should implement this endpoint. Using items/:id/food-types or similar.
      // Current backend `FoodTypeRepository` has method but no controller/route yet? 
      // Actually `FoodTypeService` has `setItemTags`. We need a route for it. 
      // Let's assume PUT /items/:itemId/food-types
      await api.put<{ success: boolean }>(`/items/${itemId}/food-types`, { foodTypeIds });
  },

  getItemTags: async (itemId: string) => {
      const response = await api.get<{ success: boolean; data: string[] }>(`/items/${itemId}/food-types`);
      return response.data.data;
  }
};
