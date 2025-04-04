
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyTemplate } from '@/types/invoice';
import { toast } from 'sonner';
import { STORAGE_KEYS } from './types';
import { supabase, mapTemplateFromSupabase, mapTemplateToSupabase, getCurrentUserId } from '@/lib/supabase';

interface TemplatesContextType {
  templates: CompanyTemplate[];
  addTemplate: (template: CompanyTemplate) => Promise<void>;
  updateTemplate: (template: CompanyTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getTemplateById: (id: string) => CompanyTemplate | undefined;
  loading: boolean;
  error: string | null;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

// Sample template data (fallback if database is empty)
const sampleTemplates: CompanyTemplate[] = [
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

export const TemplatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load templates from Supabase on initial render
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        console.log('Fetching templates from Supabase');
        
        // Get current user ID
        const userId = await getCurrentUserId();
        
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
          const mappedTemplates = data.map(mapTemplateFromSupabase);
          setTemplates(mappedTemplates);
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
          }
          
          setTemplates(sampleTemplates);
        }
      } catch (err) {
        console.error('Error loading templates:', err);
        setError('Failed to load templates');
        toast.error('Failed to load templates');
        
        // Fallback to sample data if there's an error
        setTemplates(sampleTemplates);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const addTemplate = async (template: CompanyTemplate) => {
    try {
      console.log('Adding template:', template);
      setLoading(true);
      
      // Get current user ID
      const userId = await getCurrentUserId();
      
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
      
      // Update local state
      setTemplates((prev) => [...prev, template]);
      toast.success('Template created successfully');
    } catch (err) {
      console.error('Error adding template:', err);
      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (template: CompanyTemplate) => {
    try {
      console.log('Updating template:', template);
      setLoading(true);
      
      // Map template to Supabase format
      const supabaseTemplate = mapTemplateToSupabase(template);
      
      // Update template in Supabase
      const { error } = await supabase
        .from('templates')
        .update(supabaseTemplate)
        .eq('id', template.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTemplates((prev) => prev.map((temp) => (temp.id === template.id ? template : temp)));
      toast.success('Template updated successfully');
    } catch (err) {
      console.error('Error updating template:', err);
      toast.error('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      console.log('Deleting template:', id);
      setLoading(true);
      
      // Delete template from Supabase
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setTemplates((prev) => prev.filter((template) => template.id !== id));
      toast.success('Template deleted successfully');
    } catch (err) {
      console.error('Error deleting template:', err);
      toast.error('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = (id: string) => {
    return templates.find((template) => template.id === id);
  };

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplateById,
        loading,
        error,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplatesProvider');
  }
  return context;
};
