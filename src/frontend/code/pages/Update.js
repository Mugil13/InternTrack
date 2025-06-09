import React, { useState } from 'react';
import Navbar from "./Navbar";
import axios from 'axios';

export default function Update() {
  const [formData, setFormData] = useState({
    registerNumber: '', name: '', title: '', mobileNo: '',
    startDate: '', endDate: '', companyName: '', placementType: '',
    stipend: '', researchIndustry: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/update", formData);
      if (res.data.message === "yes") {
        alert("Yes: Internship details updated successfully");
      } else {
        alert("No: Failed to update details");
      }
    } catch (error) {
      console.error(error);
      alert("No: Something went wrong");
    }
  };
  
  return (
    <div>
      <Navbar role="student" />
      <div className="container">
        <h2>Update Internship Details</h2>
        <form onSubmit={handleSubmit} className="form">
          {Object.entries(formData).map(([key, value]) => (
            key !== "placementType" && key !== "researchIndustry" ? (
              <div className="form-group" key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={key.toLowerCase().includes("date") ? "date" : key === "stipend" ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : null
          ))}
          <div className="form-group">
            <label>Placement thru college / outside</label>
            <select name="placementType" value={formData.placementType} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="College">College</option>
              <option value="Outside">Outside</option>
            </select>
          </div>
          <div className="form-group">
            <label>Research / Industry</label>
            <select name="researchIndustry" value={formData.researchIndustry} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Research">Research</option>
              <option value="Industry">Industry</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}