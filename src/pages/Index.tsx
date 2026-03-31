import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import ProjectsPreviewSection from "@/components/ProjectsPreviewSection";
import PostsPreviewSection from "@/components/PostsPreviewSection";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <IntroSection />
            <ProjectsPreviewSection />
            <PostsPreviewSection />
            <Footer />
        </div>
    );
};

export default Index;
