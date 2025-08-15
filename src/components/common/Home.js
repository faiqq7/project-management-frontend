import React, { useState } from "react";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

function Home() {
  const [sidebarHovered, setSidebarHovered] = useState(false);

  return (
    <>
      <Navbar
        className={`transition-all duration-300 ${sidebarHovered ? "ml-56" : "ml-16"}`}
      />
      <div className="flex">
        <Sidebar
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
          sidebarHovered={sidebarHovered}
        />
      </div>
    </>
  );
}

export default Home;
