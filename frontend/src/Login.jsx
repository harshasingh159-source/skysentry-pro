import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For Hackathon: Any login works, or check for "admin"
    if (email && password) {
      onLoginSuccess();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.logo}>SKYSENTRY <span style={styles.ai}>AI</span></h1>
          <p style={styles.subtitle}>Environmental Intelligence Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>OPERATOR EMAIL</label>
            <input 
              type="email" 
              style={styles.input} 
              placeholder="operator@skysentry.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>ACCESS KEY</label>
            <input 
              type="password" 
              style={styles.input} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            INITIALIZE SESSION
          </button>
          <div className="mt-6 text-center">
  <button 
  type="button"
  onClick={onSwitchToSignup}
  className="mt-4 text-blue-500 text-xs font-bold hover:underline"
>
  NEW OPERATOR? CREATE ACCOUNT
</button>
</div>
        </form>
        
        <p style={styles.footer}>Restricted Access: Bagmati Province Network</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  loginCard: {
    background: 'rgba(30, 41, 59, 0.7)',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  logo: {
    color: '#fff',
    letterSpacing: '4px',
    fontSize: '1.5rem',
    margin: '0 0 5px 0',
  },
  ai: {
    color: '#38bdf8',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '30px',
  },
  inputGroup: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#38bdf8',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    marginLeft: '5px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '12px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#38bdf8',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s',
  },
  footer: {
    color: '#475569',
    fontSize: '0.7rem',
    marginTop: '30px',
  }
};

export default Login;