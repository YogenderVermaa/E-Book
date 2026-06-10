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
  const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });
  const [formError, setFormError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '', general: '' });
    setFormError('');

    const clientErrors = {
      name: !formData.name ? 'Name is required.' : '',
      email: !formData.email ? 'Email is required.' : '',
      password: '',
      general: '',
    };

    if (!formData.password) {
      clientErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      clientErrors.password = 'Password must be at least 6 characters long.';
    }

    if (clientErrors.name || clientErrors.email || clientErrors.password) {
      setErrors(clientErrors);
      setFormError(
        clientErrors.name ||
          clientErrors.email ||
          clientErrors.password ||
          'Please fix the errors below.'
      );
      return;
    }

    setIsloading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      // console.log(response.data)
      const { token } = response.data.data;
      // console.log('Response:::::', response);

      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(profileResponse.data.data, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);

      const status = error.response?.status;
      const message =
        error.response?.data?.message || 'Unable to sign up right now. Please try again.';
      const normalized = message.toLowerCase();
      let displayMessage = message;

      if (status === 400 && normalized.includes('already exists')) {
        const existsMessage = message || 'User already exists with this email';
        setErrors({ name: '', email: existsMessage, password: '', general: '' });
        setFormError(existsMessage);
        displayMessage = existsMessage;
      } else if (normalized.includes('email required')) {
        setErrors({ name: '', email: 'Email is required.', password: '', general: '' });
        setFormError('Email is required');
        displayMessage = 'Email is required';
      } else if (normalized.includes('password required')) {
        setErrors({ name: '', email: '', password: 'Password is required.', general: '' });
        setFormError('Password is required');
        displayMessage = 'Password is required';
      } else if (
        normalized.includes('at least 6 characters') ||
        normalized.includes('shorter than the minimum')
      ) {
        setErrors({
          name: '',
          email: '',
          password: 'Password must be at least 6 characters long.',
          general: '',
        });
        setFormError('Password must be at least 6 characters long');
        displayMessage = 'Password must be at least 6 characters long';
      } else if (normalized.includes('all fileds are required')) {
        setErrors({
          name: !formData.name ? 'Name is required.' : '',
          email: !formData.email ? 'Email is required.' : '',
          password: !formData.password ? 'Password is required.' : '',
          general: '',
        });
        setFormError('Please fill in all required fields');
        displayMessage = 'Please fill in all required fields';
      } else {
        const fallback = 'Signup failed. Please check your details and try again.';
        setErrors({ name: '', email: '', password: '', general: fallback });
        setFormError(fallback);
        displayMessage = fallback;
      }

      toast.error(displayMessage);
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
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}

            <InputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
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
              error={errors.email}
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
              error={errors.password}
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
