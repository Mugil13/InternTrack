import { useState } from "react";
import "./upload.css";
import Navbar from "./Navbar";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setExtractedData(data);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async () => {
    if (!file) return alert("Upload a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/verify", formData);
      alert(res.data.message);
    } catch {
      alert("Verification failed");
    }
  };

  return (
    <div>
      <Navbar role="student" />
      <div className="upload-container">
        <h2>Upload Permission Form</h2>
        <label className="upload-button">
          Choose File
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
        </label>
        {file && <p className="file-name">{file.name}</p>}
        <button onClick={handleUpload} disabled={uploading} className="upload-button">
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {extractedData && (
          <div className="extracted-data">
            <h3>Extracted Information</h3>
            <table className="display-table">
              <thead>
                <tr><th>Field</th><th>Value</th></tr>
              </thead>
              <tbody>
                {Object.entries(extractedData).map(([key, val]) => (
                  <tr key={key}><td>{key}</td><td>{String(val)}</td></tr>
                ))}
              </tbody>
            </table>
            <button className="upload-drive-button" onClick={handleVerify}>Upload to Drive</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
