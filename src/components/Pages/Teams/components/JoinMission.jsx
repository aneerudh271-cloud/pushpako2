"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1 },
    }),
}

export default function JoinMission() {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-20"
        >
            <h3 className="text-2xl font-bold mb-4 font-heading">Join Our Mission</h3>
            <p className="text-white mb-8 max-w-2xl mx-auto">
                Explore career opportunities or partner with us to shape the future of aviation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    asChild
                    variant="hero"
                    size="xl"
                    className="group cursor-pointer p-4 px-8 bg-[#07C5EB] hover:bg-[#07C5EB]/90 text-white border-0 text-lg rounded-full"
                >
                    <Link href="/contact-us" className="flex items-center justify-center space-x-3">
                        <span>Contact Us</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="group cursor-pointer p-4 px-8 border-white hover:text-white hover:bg-white/5 text-white bg-transparent text-lg rounded-full"
                >
                    <Link href="/about-us" className="flex items-center justify-center space-x-3">
                        <span>About Company</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </motion.div>
    )
}
