// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Users from "./Pages/admin";


// function App() {
//   return (
//     <Router>
      
//         <Routes>
//           <Route path="/" element={<Users />} />
//         </Routes>
    
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";

import AdminDashboard from "./pages/admin";

// Authentication check function
const isAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}

export default App;
