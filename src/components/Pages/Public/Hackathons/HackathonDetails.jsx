'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Trophy, Book, Code, Clock, ShieldCheck, Github, ExternalLink, Loader2, Lock, CheckCircle, Ticket, CreditCard, X, ChevronRight, Gift, Plus, Trash2, Copy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Script from 'next/script';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' });
const formatDateTime = (date) => new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function HackathonDetails({ hackathon, user, initialStatus }) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus || { registered: false, status: null });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [submissionForm, setSubmissionForm] = useState({
        githubRepo: '',
        demoLink: '',
        markdownFile: '' // Assuming content string for now
    });

    // Payment & Coupon States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discountInfo, setDiscountInfo] = useState({ discount: 0, finalAmount: hackathon.registrationFee || 0, valid: false });
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Team Registration States
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [teamData, setTeamData] = useState({
        teamName: '',
        members: Array.from({ length: hackathon.teamSettings?.minTeamSize || 1 }, () => ({
            name: '',
            email: '',
            gender: 'MALE',
            college: '',
            role: '',
            phone: ''
        }))
    });

    const isUpcoming = hackathon.status === 'UPCOMING';
    const isLive = hackathon.status === 'LIVE';
    const isEnded = hackathon.status === 'ENDED';

    // Actions
    const handleRegister = async () => {
        if (!isLive) {
            toast.error('Registration is only available when the hackathon is LIVE!');
            return;
        }

        if (!user) {
            router.push(`/sign-in?callbackUrl=/hackathons/${hackathon.slug}`);
            return;
        }

        if (hackathon.teamSettings.teamType === 'TEAM') {
            setShowTeamModal(true);
            return;
        }

        if (hackathon.registrationFee > 0) {
            setShowPaymentModal(true);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/participation/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hackathonId: hackathon._id })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Successfully registered!');
                setStatus({ registered: true, status: data.participation.status, participationId: data.participation.id });
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleTeamSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!teamData.teamName.trim()) return toast.error('Team Name is required');

        const { minMale, minFemale, requireGenderBalance } = hackathon.teamSettings;
        if (requireGenderBalance) {
            const males = teamData.members.filter(m => m.gender === 'MALE').length;
            const females = teamData.members.filter(m => m.gender === 'FEMALE').length;
            if (males < minMale) return toast.error(`At least ${minMale} male(s) required`);
            if (females < minFemale) return toast.error(`At least ${minFemale} female(s) required`);
        }

        if (hackathon.registrationFee > 0) {
            setShowTeamModal(false);
            setShowPaymentModal(true);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/participation/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hackathonId: hackathon._id,
                    teamName: teamData.teamName,
                    teamMembers: teamData.members
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Team registered successfully!');
                setShowTeamModal(false);
                setStatus({
                    registered: true,
                    status: data.participation.status,
                    participationId: data.participation.id,
                    participationCode: data.participation.participationCode
                });
            } else {
                toast.error(data.error || 'Team registration failed');
            }
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const addMember = () => {
        if (teamData.members.length < hackathon.teamSettings.maxTeamSize) {
            setTeamData({
                ...teamData,
                members: [...teamData.members, { name: '', email: '', gender: 'MALE', college: '', role: '', phone: '' }]
            });
        }
    };

    const removeMember = (index) => {
        if (teamData.members.length > hackathon.teamSettings.minTeamSize) {
            const newMembers = [...teamData.members];
            newMembers.splice(index, 1);
            setTeamData({ ...teamData, members: newMembers });
        }
    };

    const updateMember = (index, field, value) => {
        const newMembers = [...teamData.members];
        newMembers[index][field] = value;
        setTeamData({ ...teamData, members: newMembers });
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setVerifyingCoupon(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode,
                    hackathonId: hackathon._id,
                    amount: hackathon.registrationFee
                })
            });
            const data = await res.json();
            if (res.ok) {
                setDiscountInfo(data);
                toast.success(`Coupon Applied! ₹${data.discount} saved`);
            } else {
                setDiscountInfo({ discount: 0, finalAmount: hackathon.registrationFee, valid: false });
                toast.error(data.error || 'Invalid Coupon');
            }
        } catch (error) {
            toast.error('Failed to validate coupon');
        } finally {
            setVerifyingCoupon(false);
        }
    };

    const handlePayment = async () => {
        setProcessingPayment(true);
        try {
            // 1. Create Order
            const orderRes = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hackathonId: hackathon._id,
                    couponCode: discountInfo.valid ? couponCode : null
                })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error(orderData.error);

            if (orderData.finalAmount === 0) {
                // Free registration via coupon
                const verifyRes = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        hackathonId: hackathon._id,
                        couponId: orderData.couponId,
                        discount: orderData.discount,
                        amountPaid: 0,
                        teamName: teamData.teamName,
                        teamMembers: teamData.members
                    })
                });
                const verifyData = await verifyRes.json();
                if (verifyRes.ok) {
                    toast.success('Registration Complete!');
                    setShowPaymentModal(false);
                    setStatus({ registered: true, status: verifyData.participation.status, participationId: verifyData.participation._id });
                } else {
                    toast.error(verifyData.error);
                }
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_S8nBupaDcI7xxs',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Pushpak O2",
                description: `Registration for ${hackathon.title}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            hackathonId: hackathon._id,
                            couponId: orderData.couponId,
                            discount: orderData.discount,
                            amountPaid: orderData.finalAmount,
                            teamName: teamData.teamName,
                            teamMembers: teamData.members
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok) {
                        toast.success('Payment Successful & Registered!');
                        setShowPaymentModal(false);
                        setStatus({
                            registered: true,
                            status: verifyData.participation.status,
                            participationId: verifyData.participation._id,
                            participationCode: verifyData.participation.participationCode
                        });
                    } else {
                        toast.error(verifyData.error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#8B5CF6" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.error(error.message || 'Payment failed to initiate');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...submissionForm,
                    code: generatedCode
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Project submitted successfully!');
                setShowSubmitModal(false);
                setStatus(prev => ({ ...prev, status: 'SUBMITTED' }));
            } else {
                toast.error(data.error || 'Submission failed');
            }
        } catch (error) {
            toast.error('Error submitting project');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSubmitModal = () => {
        if (!isLive) {
            toast.error('Submissions are only available when the hackathon is LIVE!');
            return;
        }
        setShowSubmitModal(true);
    };

    // Render Logic for Comparison
    const getCTA = () => {
        if (isEnded) return <button className="w-full py-3 rounded-xl font-bold bg-gray-700 text-gray-400 cursor-not-allowed">Hackathon Ended</button>;

        if (isUpcoming) {
            return (
                <button
                    onClick={() => toast.info('Hackathon is not live yet. Please wait for it to start!')}
                    className="w-full py-3 rounded-xl font-bold bg-blue-500/20 text-blue-400 border border-blue-500/50 cursor-pointer"
                >
                    Hackathon Upcoming
                </button>
            );
        }

        if (!user) {
            return (
                <Link href="/sign-in?callbackUrl=/hackathons" className="block text-center w-full py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all">
                    Login to Participate
                </Link>
            );
        }

        if (status.status === 'SUBMITTED') {
            return (
                <Link href="/dashboards/student" className="block text-center w-full py-3 rounded-xl font-bold bg-green-600/20 text-green-500 border border-green-500/50 hover:bg-green-600/30 transition-all">
                    View Submission
                </Link>
            );
        }

        if (status.registered) {
            if (status.status === 'PENDING') {
                return <button className="w-full py-3 rounded-xl font-bold bg-yellow-600/20 text-yellow-500 border border-yellow-500/50 cursor-pointer">Approval Pending</button>;
            }

            if (status.status === 'REGISTERED' || status.status === 'APPROVED') {
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 mb-1">
                                <CheckCircle size={16} /> Registration Complete
                            </h4>
                            <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                                You are officially registered! Use the code below for project submission.
                            </p>
                            <div className="bg-[#0a0c10] border border-white/5 p-4 rounded-2xl space-y-3 group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                                        <Lock size={12} className="text-blue-500/50" />
                                        Submission Code
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (status.participationCode) {
                                                navigator.clipboard.writeText(status.participationCode);
                                                toast.success('Code copied to clipboard!');
                                            }
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-blue-500/20 text-[10px] font-black text-gray-400 hover:text-blue-400 rounded-lg border border-white/5 hover:border-blue-500/30 transition-all uppercase"
                                    >
                                        <Copy size={12} /> Copy
                                    </button>
                                </div>
                                <div className="relative group/input">
                                    <input
                                        readOnly
                                        value={status.participationCode || '------'}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono tracking-[0.2em] text-white focus:outline-none overflow-x-auto whitespace-nowrap selection:bg-blue-500/30 cursor-text"
                                        title="Your unique participation code"
                                    />
                                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050505] to-transparent rounded-r-xl pointer-events-none" />
                                </div>
                            </div>

                            {status.teamName && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Users size={12} className="text-blue-400" />
                                        Team: {status.teamName}
                                    </h5>
                                    <div className="space-y-2">
                                        {status.teamMembers?.map((member, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-white">{member.name}</span>
                                                    <span className="text-[9px] text-gray-400">{member.role || 'Member'}</span>
                                                </div>
                                                {idx === 0 && (
                                                    <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20 font-bold">LEAD</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {status.status === 'APPROVED' ? (
                            <button
                                onClick={handleOpenSubmitModal}
                                disabled={!isLive}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${isLive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white animate-pulse shadow-lg shadow-blue-900/20'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Submit Project
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                <Clock className="text-blue-400" size={14} />
                                <span className="text-[10px] text-blue-200/70">Awaiting Manager Approval for Submissions</span>
                            </div>
                        )}
                    </div>
                );
            }

            // Fallback
            return <button className="w-full py-3 rounded-xl font-bold bg-gray-600">Registered</button>;
        }

        // Not registered
        return (
            <button
                onClick={handleRegister}
                disabled={loading || !isLive}
                className={`w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${isLive
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Register Now'}
            </button>
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Book },
        { id: 'structure', label: 'Structure', icon: Code },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'rules', label: 'Rules', icon: ShieldCheck },
        { id: 'prizes', label: 'Trophy', icon: Trophy },
        { id: 'resources', label: 'Resources', icon: ExternalLink },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10" />
                <Image
                    src={hackathon.bannerImage || '/images/placeholder-hackathon.jpg'}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-end z-20 pb-16 md:pb-24 max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex gap-4 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border ${isLive ? 'bg-green-500/20 border-green-500 text-green-400' :
                            isEnded ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-blue-500/20 border-blue-500 text-blue-400'
                            }`}>
                            {hackathon.status}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white/10 backdrop-blur-md border border-white/10 text-white">
                            {hackathon.teamSettings.teamType === 'TEAM' ? 'Team' : 'Solo'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{hackathon.title}</h1>
                    {hackathon.theme && (
                        <p className="text-xl md:text-2xl font-semibold text-purple-400 mb-4 tracking-wider">
                            THEME: {hackathon.theme}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-purple-400" />
                            {formatDate(hackathon.timeline.startDate)} - {formatDate(hackathon.timeline.endDate)}
                        </div>
                        {hackathon.venue && (
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-blue-400" />
                                {hackathon.venue}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-400" />
                            {formatCurrency(hackathon.prizes.totalPrizePool)} Prize Pool
                        </div>
                        {hackathon.organizedBy && (
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-green-400" />
                                Organized by {hackathon.organizedBy}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20 -mt-10">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs Nav */}
                    <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-2 scrollbar-none sticky top-4 bg-[#050505]/95 backdrop-blur z-30 py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#0f1115] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-2xl font-bold mb-4 text-white">About</h3>
                                        <ReactMarkdown>
                                            {hackathon.description}
                                        </ReactMarkdown>

                                        <h4 className="text-xl font-bold mt-8 mb-4 text-white uppercase tracking-wider">8. Evaluation Criteria</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hackathon.judgingCriteria?.map((criteria, i) => (
                                                <div key={i} className="bg-white/5 p-4 rounded-xl">
                                                    <div className="flex justify-between mb-2 text-sm">
                                                        <span>{criteria.title}</span>
                                                        <span className="font-bold">{criteria.weight}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500" style={{ width: `${criteria.weight}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'structure' && (
                                    <div className="space-y-12">
                                        <h3 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Event Structure</h3>
                                        {hackathon.structure?.length > 0 ? (
                                            <div className="space-y-8">
                                                {hackathon.structure.map((round, idx) => (
                                                    <div key={idx} className="relative pl-8 border-l-2 border-purple-500/30 py-4">
                                                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/40 transition-all group">
                                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                                <h4 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                                                    {round.roundName}
                                                                </h4>
                                                                {round.elimination && (
                                                                    <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                                                                        {round.elimination}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                                                <div>
                                                                    <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Activities</h5>
                                                                    <ul className="space-y-2">
                                                                        {round.activities?.map((activity, i) => (
                                                                            <li key={i} className="flex gap-2 text-gray-300 items-start">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                                                                                {activity}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                {round.judgingCriteria?.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Judging Criteria</h5>
                                                                        <div className="space-y-3">
                                                                            {round.judgingCriteria.map((c, i) => (
                                                                                <div key={i} className="space-y-1">
                                                                                    <div className="flex justify-between text-xs text-gray-400">
                                                                                        <span>{c.title}</span>
                                                                                        <span>{c.weight}%</span>
                                                                                    </div>
                                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                                        <div
                                                                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                                                            style={{ width: `${c.weight}%` }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <Code size={48} className="mx-auto text-gray-600 mb-4" />
                                                <p className="text-gray-400 italic">Detailed event structure will be revealed soon.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'timeline' && (
                                    <div className="space-y-8 relative">
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent" />
                                        {[
                                            {
                                                label: 'Registration Opens',
                                                date: hackathon.timeline.startDate,
                                                note: 'Official opening of registrations. Create your team or join solo!',
                                                icon: Users
                                            },
                                            {
                                                label: 'Registration Deadline',
                                                date: hackathon.timeline.registrationDeadline,
                                                note: 'Final call for registrations. Ensure all team members are listed.',
                                                icon: Ticket
                                            },
                                            {
                                                label: 'Project Submission Deadline',
                                                date: hackathon.timeline.submissionDeadline,
                                                note: 'Final deadline to submit your project github repo and demo links.',
                                                icon: Code
                                            },
                                            {
                                                label: 'Hackathon Concludes',
                                                date: hackathon.timeline.endDate,
                                                note: 'The event ends. Results and winner announcements will follow.',
                                                icon: Trophy
                                            },
                                        ]
                                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                                            .map((item, i, array) => {
                                                const eventDate = new Date(item.date);
                                                const now = new Date();
                                                const isPast = eventDate < now;
                                                const nextItem = array[i + 1];
                                                const nextDate = nextItem ? new Date(nextItem.date) : null;

                                                // An event is "Ongoing" if it has started but the next event hasn't.
                                                // Or if it's the last event and it's in the past (it's the current end state)
                                                // But usually, the "Current" state is the one we are currently in.
                                                const isCurrent = (isPast && (!nextDate || now < nextDate)) || (!isPast && i === 0 && now < eventDate);

                                                return (
                                                    <div key={i} className={`flex gap-8 relative p-6 rounded-2xl border transition-all ${isCurrent ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/20' : 'bg-white/5 border-white/5'
                                                        }`}>
                                                        <div className={`w-12 h-12 rounded-2xl border-2 z-10 flex items-center justify-center shrink-0 transition-all ${isPast && !isCurrent ? 'bg-green-500/10 border-green-500 text-green-400' :
                                                            isCurrent ? 'bg-purple-500 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
                                                                'bg-[#0f1115] border-white/10 text-gray-500'
                                                            }`}>
                                                            {isPast && !isCurrent ? <CheckCircle size={20} /> : <item.icon size={20} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className={`text-xl font-bold ${isCurrent ? 'text-white' : isPast ? 'text-gray-400' : 'text-gray-300'}`}>
                                                                        {item.label}
                                                                    </h4>
                                                                    {isCurrent && (
                                                                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                                                                    )}
                                                                </div>
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${isPast && !isCurrent ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                                    isCurrent ? 'bg-purple-500 text-white shadow-lg' :
                                                                        'bg-white/5 text-gray-500 border border-white/10'
                                                                    }`}>
                                                                    {isPast && !isCurrent ? 'Completed' : isCurrent ? 'Ongoing' : 'Upcoming'}
                                                                </span>
                                                            </div>
                                                            <p className={`text-sm mb-3 font-bold tracking-tight ${isCurrent ? 'text-purple-400' : 'text-gray-500'}`}>
                                                                {formatDateTime(item.date)}
                                                            </p>
                                                            <p className={`text-sm leading-relaxed max-w-lg ${isCurrent ? 'text-gray-200' : 'text-gray-500'}`}>
                                                                {item.note}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}

                                {activeTab === 'rules' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">Rules</h3>
                                            <ul className="space-y-3">
                                                {hackathon.rules?.map((rule, i) => (
                                                    <li key={i} className="flex gap-3 text-gray-300">
                                                        <CheckCircle className="text-green-500 shrink-0" size={20} />
                                                        {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">Eligibility</h3>
                                            <ul className="space-y-3">
                                                {hackathon.eligibility?.map((rule, i) => (
                                                    <li key={i} className="flex gap-3 text-gray-300">
                                                        <CheckCircle className="text-blue-500 shrink-0" size={20} />
                                                        {rule}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'prizes' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {hackathon.prizes.firstPrize && (
                                            <div className="bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 p-6 rounded-2xl text-center">
                                                <Trophy className="mx-auto text-yellow-400 mb-4" size={48} />
                                                <h3 className="text-2xl font-bold text-white mb-2">1st Place</h3>
                                                <p className="text-3xl font-extrabold text-yellow-400">{formatCurrency(hackathon.prizes.firstPrize)}</p>
                                            </div>
                                        )}
                                        {hackathon.prizes.secondPrize && (
                                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                                                <Trophy className="mx-auto text-gray-400 mb-4" size={40} />
                                                <h3 className="text-xl font-bold text-white mb-2">2nd Place</h3>
                                                <p className="text-2xl font-bold text-gray-300">{formatCurrency(hackathon.prizes.secondPrize)}</p>
                                            </div>
                                        )}
                                        {hackathon.prizes.thirdPrize && (
                                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                                                <Trophy className="mx-auto text-orange-400 mb-4" size={40} />
                                                <h3 className="text-xl font-bold text-white mb-2">3rd Place</h3>
                                                <p className="text-2xl font-bold text-orange-300">{formatCurrency(hackathon.prizes.thirdPrize)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'resources' && (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold mb-4 text-white">Resources</h3>
                                        <div className="grid gap-4">
                                            {hackathon.resourceLinks?.map((res, i) => (
                                                <a
                                                    key={i}
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-all group"
                                                >
                                                    <span className="font-semibold text-gray-200">{res.title}</span>
                                                    <ExternalLink className="text-gray-500 group-hover:text-white" size={18} />
                                                </a>
                                            ))}
                                            {/* Static Examples */}
                                            {(!hackathon.resourceLinks || hackathon.resourceLinks.length === 0) && (
                                                <p className="text-gray-500 italic">No specific resources listed.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Card */}
                    <div className="bg-[#0f1115] border border-white/5 rounded-3xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6">Participation</h3>

                        <div className="space-y-4">
                            {getCTA()}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Team Size</span>
                                <span className="text-white font-medium">{hackathon.teamSettings.minTeamSize} - {hackathon.teamSettings.maxTeamSize} Members</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Registration Fee</span>
                                <span className="text-white font-medium">{hackathon.registrationFee > 0 ? `₹${hackathon.registrationFee}` : 'Free'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Rounds</span>
                                <span className="text-white font-medium">{hackathon.structure?.length || 'Multiple'} Stages</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Access</span>
                                <span className="text-white font-medium">Public</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1d24] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Submit Project</h3>
                            <button onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmitProject} className="space-y-4">
                                <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg mb-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-1">
                                        <Lock size={14} /> Secure Submission
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                        Please enter the Access Token sent to your registered email address.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Access Token</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your participation token"
                                        value={generatedCode}
                                        onChange={(e) => setGeneratedCode(e.target.value)}
                                        className="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 font-mono text-center tracking-widest focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">GitHub Repository</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://github.com/username/project"
                                        value={submissionForm.githubRepo}
                                        onChange={e => setSubmissionForm({ ...submissionForm, githubRepo: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Demo Link (Optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://project-demo.com"
                                        value={submissionForm.demoLink}
                                        onChange={e => setSubmissionForm({ ...submissionForm, demoLink: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Description (Markdown)</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="# My Project..."
                                        value={submissionForm.markdownFile}
                                        onChange={e => setSubmissionForm({ ...submissionForm, markdownFile: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-all mt-4"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Submit Project'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Razorpay Script */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Payment & Coupon Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#12141a] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <CreditCard className="text-purple-400" size={20} />
                                        Complete Registration
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Final step to join {hackathon.title}</p>
                                </div>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Entry Fee Details */}
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Entry Fee</span>
                                        <span className="text-white font-bold">{formatCurrency(hackathon.registrationFee)}</span>
                                    </div>
                                    {discountInfo.discount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-green-400 mb-2">
                                            <span className="flex items-center gap-1"><Gift size={14} /> Discount</span>
                                            <span>- {formatCurrency(discountInfo.discount)}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-white/5 my-3" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium">Total Amount</span>
                                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                            {formatCurrency(discountInfo.finalAmount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Coupon Section */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Ticket size={14} className="text-purple-500" />
                                        Have a Coupon Code?
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="ENTER CODE"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-3 pr-10 text-sm font-bold tracking-widest focus:border-purple-500 outline-none transition-all placeholder:text-gray-700"
                                            />
                                            {discountInfo.valid && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                                            )}
                                        </div>
                                        <button
                                            onClick={applyCoupon}
                                            disabled={verifyingCoupon || !couponCode.trim()}
                                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {verifyingCoupon ? <Loader2 className="animate-spin" size={16} /> : 'APPLY'}
                                        </button>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <ShieldCheck className="text-blue-400 shrink-0" size={18} />
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        Secure payment powered by <b>Razorpay</b>. Your data is encrypted and protected.
                                        By proceeding, you agree to the hackathon's terms and participation rules.
                                    </p>
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                    className="w-full group relative flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-black text-white shadow-xl shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {processingPayment ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {discountInfo.finalAmount === 0 ? 'COMPLETE REGISTRATION' : `PAY ${formatCurrency(discountInfo.finalAmount)}`}
                                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Team Registration Modal */}
            <AnimatePresence>
                {showTeamModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#12141a] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users className="text-blue-400" size={20} />
                                        Team Registration
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Register your squad for {hackathon.title}</p>
                                </div>
                                <button
                                    onClick={() => setShowTeamModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleTeamSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Team Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Team Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter a cool name for your team"
                                        value={teamData.teamName}
                                        onChange={(e) => setTeamData({ ...teamData, teamName: e.target.value })}
                                        className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Members List */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Team Members ({teamData.members.length}/{hackathon.teamSettings.maxTeamSize})</label>
                                        {teamData.members.length < hackathon.teamSettings.maxTeamSize && (
                                            <button
                                                type="button"
                                                onClick={addMember}
                                                className="flex items-center gap-1 text-[10px] font-black text-blue-400 hover:text-blue-300 transition-all bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20"
                                            >
                                                <Plus size={12} /> ADD MEMBER
                                            </button>
                                        )}
                                    </div>

                                    {teamData.members.map((member, index) => (
                                        <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4 relative group">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                                <span className="text-xs font-bold text-gray-400">Member {index + 1} {index === 0 && "(Team Lead)"}</span>
                                                {index >= hackathon.teamSettings.minTeamSize && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember(index)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Full Name"
                                                    value={member.name}
                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Email Address"
                                                    value={member.email}
                                                    onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                />
                                                <select
                                                    value={member.gender}
                                                    onChange={(e) => updateMember(index, 'gender', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                >
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Phone (Optional)"
                                                    value={member.phone}
                                                    onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="College/Org"
                                                    value={member.college}
                                                    onChange={(e) => updateMember(index, 'college', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Role (e.g. Developer)"
                                                    value={member.role}
                                                    onChange={(e) => updateMember(index, 'role', e.target.value)}
                                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {teamData.members.length < hackathon.teamSettings.maxTeamSize && (
                                        <button
                                            type="button"
                                            onClick={addMember}
                                            className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-gray-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-all">
                                                <Plus size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Add Another Team Member</span>
                                        </button>
                                    )}
                                </div>

                                {/* Restrictions Info */}
                                {hackathon.teamSettings.requireGenderBalance && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-3">
                                        <ShieldCheck className="text-yellow-500 shrink-0" size={18} />
                                        <div className="text-[10px] text-yellow-200/70">
                                            <b>Gender Balance Required:</b> This hackathon requires at least {hackathon.teamSettings.minMale} male and {hackathon.teamSettings.minFemale} female member(s) per team.
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mx-auto" />
                                    ) : (
                                        hackathon.registrationFee > 0 ? 'PROCEED TO PAYMENT' : 'REGISTER TEAM'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
