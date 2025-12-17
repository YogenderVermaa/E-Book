import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, Axis3D } from 'lucide-react';
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
      const { token } = response.data;
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(profileResponse.data, token);
      toast.success('login successfull');
      navigate('/dashboard');
    } catch (error) {
      localStorage.clear();
      toast.error(error.response?.data?.message || 'Login failed.Please try again');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="">
            <BookOpen className="" />
          </div>
          <h1 className="">Welcome back</h1>
          <p>Sign in to continue</p>
        </div>

        <div className="">
          <form onSubmit={handleSubmit} className="">
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
              placeholder="*********"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" isLoading={isLoading} className="">
              Sign In
            </Button>
          </form>
          <p>
            Don't have an account?{''}
            <Link to="/signup" className="">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
