
import { CompanyInfo } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { mapCompanyFromSupabase, mapCompanyToSupabase, SupabaseCompanySettings } from '@/lib/companySupabase';
import { getCurrentUserId } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to fetch company details from Supabase
export const fetchCompanyDetails = async (): Promise<CompanyInfo | null> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.log('No authenticated user, returning empty company details');
      return null;
    }
    
    // Fetch company details for the current user
    // Using 'from' with a cast to any to bypass type checking for the table name
    const { data, error } = await supabase
      .from('company_settings' as any)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    console.log('Fetched company details:', data);
    
    if (data) {
      // Map company from Supabase format to application format
      // Use type assertion to tell TypeScript about the expected shape
      return mapCompanyFromSupabase(data as unknown as SupabaseCompanySettings);
    } else {
      // Return null if no company found
      console.log('No company details found, returning null');
      return null;
    }
  } catch (err) {
    console.error('Error loading company details:', err);
    toast.error('Failed to load company details');
    
    // Return null in case of error
    return null;
  }
};

// Function to save company details to Supabase
export const saveCompanyToDatabase = async (company: CompanyInfo): Promise<void> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to save company details');
      return;
    }
    
    // Map company to Supabase format
    const supabaseCompany = mapCompanyToSupabase(company);
    
    // First check if company details exist for this user
    const { data, error: fetchError } = await supabase
      .from('company_settings' as any)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (data) {
      // Update existing company details
      const { error } = await supabase
        .from('company_settings' as any)
        .update({
          ...supabaseCompany,
          user_id: userId
        })
        .eq('id', (data as any).id);
      
      if (error) {
        throw error;
      }
    } else {
      // Insert new company details
      const { error } = await supabase
        .from('company_settings' as any)
        .insert({
          ...supabaseCompany,
          user_id: userId
        } as any);
      
      if (error) {
        throw error;
      }
    }
    
    toast.success('Company details saved successfully');
  } catch (err) {
    console.error('Error saving company details:', err);
    toast.error('Failed to save company details');
    throw err;
  }
};
