import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./Pages/admin";


function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Users />} />
        </Routes>
    
    </Router>
  );
}

export default App;
