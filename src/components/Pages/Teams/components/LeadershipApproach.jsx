"use client"
import { motion } from "framer-motion"
import { Users, CheckCircle } from "lucide-react"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
}

export default function LeadershipApproach({ data }) {
    if (!data) return null;

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#07C5EB]/50 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#07C5EB]/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#07C5EB]/5 ring-1 ring-[#07C5EB]/20">
                        <Users className="w-8 h-8 text-[#07C5EB]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                        {data?.title}
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        {data?.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-10">
                    {data.points.map((point, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={index}
                            className="flex items-center gap-4 p-4 rounded-xl bg-background/10 border border-white/5 hover:border-[#07C5EB]/30 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#07C5EB]/10 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4 text-[#07C5EB]" />
                            </div>
                            <span className="text-gray-300 font-medium">{point}</span>
                        </motion.div>
                    ))}
                </div>

                <p className="text-gray-300 text-center italic border-t border-white/10 pt-8 mt-8">
                    "{data?.conclusion}"
                </p>
            </div>
        </motion.div>
    )
}
