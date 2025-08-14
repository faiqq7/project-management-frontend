import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { access } = useContext(AuthContext);
  return access ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
