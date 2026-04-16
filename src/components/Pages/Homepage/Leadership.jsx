"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { leadershipTeam, foundingLeadershipApproach } from "@/lib/data/companyData";
import LeaderCard from "../Teams/components/LeaderCard";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
};

const Leadership = ({ teamData }) => {
    // If dynamic data is passed, filter/use it. Otherwise fallback to hardcoded (handled in page.js but redundant safety here).
    // Logic: If we have explicit 'order' 1 and 2, those are founders. Or just take first 2.
    // User wants "Founder Order 1 and 2". 
    // Usually 'teamData' passed from page.js is already sorted by order.
    // But 'teamData' contains ALL members. We only want to show 2 Founders here.

    const founders = teamData && teamData.length > 0
        ? teamData.slice(0, 2) // Assume top 2 are founders
        : leadershipTeam.slice(0, 2);

    return (
        <section id="leadership" className="py-24 bg-background-darker relative overflow-hidden">
            {/* Background Effects */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-background to-background-darker" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#07C5EB]/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" /> */}

            <div className="container mx-auto px-6 lg:px-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 text-xs font-semibold bg-[#07C5EB]/10 text-[#07C5EB] rounded-full mb-6"
                    >
                        Leadership
                    </motion.span>

                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={1}
                        className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                    >
                        Meet Our <span className="text-gradient">Founding Team</span>
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={2}
                        className="text-gray-300 max-w-2xl mx-auto"
                    >
                        {foundingLeadershipApproach.description}
                    </motion.p>
                </div>

                {/* Leadership Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 h-auto">
                    {founders.map((member, index) => (
                        <div key={member.id || member._id} className="h-auto">
                            <LeaderCard member={member} index={index} hideBio={true} />
                        </div>
                    ))}
                </div>

                {/* Leadership Approach */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-8 mb-12"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[#07C5EB]/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-[#07C5EB]" />
                                </div>
                                <h3 className="text-xl font-bold gray-300">
                                    {foundingLeadershipApproach.title}
                                </h3>
                            </div>
                            <p className="text-gray-300 italic mb-6">
                                "{foundingLeadershipApproach.conclusion}"
                            </p>
                        </div>

                        <div className="flex-1 grid gap-3 w-full">
                            {foundingLeadershipApproach.points.map((point, index) => (
                                <div key={index} className="flex items-center gap-3 bg-background/10 p-3 rounded-lg border border-white/5">
                                    <CheckCircle className="w-5 h-5 text-[#07C5EB] shrink-0" />
                                    <span className="text-gray-300 text-sm font-medium">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Button
                        asChild
                        variant="hero"
                        size="xl"
                        className="group text-white cursor-pointer bg-[#07C5EB] hover:bg-[#07C5EB]/90 border-0"
                    >
                        <Link href="/our-team" className="flex items-center gap-2 p-2 cursor-pointer">
                            <span>View Full Team</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Leadership;
