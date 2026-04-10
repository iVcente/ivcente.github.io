import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"

import Loading from "./pages/Loading";

const Index = lazy(() => import("./pages/Index"))
const Posts = lazy(() => import("./pages/Posts"))
const Post = lazy(() => import("./pages/Post"))
const Projects = lazy(() => import("./pages/Projects"))
const Project = lazy(() => import("./pages/Project"))
const NotFound = lazy(() => import("./pages/NotFound"))

const App = () => (
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/:slug" element={<Post />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<Project />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </TooltipProvider>
);

export default App;
