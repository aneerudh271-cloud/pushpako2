"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    Leaf, Brain, Plane, ArrowRight, Flag, Lightbulb, Shield,
    Target, Cog, CheckCircle, Building2, Award, Users
} from "lucide-react"
import { Squares } from "@/components/ui/square"
import { Button } from "@/components/ui/button"
import { aboutUsPageData, companyProfile } from "@/lib/data/companyData"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
}

const iconMap = {
    "Sustainability": Leaf,
    "Autonomy": Brain,
    "Engineering": Plane,
    "Make in India": Flag,
    "Innovation": Lightbulb,
    "Safety & Compliance": Shield,
    "Safety": Shield,
    "Flag": Flag,
    "Lightbulb": Lightbulb,
    "Shield": Shield,
    "Plane": Plane,
    "Cog": Cog,
    "Leaf": Leaf,
    "Target": Target,
    "Drone": Plane,
}

export default function AboutPage() {
    const [aboutData, setAboutData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/about-us')
                if (!response.ok) {
                    throw new Error('Failed to fetch about us data')
                }
                const data = await response.json()
                setAboutData(data)
                setError(null)
            } catch (err) {
                setError(err.message)
                console.error('Error fetching about us data:', err)
                // Use hardcoded data as fallback
                setAboutData(aboutUsPageData)
            } finally {
                setLoading(false)
            }
        }

        fetchAboutData()
    }, [])

    // Use hardcoded data while loading or if no data
    const data = aboutData || aboutUsPageData

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-300">Loading...</span>
            </main>
        )
    }

    return (
        <main className="">

            {/* HERO */}
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
                        className="inline-block px-4 py-1 text-xs font-semibold bg-primary/10 text-white rounded-full mb-6"
                    >
                        About {companyProfile.brandName}
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        {data.hero?.title || "Redefining the Future of"} {" "}
                        <span className="text-[#07C5EB]">{data.hero?.subtitle || "Indian Aviation & Aerospace"}</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="max-w-3xl mx-auto text-gray-300 text-lg"
                    >
                        {data.hero?.description || companyProfile.tagline}
                    </motion.p>
                </div>
            </section>

            {/* COMPANY OVERVIEW */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                            About <span className="text-[#07C5EB]">{companyProfile.brandName}</span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg mb-4">
                            {companyProfile.about}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VISION & MISSION */}
            <section className="py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#07C5EB]/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-[#07C5EB]" />
                                </div>
                                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                                    {data.vision?.title || "Our Vision"}
                                </h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {data.vision?.content || companyProfile.vision}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Flag className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                                    Our Mission
                                </h2>
                            </div>
                            <ul className="space-y-3">
                                {(data.mission?.items || companyProfile.mission).map((item, index) => (
                                    <motion.li
                                        key={index}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        custom={index}
                                        className="flex items-start gap-3 text-gray-300"
                                    >
                                        <CheckCircle className="w-5 h-5 text-[#07C5EB] mt-0.5 shrink-0" />
                                        <span>{typeof item === 'string' ? item : item.text}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={1}
                        className="relative rounded-2xl overflow-hidden border border-border"
                    >
                        <Image
                            src="/hero-drone-video.gif"
                            alt="PushpakO2 Aviation Systems"
                            width={800}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                            unoptimized
                        />
                    </motion.div>
                </div>
            </section>

            {/* CORE PHILOSOPHY */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-4xl font-bold mb-16 text-white"
                    >
                        Core Philosophy
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(data.corePhilosophy || aboutUsPageData.corePhilosophy).map((item, i) => (
                            <motion.div
                                key={item.id || i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i}
                                className="p-6 bg-[#060B18]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#07C5EB]/30 transition-all duration-300"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-b from-[#07C5EB]/50 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />

                                <div className="w-10 h-10 rounded-lg bg-[#07C5EB]/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-5 h-5 text-[#07C5EB]" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold mb-2 text-white">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* KEY DOMAINS */}
            <section className="py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-4xl font-bold mb-6 text-white"
                    >
                        Key Domains of Operation
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center text-gray-400 max-w-2xl mx-auto mb-16"
                    >
                        Our expertise spans across multiple aviation and aerospace domains
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {companyProfile.keyDomains.map((domain, i) => {
                            const Icon = iconMap[domain.icon] || Plane
                            const isBlue = i % 2 === 0

                            return (
                                <motion.div
                                    key={domain.id}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={i}
                                    className={`p-8 rounded-2xl bg-card/10 border transition-all duration-300 hover:shadow-xl ${isBlue
                                        ? "border-[#07C5EB]/20 hover:border-[#07C5EB]/50"
                                        : "border-border hover:border-foreground/30"
                                        }`}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${isBlue
                                            ? "bg-[#07C5EB]/10 text-[#07C5EB]"
                                            : "bg-foreground/10 text-gray-300"
                                            }`}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>

                                    <h3
                                        className={`font-heading text-xl font-semibold mb-4 ${isBlue ? "text-[#07C5EB]" : "text-gray-300"
                                            }`}
                                    >
                                        {domain.title}
                                    </h3>

                                    <ul className="space-y-2">
                                        {domain.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                                <CheckCircle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY & CAPABILITIES */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                                Technology & <span className="text-[#07C5EB]">Capabilities</span>
                            </h2>
                            <p className="text-gray-300 mb-8">
                                Our comprehensive technology stack enables end-to-end development of aviation systems.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {companyProfile.technologyCapabilities.map((capability, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        custom={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border"
                                    >
                                        <Cog className="w-5 h-5 text-[#07C5EB] shrink-0" />
                                        <span className="text-sm text-gray-300">{capability}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={1}
                            className="relative rounded-2xl overflow-hidden border border-border"
                        >
                            <Image
                                src="/hero-aircraft.png"
                                alt="PushpakO2 Technology"
                                width={800}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MAKE IN INDIA COMMITMENT */}
            <section className="py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="w-16 h-16 rounded-2xl bg-[#07C5EB]/10 flex items-center justify-center mx-auto mb-6">
                                <Flag className="w-8 h-8 text-[#07C5EB]" />
                            </div>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                                {companyProfile.makeInIndiaCommitment.title}
                            </h2>
                            <p className="text-gray-300 text-lg">
                                {companyProfile.makeInIndiaCommitment.description}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {companyProfile.makeInIndiaCommitment.points.map((point, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={index}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-card/10 border border-border"
                                >
                                    <CheckCircle className="w-5 h-5 text-[#07C5EB] mt-0.5 shrink-0" />
                                    <span className="text-gray-300 text-sm">{point}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* REGULATORY COMPLIANCE */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                                {companyProfile.regulatoryCompliance.title}
                            </h2>
                            <p className="text-gray-300 text-lg">
                                {companyProfile.regulatoryCompliance.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {companyProfile.regulatoryCompliance.standards.map((standard, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={index}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/10 border border-border"
                                >
                                    <Award className="w-4 h-4 text-white" />
                                    <span className="text-gray-300 text-sm">{standard}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-24 bg-background-darker">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-4xl font-bold mb-16 text-white"
                    >
                        What Defines Us
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {(data.values || aboutUsPageData.values).map((item, i) => {
                            const isBlue = i % 2 !== 0
                            const Icon = iconMap[item.icon] || iconMap[item.title] || Leaf

                            return (
                                <motion.div
                                    key={item.id || item.title}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={i}
                                    className={`p-8 rounded-2xl bg-card/10 border transition-all duration-300 hover:shadow-xl ${isBlue
                                        ? "border-[#07C5EB]/20 hover:border-[#07C5EB]/50"
                                        : "border-border hover:border-foreground/30"
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${isBlue
                                            ? "bg-[#07C5EB]/10 text-[#07C5EB]"
                                            : "bg-foreground/10 text-gray-300"
                                            }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3
                                        className={`font-heading text-xl font-semibold mb-3 ${isBlue ? "text-[#07C5EB]" : "text-gray-300"
                                            }`}
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* STATS */}
            {(data.stats || aboutUsPageData.stats) && (
                <section className="py-16">
                    <div className="container mx-auto px-6 lg:px-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {(data.stats || aboutUsPageData.stats).map((stat, i) => (
                                <motion.div
                                    key={stat.id || i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={i}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-[#07C5EB] mb-2">
                                        {stat.value}{stat.suffix}
                                    </div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-12">
                <div className="container mx-auto px-6 lg:px-10 text-center">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="font-heading text-3xl md:text-4xl font-bold mb-4"
                    >
                        Meet Our Leadership
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-gray-400 mb-8 max-w-2xl mx-auto"
                    >
                        Learn about the visionary team driving India&apos;s aviation innovation
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            variant="hero"
                            size="xl"
                            className="group cursor-pointer p-2 px-6 bg-[#07C5EB] border text-xl py-2"
                        >
                            <Link href="/our-team" className="flex items-center justify-center space-x-3">
                                <Users className="w-5 h-5" />
                                <span>Our Team</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="xl"
                            className="group cursor-pointer p-2 px-6 border text-xl py-2 bg-card/10 hover:bg-card/30 hover:border-[#07C5EB]/20 transition-all duration-300 hover:text-white"
                        >
                            <Link href="/services" className="flex items-center justify-center space-x-3">
                                <span>Explore Services</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300 " />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

        </main>
    )
}
