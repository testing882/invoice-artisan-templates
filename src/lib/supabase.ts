
import { CompanyTemplate } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Export supabase client
export { supabase };

// Database types
export type SupabaseTemplate = Database['public']['Tables']['templates']['Row'];

// Convert snake_case from DB to camelCase for frontend
export const mapTemplateFromSupabase = (template: SupabaseTemplate): CompanyTemplate => ({
  id: template.id,
  name: template.name,
  address: template.address,
  city: template.city,
  postalCode: template.postal_code,
  country: template.country,
  phone: template.phone || '',
  email: template.email || '',
  taxId: template.tax_id || '',
  description: template.description || '',
  logo: template.logo || '',
  isEU: template.is_eu || false,
});

// Convert camelCase from frontend to snake_case for DB
export const mapTemplateToSupabase = (template: CompanyTemplate): Omit<SupabaseTemplate, 'created_at' | 'user_id'> => ({
  id: template.id,
  name: template.name,
  address: template.address,
  city: template.city,
  postal_code: template.postalCode,
  country: template.country,
  phone: template.phone || null,
  email: template.email || null,
  tax_id: template.taxId || null,
  description: template.description || null,
  logo: template.logo || null,
  is_eu: template.isEU,
});

// Get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};
