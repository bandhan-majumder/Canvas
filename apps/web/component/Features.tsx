import { Card } from "@repo/ui";

export const Features = () => {
  const features = [
    {
      icon: "⚡",
      title: "Instant Synchronization",
      description: "Every stroke appears instantly. No lag, just pure real-time collaboration."
    },
    {
      icon: "⭕",
      title: "Perfect Geometry",
      description: "Flawless circles and precise rectangles. Clean shapes, infinite possibilities."
    },
    {
      icon: "☁️",
      title: "Effortless Persistence",
      description: "Your creations save automatically. Access your work from anywhere, anytime."
    },
    {
      icon: "👥",
      title: "Seamless Teamwork",
      description: "Multiple creators, one unified canvas. True collaborative artistry."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-gray-800 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light mb-8 text-white tracking-tight">
            Elegance in Every Detail
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed">
            Thoughtfully crafted features that enhance creativity without complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 group">
              <div className="text-5xl mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-4 text-white group-hover:text-gray-100 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
