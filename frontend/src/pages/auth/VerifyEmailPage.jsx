import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, isLoading, error } = useAuthStore();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmail(email, code);
      setSuccess(true);
    } catch (err) {
      // Error handled by store
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-10 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your account is now active. You can sign in to access your dashboard.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full flex justify-center py-2">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            We've sent a 6-digit verification code to <strong>{email}</strong>.
            Please check your inbox and spam folder.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              6-Digit Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-[0.5em] font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-3"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

