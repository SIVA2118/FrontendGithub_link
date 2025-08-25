import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Users() {
  const { token, API_BASE, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || ''
  });

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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="card">Loading users...</div>;
  if (error) return <div className="card error">{error}</div>;

  return (
    <div className="card">
      <h2>Users</h2>

      {user && (
        <div className="current-user">
          <h3>Your Profile</h3>
          <div 
            className="user-item highlight" 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="avatar">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </div>
              <div>
                {editMode ? (
                  <>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                  </>
                ) : (
                  <>
                    <div className="name">{formData.firstName} {formData.lastName}</div>
                    <div className="muted">{formData.email} • {formData.mobileNumber}</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {editMode ? (
                <>
                  <button 
                    onClick={handleSave} 
                    style={{
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "0.3s"
                    }}
                    onMouseOver={e => e.target.style.background = "#45a049"}
                    onMouseOut={e => e.target.style.background = "#4CAF50"}
                  >
                    Save
                  </button>

                  <button 
                    onClick={() => setEditMode(false)} 
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "0.3s"
                    }}
                    onMouseOver={e => e.target.style.background = "#d32f2f"}
                    onMouseOut={e => e.target.style.background = "#f44336"}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setEditMode(true)} 
                  style={{
                    background: "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "0.3s"
                  }}
                  onMouseOver={e => e.target.style.background = "#1976D2"}
                  onMouseOut={e => e.target.style.background = "#2196F3"}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <hr />

      <h3>All Other Users</h3>
      <ul className="user-list">
        {users.map(u => (
          <li 
            key={u._id} 
            className="user-item" 
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
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
