import { Card } from "@repo/ui";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Design Lead at Stripe",
      content:
        "Finally, a drawing tool that doesn't overwhelm. The minimalist approach lets our team focus purely on ideas and collaboration.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager at Notion",
      content:
        "The simplicity is profound. We can express complex concepts with just circles and rectangles, and it works beautifully.",
    },
    {
      name: "Emily Watson",
      role: "Creative Director at Figma",
      content:
        "Real-time collaboration that actually feels magical. No lag, no confusion, just pure creative flow with your team.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-900 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light mb-8 text-white tracking-tight">
            Trusted by Creative Teams
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
            What industry leaders say about our minimalist philosophy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-10 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-500 group"
            >
              <div className="mb-8">
                <h4 className="font-medium text-white text-lg group-hover:text-gray-100 transition-colors duration-300">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500 font-light mt-1">
                  {testimonial.role}
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed font-light text-lg group-hover:text-gray-200 transition-colors duration-300">
                "{testimonial.content}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
