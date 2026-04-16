'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (isMountedRef.current) {
      setLoading(true);
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Newsletter Subscriber', // Default name for subscribers
          email: email.trim(),
          type: 'subscriber',
          source: 'Stay Updated',
          status: 'new',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Thank you for subscribing! We\'ll keep you updated with the latest news.');
        if (isMountedRef.current) {
          setEmail('');
        }
      } else {
        if (response.status === 400 && data.error?.includes('duplicate')) {
          toast.error('This email is already subscribed to our newsletter.');
        } else {
          toast.error(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-4 text-sm md:text-base">
        Subscribe to our newsletter for the latest updates on aviation technology.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium text-sm md:text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </>
  );
}