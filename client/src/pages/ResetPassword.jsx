import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RouteSignIn } from '@/helpers/RouteName'

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/${token}`,
        { password }
      );
      setSuccess(res.data.message);
      // Redirect to login after 3 seconds using RouteSignIn constant
      setTimeout(() => navigate(RouteSignIn, { replace: true }), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200 px-4">
      <div className="backdrop-blur-lg bg-white/70 border border-white/30 shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 bg-purple-100 w-14 h-14 flex items-center justify-center rounded-full shadow-md">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Reset Your Password</h2>
          <p className="text-gray-600 text-sm mt-1">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-xl font-semibold transition duration-300 ${
              loading
                ? 'bg-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm flex items-center gap-2 justify-center">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-xl bg-green-100 text-green-700 text-sm flex items-center gap-2 justify-center">
            <CheckCircle2 size={18} />
            <span>{success} Redirecting to login...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
