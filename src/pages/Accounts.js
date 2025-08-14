import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Accounts() {
  const { fetchWithAuth } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [subs, setSubs] = useState([]);
  const [openDialog, setOpenDialog] = useState({ type: null });
  const [form, setForm] = useState({});

  const loadAll = async () => {
    const [e, p, ex, s] = await Promise.all([
      fetchWithAuth("/api/v1/employees/"),
      fetchWithAuth("/api/v1/payrolls/"),
      fetchWithAuth("/api/v1/expenses/"),
      fetchWithAuth("/api/v1/subscriptions/"),
    ]);
    if (e.ok) {
      const data = await e.json();
      setEmployees(Array.isArray(data) ? data : data.results || []);
    } else {
      setEmployees([]);
    }
    if (p.ok) {
      const data = await p.json();
      setPayrolls(Array.isArray(data) ? data : data.results || []);
    } else {
      setPayrolls([]);
    }
    if (ex.ok) {
      const data = await ex.json();
      setExpenses(Array.isArray(data) ? data : data.results || []);
    } else {
      setExpenses([]);
    }
    if (s.ok) {
      const data = await s.json();
      setSubs(Array.isArray(data) ? data : data.results || []);
    } else {
      setSubs([]);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="p-12 ml-8">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Accounts
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Employees" />
        <Tab label="Payrolls" />
        <Tab label="Expenses" />
        <Tab label="Subscriptions" />
      </Tabs>

      {tab === 0 && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog({ type: "employee" });
                setForm({
                  user: "",
                  title: "",
                  base_salary: "",
                  hourly_rate: "",
                  start_date: "",
                });
              }}
            >
              Add Employee
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Base Salary</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Hourly</TableCell>
                  <TableCell align="right">Commission %</TableCell>
                  <TableCell align="right">Stipend</TableCell>
                  <TableCell align="right">Hourly</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.user_username}</TableCell>
                    <TableCell>{e.title}</TableCell>
                    <TableCell align="right">{e.base_salary}</TableCell>
                    <TableCell>{e.salary_currency || "PKR"}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {e.employment_type || "full_time"}
                    </TableCell>
                    <TableCell align="right">{e.hourly_rate || "-"}</TableCell>
                    <TableCell align="right">
                      {e.commission_percentage || "-"}
                    </TableCell>
                    <TableCell align="right">
                      {e.stipend_amount || "-"}
                    </TableCell>
                    <TableCell align="right">{e.hourly_rate || "-"}</TableCell>
                    <TableCell>{e.start_date}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setOpenDialog({ type: "edit_employee" });
                          setForm({
                            id: e.id,
                            user: e.user,
                            title: e.title || "",
                            ssn: e.ssn || "",
                            employee_code: e.employee_code || "",
                            base_salary: e.base_salary || "",
                            salary_currency: e.salary_currency || "PKR",
                            hourly_rate: e.hourly_rate || "",
                            employment_type: e.employment_type || "full_time",
                            commission_percentage:
                              e.commission_percentage || "",
                            stipend_amount: e.stipend_amount || "",
                            start_date: e.start_date || "",
                            end_date: e.end_date || "",
                            company_role: e.company_role || "",
                            emergency_contact_name:
                              e.emergency_contact_name || "",
                            emergency_contact_phone:
                              e.emergency_contact_phone || "",
                            bank_name: e.bank_name || "",
                            account_number: e.account_number || "",
                            account_holder_name: e.account_holder_name || "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 1 && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog({ type: "payroll" });
                setForm({
                  employee: "",
                  period_start: "",
                  period_end: "",
                  payroll_type: "monthly",
                  currency: "PKR",
                  base_salary: 0,
                  overtime_hours: 0,
                  overtime_rate: 0,
                  overtime_amount: 0,
                  commission_breakdown: [],
                  commission_usd: 0,
                  commission_pkr: 0,
                  usd_to_pkr_rate: 280,
                  transport_allowance: 0,
                  medical_allowance: 0,
                  food_allowance: 0,
                  housing_allowance: 0,
                  other_allowances: 0,
                  other_allowances_description: "",
                  extra_working_days: 0,
                  extra_days_rate: 0,
                  extra_days_component: 0,
                  bonus_amount: 0,
                  bonus_description: "",
                  performance_bonus: 0,
                  annual_bonus: 0,
                  tax_deduction: 0,
                  provident_fund: 0,
                  health_insurance: 0,
                  loan_deduction: 0,
                  advance_deduction: 0,
                  other_deductions: 0,
                  other_deductions_description: "",
                  gross_salary: 0,
                  net_salary: 0,
                  total_deductions: 0,
                  salary_component: 0,
                  commission_component: 0,
                  gross_amount: 0,
                  deductions: 0,
                  net_amount: 0,
                  combine_commission_salary: false,
                  note: "",
                  employee_note: "",
                  payment_method: "",
                  reference_number: "",
                });
              }}
            >
              Generate Payroll
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Gross</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Net</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.employee_username}</TableCell>
                    <TableCell>
                      {p.period_start} → {p.period_end}
                    </TableCell>
                    <TableCell align="right">
                      PKR {Number(p.gross_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      PKR {Number(p.deductions || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      PKR {Number(p.net_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            p.status === "paid"
                              ? "#e8f5e8"
                              : p.status === "scheduled"
                                ? "#fff3cd"
                                : "#f8f9fa",
                          color:
                            p.status === "paid"
                              ? "#155724"
                              : p.status === "scheduled"
                                ? "#856404"
                                : "#6c757d",
                          fontSize: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            const res = await fetchWithAuth(
                              `/api/v1/payrolls/${p.id}/view_pdf/`,
                              { method: "GET" },
                            );
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, "_blank", "noopener");
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
                          onClick={async () => {
                            const res = await fetchWithAuth(
                              `/api/v1/payrolls/${p.id}/download_pdf/`,
                              { method: "GET" },
                            );
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `payroll_${p.id}_${p.employee_username}_${p.period_start}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(url);
                            } else {
                              alert("Failed to download PDF");
                            }
                          }}
                        >
                          Download
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 2 && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog({ type: "expense" });
                setForm({
                  name: "",
                  category: "other",
                  amount: "",
                  is_recurring: false,
                  recurring_interval: "",
                  next_due_date: "",
                });
              }}
            >
              Add Expense
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Recurring</TableCell>
                  <TableCell>Next Due</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((x) => (
                  <TableRow key={x.id}>
                    <TableCell>{x.name}</TableCell>
                    <TableCell>{x.category}</TableCell>
                    <TableCell align="right">{x.amount}</TableCell>
                    <TableCell>
                      {x.is_recurring ? `${x.recurring_interval}` : "No"}
                    </TableCell>
                    <TableCell>{x.next_due_date || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 3 && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog({ type: "subscription" });
                setForm({
                  name: "",
                  vendor: "",
                  amount: "",
                  billing_cycle: "monthly",
                  next_renewal: "",
                  notify_days_before: 7,
                });
              }}
            >
              Add Subscription
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Cycle</TableCell>
                  <TableCell>Next Renewal</TableCell>
                  <TableCell>Reminder</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.vendor}</TableCell>
                    <TableCell align="right">{s.amount}</TableCell>
                    <TableCell>{s.billing_cycle}</TableCell>
                    <TableCell>{s.next_renewal}</TableCell>
                    <TableCell>{s.notify_days_before} days before</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog
        open={!!openDialog.type}
        onClose={() => setOpenDialog({ type: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {openDialog.type === "edit_employee"
            ? "Edit Employee"
            : `Add ${openDialog.type}`}
        </DialogTitle>
        <DialogContent dividers>
          {openDialog.type === "employee" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="User ID"
                value={form.user || ""}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
              />
              <TextField
                label="Title"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <TextField
                label="Base Salary"
                type="number"
                value={form.base_salary || ""}
                onChange={(e) =>
                  setForm({ ...form, base_salary: e.target.value })
                }
              />
              <TextField
                label="Hourly Rate"
                type="number"
                value={form.hourly_rate || ""}
                onChange={(e) =>
                  setForm({ ...form, hourly_rate: e.target.value })
                }
              />
              <TextField
                label="Start Date"
                type="date"
                value={form.start_date || ""}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          )}
          {openDialog.type === "edit_employee" && (
            <Stack
              spacing={2}
              sx={{ mt: 1, maxHeight: "70vh", overflowY: "auto" }}
            >
              {/* Personal Information */}
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                Personal Information
              </Typography>
              <TextField
                label="Title"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="SSN/Employee ID"
                  value={form.ssn || ""}
                  onChange={(e) => setForm({ ...form, ssn: e.target.value })}
                  helperText="Social Security Number or Employee ID"
                />
                <TextField
                  label="Employee Code"
                  value={form.employee_code || ""}
                  onChange={(e) =>
                    setForm({ ...form, employee_code: e.target.value })
                  }
                  helperText="Unique employee code/number"
                />
              </Stack>

              {/* Employment Details */}
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                Employment Details
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    value={form.employment_type || "full_time"}
                    onChange={(e) =>
                      setForm({ ...form, employment_type: e.target.value })
                    }
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="intern">Intern</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    label="Currency"
                    value={form.salary_currency || "PKR"}
                    onChange={(e) =>
                      setForm({ ...form, salary_currency: e.target.value })
                    }
                  >
                    <MenuItem value="PKR">PKR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {/* Compensation */}
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                Compensation
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Base Salary"
                  type="number"
                  value={form.base_salary || ""}
                  onChange={(e) =>
                    setForm({ ...form, base_salary: e.target.value })
                  }
                />
                <TextField
                  label="Hourly Rate"
                  type="number"
                  value={form.hourly_rate || ""}
                  onChange={(e) =>
                    setForm({ ...form, hourly_rate: e.target.value })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Commission %"
                  type="number"
                  value={form.commission_percentage || ""}
                  onChange={(e) =>
                    setForm({ ...form, commission_percentage: e.target.value })
                  }
                />
                <TextField
                  label="Stipend Amount"
                  type="number"
                  value={form.stipend_amount || ""}
                  onChange={(e) =>
                    setForm({ ...form, stipend_amount: e.target.value })
                  }
                />
              </Stack>

              {/* Timeline */}
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                Timeline
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={form.start_date || ""}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={form.end_date || ""}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for ongoing employment"
                />
              </Stack>

              {/* Emergency Contact */}
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                Emergency Contact
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Emergency Contact Name"
                  value={form.emergency_contact_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, emergency_contact_name: e.target.value })
                  }
                />
                <TextField
                  label="Emergency Contact Phone"
                  value={form.emergency_contact_phone || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      emergency_contact_phone: e.target.value,
                    })
                  }
                />
              </Stack>

              {/* Bank Account Information */}
              <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
                Bank Account Information
              </Typography>
              <TextField
                label="Bank Name"
                value={form.bank_name || ""}
                onChange={(e) =>
                  setForm({ ...form, bank_name: e.target.value })
                }
                helperText="Name of the bank"
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Account Number"
                  value={form.account_number || ""}
                  onChange={(e) =>
                    setForm({ ...form, account_number: e.target.value })
                  }
                  helperText="Bank account number"
                />
                <TextField
                  label="Account Holder Name"
                  value={form.account_holder_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, account_holder_name: e.target.value })
                  }
                  helperText="Name as it appears on the account"
                />
              </Stack>
            </Stack>
          )}
          {openDialog.type === "payroll" && (
            <Stack
              spacing={2}
              sx={{ mt: 1, maxHeight: "70vh", overflowY: "auto" }}
            >
              {/* Basic Information */}
              <Typography variant="h6" color="primary">
                Basic Information
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    label="Employee"
                    value={form.employee || ""}
                    onChange={(e) => {
                      const selectedEmployeeId = e.target.value;
                      const selectedEmployee = employees.find(
                        (emp) => emp.id === selectedEmployeeId,
                      );

                      setForm({
                        ...form,
                        employee: selectedEmployeeId,
                        base_salary: selectedEmployee
                          ? Number(selectedEmployee.base_salary || 0)
                          : 0,
                        salary_component: selectedEmployee
                          ? Number(selectedEmployee.base_salary || 0)
                          : 0,
                      });
                    }}
                  >
                    <MenuItem value="">Select…</MenuItem>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.user_username} - {emp.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Payroll Type</InputLabel>
                  <Select
                    label="Payroll Type"
                    value={form.payroll_type || "monthly"}
                    onChange={(e) =>
                      setForm({ ...form, payroll_type: e.target.value })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="bi_weekly">Bi-Weekly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="bonus">Bonus Only</MenuItem>
                    <MenuItem value="commission">Commission Only</MenuItem>
                    <MenuItem value="final">Final Settlement</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Period Start"
                  type="date"
                  value={form.period_start || ""}
                  onChange={(e) =>
                    setForm({ ...form, period_start: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Period End"
                  type="date"
                  value={form.period_end || ""}
                  onChange={(e) =>
                    setForm({ ...form, period_end: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Pay Date"
                  type="date"
                  value={form.pay_date || ""}
                  onChange={(e) =>
                    setForm({ ...form, pay_date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              {/* Salary & Overtime */}
              <Divider />
              <Typography variant="h6" color="primary">
                Salary & Overtime
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Base Salary (PKR)"
                  type="number"
                  value={form.base_salary || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      base_salary: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Overtime Hours"
                  type="number"
                  value={form.overtime_hours || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      overtime_hours: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Overtime Rate (PKR/hr)"
                  type="number"
                  value={form.overtime_rate || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      overtime_rate: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>

              {/* Commission Section */}
              <Divider />
              <Typography variant="h6" color="primary">
                Commission
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="USD to PKR Rate"
                  type="number"
                  value={form.usd_to_pkr_rate || 280}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      usd_to_pkr_rate: Number(e.target.value || 280),
                    })
                  }
                />
                <TextField
                  label="Commission USD (Auto)"
                  type="number"
                  value={form.commission_usd || 0}
                  disabled
                />
                <TextField
                  label="Commission PKR (Editable)"
                  type="number"
                  value={form.commission_pkr || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      commission_pkr: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>
              <Button
                variant="outlined"
                disabled={
                  !form.employee || !form.period_start || !form.period_end
                }
                onClick={async () => {
                  if (!form.employee || !form.period_start || !form.period_end)
                    return;
                  const res = await fetchWithAuth(
                    `/api/v1/payrolls/commission-projects/?employee_id=${form.employee}&period_start=${form.period_start}&period_end=${form.period_end}`,
                  );
                  if (res.ok) {
                    const projects = await res.json();
                    const breakdown = projects.map((p) => ({
                      project_id: p.id,
                      project_name: p.name,
                      revenue: p.revenue || 0,
                      percent: p.commission_percent || 20,
                      commission_amount: Number(
                        (
                          ((p.revenue || 0) * (p.commission_percent || 20)) /
                          100
                        ).toFixed(2),
                      ),
                    }));

                    const total_commission_usd = breakdown.reduce(
                      (total, item) => total + (item.commission_amount || 0),
                      0,
                    );
                    const commission_pkr_calculated = Number(
                      (
                        total_commission_usd *
                        Number(form.usd_to_pkr_rate || 280)
                      ).toFixed(2),
                    );

                    setForm((prev) => ({
                      ...prev,
                      commission_breakdown: breakdown,
                      commission_usd: total_commission_usd,
                      commission_pkr: commission_pkr_calculated,
                      commission_component: commission_pkr_calculated,
                    }));
                  }
                }}
              >
                Load Projects & Calculate Commission
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                💡 In the generated PDF, each project's commission will be shown
                as a separate line item for better clarity.
              </Typography>

              {Array.isArray(form.commission_breakdown) &&
              form.commission_breakdown.length ? (
                <>
                  <Typography variant="subtitle2">
                    Commission Breakdown
                  </Typography>
                  {form.commission_breakdown.map((row, i) => (
                    <Stack
                      key={row.project_id}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ sm: "center" }}
                    >
                      <TextField
                        label="Project"
                        value={row.project_name}
                        size="small"
                        disabled
                        sx={{ minWidth: 200 }}
                      />
                      <TextField
                        label="Revenue (USD)"
                        type="number"
                        size="small"
                        value={row.revenue}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            commission_breakdown: prev.commission_breakdown.map(
                              (r, idx) =>
                                idx === i
                                  ? {
                                      ...r,
                                      revenue: Number(e.target.value || 0),
                                    }
                                  : r,
                            ),
                          }))
                        }
                        sx={{ width: 120 }}
                      />
                      <TextField
                        label="%"
                        type="number"
                        size="small"
                        value={row.percent}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            commission_breakdown: prev.commission_breakdown.map(
                              (r, idx) =>
                                idx === i
                                  ? {
                                      ...r,
                                      percent: Number(e.target.value || 0),
                                    }
                                  : r,
                            ),
                          }))
                        }
                        sx={{ width: 80 }}
                      />
                      <TextField
                        label="Commission (USD)"
                        type="number"
                        size="small"
                        value={row.commission_amount}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            commission_breakdown: prev.commission_breakdown.map(
                              (r, idx) =>
                                idx === i
                                  ? {
                                      ...r,
                                      commission_amount: Number(
                                        e.target.value || 0,
                                      ),
                                    }
                                  : r,
                            ),
                          }))
                        }
                        sx={{ width: 140 }}
                      />
                    </Stack>
                  ))}
                </>
              ) : null}

              {/* Allowances */}
              <Divider />
              <Typography variant="h6" color="primary">
                Allowances
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Transport (PKR)"
                  type="number"
                  value={form.transport_allowance || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transport_allowance: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Medical (PKR)"
                  type="number"
                  value={form.medical_allowance || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medical_allowance: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Food (PKR)"
                  type="number"
                  value={form.food_allowance || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      food_allowance: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Housing (PKR)"
                  type="number"
                  value={form.housing_allowance || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      housing_allowance: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Other Allowances (PKR)"
                  type="number"
                  value={form.other_allowances || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      other_allowances: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Other Allowances Description"
                  value={form.other_allowances_description || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      other_allowances_description: e.target.value,
                    })
                  }
                />
              </Stack>

              {/* Bonuses */}
              <Divider />
              <Typography variant="h6" color="primary">
                Bonuses & Extra Days
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Bonus Amount (PKR)"
                  type="number"
                  value={form.bonus_amount || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bonus_amount: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Performance Bonus (PKR)"
                  type="number"
                  value={form.performance_bonus || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      performance_bonus: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Annual Bonus (PKR)"
                  type="number"
                  value={form.annual_bonus || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      annual_bonus: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Bonus Description"
                  value={form.bonus_description || ""}
                  onChange={(e) =>
                    setForm({ ...form, bonus_description: e.target.value })
                  }
                  sx={{ flexGrow: 1 }}
                />
                <TextField
                  label="Extra Working Days"
                  type="number"
                  value={form.extra_working_days || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      extra_working_days: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Extra Days Rate (PKR)"
                  type="number"
                  value={form.extra_days_rate || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      extra_days_rate: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>

              {/* Deductions */}
              <Divider />
              <Typography variant="h6" color="primary">
                Deductions
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Tax Deduction (PKR)"
                  type="number"
                  value={form.tax_deduction || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tax_deduction: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Provident Fund (PKR)"
                  type="number"
                  value={form.provident_fund || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      provident_fund: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Health Insurance (PKR)"
                  type="number"
                  value={form.health_insurance || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      health_insurance: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Loan Deduction (PKR)"
                  type="number"
                  value={form.loan_deduction || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      loan_deduction: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Advance Deduction (PKR)"
                  type="number"
                  value={form.advance_deduction || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      advance_deduction: Number(e.target.value || 0),
                    })
                  }
                />
                <TextField
                  label="Other Deductions (PKR)"
                  type="number"
                  value={form.other_deductions || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      other_deductions: Number(e.target.value || 0),
                    })
                  }
                />
              </Stack>
              <TextField
                label="Other Deductions Description"
                value={form.other_deductions_description || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    other_deductions_description: e.target.value,
                  })
                }
              />

              {/* Configuration & Notes */}
              <Divider />
              <Typography variant="h6" color="primary">
                Configuration & Notes
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.combine_commission_salary || false}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        combine_commission_salary: e.target.checked,
                      })
                    }
                  />
                }
                label="Combine Commission and Salary into one line item"
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Payment Method"
                  value={form.payment_method || ""}
                  onChange={(e) =>
                    setForm({ ...form, payment_method: e.target.value })
                  }
                />
                <TextField
                  label="Reference Number"
                  value={form.reference_number || ""}
                  onChange={(e) =>
                    setForm({ ...form, reference_number: e.target.value })
                  }
                />
              </Stack>
              <TextField
                label="Internal Note"
                multiline
                rows={2}
                value={form.note || ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <TextField
                label="Employee Note"
                multiline
                rows={2}
                value={form.employee_note || ""}
                onChange={(e) =>
                  setForm({ ...form, employee_note: e.target.value })
                }
              />

              {/* Totals */}
              <Divider />
              <Typography variant="h6" color="primary">
                Totals
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Gross Salary (PKR)"
                  type="number"
                  value={form.gross_salary || 0}
                  disabled
                  sx={{ fontWeight: "bold" }}
                />
                <TextField
                  label="Total Deductions (PKR)"
                  type="number"
                  value={form.total_deductions || 0}
                  disabled
                />
                <TextField
                  label="Net Salary (PKR)"
                  type="number"
                  value={form.net_salary || 0}
                  disabled
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>
              <Button
                variant="contained"
                onClick={() => {
                  // Calculate all components
                  const overtime_amount =
                    Number(form.overtime_hours) * Number(form.overtime_rate);
                  const extra_days_component =
                    Number(form.extra_working_days) *
                    Number(form.extra_days_rate);

                  const gross_salary =
                    Number(form.base_salary) +
                    overtime_amount +
                    Number(form.commission_pkr) +
                    Number(form.transport_allowance) +
                    Number(form.medical_allowance) +
                    Number(form.food_allowance) +
                    Number(form.housing_allowance) +
                    Number(form.other_allowances) +
                    extra_days_component +
                    Number(form.bonus_amount) +
                    Number(form.performance_bonus) +
                    Number(form.annual_bonus);

                  const total_deductions =
                    Number(form.tax_deduction) +
                    Number(form.provident_fund) +
                    Number(form.health_insurance) +
                    Number(form.loan_deduction) +
                    Number(form.advance_deduction) +
                    Number(form.other_deductions);

                  const net_salary = gross_salary - total_deductions;

                  // Update commission USD based on breakdown (this helps maintain consistency)
                  const commission_usd = (
                    form.commission_breakdown || []
                  ).reduce((s, r) => s + Number(r.commission_amount || 0), 0);

                  // Note: commission_pkr is user-editable and may differ from auto-calculated value
                  // The PDF will show individual project commissions based on the breakdown

                  setForm((prev) => ({
                    ...prev,
                    overtime_amount,
                    extra_days_component,
                    commission_usd,
                    gross_salary: Number(gross_salary.toFixed(2)),
                    total_deductions: Number(total_deductions.toFixed(2)),
                    net_salary: Number(net_salary.toFixed(2)),
                    // Legacy fields for backward compatibility
                    salary_component: Number(form.base_salary),
                    commission_component: Number(form.commission_pkr),
                    gross_amount: Number(gross_salary.toFixed(2)),
                    deductions: Number(total_deductions.toFixed(2)),
                    net_amount: Number(net_salary.toFixed(2)),
                  }));
                }}
              >
                Calculate Totals
              </Button>
            </Stack>
          )}
          {openDialog.type === "expense" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={form.category || "other"}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <MenuItem value="rent">Rent</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="tools">Tools/Software</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <TextField
                label="Recurring Interval (optional)"
                value={form.recurring_interval || ""}
                onChange={(e) =>
                  setForm({ ...form, recurring_interval: e.target.value })
                }
              />
              <TextField
                label="Next Due Date"
                type="date"
                value={form.next_due_date || ""}
                onChange={(e) =>
                  setForm({ ...form, next_due_date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          )}
          {openDialog.type === "subscription" && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Vendor"
                value={form.vendor || ""}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              />
              <TextField
                label="Amount"
                type="number"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Billing Cycle</InputLabel>
                <Select
                  label="Billing Cycle"
                  value={form.billing_cycle || "monthly"}
                  onChange={(e) =>
                    setForm({ ...form, billing_cycle: e.target.value })
                  }
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Next Renewal"
                type="date"
                value={form.next_renewal || ""}
                onChange={(e) =>
                  setForm({ ...form, next_renewal: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Notify Days Before"
                type="number"
                value={form.notify_days_before || 7}
                onChange={(e) =>
                  setForm({ ...form, notify_days_before: e.target.value })
                }
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog({ type: null })}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              let url = "",
                method = "POST",
                payload = form;

              if (openDialog.type === "employee") url = "/api/v1/employees/";
              if (openDialog.type === "edit_employee") {
                url = `/api/v1/employees/${form.id}/`;
                method = "PUT";
                // Remove id from payload for PUT request and handle empty dates
                const { id, ...updatePayload } = form;

                // Convert empty date strings to null for Django
                if (updatePayload.end_date === "")
                  updatePayload.end_date = null;
                if (updatePayload.start_date === "")
                  updatePayload.start_date = null;

                // Convert empty strings to null for numeric fields
                if (updatePayload.hourly_rate === "")
                  updatePayload.hourly_rate = null;
                if (updatePayload.commission_percentage === "")
                  updatePayload.commission_percentage = null;
                if (updatePayload.stipend_amount === "")
                  updatePayload.stipend_amount = null;
                if (updatePayload.company_role === "")
                  updatePayload.company_role = null;

                payload = updatePayload;
              }
              if (openDialog.type === "payroll") url = "/api/v1/payrolls/";
              if (openDialog.type === "expense") url = "/api/v1/expenses/";
              if (openDialog.type === "subscription")
                url = "/api/v1/subscriptions/";

              const res = await fetchWithAuth(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              if (res.ok) {
                setOpenDialog({ type: null });
                await loadAll();
                alert(
                  openDialog.type === "edit_employee"
                    ? "Employee updated successfully!"
                    : "Saved successfully!",
                );
              } else {
                const errorData = await res.json().catch(() => ({}));
                alert(`Failed: ${JSON.stringify(errorData)}`);
              }
            }}
          >
            {openDialog.type === "edit_employee" ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
