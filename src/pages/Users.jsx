import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Users() {
  const { token, API_BASE, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/others`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_BASE, token]);

  if (loading) return <div className="card">Loading users...</div>;
  if (error) return <div className="card error">{error}</div>;

  return (
    <div className="card">
      <h2>Users</h2>

      
      {user && (
        <div className="current-user">
          <h3>Your Profile</h3>
          <div className="user-item highlight">
            <div className="avatar">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <div className="name">{user.firstName} {user.lastName}</div>
              <div className="muted">{user.email} • {user.mobileNumber}</div>
            </div>
          </div>
        </div>
      )}

      <hr />

     
      <h3>All Other Users</h3>
      <ul className="user-list">
        {users.map(u => (
          <li key={u._id} className="user-item">
            <div className="avatar">{u.firstName[0]}{u.lastName[0]}</div>
            <div>
              <div className="name">{u.firstName} {u.lastName}</div>
              <div className="muted">{u.email} • {u.mobileNumber}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
