'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ManagerLoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            if (session.user.role === 'hackathon_manager') {
                router.push('/dashboards/hackathon-managers');
            } else {
                toast.error("You are logged in with a non-manager account.");
                // Optionally sign them out or redirect
            }
        }
    }, [session, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
                userType: 'manager', // Distinct type for manager login
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Manager signed in successfully');
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white">
            {/* Left Side - Image */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center border-r border-white/10">
                <div className="text-center h-[450px] w-2/3">
                    <div className="relative w-full h-3/5 mb-6">
                        <Image
                            src="/hero-aircraft.png"
                            alt="Hackathon Manager"
                            fill
                            className="rounded-lg shadow-lg object-cover opacity-80"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-500">Hackathon Manager</h2>
                    <p className="text-gray-400 mt-2">Dedicated Portal for Organizers</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Manager Login</h1>
                        <p className="text-gray-400">Access your hackathon management dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="manager@example.com"
                                className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[#0f1115] border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Not a manager? <a href="/sign-in" className="text-blue-500 hover:underline">Go to Standard Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
