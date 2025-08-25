import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="card center">
      <h1>Welcome, {user?.firstName}!</h1>
      <p>You are logged in. Use the Users page to see other users.</p>
    </div>
  );
}
