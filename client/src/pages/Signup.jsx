import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Building, Landmark, ArrowRight, Shield } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    collegeName: '',
    collegeCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-900/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[30%] rounded-full bg-primary-800/20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg z-10 p-8 sm:p-10 relative border border-primary-800/30 bg-bg-card/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary-900/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
            Create an Account
          </h1>
          <p className="text-gray-400">Join TakeChance for scholarship opportunities</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 placeholder-gray-600"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 placeholder-gray-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield size={18} className="text-gray-500" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 appearance-none"
              >
                <option value="student">Student</option>
                <option value="collegeAdmin">College Admin</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
          </div>

          {(formData.role === 'student' || formData.role === 'collegeAdmin') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">College Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Landmark size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 placeholder-gray-600"
                    placeholder="University Name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">College Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="collegeCode"
                    required
                    value={formData.collegeCode}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-gray-100 placeholder-gray-600"
                    placeholder="e.g. UNI123"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
