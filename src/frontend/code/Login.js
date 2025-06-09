import React from 'react';
import { auth, provider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email.endsWith('@gmail.com') && !/2210\d{3}@ssn\.edu\.in/.test(email)) {
        window.location.href = "/faculty";
      } else if (/2210\d{3}@ssn\.edu\.in/.test(email)) {
        window.location.href = "/student";
      } else {
        alert("Access Denied: Use your SSN Email");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome to SSN Portal</h2>
      <button onClick={handleLogin}>Sign in with SSN Email</button>
    </div>
  );
};

export default Login;
