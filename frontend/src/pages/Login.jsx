import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Layout, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-slate-700/50 relative overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-500/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent-500/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
            <Layout size={28} />
          </div>
          <h1 className="text-3xl font-bold font-heading gradient-text tracking-wide relative z-10">ArchMind</h1>
          <p className="text-slate-400">Welcome back to ArchMind</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="email"
                required
                className="w-full rounded-lg bg-dark-800/80 border border-slate-700/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:border-primary-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all duration-300"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="password"
                required
                className="w-full rounded-lg bg-dark-800/80 border border-slate-700/50 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:border-primary-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all duration-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600/90 py-3 mt-2 font-semibold text-white hover:bg-primary-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative z-10">{loading ? 'Logging in...' : 'Log in'}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 transition-all">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
