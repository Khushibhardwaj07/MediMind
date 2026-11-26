import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { describeError } from '../api/client.js';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      // On success, PublicOnlyRoute sees the user and moves us to the app.
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="brand-large">MediMind</h1>
      <p className="subtitle">Understand your medical reports in simple words.</p>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Log in</h2>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>

        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>

        <p className="switch-text">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>

      <p className="disclaimer">
        MediMind does not diagnose and is not medical advice. Always talk to your doctor.
      </p>
    </div>
  );
}