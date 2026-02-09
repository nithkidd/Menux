import { supabaseAdmin } from '../../config/supabase.js';

export interface FoodType {
  id: string;
  business_id: string;
  name: string;
  icon: string;
  created_at: string;
}

export class FoodTypeRepository {
  private table = 'food_types';
  private junctionTable = 'item_food_types';

  async create(data: { business_id: string; name: string; icon: string }): Promise<FoodType> {
    const { data: foodType, error } = await supabaseAdmin
      .from(this.table)
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return foodType;
  }

  async findByBusinessId(businessId: string): Promise<FoodType[]> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('business_id', businessId)
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  // Manage Item Tags
  async addItemTags(itemId: string, foodTypeIds: string[]): Promise<void> {
    if (foodTypeIds.length === 0) return;

    const inserts = foodTypeIds.map(typeId => ({
      item_id: itemId,
      food_type_id: typeId
    }));

    const { error } = await supabaseAdmin
      .from(this.junctionTable)
      .insert(inserts);
    
    if (error) throw new Error(error.message);
  }

  async removeItemTags(itemId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.junctionTable)
      .delete()
      .eq('item_id', itemId);

    if (error) throw new Error(error.message);
  }

  async getItemTags(itemId: string): Promise<string[]> {
    const { data, error } = await supabaseAdmin
      .from(this.junctionTable)
      .select('food_type_id')
      .eq('item_id', itemId);

    if (error) return [];
    return data.map((d: any) => d.food_type_id);
  }
}

export const foodTypeRepository = new FoodTypeRepository();
