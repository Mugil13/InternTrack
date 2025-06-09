import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import axios from 'axios';
import "./view.css";

export default function View() {
  const [registerNumber, setRegisterNumber] = useState('');
  const [person, setPerson] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/getall")
      .then(res => setPerson(res.data.data.values))
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = person.find(i => i[1] === registerNumber);
    setPerson(match || []);
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar role="faculty" />
      {!submitted ? (
        <div className="container">
          <h2>Enter Details</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Register Number" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} required className="input-field" />
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      ) : (
        <div className="display">
          {person.length ? (
            <div className="table-container">
              <h2>Internship Details</h2>
              <table className="display-table">
                <tbody>
                  <tr><td>Name</td><td>{person[2]}</td></tr>
                  <tr><td>Title</td><td>{person[3]}</td></tr>
                  <tr><td>Mobile No.</td><td>{person[4]}</td></tr>
                  <tr><td>Company</td><td>{person[10]}</td></tr>
                  <tr><td>Placement through</td><td>{person[11]}</td></tr>
                  <tr><td>Stipend</td><td>{person[12]}</td></tr>
                  <tr><td>Research/Industry</td><td>{person[13]}</td></tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-internship">No internship found</p>
          )}
        </div>
      )}
    </div>
  );
}
