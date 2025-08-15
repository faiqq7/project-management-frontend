import React from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AdminRoute from "./components/common/AdminRoute";
import Home from "./components/common/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { InvoicesProvider } from "./context/InvoicesContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { TimeLogsProvider } from "./context/TimeLogsContext";
import Accounts from "./pages/Accounts";
import CompanySettings from "./pages/CompanySettings";
import Dashboard from "./pages/DashBoard";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import InvoiceHistory from "./pages/InvoiceHistory";
import Login from "./pages/Login";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectInvoices from "./pages/ProjectInvoices";
import ProjectLogs from "./pages/ProjectLogs";
import Projects from "./pages/Projects";
import Register from "./pages/Register";
import TimeLogs from "./pages/TimeLogs";
import Users from "./pages/Users";

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
