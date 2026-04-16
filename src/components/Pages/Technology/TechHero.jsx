"use client";

import { Squares } from "@/components/ui/square";
import { motion } from "framer-motion";

export default function TechnologyPage({ technologies: technologiesData }) {
    return (
        <main className="max-w-screen overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="relative min-h-screen flex items-center justify-center bg-background-darker">
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background-darker to-background-darker" />
                <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute w-full h-full">
                    <Squares />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6"
                >
                    <span className="text-white text-sm font-semibold tracking-widest uppercase">
                        Our Technology
                    </span>
                    <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                        Engineering the <span className="text-gradient">Future of Flight</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-gray-300 text-lg">
                        From autonomous flight systems to intelligent ground infrastructure,
                        our technology stack is designed to redefine urban air mobility.
                    </p>
                </motion.div>
            </section>

            {/* ================= TECHNOLOGY GRID ================= */}
            <section className="relative py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-white text-sm font-semibold tracking-wider uppercase">
                            Innovation Stack
                        </span>
                        <h2 className="mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold">
                            Advanced <span className="text-gradient">Technologies</span>
                        </h2>
                        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
                            A tightly integrated ecosystem of hardware, software, and AI that
                            powers next-generation aerial operations.
                        </p>
                    </motion.div>

                    {technologiesData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {technologiesData.map((tech, index) => (
                                <motion.div
                                    key={tech._id || tech.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative rounded-2xl overflow-hidden border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={tech.featuredImage || "/placeholder-tech.jpg"}
                                            alt={tech.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-heading text-xl font-semibold mb-2">
                                            {tech.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {tech.description}
                                        </p>
                                    </div>

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-400 mb-4">No technologies found</h3>
                            <p className="text-gray-500">Technologies will be displayed here once added.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ================= WHY OUR TECH ================= */}
            <section className="relative py-24 ">
                <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />

                <div className="container mx-auto px-6 lg:px-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl font-bold">
                            Built for <span className="text-gradient">Scale, Safety & Speed</span>
                        </h2>
                        <p className="mt-6 text-gray-300 leading-relaxed">
                            Every technology we develop is focused on three principles:
                            operational safety, rapid scalability, and seamless user
                            experience. Our systems work together as a single intelligent
                            network — not isolated components.
                        </p>
                        <p className="mt-4 text-gray-300 leading-relaxed">
                            This integrated approach allows us to reduce turnaround time,
                            increase flight efficiency, and unlock sustainable urban air
                            mobility at scale.
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
