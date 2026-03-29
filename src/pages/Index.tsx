import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import PostsSection from "@/components/PostsSection";
import Footer from "@/components/Footer";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <ProjectsSection />
            <PostsSection />
            <Footer />
        </div>
    );
};

export default Index;
