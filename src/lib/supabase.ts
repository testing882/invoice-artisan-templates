
import { CompanyTemplate } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';

// Export supabase client
export { supabase };

// Database types - use a type that matches the actual database schema
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
  notes: string | null;
  is_eu: boolean;
  vat_number: string | null;
  created_at: string;
  user_id: string;
  currency: string | null; // Add currency field to match the database
};

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
  notes: template.notes || '',
  isEU: template.is_eu || false,
  vatNumber: template.vat_number || '',
  currency: template.currency || 'USD', // Map currency from DB, default to USD if not present
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
  notes: template.notes || null,
  vat_number: template.vatNumber || null,
  currency: template.currency || 'USD', // Ensure the currency is mapped to the database
});

// Get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};
