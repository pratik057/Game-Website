import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Open Logout Popup
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 shadow-lg rounded-2xl w-96 text-center bg-white">
            <h2 className="text-2xl font-semibold mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-between gap-4">
              <button 
                onClick={handleLogout} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Logout
              </button>
              <button 
                onClick={() => setShowPopup(false)} 
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutPage;
