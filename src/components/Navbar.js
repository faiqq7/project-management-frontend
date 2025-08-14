import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar({ className = "" }) {
  const { access, logout, username } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const firstLetter = username ? username.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`flex items-center justify-between px-8 py-4 bg-white shadow-md ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">ZenDev Co</Link>
        </div>
      </div>
      <div>
        {!access ? (
          <Link to="/login">
            <button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {firstLetter}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
