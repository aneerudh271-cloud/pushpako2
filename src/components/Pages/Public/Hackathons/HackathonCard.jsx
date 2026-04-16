import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatCurrency = (amount) => {
    if (!amount) return 'TBA';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function HackathonCard({ hackathon }) {
    const {
        title,
        slug,
        overview,
        bannerImage,
        status,
        timeline,
        prizes,
        teamSettings
    } = hackathon;

    const statusColors = {
        'UPCOMING': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'LIVE': 'bg-green-500/10 text-green-500 border-green-500/20',
        'ENDED': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-[#0f1115] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/10"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent z-10" />
                <Image
                    src={bannerImage || '/images/placeholder-hackathon.jpg'}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 z-20">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md uppercase tracking-wide",
                        statusColors[status] || statusColors['UPCOMING']
                    )}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                    {overview || "Join us for an amazing hackathon event where you can build, learn and win."}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar size={16} className="text-purple-400" />
                        <span>{formatDate(timeline?.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Trophy size={16} className="text-yellow-400" />
                        <span>{formatCurrency(prizes?.totalPrizePool)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 col-span-2">
                        <Users size={16} className="text-blue-400" />
                        <span>{teamSettings?.teamType === 'TEAM' ? `Teams (${teamSettings.minTeamSize}-${teamSettings.maxTeamSize})` : 'Solo Participation'}</span>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">
                        Ends {formatDate(timeline?.endDate)}
                    </span>
                    <Link
                        href={`/hackathons/${slug}`}
                        className="flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg transition-all group-hover:pl-5"
                    >
                        View Details
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
