
import { CompanyTemplate } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { mapTemplateFromSupabase, mapTemplateToSupabase, getCurrentUserId } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to fetch templates from Supabase
export const fetchTemplates = async (): Promise<CompanyTemplate[]> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    console.log('Current user ID:', userId);
    
    if (!userId) {
      console.log('No authenticated user, returning empty templates array');
      return [];
    }
    
    // Fetch templates for the current user
    console.log('Fetching templates for user:', userId);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Supabase error when fetching templates:', error);
      throw error;
    }
    
    console.log('Fetched templates data:', data);
    
    if (data && data.length > 0) {
      // Map templates from Supabase format to application format
      const mappedTemplates = data.map(mapTemplateFromSupabase);
      console.log('Mapped templates:', mappedTemplates);
      return mappedTemplates;
    } else {
      // Return empty array if no templates found
      console.log('No templates found, returning empty array');
      return [];
    }
  } catch (err) {
    console.error('Error loading templates:', err);
    toast.error('Failed to load templates');
    
    // Return empty array in case of error
    return [];
  }
};

// Function to add a template to Supabase
export const addTemplateToDatabase = async (template: CompanyTemplate): Promise<void> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to create templates');
      return;
    }
    
    // Ensure currency is set
    if (!template.currency) {
      template.currency = 'USD';
    }
    
    // Map template to Supabase format
    const supabaseTemplate = mapTemplateToSupabase(template);
    
    console.log('Adding template to database with currency:', supabaseTemplate.currency);
    
    // Insert template into Supabase
    const { error } = await supabase
      .from('templates')
      .insert({
        ...supabaseTemplate,
        user_id: userId
      });
    
    if (error) {
      console.error('Error inserting template:', error);
      throw error;
    }
    
    toast.success('Template created successfully');
  } catch (err) {
    console.error('Error adding template:', err);
    toast.error('Failed to create template');
    throw err;
  }
};

// Function to update a template in Supabase
export const updateTemplateInDatabase = async (template: CompanyTemplate): Promise<void> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to update templates');
      return;
    }
    
    // Ensure currency is set
    if (!template.currency) {
      template.currency = 'USD';
    }
    
    // Map template to Supabase format
    const supabaseTemplate = mapTemplateToSupabase(template);
    
    console.log('Updating template in database with currency:', supabaseTemplate.currency);
    
    // Update template in Supabase
    const { error } = await supabase
      .from('templates')
      .update({
        ...supabaseTemplate,
        user_id: userId
      })
      .eq('id', template.id);
    
    if (error) {
      console.error('Error updating template:', error);
      throw error;
    }
    
    toast.success('Template updated successfully');
  } catch (err) {
    console.error('Error updating template:', err);
    toast.error('Failed to update template');
    throw err;
  }
};

// Function to delete a template from Supabase
export const deleteTemplateFromDatabase = async (id: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to delete templates');
      return;
    }
    
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Template deleted successfully');
  } catch (err) {
    console.error('Error deleting template:', err);
    toast.error('Failed to delete template');
    throw err;
  }
};
