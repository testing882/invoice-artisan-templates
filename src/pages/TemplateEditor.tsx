
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoice } from '@/context/InvoiceContext';
import TemplateForm from '@/components/templates/TemplateForm';
import { CompanyTemplate } from '@/types/invoice';
import { toast } from 'sonner';

const TemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, addTemplate, updateTemplate, getTemplateById } = useInvoice();
  
  const isNewTemplate = id === 'new';
  const template = !isNewTemplate ? getTemplateById(id!) : undefined;
  
  const handleSubmit = (data: CompanyTemplate) => {
    if (isNewTemplate) {
      addTemplate(data);
    } else {
      updateTemplate(data);
    }
    
    navigate('/templates');
  };
  
  if (!isNewTemplate && !template) {
    toast.error('Template not found');
    navigate('/templates');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-invoice-darkGray">
        {isNewTemplate ? 'Create New Template' : 'Edit Template'}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{isNewTemplate ? 'Company Information' : `Editing ${template?.name}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm 
            initialData={template} 
            onSubmit={handleSubmit} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateEditor;
