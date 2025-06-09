import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import FacultyPage from "./pages/FacultyPage";
import StudentPage from "./pages/StudentPage";
import Update from "./pages/Update";
import Upload from "./pages/Upload";
import View from "./pages/View";
import FilteredPage from "./pages/FilteredPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/update" element={<Update />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/view" element={<View />} />
        <Route path="/filter" element={<FilteredPage />} />
      </Routes>
    </Router>
  );
}

export default App;
