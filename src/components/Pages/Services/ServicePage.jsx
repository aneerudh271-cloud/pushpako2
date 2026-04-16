"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    Plane,
    Wrench,
    Network,
    ShieldCheck,
    ArrowRight,
} from "lucide-react"
import { Squares } from "@/components/ui/square"
import { Button } from "@/components/ui/button"

/* ---------------------------------------------
   ANIMATION VARIANTS
---------------------------------------------- */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
}

const iconMap = {
    "plane": Plane,
    "wrench": Wrench,
    "network": Network,
    "shield-check": ShieldCheck,
}

const processSteps = [
    "Requirement Analysis",
    "Solution Design",
    "Deployment & Testing",
    "Ongoing Support",
]

/* ---------------------------------------------
   COMPONENT
---------------------------------------------- */
export default function ServicesPage({ services: servicesData }) {
    return (
        <main className="">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background-darker to-background-darker" />
                <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute w-full h-full">
                    <Squares />
                </div>
                <div className="relative container mx-auto px-6 lg:px-10 text-center py-28">
                    <motion.span
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="inline-block px-4 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-6 text-white"
                    >
                        Our Services
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        End-to-End{" "}
                        <span className="text-[#07C5EB]">Air Mobility Solutions</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="max-w-3xl mx-auto text-gray-300 text-lg"
                    >
                        Pushpak O2 delivers integrated aircraft platforms, operational
                        services, and long-term support for next-generation aviation.
                    </motion.p>
                </div>
            </section>

            {/* ================= SERVICES ================= */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    {servicesData.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {servicesData.map((service, index) => {
                                const Icon = iconMap[service.icon] || Plane
                                return (
                                    <motion.div
                                        key={service._id || service.title}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        custom={index}
                                        className="p-8 rounded-2xl  border border-border hover:border-primary/40 transition"
                                    >
                                        <Icon className="w-10 h-10 text-white mb-4" />
                                        <h3 className="font-heading text-xl font-semibold mb-3 text-gray-300">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-400 mb-4">No services available</h3>
                            <p className="text-gray-500">Services will be displayed here once added.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ================= PROCESS ================= */}
            <section className="py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-4xl font-bold mb-16"
                    >
                        How We Work
                    </motion.h2>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={index}
                                className="p-6 rounded-xl  border border-border"
                            >
                                <div className="text-3xl font-bold text-white mb-3">
                                    {index + 1}
                                </div>
                                <p className="text-sm text-gray-300">{step}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10 text-center">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white"
                    >
                        Let’s Build Your Air Mobility Solution
                    </motion.h2>

                    <Button
                        asChild
                        variant="hero"
                        size="xl"
                        className="group cursor-pointer p-2 px-4 bg-[#07C5EB0b] border w-4/5 md:w-1/5 text-xl py-2"
                    >
                        <Link href="/contact-us" className="flex items-center justify-center space-x-3">
                            <span>Contact Our Team</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </section>

        </main>
    )
}
