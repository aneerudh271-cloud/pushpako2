'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfileTab({ investor, isEditing: initialEditing }) {
  const [profile, setProfile] = useState({
    name: investor.name,
    email: investor.email,
  });
  const [isEditing, setIsEditing] = useState(initialEditing || false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/investors/${investor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update the local investor data if needed
        window.location.reload(); // Simple refresh to get updated data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: resetPasswordData.currentPassword,
          newPassword: resetPasswordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setIsResettingPassword(false);
        setResetPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Investor Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-300">{profile.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-300">{profile.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <p className="text-gray-300">{investor.phone || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Investment Amount</label>
          <p className="text-gray-300">${investor.investmentAmount?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Join Date</label>
          <p className="text-gray-300">{investor.joinDate || 'Not available'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Risk Profile</label>
          <p className="text-gray-300 capitalize">{investor.riskProfile || 'Not set'}</p>
        </div>

        {/* Reset Password Section */}
        {isResettingPassword && (
          <div className="border-t border-gray-700 pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-3">Reset Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={resetPasswordData.currentPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="New Password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                disabled={isLoading}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  onClick={() => setIsResettingPassword(false)}
                  disabled={isLoading}
                  className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          {!isResettingPassword && (
            <button
              onClick={() => setIsResettingPassword(true)}
              className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Reset Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
}