
import React, { createContext, useContext } from 'react';
import { CompanyTemplate } from '@/types/invoice';
import { useTemplatesData } from '@/hooks/useTemplatesData';

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

export const TemplatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const templatesData = useTemplatesData();

  return (
    <TemplatesContext.Provider value={templatesData}>
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
