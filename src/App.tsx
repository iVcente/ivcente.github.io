import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import ArticlePage from "./pages/ArticlePage";
import NotFound from "./pages/NotFound";

const App = () => (
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<ArticlePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </TooltipProvider>
);

export default App;
