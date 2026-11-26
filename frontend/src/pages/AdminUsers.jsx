// Admin page: all accounts. (Changing roles on screen can come later.)
import useApiGet from '../hooks/useApiGet.js';

export default function AdminUsers() {
  const { data, error, loading } = useApiGet('/admin/users?limit=100');
  const users = (data && data.users) || [];

  return (
    <>
      <h1>Users</h1>

      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {users.map((account) => (
        <div className="person" key={account.id}>
          <div>
            <strong>{account.fullName}</strong>
            <br />
            <span className="muted">{account.email}</span>
            <br />
            <span className="muted">
              Joined {new Date(account.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="badge">{account.role}</span>
        </div>
      ))}
    </>
  );
}