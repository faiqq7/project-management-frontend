import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";




function Dashboard() {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { username } = useContext(AuthContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : "Good evening";

  return (
    <>

      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarHovered ? "ml-56" : "ml-16"}`}>
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-4xl font-bold text-center">
            {greeting} {username} !
          </h2>
        </div>
      </div>

    </>
  );
}

export default Dashboard;