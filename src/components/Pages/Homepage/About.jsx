"use client";

import { motion } from "framer-motion";
import { Flag, Plane, Shield, Leaf, ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { companyProfile, homepageData } from "@/lib/data/companyData";

const iconMap = {
  "Flag": Flag,
  "Plane": Plane,
  "Drone": Plane,
  "Shield": Shield,
  "Leaf": Leaf,
  "Target": Target,
};

const highlights = [
  {
    icon: Flag,
    label: "100% Indigenous",
    description: "Complete in-house development from scratch",
  },
  {
    icon: Plane,
    label: "Aviation Platforms",
    description: "Fixed-wing and hybrid aircraft designs",
  },
  {
    icon: Target,
    label: "UAS Systems",
    description: "Surveillance & monitoring drones",
  },
  {
    icon: Shield,
    label: "Compliance Ready",
    description: "DGCA & safety standards aligned",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 overflow-x-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/hero-aircraft.png"
                alt="PushpakO2 Aircraft"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-8 right-4 lg:-right-8 bg-card border border-border rounded-xl p-5 shadow-xl w-64 max-w-[calc(100vw-2rem)] lg:max-w-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#07C5EB]/20 flex items-center justify-center">
                  <Flag className="w-7 h-7 text-[#07C5EB]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Made in India</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#07C5EB]/10 text-[#07C5EB] rounded-full mb-4">
              About {companyProfile.brandName}
            </span>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {companyProfile.tagline.split(' ').slice(0, 3).join(' ')} <span className="text-gradient">{companyProfile.tagline.split(' ').slice(3).join(' ')}</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Indian Aerospace & Advanced Engineering Company
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {companyProfile.about.split('.').slice(0, 2).join('.')}. Our core philosophy emphasizes complete in-house development, ensuring full control over design, IP, and manufacturing.
            </p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border hover:border-[#07C5EB]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#07C5EB]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#07C5EB]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group text-black cursor-pointer"
            >
              <Link href="/about-us" className="flex items-center">
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
