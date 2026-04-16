"use client"
import { motion } from "framer-motion"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
}

export default function TeamHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-20">
            <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="inline-block px-4 py-1 text-xs font-semibold bg-[#07C5EB]/10 text-[#07C5EB] rounded-full mb-6 border border-[#07C5EB]/20"
            >
                Leadership Team
            </motion.span>

            <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6"
            >
                {title}
            </motion.h1>

            <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
            >
                {subtitle}
            </motion.p>
        </div>
    )
}
