import React, { useState } from "react";
import { FiHome, FiEdit, FiPlusSquare, FiLogOut } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../index.css'


const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Logout user
  const [logoutLoader, setLogoutLoader] = useState(false);
  const logoutUser = async () => {
    setLogoutLoader(true);
    try {
      const response = await fetch("/api/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        toast("Logged out");
        localStorage.removeItem("user");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setLogoutLoader(false);
    }
  };

  return (
    <div id='sidebar' className="h-screen w-20 bg-gray-800 text-white flex flex-col fixed left-0">
      {/* Logo at the top */}
      <div id="logo" className="p-4 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">P</h1>
      </div>

      {/* Navigation Icons */}
      <div id="nav-side" className="flex-1 flex flex-col items-center mt-6 space-y-8">
        <button onClick={()=>{navigate("/profile")}} className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center">
          <FiHome size={24} />
        </button>
        <button onClick={()=>{navigate("/chat")}}  className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center">
          <FiMessageCircle size={24} />
        </button>
        <button onClick={()=>{navigate("/edit")}} className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center">
          <FiEdit size={24} />
        </button>
        <button onClick={()=>{navigate("/add")}} className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center">
          <FiPlusSquare size={24} />
        </button>
        <button onClick={()=>{navigate("/bookmark")}} className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center">
          <FaBookmark size={24} />
        </button>
        
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 w-full my-2" id="border-div" />

      {/* Bottom Icon */}
      <div id="logout" className="flex items-center justify-center mb-4">
        <button
          className="p-3 hover:bg-gray-700 rounded-lg w-full flex justify-center"
          onClick={() => setShowModal(true)}
        >
          <FiLogOut size={24} />
        </button>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white relative rounded-lg p-6 shadow-lg w-80 text-gray-800">
            <h2 className="text-xl font-semibold mb-4">Logout</h2>
            <p className="text-gray-600 mb-6 z-50">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() =>logoutUser()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
