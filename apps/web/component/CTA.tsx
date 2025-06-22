import { Button } from "@repo/ui";

export const CTA = () => {
  return (
    <section className="py-24 px-4 bg-gray-800 relative overflow-hidden">
      {/* Elegant background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 right-16 w-40 h-40 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-32 h-24 border border-white"></div>
      </div>
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-light mb-8 text-white tracking-tight leading-tight">
          Ready to Create
          <br />
          <span className="italic font-extralight text-gray-300">Something Beautiful?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          Join creative teams who choose elegance over complexity. 
          Start drawing in seconds, collaborate in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-lg font-medium rounded-full shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all duration-300">
            Start Creating
          </Button>
          <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 px-12 py-4 text-lg rounded-full backdrop-blur-sm font-medium transition-all duration-300">
            Watch Demo
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 font-light">
          Free to use. No signup required to experience the magic.
        </p>
      </div>
    </section>
  );
};
