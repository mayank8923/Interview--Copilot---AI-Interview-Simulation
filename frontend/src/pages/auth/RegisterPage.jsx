import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profiling state
  const [educationLevel, setEducationLevel] = useState('GRADUATE'); // GRADUATE, UNDERGRADUATE
  const [experienceLevel, setExperienceLevel] = useState('FRESHER'); // FRESHER, EXPERIENCED
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [branch, setBranch] = useState('');

  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name,
      email,
      password,
      educationLevel,
      ...(educationLevel === 'GRADUATE' ? {
        experienceLevel,
        yearsOfExperience: experienceLevel === 'EXPERIENCED' ? parseInt(yearsOfExperience) : null
      } : {
        currentYear,
        branch
      })
    };

    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Tell us about your background so the AI can tailor your interviews.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="border-t border-slate-200 pt-4 mt-6">
              <label className="block text-sm font-bold text-slate-900 mb-2">Education Level</label>
              <div className="flex gap-4">
                <label className="flex items-center text-sm">
                  <input type="radio" className="mr-2" checked={educationLevel === 'GRADUATE'} onChange={() => setEducationLevel('GRADUATE')} />
                  Graduate
                </label>
                <label className="flex items-center text-sm">
                  <input type="radio" className="mr-2" checked={educationLevel === 'UNDERGRADUATE'} onChange={() => setEducationLevel('UNDERGRADUATE')} />
                  Undergraduate
                </label>
              </div>
            </div>

            {/* Conditional Fields for GRADUATE */}
            {educationLevel === 'GRADUATE' && (
              <div className="bg-slate-50 p-4 rounded-md space-y-4 border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm">
                      <input type="radio" className="mr-2" checked={experienceLevel === 'FRESHER'} onChange={() => setExperienceLevel('FRESHER')} />
                      Fresher (0 years)
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="radio" className="mr-2" checked={experienceLevel === 'EXPERIENCED'} onChange={() => setExperienceLevel('EXPERIENCED')} />
                      Experienced
                    </label>
                  </div>
                </div>

                {experienceLevel === 'EXPERIENCED' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Conditional Fields for UNDERGRADUATE */}
            {educationLevel === 'UNDERGRADUATE' && (
              <div className="bg-slate-50 p-4 rounded-md space-y-4 border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Year</label>
                  <select
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    required
                  >
                    <option value="">Select Year...</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
              </div>
            )}

          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full flex justify-center py-2 px-4"
              disabled={isLoading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
