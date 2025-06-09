import React from "react";
import Navbar from "./Navbar";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function FacultyPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate('/'))
      .catch((error) => console.error('Sign out error:', error));
  };

  return (
    <div>
      <Navbar role="faculty" />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to the Faculty Dashboard</h2>
        <p>You can view or filter student internship data using the navbar above.</p>
        <button onClick={handleSignOut} style={{ marginTop: '20px' }}>Sign Out</button>
      </div>
    </div>
  );
}
