import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/index.tsx";
import NotFound from "./pages/not-found.tsx";
import UserProfile from "./pages/user-profile.tsx";
import ProjectViewer from "./pages/project-viewer.tsx";
import Community from "./pages/community.tsx";
import CommunityProfile from "./pages/CommunityProfile.tsx";
import NotificationsPage from "./pages/NotificationsPage.tsx";
import GraphifyPage from "./pages/Graphify.tsx";
import ProtoAI from "@/features/ai/components/proto-ai";
import { CollaborationHub } from "@/features/collaboration/components/CollaborationHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile/:username" element={<CommunityProfile />} />
            <Route path="/user/:username" element={<CommunityProfile />} />
            <Route path="/project/:id" element={<ProjectViewer />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/graphify" element={<GraphifyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Global Collaboration & AI Access */}
          <CollaborationHub />
          <ProtoAI />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
