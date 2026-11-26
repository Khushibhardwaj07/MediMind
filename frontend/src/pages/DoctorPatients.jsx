// Doctor page: the patients who have given this doctor access.
import useApiGet from '../hooks/useApiGet.js';

export default function DoctorPatients() {
  const { data, error, loading } = useApiGet('/doctor/patients');
  const patients = (data && data.patients) || [];

  return (
    <>
      <h1>My patients</h1>
      <p>These patients have given you access.</p>

      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && patients.length === 0 && (
        <p className="muted">No patient has given you access yet.</p>
      )}

      {patients.map((patient) => (
        <div className="person" key={patient.id}>
          <div>
            <strong>{patient.fullName}</strong>
            <br />
            <span className="muted">{patient.email}</span>
          </div>
        </div>
      ))}
    </>
  );
}