import PropTypes from "prop-types";
import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function AdminRoute({ children }) {
  const { userRole } = useContext(AuthContext);

  if (userRole !== "admin") {
    return (
      <div className="p-12 ml-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;

AdminRoute.propTypes = {
  children: PropTypes.node,
};
