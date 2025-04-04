
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyTemplate } from '@/types/invoice';
import { toast } from 'sonner';
import { STORAGE_KEYS } from './types';

interface TemplatesContextType {
  templates: CompanyTemplate[];
  addTemplate: (template: CompanyTemplate) => void;
  updateTemplate: (template: CompanyTemplate) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => CompanyTemplate | undefined;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

// Sample template data
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
  const [initialized, setInitialized] = useState(false);

  // Load saved templates from localStorage on initial render
  useEffect(() => {
    try {
      console.log('Loading templates from localStorage');
      const savedTemplates = localStorage.getItem(STORAGE_KEYS.TEMPLATES_STORAGE_KEY);
      
      console.log('Saved templates:', savedTemplates);
      
      if (savedTemplates) {
        try {
          const parsed = JSON.parse(savedTemplates);
          console.log('Parsed templates:', parsed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTemplates(parsed);
            setInitialized(true);
          } else {
            console.log('Saved templates is empty or invalid, using samples');
            setTemplates(sampleTemplates);
            setInitialized(true);
          }
        } catch (parseError) {
          console.error('Error parsing templates:', parseError);
          setTemplates(sampleTemplates);
          setInitialized(true);
        }
      } else {
        console.log('No saved templates found, using samples');
        setTemplates(sampleTemplates);
        setInitialized(true);
      }
    } catch (error) {
      console.error('Error loading saved templates:', error);
      toast.error('Failed to load saved templates');
      
      // Fallback to sample data if there's an error
      setTemplates(sampleTemplates);
      setInitialized(true);
    }
  }, []);

  // Save to localStorage whenever templates change, but only after initial load
  useEffect(() => {
    if (!initialized) return;
    
    try {
      console.log('Saving templates to localStorage:', templates);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving templates:', error);
      toast.error('Failed to save templates');
    }
  }, [templates, initialized]);

  const addTemplate = (template: CompanyTemplate) => {
    console.log('Adding template:', template);
    setTemplates((prev) => [...prev, template]);
    toast.success('Template created successfully');
  };

  const updateTemplate = (template: CompanyTemplate) => {
    console.log('Updating template:', template);
    setTemplates((prev) => prev.map((temp) => (temp.id === template.id ? template : temp)));
    toast.success('Template updated successfully');
  };

  const deleteTemplate = (id: string) => {
    console.log('Deleting template:', id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
    toast.success('Template deleted successfully');
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
