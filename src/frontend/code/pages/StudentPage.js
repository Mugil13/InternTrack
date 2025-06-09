import React from 'react';
import Navbar from './Navbar';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function StudentPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate('/'))
      .catch((error) => console.error('Sign out error:', error));
  };

  return (
    <div>
      <Navbar role="student" />
      <div className="student-home-content" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to the Student Dashboard</h2>
        <p>You can update your internship details or upload your permission form using the navbar above.</p>
        <button onClick={handleSignOut} style={{ marginTop: '20px' }}>Sign Out</button>
      </div>
    </div>
  );
}
