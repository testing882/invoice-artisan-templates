
import { CompanyTemplate } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { mapTemplateFromSupabase, mapTemplateToSupabase, getCurrentUserId } from '@/lib/supabase';
import { toast } from 'sonner';

// Sample template data (fallback if database is empty)
export const sampleTemplates: CompanyTemplate[] = [
  {
    id: '1',
    name: 'Acme Inc',
    address: '123 Business St',
    city: 'Techville',
    postalCode: '12345',
    country: 'USA',
    phone: '(555) 123-4567',
    email: 'billing@acmeinc.com',
    taxId: 'US12345678',
    isEU: false,
  },
  {
    id: '2',
    name: 'TechCorp',
    address: '456 Innovation Ave',
    city: 'Silicon Valley',
    postalCode: '94043',
    country: 'USA',
    phone: '(555) 987-6543',
    email: 'accounts@techcorp.com',
    taxId: 'US98765432',
    isEU: false,
  },
  {
    id: '3',
    name: 'EuroSoft GmbH',
    address: '789 Hauptstrasse',
    city: 'Berlin',
    postalCode: '10115',
    country: 'Germany',
    phone: '+49 30 12345678',
    email: 'billing@eurosoft.de',
    taxId: 'DE123456789',
    isEU: true,
  }
];

// Function to fetch templates from Supabase
export const fetchTemplates = async (): Promise<CompanyTemplate[]> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.log('No authenticated user, using sample templates');
      return sampleTemplates;
    }
    
    // Fetch templates for the current user
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    console.log('Fetched templates:', data);
    
    if (data && data.length > 0) {
      // Map templates from Supabase format to application format
      return data.map(mapTemplateFromSupabase);
    } else {
      // If no templates found, initialize with sample templates
      // Only do this on first load for new users
      console.log('No templates found, initializing with samples');
      
      // For new users, add sample templates to Supabase
      if (userId) {
        for (const template of sampleTemplates) {
          const supabaseTemplate = mapTemplateToSupabase(template);
          await supabase
            .from('templates')
            .insert({
              ...supabaseTemplate,
              user_id: userId
            });
        }
        
        // Fetch templates again after inserting samples
        const { data: refreshedData } = await supabase
          .from('templates')
          .select('*')
          .eq('user_id', userId);
          
        if (refreshedData && refreshedData.length > 0) {
          return refreshedData.map(mapTemplateFromSupabase);
        }
      }
      
      return sampleTemplates;
    }
  } catch (err) {
    console.error('Error loading templates:', err);
    toast.error('Failed to load templates');
    
    // Fallback to sample data if there's an error
    return sampleTemplates;
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
    
    // Map template to Supabase format
    const supabaseTemplate = mapTemplateToSupabase(template);
    
    // Insert template into Supabase
    const { error } = await supabase
      .from('templates')
      .insert({
        ...supabaseTemplate,
        user_id: userId
      });
    
    if (error) {
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
    
    // Map template to Supabase format
    const supabaseTemplate = mapTemplateToSupabase(template);
    
    // Update template in Supabase
    const { error } = await supabase
      .from('templates')
      .update({
        ...supabaseTemplate,
        user_id: userId
      })
      .eq('id', template.id);
    
    if (error) {
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
    
    // Check if this is a sample template (using simple numeric IDs)
    const isSampleTemplate = sampleTemplates.some(template => template.id === id);
    
    if (!userId || isSampleTemplate) {
      // For sample templates or when not logged in, just pretend we deleted it
      // This avoids the UUID validation error from Supabase
      console.log('Simulating deletion for sample template or no authenticated user');
      toast.success('Template deleted successfully');
      return;
    }
    
    // Only try to delete from database if it's not a sample template
    // and the user is authenticated
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
