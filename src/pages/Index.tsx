import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <BlogPreviewSection />
      <Footer />
    </div>
  );
};

export default Index;
