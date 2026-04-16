'use client';
import { useState, useMemo } from 'react';
import { Search, Filter, Calendar as CalendarIcon, DollarSign, Users } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { motion } from 'framer-motion';

export default function HackathonList({ initialHackathons }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'ALL',
        type: 'ALL',
        prizeRange: 'ALL'
    });
    const [sortBy, setSortBy] = useState('LATEST');

    // Filter Logic
    const filteredHackathons = useMemo(() => {
        let result = [...(initialHackathons || [])];

        // Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(h =>
                h.title?.toLowerCase().includes(lowerQuery) ||
                h.overview?.toLowerCase().includes(lowerQuery)
            );
        }

        // Status Filter
        if (filters.status !== 'ALL') {
            result = result.filter(h => h.status === filters.status);
        }

        // Type Filter (Solo/Team)
        if (filters.type !== 'ALL') {
            result = result.filter(h => h.teamSettings?.teamType === filters.type);
        }

        // Prize Range Filter
        if (filters.prizeRange !== 'ALL') {
            result = result.filter(h => {
                const prize = h.prizes?.totalPrizePool || 0;
                switch (filters.prizeRange) {
                    case 'HIGH': return prize > 5000;
                    case 'MEDIUM': return prize >= 1000 && prize <= 5000;
                    case 'LOW': return prize < 1000;
                    default: return true;
                }
            });
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'PRIZE_HIGH':
                    return (b.prizes?.totalPrizePool || 0) - (a.prizes?.totalPrizePool || 0);
                case 'START_DATE':
                    return new Date(a.timeline.startDate) - new Date(b.timeline.startDate);
                case 'LATEST':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return result;
    }, [initialHackathons, searchQuery, filters, sortBy]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Pagination Logic
    const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);
    const displayedHackathons = filteredHackathons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Hero Section */}
            <section className="relative py-20 px-4 md:px-8 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2">
                            Explore Hackathons
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Discover the hottest hackathons, build innovative projects, and win amazing prizes.
                        </p>
                    </motion.div>

                    {/* Search & Filters Controls */}
                    <div className="bg-[#0f1115] p-2 rounded-2xl border border-white/5 shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mt-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search hackathons..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
                            />
                        </div>
                        <div className="flex gap-2 p-1 overflow-x-auto">
                            {/* Status Select */}
                            <div className="relative group">
                                <select
                                    value={filters.status}
                                    onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
                                    className="appearance-none bg-[#1a1d24] text-sm text-gray-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-purple-500 min-w-[120px] cursor-pointer"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="LIVE">Live</option>
                                    <option value="ENDED">Ended</option>
                                </select>
                            </div>

                            {/* Type Select */}
                            <select
                                value={filters.type}
                                onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
                                className="appearance-none bg-[#1a1d24] text-sm text-gray-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                                <option value="ALL">Any Type</option>
                                <option value="SOLO">Solo</option>
                                <option value="TEAM">Team</option>
                            </select>

                            {/* Sort Select */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-[#1a1d24] text-sm text-gray-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                                <option value="LATEST">Newest</option>
                                <option value="PRIZE_HIGH">High Prize</option>
                                <option value="START_DATE">Start Date</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                {filteredHackathons.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedHackathons.map((hackathon) => (
                                <HackathonCard key={hackathon._id} hackathon={hackathon} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-[#1a1d24] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252a33] transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-[#1a1d24] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#252a33] transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No hackathons found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
