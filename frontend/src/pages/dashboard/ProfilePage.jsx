import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';

const ProfilePage = () => {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    targetRole: '',
    targetCompany: '',
    experienceLevel: '',
    preferredLanguage: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        targetRole: user.targetRole || '',
        targetCompany: user.targetCompany || '',
        experienceLevel: user.experienceLevel || '',
        preferredLanguage: user.preferredLanguage || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>
        
        {error && <div className="mb-4 p-4 text-red-700 bg-red-50 rounded-md">{error}</div>}
        {successMsg && <div className="mb-4 p-4 text-green-700 bg-green-50 rounded-md">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Target Role</label>
            <input
              type="text"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Target Company</label>
            <input
              type="text"
              name="targetCompany"
              value={formData.targetCompany}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Experience Level</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
            >
              <option value="">Select Level</option>
              <option value="JUNIOR">Junior (0-2 years)</option>
              <option value="MID">Mid-Level (3-5 years)</option>
              <option value="SENIOR">Senior (5+ years)</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

