import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar({ onMouseEnter, onMouseLeave, sidebarHovered }) {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-40 bg-white shadow-lg flex flex-col items-center py-6 transition-all duration-300 ${sidebarHovered ? "w-56" : "w-16"}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <ul className="space-y-4 w-full">
                <li>
                    <Link to="/dashboard" className="flex items-center px-4 py-2 group">
                        <svg className="w-6 h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
                        </svg>
                        <span className={`ml-4 text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Dashboard
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/projects" className="flex items-center px-4 py-2 group">
                        <svg className="w-6 h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v2m0 4H6a2 2 0 01-2-2v-5h16v5a2 2 0 01-2 2h-6zm6-10V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h8z" />
                        </svg>

                        <span className={`ml-4 text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Projects
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/time-logs" className="flex items-center px-4 py-2 group">
                        <svg className="w-6 h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <span className={`ml-4 text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Time Logs
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/invoices" className="flex items-center px-4 py-2 group">
                        <svg className="w-6 h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <path d="M8 8h8M8 12h8M8 16h4" />
                        </svg>
                        <span className={`ml-4 text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Invoices
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="flex items-center px-4 py-2 group">
                        <svg className="w-6 h-6 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4" />
                        </svg>
                        <span className={`ml-4 text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Profile
                        </span>
                    </Link>
                </li>
                <li>
                    <button className="flex items-center px-4 py-2 w-full text-left group" onClick={handleLogout}>
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                        <span className={`ml-4 text-lg text-red-500 whitespace-nowrap transition-all duration-300 ${sidebarHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"} group-hover:font-bold`}>
                            Logout
                        </span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;