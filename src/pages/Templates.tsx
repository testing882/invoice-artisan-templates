
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash, AlertCircle, LoaderCircle, Search } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { CompanyTemplate } from '@/types/invoice';

const Templates: React.FC = () => {
  const { templates, deleteTemplate, loading, error } = useTemplates();
  const navigate = useNavigate();
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<CompanyTemplate[]>([]);
  
  useEffect(() => {
    if (templates) {
      setFilteredTemplates(
        templates.filter(template => 
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.country.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, templates]);
  
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
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {filteredTemplates && filteredTemplates.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-invoice-blue flex items-center justify-center text-white font-medium">
                          {template.name.charAt(0)}
                        </div>
                        <div>
                          <p>{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description || 'No description'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{template.email}</p>
                        <p className="text-muted-foreground">{template.phone || 'No phone'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{template.address}</p>
                        <p className="text-muted-foreground">{template.city}, {template.postalCode}</p>
                        <p className="text-muted-foreground">{template.country}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/templates/${template.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/create-invoice?template=${template.id}`);
                          }}
                          className="bg-invoice-blue hover:bg-invoice-darkBlue"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Use
                        </Button>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTemplateToDelete(template.id);
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="text-invoice-gray mb-4 text-center">
              {searchQuery ? 'No templates found matching your search.' : 'No templates found. Create your first template to get started.'}
            </p>
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
