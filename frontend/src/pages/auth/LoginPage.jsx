import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      if (err.message === "EMAIL_NOT_VERIFIED" || err.response?.data?.message === "EMAIL_NOT_VERIFIED") {
        navigate('/verify-email', { state: { email } });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fbf9f6] dark:bg-[#0c0d0f] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#131418] p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-stone-300 dark:border-stone-700 placeholder-stone-400 bg-white dark:bg-[#101114] text-stone-900 dark:text-white rounded-t-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-stone-300 dark:border-stone-700 placeholder-stone-400 bg-white dark:bg-[#101114] text-stone-900 dark:text-white rounded-b-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full flex justify-center py-2.5 px-4 font-bold"
              disabled={isLoading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">
            Or <Link to="/register" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold">register for a new account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

