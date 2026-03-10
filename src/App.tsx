import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"

import Loading from "./pages/Loading";

const Index = lazy(() => import("./pages/Index"))
const Blog = lazy(() => import("./pages/Blog"))
const ArticlePage = lazy(() => import("./pages/ArticlePage"))
const NotFound = lazy(() => import("./pages/NotFound"))

const App = () => (
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<ArticlePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </HashRouter>
    </TooltipProvider>
);

export default App;
