import React, { useState } from 'react';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', pass: '' });

  const handleSignup = (e) => {
    e.preventDefault();
    // In a hackathon, we simulate a successful account creation
    if (formData.email && formData.pass) onSignupSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans p-4">
      <div className="p-8 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tighter">JOIN SKYSENTRY</h1>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Create Operator Profile</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Work Email" required
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Create Access Key" required
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 transition"
            onChange={(e) => setFormData({...formData, pass: e.target.value})}
          />
          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
            CREATE ACCOUNT
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={onSwitchToLogin}
            className="text-blue-500 text-sm font-semibold hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;