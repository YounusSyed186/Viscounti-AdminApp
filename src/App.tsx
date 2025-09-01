import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import { DayPickerProvider } from "react-day-picker";
import MenuListingPage from "./components/MoreMenu";
import FullMenuPage from "./components/MoreMenu";
import MenuImageUpload from "./pages/admin/UploadMenu";
import OfferBadgesManager from "./pages/admin/offerBage";

const queryClient = new QueryClient();

const App = () => {
  // Define initialProps to configure the DayPickerProvider
  const initialProps = {
    selected: new Date(), // Initial selected date (can be customized)
    // You can add other properties here as required for your DayPicker configuration
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DayPickerProvider initialProps={initialProps}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/full/:category" element={<FullMenuPage />} />
              <Route path="/menu/full/:category" element={<FullMenuPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="menu-img" element={<MenuImageUpload />} />
                <Route path="offer" element={<OfferBadgesManager/>} />
                <Route path="settings" element={<div className="p-6 text-center text-muted-foreground">Settings page coming soon...</div>} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DayPickerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
