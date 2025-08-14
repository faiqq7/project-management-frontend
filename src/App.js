import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { TimeLogsProvider } from "./context/TimeLogsContext";
import { InvoicesProvider } from "./context/InvoicesContext";

import Home from "./components/Home";
import Dashboard from "./pages/DashBoard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import TimeLogs from "./pages/TimeLogs";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import ProjectLogs from "./pages/ProjectLogs";
import ProjectInvoices from "./pages/ProjectInvoices";
import InvoiceHistory from "./pages/InvoiceHistory";
import Accounts from "./pages/Accounts";
import CompanySettings from "./pages/CompanySettings";
import Users from "./pages/Users";
import AdminRoute from "./components/AdminRoute";

const PrivateLayout = () => (
  <>
    <Home />
    <Outlet />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <PrivateRoute>
                <ProjectsProvider>
                  <TimeLogsProvider>
                    <InvoicesProvider>
                      <PrivateLayout />
                    </InvoicesProvider>
                  </TimeLogsProvider>
                </ProjectsProvider>
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/time-logs" element={<TimeLogs />} />
            <Route path="/time-logs/:projectId" element={<ProjectLogs />} />
            <Route path="/invoices" element={<InvoiceGenerator />} />
            <Route
              path="/invoices/:invoiceId/history"
              element={<InvoiceHistory />}
            />
            <Route path="/invoices/:projectId" element={<ProjectInvoices />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route
              path="/company-settings"
              element={
                <AdminRoute>
                  <CompanySettings />
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
