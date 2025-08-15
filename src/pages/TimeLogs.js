import {
  Button,
  Card,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeEntryForm from "../components/forms/TimeEntryForm";
import { AuthContext } from "../context/AuthContext";
import { useInvoices } from "../context/InvoicesContext";
import { useProjects } from "../context/ProjectsContext";
import { useTimeLogs } from "../context/TimeLogsContext";

export default function TimeLogs() {
  const { addTimeLog, timeLogs } = useTimeLogs();
  const { projects } = useProjects();
  const { invoices, addInvoice, updateInvoice } = useInvoices();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const { fetchWithAuth } = useContext(AuthContext);
  const [weekStart, setWeekStart] = useState("");
  const [weekRows, setWeekRows] = useState([]); // [{date,hours,description,holiday_type,holiday_reason}]

  const handleAddLogClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleLogSubmit = async (log) => {
    try {
      // The log object from TimeEntryForm will have different shapes
      // We construct the payload for the backend here.
      const payload = {
        ...log,
        project_id: selectedProject.id,
        hours: log.hours ? parseFloat(log.hours) : null, // Handle null hours for Fixed projects
      };

      // Remove status field as it's not part of the TimeLog model
      delete payload.status;

      await addTimeLog(payload);

      // --- Existing Invoice Logic ---
      // This can be refactored later if needed.
      const project = selectedProject;
      const logDate = log.date;
      if (project.billing === "hourly") {
        // Daily invoice for this project and date
        const dailyInvoices = invoices.filter(
          (inv) => inv.projectId === project.id && inv.date === logDate,
        );
        const logsForDay = [
          ...timeLogs,
          { ...log, project: project.name },
        ].filter((l) => l.project === project.name && l.date === logDate);
        const totalHours = logsForDay.reduce(
          (sum, l) => sum + Number(l.hours),
          0,
        );
        const amount = totalHours * Number(project.rate);
        if (dailyInvoices.length > 0) {
          // Update existing invoice
          updateInvoice(dailyInvoices[0].id, {
            amount,
            logs: logsForDay,
          });
        } else {
          // Create new invoice (backend expects only allowed fields)
          addInvoice({
            project: project.id,
            status: "Pending",
            note: "",
            amount: amount, // send calculated amount
          });
        }
      } else if (project.billing === "fixed") {
        const fixedInvoice = invoices.find(
          (inv) => inv.projectId === project.id && inv.type === "Fixed",
        );
        if (!fixedInvoice) {
          addInvoice({
            project: project.id,
            status: "Pending",
            note: log.description || "",
            amount: Number(project.price), // send fixed price
          });
        }
      } else if (project.billing === "yearly") {
        const logMonth = logDate ? logDate.slice(0, 7) : "";
        const invoiceExists = invoices.some(
          (inv) =>
            inv.projectId === project.id &&
            inv.type === "Yearly" &&
            inv.period === logMonth,
        );
        const is30th = logDate && logDate.endsWith("-30");
        if (!invoiceExists && is30th) {
          addInvoice({
            project: project.id,
            status: "Pending",
            note: "",
            amount: Number(project.price), // send yearly price
          });
        }
      }
      // --- End of Invoice Logic ---

      setShowModal(false);
      setSelectedProject(null);
    } catch (err) {
      alert("Failed to add time log.");
    }
  };

  const handleViewLogs = (projectId) => {
    navigate(`/time-logs/${projectId}`);
  };

  const buildWeek = () => {
    if (!weekStart) return;
    const start = new Date(weekStart);
    const rows = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      return {
        date: iso,
        hours: "",
        description: "",
        holiday_type: "",
        holiday_reason: "",
      };
    });
    setWeekRows(rows);
  };

  const submitWeek = async (projectId) => {
    if (!weekRows.length) return;
    const payload = {
      project_id: projectId,
      start_date: weekStart,
      days: weekRows.map((r) => ({
        date: r.date,
        hours: r.holiday_type ? 0 : Number(r.hours || 0),
        description: r.description,
        holiday_type: r.holiday_type || null,
        holiday_reason: r.holiday_type ? r.holiday_reason || "" : null,
      })),
    };
    const res = await fetchWithAuth("/api/v1/timelogs/bulk-create-week/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Week logs submitted");
      setWeekRows([]);
      setWeekStart("");
    } else {
      const err = await res.json().catch(() => ({}));
      alert("Failed: " + (err.error || res.status));
    }
  };

  return (
    <div className="p-12 ml-8">
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Time Logs</Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Billing</TableCell>
              <TableCell align="right">Rate/Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(projects)
              ? projects.map((project) => {
                  const hasFixedLog =
                    project.billing === "fixed" &&
                    timeLogs.some((log) => log.project === project.id);
                  return (
                    <TableRow key={project.id} hover>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.client_name}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {project.billing}
                      </TableCell>
                      <TableCell align="right">
                        {project.billing === "hourly"
                          ? `$${project.rate}/hr`
                          : project.price
                            ? `$${project.price}`
                            : "-"}
                      </TableCell>
                      <TableCell>
                        {project.billing !== "yearly" &&
                          !(project.billing === "fixed" && hasFixedLog) && (
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleAddLogClick(project)}
                            >
                              Add Log
                            </Button>
                          )}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => setSelectedProject(project)}
                        >
                          Week Entry
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleViewLogs(project.id)}
                        >
                          View Logs
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Unified Modal for All Project Types */}
      {(showModal || selectedProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-4xl md:max-w-3xl relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => {
                setShowModal(false);
                setSelectedProject(null);
                setWeekRows([]);
              }}
            >
              &times;
            </button>
            {!weekRows.length ? (
              <>
                <h3 className="text-lg font-bold mb-4">
                  Week Entry for {selectedProject?.name}
                </h3>
                <Stack
                  spacing={2}
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ md: "flex-end" }}
                >
                  <TextField
                    fullWidth
                    type="date"
                    label="Week Start (Mon)"
                    InputLabelProps={{ shrink: true }}
                    value={weekStart}
                    onChange={(e) => setWeekStart(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={buildWeek}
                    disabled={!weekStart}
                  >
                    Build Week
                  </Button>
                </Stack>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Or switch to single day entry:
                </Typography>
                <TimeEntryForm
                  onSubmit={handleLogSubmit}
                  billing={selectedProject?.billing}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Enter Week Hours</h3>
                <Grid container spacing={2}>
                  {weekRows.map((r, idx) => (
                    <Grid item xs={12} md={6} key={r.date}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Stack
                          direction={{ xs: "column", lg: "row" }}
                          spacing={1.5}
                          alignItems={{ lg: "center" }}
                          sx={{ flexWrap: "wrap" }}
                        >
                          <TextField
                            label="Date"
                            value={r.date}
                            size="small"
                            disabled
                            sx={{ minWidth: 160 }}
                          />
                          <TextField
                            label="Hours"
                            size="small"
                            type="number"
                            value={r.hours}
                            onChange={(e) =>
                              setWeekRows((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, hours: e.target.value }
                                    : x,
                                ),
                              )
                            }
                            sx={{ width: 120 }}
                          />
                          <TextField
                            label="Description"
                            size="small"
                            value={r.description}
                            onChange={(e) =>
                              setWeekRows((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, description: e.target.value }
                                    : x,
                                ),
                              )
                            }
                            sx={{ flex: 1, minWidth: 220 }}
                          />
                          <TextField
                            label="Holiday"
                            size="small"
                            select
                            value={r.holiday_type}
                            onChange={(e) =>
                              setWeekRows((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, holiday_type: e.target.value }
                                    : x,
                                ),
                              )
                            }
                            sx={{ minWidth: 160 }}
                          >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="client">Client</MenuItem>
                            <MenuItem value="internal">Internal</MenuItem>
                          </TextField>
                          <TextField
                            label="Reason"
                            size="small"
                            value={r.holiday_reason}
                            onChange={(e) =>
                              setWeekRows((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, holiday_reason: e.target.value }
                                    : x,
                                ),
                              )
                            }
                            sx={{ minWidth: 220 }}
                            disabled={!r.holiday_type}
                          />
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => submitWeek(selectedProject.id)}
                  >
                    Submit Week
                  </Button>
                  <Button variant="text" onClick={() => setWeekRows([])}>
                    Reset
                  </Button>
                </Stack>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
