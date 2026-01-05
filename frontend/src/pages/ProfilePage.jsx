import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Check, AlertCircle } from 'lucide-react';

import DashBoardLayout from '../components/layout/DashBoardLayout';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const ProfilePage = () => {
  const { user, updateUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
      });

      updateUser(response.data.user ?? response.data);
      setSaveSuccess(true);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashBoardLayout activeMenu="profile">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Loading your profile...</p>
          </div>
        </div>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout activeMenu="profile">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes successPulse {
          0% {
            background-color: rgb(220, 252, 231);
            border-color: rgb(134, 239, 172);
          }
          50% {
            background-color: rgb(240, 253, 250);
            border-color: rgb(110, 231, 183);
          }
          100% {
            background-color: rgb(220, 252, 231);
            border-color: rgb(134, 239, 172);
          }
        }

        .profile-container {
          animation: slideInUp 0.5s ease-out;
        }

        .success-banner {
          animation: successPulse 2s ease-in-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 -m-6 p-6 md:p-8">
        <div className="max-w-2xl mx-auto profile-container">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-baseline gap-2 mb-2">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
            </div>
            <p className="text-base text-slate-600">
              Update your personal information and manage your account preferences.
            </p>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3 success-banner">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">
                Your profile has been updated successfully.
              </p>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    This is the name displayed on your account.
                  </p>
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium cursor-not-allowed focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Your email address cannot be changed.</p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-2"></div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-slate-500">
                    Changes are saved to your account immediately.
                  </p>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:scale-100 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        Saved
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Info */}
            <div className="bg-slate-50 px-8 md:px-10 py-4 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  Your profile information is secure and encrypted. We never share your data with
                  third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Need to change your password?{' '}
              <a
                href="/settings/security"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Go to Security Settings
              </a>
            </p>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default ProfilePage;
