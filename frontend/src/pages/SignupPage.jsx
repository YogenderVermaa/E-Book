import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../utils/apiPath';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsloading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      const { token } = response.data.data;
      console.log('Response:::::', response);

      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(profileResponse.data.data, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again');
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Start your journey of creating amazing eBooks today.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@email.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="******"
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
