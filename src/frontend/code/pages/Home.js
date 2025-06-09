import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./home.css";

export default function Home() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get");
        const padded = padSubarrays(response.data.data.values)
        setElements(padded);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);




  function padSubarrays(arr) {
    return arr.map(sub => {
        if (sub.length === 3 || sub[3] === "No") {
            return [...sub.slice(0, 3), "No internship"];
        }
        return sub;
    });
}


  return (
    <div>
      <Navbar />
      <div>
        {elements.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                {elements[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {elements.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border">
                  {row.map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
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
