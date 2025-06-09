import React from 'react';
import "./layout.css";
import { Link } from "react-router-dom";
import logo from "../assets/ssn-logo.jpg";

export default function Navbar({ role }) {
  return (
    <div className='Navbar'>
      <Link to={role === "faculty" ? "/faculty" : "/student"}>
        <img className='logoimg' src={logo} alt='SSN LOGO' />
      </Link>
      <div className='NavtextSection'>
        {role === "faculty" ? (
          <>
            <Link to="/faculty" className='Navtext'>Home</Link>
            <Link to="/view" className='Navtext'>View</Link>
            <Link to="/filter" className='Navtext'>Filter</Link>
          </>
        ) : (
          <>
            <Link to="/student" className='Navtext'>Home</Link>
            <Link to="/update" className='Navtext'>Update</Link>
            <Link to="/upload" className='Navtext'>Upload</Link>
          </>
        )}
      </div>
    </div>
  );
}
