import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { useInvoices } from "../context/InvoicesContext";
import { useProjects } from "../context/ProjectsContext";

// Minimal MUI import (assumes MUI installed)

export default function InvoiceGenerator() {
  const { invoices, refreshInvoices, removeInvoice } = useInvoices();
  const { projects } = useProjects();
  const { fetchWithAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "",
    project: "",
    start: "",
    end: "",
    sort: "",
  });
  const [genProject, setGenProject] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkDescription, setBulkDescription] = useState("");
  const [bulkPayment, setBulkPayment] = useState({
    method: "",
    reference: "",
    conversion_rate: "",
    gross_amount: "",
    fee_amount: "",
    net_amount: "",
  });

  // Get unique project IDs with at least one invoice
  // const projectIdsWithInvoices = Array.from(new Set(invoices.map((inv) => inv.project)));
  // const projectsArray = Array.isArray(projects) ? projects : [];

  const fetchFiltered = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.project) params.append("project", filters.project);
    if (filters.start) params.append("start", filters.start);
    if (filters.end) params.append("end", filters.end);
    if (filters.sort) params.append("sort", filters.sort);
    await refreshInvoices(params.toString() ? `?${params.toString()}` : "");
  };

  const appliedFiltersKey = `${filters.status}|${filters.project}|${filters.start}|${filters.end}|${filters.sort}`;
  useEffect(() => {
    fetchFiltered();
  }, [appliedFiltersKey]);

  const generateInvoice = async () => {
    if (!genProject) return;
    const res = await fetchWithAuth("/api/v1/invoices/generate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: Number(genProject),
        period_start: periodStart || null,
        period_end: periodEnd || null,
        group_by: groupBy,
      }),
    });
    if (res.ok) {
      await fetchFiltered();
    } else {
      alert("Failed to generate invoice");
    }
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(invoices.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const applyBulkUpdate = async () => {
    if (!selectedIds.length) {
      alert("Select at least one invoice");
      return;
    }
    if (!bulkStatus) {
      alert("Choose a status");
      return;
    }
    const res = await fetchWithAuth("/api/v1/invoices/bulk-status/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: selectedIds,
        status: bulkStatus,
        description: bulkDescription,
        payment:
          bulkStatus === "paid" || bulkStatus === "cleared"
            ? normalizePayment(bulkPayment)
            : undefined,
      }),
    });
    if (res.ok) {
      setSelectedIds([]);
      setBulkStatus("");
      setBulkDescription("");
      setBulkPayment({
        method: "",
        reference: "",
        conversion_rate: "",
        gross_amount: "",
        fee_amount: "",
        net_amount: "",
      });
      await fetchFiltered();
    } else {
      alert("Bulk update failed");
    }
  };

  const normalizePayment = (p) => ({
    method: p.method || undefined,
    reference: p.reference || undefined,
    conversion_rate: p.conversion_rate ? Number(p.conversion_rate) : undefined,
    gross_amount: p.gross_amount ? Number(p.gross_amount) : undefined,
    fee_amount: p.fee_amount ? Number(p.fee_amount) : undefined,
    net_amount: p.net_amount ? Number(p.net_amount) : undefined,
  });

  return (
    <div className="p-12 ml-8">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Invoices
      </Typography>

      {/* Generate section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Generate Invoice
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Project"
                value={genProject}
                onChange={(e) => setGenProject(e.target.value)}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                label="Period Start"
                InputLabelProps={{ shrink: true }}
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                label="Period End"
                InputLabelProps={{ shrink: true }}
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Group By"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={1} display="flex" alignItems="center">
              <Button variant="contained" onClick={generateInvoice}>
                Generate
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Status"
                helperText="Default shows Draft, Sent, Overdue"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="cleared">Cleared</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Project"
                value={filters.project}
                onChange={(e) =>
                  setFilters({ ...filters, project: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                fullWidth
                label="Start"
                InputLabelProps={{ shrink: true }}
                value={filters.start}
                onChange={(e) =>
                  setFilters({ ...filters, start: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                fullWidth
                label="End"
                InputLabelProps={{ shrink: true }}
                value={filters.end}
                onChange={(e) =>
                  setFilters({ ...filters, end: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Sort"
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="due_date">Due date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="created_at">Created</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={1} display="flex" alignItems="center">
              <Button variant="outlined" onClick={fetchFiltered}>
                Apply
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
          >
            <Typography variant="subtitle1">Bulk update selected</Typography>
            <TextField
              select
              label="Status"
              size="small"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="cleared">Cleared</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
            </TextField>
            <TextField
              label="Description"
              size="small"
              value={bulkDescription}
              onChange={(e) => setBulkDescription(e.target.value)}
              sx={{ minWidth: 240 }}
            />
            {(bulkStatus === "paid" || bulkStatus === "cleared") && (
              <>
                <TextField
                  select
                  size="small"
                  label="Payment Method"
                  value={bulkPayment.method}
                  onChange={(e) =>
                    setBulkPayment({ ...bulkPayment, method: e.target.value })
                  }
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="upwork">Upwork</MenuItem>
                  <MenuItem value="wise">Wise</MenuItem>
                  <MenuItem value="ifast">iFAST</MenuItem>
                  <MenuItem value="pkr_account">PKR Account</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label="Reference"
                  value={bulkPayment.reference}
                  onChange={(e) =>
                    setBulkPayment({
                      ...bulkPayment,
                      reference: e.target.value,
                    })
                  }
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Conversion Rate"
                  value={bulkPayment.conversion_rate}
                  onChange={(e) =>
                    setBulkPayment({
                      ...bulkPayment,
                      conversion_rate: e.target.value,
                    })
                  }
                  sx={{ width: 150 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Gross"
                  value={bulkPayment.gross_amount}
                  onChange={(e) =>
                    setBulkPayment({
                      ...bulkPayment,
                      gross_amount: e.target.value,
                    })
                  }
                  sx={{ width: 120 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Fee"
                  value={bulkPayment.fee_amount}
                  onChange={(e) =>
                    setBulkPayment({
                      ...bulkPayment,
                      fee_amount: e.target.value,
                    })
                  }
                  sx={{ width: 120 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Net"
                  value={bulkPayment.net_amount}
                  onChange={(e) =>
                    setBulkPayment({
                      ...bulkPayment,
                      net_amount: e.target.value,
                    })
                  }
                  sx={{ width: 120 }}
                />
              </>
            )}
            <Button variant="contained" onClick={applyBulkUpdate}>
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                if (!selectedIds.length) {
                  alert("Select at least one invoice");
                  return;
                }
                const res = await fetchWithAuth(
                  `/api/v1/invoices/bulk_download?ids=${selectedIds.join(",")}`,
                  { method: "GET" },
                );
                if (res.ok) {
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "invoices.zip";
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                } else {
                  alert("Failed to download ZIP");
                }
              }}
            >
              Download ZIP
            </Button>
            <Typography variant="body2" color="text.secondary">
              Selected: {selectedIds.length}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Table listing */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === invoices.length
                  }
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < invoices.length
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(inv.id)}
                    onChange={() => toggleSelectOne(inv.id)}
                  />
                </TableCell>
                <TableCell>{inv.project?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={inv.status}
                    size="small"
                    color={
                      inv.status === "overdue"
                        ? "error"
                        : inv.status === "paid"
                          ? "success"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>${inv.amount}</TableCell>
                <TableCell>{inv.due_date || "-"}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={inv.description || ""}
                    placeholder="Add note"
                    onBlur={async (e) => {
                      const desc = e.target.value;
                      const res = await fetchWithAuth(
                        `/api/v1/invoices/${inv.id}/status/`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: inv.status,
                            description: desc,
                          }),
                        },
                      );
                      if (!res.ok) alert("Failed to update description");
                    }}
                    onChange={() => {}}
                  />
                  {(inv.status === "paid" || inv.status === "cleared") && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        size="small"
                        label="Method"
                        defaultValue={inv.payment_method || ""}
                        onBlur={async (e) => {
                          const method = e.target.value;
                          await fetchWithAuth(
                            `/api/v1/invoices/${inv.id}/status/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: inv.status,
                                payment: { method },
                              }),
                            },
                          );
                        }}
                      />
                      <TextField
                        size="small"
                        label="Ref"
                        defaultValue={inv.payment_reference || ""}
                        onBlur={async (e) => {
                          const reference = e.target.value;
                          await fetchWithAuth(
                            `/api/v1/invoices/${inv.id}/status/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: inv.status,
                                payment: { reference },
                              }),
                            },
                          );
                        }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Gross"
                        defaultValue={inv.gross_amount || ""}
                        onBlur={async (e) => {
                          const gross_amount = e.target.value;
                          await fetchWithAuth(
                            `/api/v1/invoices/${inv.id}/status/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: inv.status,
                                payment: {
                                  gross_amount:
                                    Number(gross_amount) || undefined,
                                },
                              }),
                            },
                          );
                        }}
                        sx={{ width: 120 }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Fee"
                        defaultValue={inv.fee_amount || ""}
                        onBlur={async (e) => {
                          const fee_amount = e.target.value;
                          await fetchWithAuth(
                            `/api/v1/invoices/${inv.id}/status/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: inv.status,
                                payment: {
                                  fee_amount: Number(fee_amount) || undefined,
                                },
                              }),
                            },
                          );
                        }}
                        sx={{ width: 120 }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Net"
                        defaultValue={inv.net_amount || ""}
                        onBlur={async (e) => {
                          const net_amount = e.target.value;
                          await fetchWithAuth(
                            `/api/v1/invoices/${inv.id}/status/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                status: inv.status,
                                payment: {
                                  net_amount: Number(net_amount) || undefined,
                                },
                              }),
                            },
                          );
                        }}
                        sx={{ width: 120 }}
                      />
                    </Stack>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={async () => {
                        const res = await fetchWithAuth(
                          `/api/v1/invoices/${inv.id}/view_pdf/`,
                          { method: "GET" },
                        );
                        if (res.ok) {
                          const blob = await res.blob();
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, "_blank", "noopener");
                          // No revoke here immediately to allow viewing; browser will free later
                        } else {
                          alert("Failed to view PDF");
                        }
                      }}
                    >
                      View PDF
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/invoices/${inv.id}/history`)}
                    >
                      View History
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={async () => {
                        const reason = window.prompt(
                          "Please provide a reason for deleting this invoice:",
                        );
                        if (!reason) return;
                        await removeInvoice(inv.id, reason);
                        await fetchFiltered();
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
