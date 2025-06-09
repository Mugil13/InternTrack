import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./filtered.css";

export default function FilteredPage() {
  const [elements, setElements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    company: "",
    placementType: "",
    researchIndustry: "",
    location: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getall");
        const padded = padArraysToLength(response.data.data.values);
        setElements(padded);
        setFiltered(padded);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  function padArraysToLength(arrays, targetLength = 15) {
    return arrays.map(arr => arr.concat(Array(targetLength - arr.length).fill("")));
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const [headers, ...rows] = elements;

    const filteredRows = rows.filter(row => {
      const company = row[10];
      const placement = row[11];
      const research = row[13];
      const location = row[14];

      return (
        (filters.company === "" || company.toLowerCase().includes(filters.company.toLowerCase())) &&
        (filters.placementType === "" || placement === filters.placementType) &&
        (filters.researchIndustry === "" || research === filters.researchIndustry) &&
        (filters.location === "" || location === filters.location)
      );
    });

    setFiltered([headers, ...filteredRows]);
  };

  return (
    <div>
      <Navbar role="faculty" />
      <div className="filter-section">
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={filters.company}
          onChange={handleFilterChange}
        />
        <select name="placementType" value={filters.placementType} onChange={handleFilterChange}>
          <option value="">Placement Type</option>
          <option value="College">College</option>
          <option value="Outside">Outside</option>
        </select>
        <select name="researchIndustry" value={filters.researchIndustry} onChange={handleFilterChange}>
          <option value="">Research/Industry</option>
          <option value="Research">Research</option>
          <option value="Industry">Industry</option>
        </select>
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">India/Abroad</option>
          <option value="India">India</option>
          <option value="Abroad">Abroad</option>
        </select>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div>
        {filtered.length > 0 ? (
          <table className="table">
            <thead>
              <tr>{filtered[0].map((head, i) => <th key={i}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.slice(1).map((row, i) => (
                <tr key={i}>{row.map((val, j) => <td key={j}>{val}</td>)}</tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}
