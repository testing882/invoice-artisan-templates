
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from './context/InvoiceContext';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import TemplateEditor from "./pages/TemplateEditor";
import InvoiceEditor from "./pages/InvoiceEditor";
import InvoiceView from "./pages/InvoiceView";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";
import CompanyPage from "./pages/CompanyPage";

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InvoiceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/:id" element={<TemplateEditor />} />
              <Route path="/create-invoice" element={<InvoiceEditor />} />
              <Route path="/create-invoice/:id" element={<InvoiceEditor />} />
              <Route path="/invoice/:id" element={<InvoiceView />} />
              <Route path="/export" element={<Export />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </InvoiceProvider>
  </QueryClientProvider>
);

export default App;
