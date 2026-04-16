'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SignInClientComponent() {
    const [userType, setUserType] = useState('investor'); // 'investor' or 'user'
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    const hasSynced = useRef(false); // Track if we've already synced

    useEffect(() => {
        const syncAndRedirect = async () => {
            // Only sync if we have a session AND haven't synced yet
            if (session?.user && !hasSynced.current && status === 'authenticated') {
                hasSynced.current = true; // Mark as synced to prevent re-runs

                try {
                    // Sync the NextAuth session with our custom auth-token
                    const response = await fetch('/api/auth/sync-session', { method: 'POST' });

                    if (!response.ok) {
                        throw new Error('Session sync failed');
                    }

                    // Redirect based on role
                    if (session.user.role === 'admin') {
                        router.push('/dashboards/admin');
                    } else if (session.user.role === 'hackathon_user') {
                        router.push('/dashboards/student'); // Redirect participants to student dashboard
                    } else {
                        router.push(`/dashboards/investors/${session.user.id}`);
                    }
                } catch (error) {
                    console.error('Session sync failed:', error);
                    toast.error(`Sync failed: ${error.message}`);
                    hasSynced.current = false; // Reset on error
                }
            }
        };

        syncAndRedirect();
    }, [session, status, router]); // Only depend on session, status, and router

    const handleSignOut = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        router.push('/api/auth/signout');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignIn) {
            // Sign In
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                    userType: userType, // Pass selected user type
                });

                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success('Signed in successfully');
                    router.refresh();
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        } else {
            // Sign Up
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('/api/auth/sign-up', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        userType: userType, // Pass selected user type
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success('Account created successfully');
                    setIsSignIn(true);
                } else {
                    toast.error(data.error);
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
        setLoading(false);
    };

    const handleGoogleSignIn = () => {
        // Set cookie to indicate intended user type for the callback
        document.cookie = `login-user-type=${userType}; path=/; max-age=300`; // Expires in 5 mins
        signIn('google', { callbackUrl: '/sign-in' });
    };

    return (
        <div className="flex h-screen ">
            {/* Left Side - Image */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center">
                <div className="text-center text-white h-[450px] w-2/3">
                    <Image
                        src="/hero-aircraft.png"
                        alt="Auth"
                        width={400}
                        height={400}
                        className="rounded-lg shadow-lg w-full h-3/5 object-cover"
                    />
                    <h2 className="text-3xl font-bold mt-6">Welcome</h2>
                    <p className="text-blue-100 mt-2">Your journey starts here</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* User Type Toggles */}
                    <div className="flex bg-gray-800 p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setUserType('investor')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${userType === 'investor'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Investor / Admin
                        </button>
                        <button
                            onClick={() => setUserType('user')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${userType === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Hackathon Participant
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-bold text-gray-300">
                            {userType === 'investor'
                                ? (isSignIn ? 'Investor Sign In' : 'Create Investor Account')
                                : (isSignIn ? 'Participant Sign In' : 'Create Participant Account')}
                        </h1>
                        {session && (
                            <button
                                onClick={handleSignOut}
                                className="text-xs text-red-400 border border-red-400 px-2 py-1 rounded hover:bg-red-400/10"
                            >
                                Force Sign Out
                            </button>
                        )}
                    </div>
                    <p className="text-gray-400 mb-8">
                        {isSignIn
                            ? "Don't have an account? "
                            : 'Already have an account? '}
                        <button
                            onClick={() => setIsSignIn(!isSignIn)}
                            className="text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                            {isSignIn ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isSignIn && (
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required={!isSignIn}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {!isSignIn && (
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required={!isSignIn}
                                />
                            </div>
                        )}

                        {isSignIn && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.push('/forgot-password')}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full mt-4 bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-6 text-center text-gray-600 text-sm">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </div>
                </div>
            </div>
        </div>
    );
}