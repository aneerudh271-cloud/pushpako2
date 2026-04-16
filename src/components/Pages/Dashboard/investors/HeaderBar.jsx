'use client';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function HeaderBar({ investor, onProfileAction }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();


  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl md:text-4xl font-bold">Investor Dashboard</h1>
      <div className="relative">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {investor.name.charAt(0)}
          </div>
          <span className="hidden sm:inline">{investor.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {profileDropdownOpen && (
          <div className="absolute right-0 mt-2 min-w-48 bg-gray-800 rounded-lg shadow-lg z-10">
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="font-medium">{investor.email}</p>
            </div>
            <button
              onClick={() => {
                onProfileAction('view');
                setProfileDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                onProfileAction('edit');
                setProfileDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  toast.success('Logged out successfully');
                  signOut({ callbackUrl: '/sign-in' });
                } catch (error) {
                  console.error(error);
                  toast.error('Logout failed');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}