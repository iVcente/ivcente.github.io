import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import ProjectsPreviewSection from "@/components/ProjectsPreviewSection";
import PostsPreviewSection from "@/components/PostsPreviewSection";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet><title>Danzmann.dev</title></Helmet>
            <Navbar />
            <IntroSection />
            <ProjectsPreviewSection />
            <PostsPreviewSection />
            <Footer />
        </div>
    );
};

export default Index;
