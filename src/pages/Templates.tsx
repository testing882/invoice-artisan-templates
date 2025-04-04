
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash, AlertCircle, LoaderCircle } from 'lucide-react';
import { useTemplates } from '@/context/TemplatesContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Templates: React.FC = () => {
  const { templates, deleteTemplate, loading, error } = useTemplates();
  const navigate = useNavigate();
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };
  
  // Log the templates to help with debugging
  console.log('Current templates:', templates);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoaderCircle className="w-10 h-10 text-invoice-blue animate-spin" />
        <p className="text-invoice-gray">Loading templates...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Company Templates</h1>
        <Button 
          onClick={() => navigate('/templates/new')}
          className="bg-invoice-blue hover:bg-invoice-darkBlue"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
      
      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description || 'No description'}</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-invoice-blue flex items-center justify-center text-white font-medium">
                    {template.name.charAt(0)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>{template.address}</p>
                  <p>{template.city}, {template.postalCode}</p>
                  <p>{template.country}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/templates/${template.id}`)}
                >
                  Edit
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => navigate(`/create-invoice?template=${template.id}`)}
                    className="bg-invoice-blue hover:bg-invoice-darkBlue"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Use
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => setTemplateToDelete(template.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="text-invoice-gray mb-4 text-center">No templates found. Create your first template to get started.</p>
            <Button 
              onClick={() => navigate('/templates/new')}
              className="bg-invoice-blue hover:bg-invoice-darkBlue"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}
      
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this company template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Templates;
