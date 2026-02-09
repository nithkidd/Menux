import { menuRepository } from './menu.repository.js';
import { BusinessType } from '../../shared/types/index.js';

interface MenuResponse {
  business: {
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    business_type: BusinessType;
    contact_email: string | null;
    contact_phone: string | null;
    address: string | null;
    website_url: string | null;
    social_links: any;
    opening_hours: any;
    primary_color: string | null;
    cover_image_url: string | null;
    currency: string;
  };
  categories: Array<{
    id: string;
    business_id: string;
    name: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
    items: Array<{
      id: string;
      category_id: string;
      name: string;
      description: string | null;
      price: number;
      image_url: string | null;
      is_available: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }>;
  }>;
}

export class MenuService {
  /**
   * Get the full public menu by business slug
   */
  async getBySlug(slug: string): Promise<MenuResponse | null> {
    const business = await menuRepository.getBusinessBySlug(slug);
    if (!business) return null;

    const categories = await menuRepository.getCategoriesWithItems(business.id);

    return {
      business: {
        name: business.name,
        slug: business.slug,
        logo_url: business.logo_url,
        description: business.description,
        business_type: business.business_type as BusinessType,
        contact_email: business.contact_email,
        contact_phone: business.contact_phone,
        address: business.address,
        website_url: business.website_url,
        social_links: business.social_links,
        opening_hours: business.opening_hours,
        primary_color: business.primary_color,
        cover_image_url: business.cover_image_url,
        currency: business.currency,
      },
      categories,
    };
  }
}

export const menuService = new MenuService();
