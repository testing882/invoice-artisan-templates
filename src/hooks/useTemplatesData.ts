
import { useState, useEffect } from 'react';
import { CompanyTemplate } from '@/types/invoice';
import { 
  fetchTemplates, 
  addTemplateToDatabase, 
  updateTemplateInDatabase, 
  deleteTemplateFromDatabase 
} from '@/api/templateApi';

export const useTemplatesData = () => {
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load templates on initial render
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        console.log('Loading templates in useTemplatesData...');
        setLoading(true);
        const data = await fetchTemplates();
        console.log('Templates loaded in useTemplatesData:', data);
        setTemplates(data);
        setError(null);
      } catch (err) {
        console.error('Error in useTemplatesData:', err);
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const addTemplate = async (template: CompanyTemplate) => {
    try {
      setLoading(true);
      await addTemplateToDatabase(template);
      // Update local state
      setTemplates((prev) => [...prev, template]);
    } catch (err) {
      console.error('Error adding template in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (template: CompanyTemplate) => {
    try {
      setLoading(true);
      await updateTemplateInDatabase(template);
      // Update local state
      setTemplates((prev) => prev.map((temp) => (temp.id === template.id ? template : temp)));
    } catch (err) {
      console.error('Error updating template in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      await deleteTemplateFromDatabase(id);
      // Update local state
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (err) {
      console.error('Error deleting template in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = (id: string) => {
    return templates.find((template) => template.id === id);
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    loading,
    error,
  };
};
