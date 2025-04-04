
import { CompanyInfo } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserId } from './supabase';

// Define a type for company settings from Supabase
export type SupabaseCompanySettings = {
  id: string;
  user_id: string;
  name: string | null;
  street: string | null;
  city: string | null;
  zip_code: string | null;
  country: string | null;
  email: string | null;
  created_at: string;
};

// Convert snake_case from DB to camelCase for frontend
export const mapCompanyFromSupabase = (company: SupabaseCompanySettings): CompanyInfo => ({
  name: company.name || '',
  street: company.street || '',
  city: company.city || '',
  zipCode: company.zip_code || '',
  country: company.country || '',
  email: company.email || '',
});

// Convert camelCase from frontend to snake_case for DB
export const mapCompanyToSupabase = (company: CompanyInfo): Omit<SupabaseCompanySettings, 'id' | 'created_at' | 'user_id'> => ({
  name: company.name,
  street: company.street,
  city: company.city,
  zip_code: company.zipCode,
  country: company.country,
  email: company.email,
});
