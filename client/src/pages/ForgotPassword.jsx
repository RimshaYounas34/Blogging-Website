import React, { useState } from 'react';
import axios from 'axios';
import { MailCheck, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-200">
      <div className="backdrop-blur-lg bg-white/70 border border-white/30 shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full shadow-md">
            <MailCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">Forgot Your Password?</h2>
          <p className="text-gray-600 text-sm mt-1">
            Enter your email address and we’ll send you a reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:brightness-110 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 justify-center ${
              error
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {error ? <AlertCircle size={18} /> : <MailCheck size={18} />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
