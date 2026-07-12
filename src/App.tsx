import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import EmergencyContacts from "./pages/EmergencyContacts.tsx";
import SafetyTips from "./pages/SafetyTips.tsx";
import NotFound from "./pages/NotFound.tsx";
import NearbyHelp from "./pages/NearbyHelp.tsx";
import AnimatedSplash from "./components/AnimatedSplash.tsx";
import { AICompanion } from "./components/AICompanion.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedSplash>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/nearby-help" element={<NearbyHelp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AICompanion />
        </AnimatedSplash>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
