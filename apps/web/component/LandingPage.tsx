import { Hero } from "./Hero";
import { Features } from "./Features";
import { CanvasPreview } from "./CanvasPreview";
import { Testimonials } from "./Testimonials";
import { Header } from "./Header";
import { Footer } from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <CanvasPreview />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
