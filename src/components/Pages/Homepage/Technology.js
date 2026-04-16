"use client";

import { motion } from "framer-motion";
const technologies = [
  {
    title: "Smart Charging System",
    description: "Automated battery charging with intelligent power management for rapid turnaround.",
    image: "\charging-tray.gif",
  },
  {
    title: "Hydrogen Refueling",
    description: "Quick hydrogen fuel cell replenishment enabling extended range operations.",
    image: "\hydrogen-filling.gif",
  },
  {
    title: "Automated Hangar",
    description: "Precision-engineered gates for seamless aircraft storage and deployment.",
    image: "\gate-open.gif",
  },
  {
    title: "Vertical Takeoff",
    description: "eVTOL capability for flexible urban operations without runway requirements.",
    image: "\gate-open.gif",
  },
  {
    title: "Autonomous Flight",
    description: "AI-powered navigation with real-time obstacle detection and route optimization.",
    image: "\drone-flight.gif",
  },
  {
    title: "Fleet Management",
    description: "Real-time monitoring and maintenance scheduling for optimal fleet performance.",
    image: "\aircraft-inspection.png",
  },
];

const Technology = () => {
  return (
    <section id="technology" className="py-24 bg-background-darker relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#07C5EB]/5 rounded-full blur-[150px] -translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#07C5EB] text-sm font-semibold tracking-wider uppercase">
            Innovation in Motion
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Advanced <span className="text-gradient">Technology</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Experience the future of urban air mobility through our cutting-edge systems and infrastructure
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden border border-border/30 bg-card/30 backdrop-blur-sm hover:border-[#07C5EB]/50 transition-all duration-500 ${index === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={tech.image}
                  alt={tech.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {tech.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tech.description}
                </p>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-[#07C5EB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technology;
