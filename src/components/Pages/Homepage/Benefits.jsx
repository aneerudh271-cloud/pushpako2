"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Shield, Leaf } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Advanced Hydrogen Technology",
    description:
      "Next-generation fuel cell systems delivering unprecedented efficiency and intercity range capabilities",
  },
  {
    icon: Brain,
    title: "AI-Enabled Autonomy",
    description:
      "Autonomous flight control with advanced sensor fusion and real-time decision making for safe operations",
  },
  {
    icon: Shield,
    title: "Aerospace Grade Safety",
    description:
      "Rigorous safety standards and multiple failsafe systems ensuring reliable operations in all conditions",
  },
  {
    icon: Leaf,
    title: "Sustainable Future",
    description:
      "Zero emissions hydrogen technology aligned with global climate goals and green initiatives",
  },
];

export const Benefits = () => {
  return (
    <section id="benefits" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker" />

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-[#07C5EB] bg-[#07C5EB]/10 rounded-full mb-4">
            Why Choose Us
          </span>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-[#07C5EB]">Pushpak O2</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unmatched Performance, Innovation & Reliability
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            const isBlue = index % 2 !== 0;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border transition-all duration-300 hover:shadow-xl ${
                  isBlue
                    ? "hover:border-[#07C5EB]/60"
                    : "hover:border-foreground/30"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    isBlue
                      ? "bg-[#07C5EB]/10 text-[#07C5EB]"
                      : "bg-foreground/10 text-foreground"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3
                  className={`font-heading text-lg font-bold mb-3 ${
                    isBlue ? "text-[#07C5EB]" : "text-foreground"
                  }`}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
