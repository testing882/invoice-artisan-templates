
import { createClient } from '@supabase/supabase-js';
import { CompanyTemplate } from '@/types/invoice';

// Database types
export type SupabaseTemplate = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string | null;
  email: string | null;
  tax_id: string | null;
  description: string | null;
  logo: string | null;
  is_eu: boolean;
  user_id: string | null;
  created_at: string;
};

// Use the client that's already properly set up in the integrations directory
import { supabase } from '@/integrations/supabase/client';

// Export supabase client from the integrations directory
export { supabase };

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
  isEU: template.is_eu,
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
