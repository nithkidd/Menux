
import api from '../../../shared/utils/api';

export interface Item {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  sort_order: number;
}

export interface Category {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  items: Item[];
}

export const menuService = {
  getCategories: async (businessId: string) => {
    const response = await api.get<{ success: boolean; data: Category[] }>(`/business/${businessId}/categories`);
    return response.data.data;
  },

  createCategory: async (businessId: string, name: string) => {
    const response = await api.post<{ success: boolean; data: Category }>(`/business/${businessId}/categories`, { name });
    return response.data.data;
  },

  updateCategory: async (id: string, name: string) => {
    const response = await api.put<{ success: boolean; data: Category }>(`/categories/${id}`, { name });
    return response.data.data;
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },

  createItem: async (categoryId: string, data: Partial<Item>) => {
    const response = await api.post<{ success: boolean; data: Item }>(`/categories/${categoryId}/items`, data);
    return response.data.data;
  },

  updateItem: async (itemId: string, data: Partial<Item>) => {
    const response = await api.put<{ success: boolean; data: Item }>(`/items/${itemId}`, data);
    return response.data.data;
  },
  
  deleteItem: async (id: string) => {
    await api.delete(`/items/${id}`);
  },

  reorderCategories: async (items: { id: string; sort_order: number }[]) => {
    await api.put('/categories/reorder', { items });
  },

  reorderItems: async (_categoryId: string, items: { id: string; sort_order: number }[]) => {
    // categoryId arg kept for compatibility if needed, but not used in URL
    await api.put(`/items/reorder`, { items });
  }
};
