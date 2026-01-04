import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Mail } from 'lucide-react';

import DashBoardLayout from '../components/layout/DashBoardLayout';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

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
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <DashBoardLayout activeMenu="profile">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-gray-500 mb-6">Manage your account details.</p>

        <div className="bg-white p-6 rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              disabled
            />

            <div>
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default ProfilePage;
