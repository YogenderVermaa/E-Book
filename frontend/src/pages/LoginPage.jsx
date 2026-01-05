import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance.js';
import { API_PATHS } from '../utils/apiPath';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      const { token } = response.data.data;
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(profileResponse.data, token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || 'Login failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to continue your eBook journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@gmail.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-200"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
