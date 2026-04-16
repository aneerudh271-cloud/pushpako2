"use client";

import { motion } from "framer-motion";
import { Clock, Map, Package, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fleet = [
  {
    id: "standard",
    name: "Pushpak O2 Standard",
    type: "Premium Platform",
    image: "/fleet-standard.png",
    badge: null,
    description: "Optimized for urban air mobility with balanced performance and efficiency",
    specs: [
      { icon: Clock, label: "Flight Time", value: "5 hours" },
      { icon: Map, label: "Range", value: "300 km" },
      { icon: Package, label: "Payload", value: "400 kg" },
      { icon: Zap, label: "Speed", value: "200 km/h" },
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Pushpak O2 Premium",
    type: "Elite Configuration",
    image: "/fleet-premium.jpg",
    badge: "Most Popular",
    description: "Maximum performance configuration with enhanced range and payload capacity",
    specs: [
      { icon: Clock, label: "Flight Time", value: "6 hours" },
      { icon: Map, label: "Range", value: "350 km" },
      { icon: Package, label: "Payload", value: "450 kg" },
      { icon: Zap, label: "Speed", value: "220 km/h" },
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Pushpak O2 Enterprise",
    type: "Maximum Capacity",
    image: "/fleet-enterprise.jpg",
    badge: null,
    description: "Heavy-lift configuration for enterprise logistics and specialized operations",
    specs: [
      { icon: Clock, label: "Flight Time", value: "7 hours" },
      { icon: Map, label: "Range", value: "400 km" },
      { icon: Package, label: "Payload", value: "500 kg" },
      { icon: Zap, label: "Speed", value: "240 km/h" },
    ],
    featured: false,
  },
];

export const Fleet = () => {
  return (
    <section id="fleet" className="py-24 ">
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-primary/10 rounded-full mb-4">
            Our Fleet
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Explore Our <span className="text-[#07C5EB]">Luxury</span> Fleet
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium hydrogen-electric platforms engineered for modern mobility
          </p>
        </motion.div>

        {/* Fleet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((aircraft, index) => (
            <motion.div
              key={aircraft.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden bg-card border transition-all duration-500 ${
                aircraft.featured
                  ? "border-primary/50 shadow-glow lg:scale-105"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {/* Badge */}
              {aircraft.badge && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  {aircraft.badge}
                </div>
              )}

              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={aircraft.image}
                  alt={aircraft.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs font-semibold text-primary mb-1">{aircraft.type}</p>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {aircraft.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">{aircraft.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {aircraft.specs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.label}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50"
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">{spec.label}</p>
                          <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <Button
                  variant={aircraft.featured ? "default" : "default"}
                  className="w-full group/btn cursor-pointer"
                >
                  Explore Aircraft
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Glow Effect for Featured */}
              {aircraft.featured && (
                <div className="absolute inset-0 -z-10 bg-primary/10 blur-3xl" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
