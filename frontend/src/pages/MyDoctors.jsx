// Patient page: choose which doctors can see your information.
import { useState } from 'react';
import { apiRequest, describeError } from '../api/client.js';
import useApiGet from '../hooks/useApiGet.js';

export default function MyDoctors() {
  const { data, error, loading, reload } = useApiGet('/access');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const handleGrant = async (event) => {
    event.preventDefault();
    setFormError('');
    setMessage('');
    setBusy(true);
    try {
      const result = await apiRequest('/access', {
        method: 'POST',
        body: { doctorEmail: email.trim() },
      });
      setMessage(`${result.doctor.fullName} can now see your information.`);
      setEmail('');
      await reload();
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (doctor) => {
    if (!window.confirm(`Stop ${doctor.fullName} from seeing your information?`)) return;
    setFormError('');
    setMessage('');
    try {
      await apiRequest(`/access/${doctor.id}`, { method: 'DELETE' });
      await reload();
    } catch (err) {
      setFormError(describeError(err));
    }
  };

  const doctors = (data && data.doctors) || [];

  return (
    <>
      <h1>My doctors</h1>
      <p>Only the doctors listed here can see your information.</p>

      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && doctors.length === 0 && (
        <p className="muted">No doctor has access yet.</p>
      )}

      {doctors.map((doctor) => (
        <div className="person" key={doctor.id}>
          <div>
            <strong>{doctor.fullName}</strong>
            <br />
            <span className="muted">{doctor.email}</span>
          </div>
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={() => handleRemove(doctor)}
          >
            Remove
          </button>
        </div>
      ))}

      <form className="card" onSubmit={handleGrant}>
        <h2>Give a doctor access</h2>
        {formError && (
          <p className="alert alert-error" role="alert">
            {formError}
          </p>
        )}
        {message && <p className="alert alert-success">{message}</p>}

        <label htmlFor="doctorEmail">Doctor's email</label>
        <input
          id="doctorEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Adding...' : 'Give access'}
        </button>
      </form>
    </>
  );
}