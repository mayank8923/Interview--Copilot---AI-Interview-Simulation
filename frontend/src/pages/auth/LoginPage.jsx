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
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 transition-colors">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              className="w-full flex justify-center py-2 px-4"
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Or <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">register for a new account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

