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
      toast.error(error.response?.data?.message || 'Signup failed.Please try again');
    } finally {
      setIsloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="">
        <div className="">
          <div className="">
            <BookOpen className="" />
          </div>
          <h1 className="">Create an Account</h1>
          <p className="">Start your journey of creating amazing eBooks today.</p>
        </div>
        <div className="">
          <form onSubmit={handleSubmit} className="">
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
            <Button type="submit" isLoading={isLoading} className="">
              Create Account
            </Button>
          </form>
          <p className="">
            Already have an account?{' '}
            <Link to="/login" className="">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
