"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function LeaderCard({ member, index }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-full"
        >
            {/* Glow Effect Backend */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#07C5EB]/50 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />

            <div className="relative h-full bg-[#060B18]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#07C5EB]/30 transition-all duration-300 flex flex-col">
                {/* Top Section with Background Gradient */}
                <div className="relative h-24 bg-gradient-to-b from-[#07C5EB]/10 to-transparent">
                    {/* Socials removed as per request */}
                </div>

                {/* Profile Image - Overlapping */}
                <div className="px-6 -mt-12 flex justify-between items-end mb-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#060B18] shadow-xl group-hover:scale-105 transition-transform duration-500">
                        <Image
                            src={member?.image || "/placeholder-avatar.jpg"}
                            alt={member?.name || "Team Member"}
                            fill
                            className="object-cover"
                            sizes="96px"
                            unoptimized // Bypass Next.js optimization to avoid upstream private/local IP errors with Vercel Blob
                        />
                    </div>
                    {/* Department Badge */}
                    {member?.department && (
                        <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#07C5EB] bg-[#07C5EB]/10 border border-[#07C5EB]/20 rounded-full mb-2">
                            {member?.department}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6 flex flex-col flex-grow">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#07C5EB] transition-colors">{member?.name}</h3>
                        <p className="text-sm font-medium text-gray-400">{member?.role}</p>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-7 flex-grow">
                        {member?.bio}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
