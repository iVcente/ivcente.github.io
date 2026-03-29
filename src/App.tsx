import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"

import Loading from "./pages/Loading";

const Index = lazy(() => import("./pages/Index"))
const Posts = lazy(() => import("./pages/Posts"))
const PostPage = lazy(() => import("./pages/PostPage"))
const Projects = lazy(() => import("./pages/Projects"))
const ProjectPage = lazy(() => import("./pages/ProjectPage"))
const NotFound = lazy(() => import("./pages/NotFound"))

const App = () => (
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/:slug" element={<PostPage />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </HashRouter>
    </TooltipProvider>
);

export default App;
