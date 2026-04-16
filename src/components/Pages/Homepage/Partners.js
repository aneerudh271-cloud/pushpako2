"use client";

import { motion } from "framer-motion";
import { Battery, Brain, Plane, Cpu, Boxes, Zap } from "lucide-react";

const partners = [
  { name: "Hydrogen Systems", icon: Battery, category: "Energy" },
  { name: "AI Platform", icon: Brain, category: "Technology" },
  { name: "Aerospace Engineering", icon: Plane, category: "Manufacturing" },
  { name: "Avionics", icon: Cpu, category: "Systems" },
  { name: "Composites", icon: Boxes, category: "Materials" },
  { name: "Energy Solutions", icon: Zap, category: "Energy" },
];

// Duplicate for seamless loop
const allPartners = [...partners, ...partners];

const Partners = () => {
  return (
    <section className="my-16 py-12  border-y border-border">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-sm  font-semibold md:text-3xl tracking-wider uppercase mb-2">
            Technology Partners
          </h3>
          <p className="text-muted-foreground">
            Collaborating with industry leaders in hydrogen, AI, and aerospace
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:bg-gradient-to-r from-[#07c5eb75] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:bg-gradient-to-l from-[#07c5eb75] to-transparent z-10" />

          {/* Scrolling Partners */}
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-16"
          >
            {allPartners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 min-w-fit group "
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-[#07C5EB]/50 group-hover:bg-[#07C5EB]/5 transition-all duration-300">
                    <Icon className="w-12 h-12 md:w-24 md:h-24 text-muted-foreground  transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-medium  transition-colors whitespace-nowrap">
                      {partner.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{partner.category}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
