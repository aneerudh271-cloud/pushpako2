"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Clock, Plane, Award } from "lucide-react";
import { aboutUsPageData, companyProfile } from "@/lib/data/companyData";

const stats = [
  {
    icon: TrendingUp,
    value: 1000,
    prefix: "₹",
    suffix: " Cr",
    label: "Series A Valuation",
    color: "gold",
  },
  {
    icon: Clock,
    value: 1000,
    suffix: "+",
    label: "Flight Hours Tested",
    color: "primary",
  },
  {
    icon: Plane,
    value: 5000,
    suffix: "+",
    label: "Successful Test Flights",
    color: "cyan",
  },
  {
    icon: Award,
    value: 8,
    suffix: " yrs",
    label: "R&D Excellence",
    color: "green",
  },
];

const colorClasses = {
  gold: "text-yellow-400",
  primary: "text-[#07C5EB]",
  cyan: "text-[#07C5EB]",
  green: "text-green-500",
};

const CountUp = ({ end, prefix = "", suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start;
    let frame;

    const animate = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Stats = () => {
  // Use data from companyData
  const statsData = aboutUsPageData.stats.map(stat => ({
    ...stat,
    // Map generic icons if needed, or use defaults
    icon: stat.id === 'stat-1' ? Award :
      stat.id === 'stat-2' ? Plane :
        stat.id === 'stat-3' ? Clock : TrendingUp,
    color: stat.id === 'stat-1' ? 'cyan' :
      stat.id === 'stat-2' ? 'primary' :
        stat.id === 'stat-3' ? 'gold' : 'green'
  }));

  return (
    <section
      id="stats"
      className="py-24 bg-gradient-to-b from-background/40 to-background-darker"
    >
      <div className="container mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#07C5EB]/10 rounded-full mb-4">
            Our Milestones
          </span>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Numbers That Define <span className="text-[#07C5EB]">Excellence</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            {companyProfile.companyName} is committed to measurable impact and indigenous innovation
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = colorClasses[stat.color] || colorClasses.cyan;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-[#07C5EB]/30 transition-all duration-300 text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className={`w-8 h-8 ${colorClass}`} />
                </div>

                {/* Value */}
                <p className={`font-heading text-4xl font-bold ${colorClass} mb-2`}>
                  <CountUp
                    end={parseInt(stat.value)}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>

                {/* Label */}
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-[#07C5EB]/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
