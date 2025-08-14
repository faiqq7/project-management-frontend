import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function CompanySettings() {
  const { fetchWithAuth, userRole } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dialog, setDialog] = useState({ type: null });
  const [form, setForm] = useState({});
  const [useExistingUser, setUseExistingUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [st, r, e, u] = await Promise.all([
        fetchWithAuth("/api/v1/company-stats/"),
        fetchWithAuth("/api/v1/company-roles/"),
        fetchWithAuth("/api/v1/employees/?page_size=1000"),
        fetchWithAuth("/api/v1/auth/users/"),
      ]);
      if (st.ok) setStats(await st.json());
      if (r.ok) {
        const data = await r.json();
        setRoles(Array.isArray(data) ? data : data.results || []);
      } else {
        setRoles([]);
      }
      if (e.ok) {
        const data = await e.json();
        setEmployees(Array.isArray(data) ? data : data.results || []);
      }
      if (u.ok) setAllUsers(await u.json());
    };
    load();
  }, [fetchWithAuth]);

  if (userRole !== "admin") {
    return (
      <div className="p-12 ml-8">
        <Typography>You do not have access.</Typography>
      </div>
    );
  }

  return (
    <div className="p-12 ml-8">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Company Settings
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Stats" />
        <Tab label="Roles" />
        <Tab label="Onboarding" />
        <Tab label="Compensation" />
        <Tab label="Settings" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Overview
            </Typography>
            {stats ? (
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <div>
                  <Typography variant="body2">Total Users</Typography>
                  <Typography variant="h6">{stats.total_users}</Typography>
                </div>
                <div>
                  <Typography variant="body2">Total Employees</Typography>
                  <Typography variant="h6">{stats.total_employees}</Typography>
                </div>
                <div>
                  <Typography variant="body2">By Access Role</Typography>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {stats.by_access_role.map((x) => (
                      <li key={x.role}>
                        {x.role}: {x.count}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Typography variant="body2">By Company Role</Typography>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {stats.by_company_role.map((x) => (
                      <li key={x.name}>
                        {x.name}: {x.count}
                      </li>
                    ))}
                  </ul>
                </div>
              </Stack>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                setDialog({ type: "role" });
                setForm({ name: "", description: "" });
              }}
            >
              Add Role
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 2 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Onboard employee
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <FormControl fullWidth>
              <InputLabel>Mode</InputLabel>
              <Select
                label="Mode"
                value={useExistingUser ? "existing" : "new"}
                onChange={(e) =>
                  setUseExistingUser(e.target.value === "existing")
                }
              >
                <MenuItem value="new">Create new user</MenuItem>
                <MenuItem value="existing">Use existing user</MenuItem>
              </Select>
            </FormControl>
            {!useExistingUser ? (
              <>
                <TextField
                  label="Username"
                  value={form.username || ""}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={form.password || ""}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </>
            ) : (
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  label="User"
                  value={form.user || ""}
                  onChange={(e) => setForm({ ...form, user: e.target.value })}
                >
                  <MenuItem value="">Select user…</MenuItem>
                  {Array.isArray(allUsers)
                    ? allUsers.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.username} ({u.email})
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth>
              <InputLabel>Access Role</InputLabel>
              <Select
                label="Access Role"
                value={form.access_role || "user"}
                onChange={(e) =>
                  setForm({ ...form, access_role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Employee Personal Information */}
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
            {(!form.employment_type ||
              form.employment_type === "full_time") && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Base Salary"
                  type="number"
                  value={form.base_salary || ""}
                  onChange={(e) =>
                    setForm({ ...form, base_salary: e.target.value })
                  }
                />
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
            )}
            {form.employment_type === "contract" && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Hourly Rate"
                  type="number"
                  value={form.hourly_rate || ""}
                  onChange={(e) =>
                    setForm({ ...form, hourly_rate: e.target.value })
                  }
                />
                <TextField
                  label="Commission % (optional)"
                  type="number"
                  value={form.commission_percentage || ""}
                  onChange={(e) =>
                    setForm({ ...form, commission_percentage: e.target.value })
                  }
                />
              </Stack>
            )}
            {form.employment_type === "intern" && (
              <TextField
                label="Stipend Amount"
                type="number"
                value={form.stipend_amount || ""}
                onChange={(e) =>
                  setForm({ ...form, stipend_amount: e.target.value })
                }
              />
            )}
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
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            {/* Emergency Contact Information */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Emergency Contact Name"
                value={form.emergency_contact_name || ""}
                onChange={(e) =>
                  setForm({ ...form, emergency_contact_name: e.target.value })
                }
                helperText="Emergency contact person"
              />
              <TextField
                label="Emergency Contact Phone"
                value={form.emergency_contact_phone || ""}
                onChange={(e) =>
                  setForm({ ...form, emergency_contact_phone: e.target.value })
                }
                helperText="Emergency contact phone number"
              />
            </Stack>

            {/* Bank Account Information */}
            <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
              Bank Account Information
            </Typography>
            <TextField
              label="Bank Name"
              value={form.bank_name || ""}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
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
            <FormControl fullWidth>
              <InputLabel>Company Role</InputLabel>
              <Select
                label="Company Role"
                value={form.company_role || ""}
                onChange={(e) =>
                  setForm({ ...form, company_role: e.target.value })
                }
              >
                <MenuItem value="">Select...</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={async () => {
                  let res;
                  if (!useExistingUser) {
                    const payload = {
                      username: form.username,
                      email: form.email,
                      password: form.password,
                      access_role: form.access_role || "user",
                      employee: {
                        title: form.title,
                        ssn: form.ssn || "",
                        employee_code: form.employee_code || "",
                        base_salary: form.base_salary
                          ? Number(form.base_salary)
                          : 0,
                        hourly_rate: form.hourly_rate
                          ? Number(form.hourly_rate)
                          : null,
                        start_date: form.start_date || null,
                        company_role: form.company_role || null,
                        salary_currency: form.salary_currency || "PKR",
                        employment_type: form.employment_type || "full_time",
                        commission_percentage: form.commission_percentage
                          ? Number(form.commission_percentage)
                          : null,
                        stipend_amount: form.stipend_amount
                          ? Number(form.stipend_amount)
                          : null,
                        emergency_contact_name:
                          form.emergency_contact_name || "",
                        emergency_contact_phone:
                          form.emergency_contact_phone || "",
                        bank_name: form.bank_name || "",
                        account_number: form.account_number || "",
                        account_holder_name: form.account_holder_name || "",
                      },
                    };
                    res = await fetchWithAuth("/api/v1/employees/onboard/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                  } else {
                    // Create employee for existing user
                    const payload = {
                      user: form.user,
                      title: form.title || "",
                      ssn: form.ssn || "",
                      employee_code: form.employee_code || "",
                      base_salary: form.base_salary
                        ? Number(form.base_salary)
                        : 0,
                      salary_currency: form.salary_currency || "PKR",
                      hourly_rate: form.hourly_rate
                        ? Number(form.hourly_rate)
                        : null,
                      employment_type: form.employment_type || "full_time",
                      commission_percentage: form.commission_percentage
                        ? Number(form.commission_percentage)
                        : null,
                      stipend_amount: form.stipend_amount
                        ? Number(form.stipend_amount)
                        : null,
                      start_date: form.start_date || null,
                      company_role: form.company_role || null,
                      emergency_contact_name: form.emergency_contact_name || "",
                      emergency_contact_phone:
                        form.emergency_contact_phone || "",
                      bank_name: form.bank_name || "",
                      account_number: form.account_number || "",
                      account_holder_name: form.account_holder_name || "",
                      is_active: true,
                    };
                    res = await fetchWithAuth("/api/v1/employees/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                  }
                  if (res.ok) {
                    setForm({});
                    const e = await fetchWithAuth("/api/v1/employees/");
                    if (e.ok) {
                      const data = await e.json();
                      setEmployees(
                        Array.isArray(data) ? data : data.results || [],
                      );
                    }
                    alert("Onboarded");
                  } else {
                    const err = await res.json().catch(() => ({}));
                    alert("Failed: " + (err.error || res.status));
                  }
                }}
              >
                Create
              </Button>
              <Button onClick={() => setForm({})}>Reset</Button>
            </Stack>
          </Stack>
        </>
      )}

      {tab === 3 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Revise Compensation / Promote
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 640 }}>
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                label="Employee"
                value={form.rev_emp || ""}
                onChange={(e) => setForm({ ...form, rev_emp: e.target.value })}
              >
                <MenuItem value="">Select…</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.user_username} - {emp.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!employees.length ? (
              <Typography variant="caption" color="text.secondary">
                No employees found. Use the Onboarding tab to create/attach
                employees first.
              </Typography>
            ) : null}
            <FormControl fullWidth>
              <InputLabel>Change Type</InputLabel>
              <Select
                label="Change Type"
                value={form.change_type || "salary_revision"}
                onChange={(e) =>
                  setForm({ ...form, change_type: e.target.value })
                }
              >
                <MenuItem value="salary_revision">Salary Revision</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Effective Date"
              type="date"
              value={form.effective_date || ""}
              onChange={(e) =>
                setForm({ ...form, effective_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Title (optional)"
              value={form.new_title || ""}
              onChange={(e) => setForm({ ...form, new_title: e.target.value })}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Base Salary (optional)"
                type="number"
                value={form.new_base_salary || ""}
                onChange={(e) =>
                  setForm({ ...form, new_base_salary: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  label="Currency"
                  value={form.new_salary_currency || "PKR"}
                  onChange={(e) =>
                    setForm({ ...form, new_salary_currency: e.target.value })
                  }
                >
                  <MenuItem value="PKR">PKR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Hourly Rate (optional)"
                type="number"
                value={form.new_hourly_rate || ""}
                onChange={(e) =>
                  setForm({ ...form, new_hourly_rate: e.target.value })
                }
              />
              <TextField
                label="Commission % (optional)"
                type="number"
                value={form.new_commission_percentage || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    new_commission_percentage: e.target.value,
                  })
                }
              />
              <TextField
                label="Stipend (optional)"
                type="number"
                value={form.new_stipend_amount || ""}
                onChange={(e) =>
                  setForm({ ...form, new_stipend_amount: e.target.value })
                }
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                label="Employment Type"
                value={form.new_employment_type || ""}
                onChange={(e) =>
                  setForm({ ...form, new_employment_type: e.target.value })
                }
              >
                <MenuItem value="">No change</MenuItem>
                <MenuItem value="full_time">Full Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="intern">Intern</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Note"
              value={form.note || ""}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              multiline
              minRows={2}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={async () => {
                  if (!form.rev_emp) {
                    alert("Select employee");
                    return;
                  }
                  const payload = {
                    change_type: form.change_type || "salary_revision",
                    effective_date: form.effective_date || undefined,
                    note: form.note || "",
                    title: form.new_title || undefined,
                    base_salary: form.new_base_salary
                      ? Number(form.new_base_salary)
                      : undefined,
                    salary_currency: form.new_salary_currency || undefined,
                    hourly_rate: form.new_hourly_rate
                      ? Number(form.new_hourly_rate)
                      : undefined,
                    commission_percentage: form.new_commission_percentage
                      ? Number(form.new_commission_percentage)
                      : undefined,
                    stipend_amount: form.new_stipend_amount
                      ? Number(form.new_stipend_amount)
                      : undefined,
                    employment_type: form.new_employment_type || undefined,
                  };
                  const res = await fetchWithAuth(
                    `/api/v1/employees/${form.rev_emp}/revise-compensation/`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    },
                  );
                  if (res.ok) {
                    setForm({});
                    const e = await fetchWithAuth("/api/v1/employees/");
                    if (e.ok) {
                      const data = await e.json();
                      setEmployees(
                        Array.isArray(data) ? data : data.results || [],
                      );
                    }
                    alert("Updated");
                  } else {
                    const err = await res.json().catch(() => ({}));
                    alert("Failed: " + (err.error || res.status));
                  }
                }}
              >
                Apply
              </Button>
              <Button onClick={() => setForm({})}>Reset</Button>
            </Stack>
          </Stack>
        </>
      )}

      {tab === 4 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Company Settings
          </Typography>
          <CompanySettingsForm />
        </>
      )}

      <Dialog
        open={dialog.type === "role"}
        onClose={() => setDialog({ type: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Company Role</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Role Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ type: null })}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const res = await fetchWithAuth("/api/v1/company-roles/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: form.name,
                  description: form.description,
                }),
              });
              if (res.ok) {
                setDialog({ type: null });
                const r = await fetchWithAuth("/api/v1/company-roles/");
                if (r.ok) {
                  const data = await r.json();
                  setRoles(Array.isArray(data) ? data : data.results || []);
                }
              } else {
                alert("Failed");
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function CompanySettingsForm() {
  const { fetchWithAuth } = useContext(AuthContext);
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchWithAuth("/api/v1/company-settings/");
      if (res.ok) {
        const data = await res.json();
        const s = Array.isArray(data)
          ? data[0]
          : data.results
            ? data.results[0]
            : data;
        setSetting(s);
      }
    };
    load();
  }, [fetchWithAuth]);

  // Create preview URL when file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const save = async () => {
    if (!setting) return;
    setLoading(true);
    try {
      let body;
      let headers = {};

      if (file && file instanceof File) {
        // When uploading a new file, use FormData and ensure proper multipart encoding
        body = new FormData();

        // Add only the essential fields, not all settings
        const fieldsToInclude = [
          "name",
          "primary_color",
          "secondary_color",
          "theme_mode",
          "address",
          "phone",
          "email",
          "website",
          "registration_number",
          "commission_enabled",
        ];

        fieldsToInclude.forEach((field) => {
          if (setting[field] !== null && setting[field] !== undefined) {
            body.append(field, setting[field]);
          }
        });

        // Handle extras field specially
        try {
          const extrasValue =
            typeof setting.extras === "object"
              ? setting.extras
              : JSON.parse(setting.extras || "{}");
          body.append("extras", JSON.stringify(extrasValue));
        } catch (error) {
          body.append("extras", "{}");
        }

        // Add the actual file
        body.append("logo", file);

        // Don't set Content-Type header - let browser set it automatically for multipart/form-data
      } else {
        // Regular JSON update without file - exclude logo field to avoid validation issues
        const settingWithoutLogo = { ...setting };
        delete settingWithoutLogo.logo; // Remove logo field when not uploading a file

        headers["Content-Type"] = "application/json";
        body = JSON.stringify(settingWithoutLogo);
      }

      const url = `/api/v1/company-settings/${setting.id || ""}${setting.id ? "/" : ""}`;
      const method = setting.id ? "PUT" : "POST";
      const res = await fetchWithAuth(url, { method, headers, body });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Save failed: ${JSON.stringify(errorData)}`);
      }

      // Reload the setting to get the updated logo URL
      const reloadRes = await fetchWithAuth("/api/v1/company-settings/");
      if (reloadRes.ok) {
        const data = await reloadRes.json();
        const s = Array.isArray(data)
          ? data[0]
          : data.results
            ? data.results[0]
            : data;
        setSetting(s);
      }

      // Clear the file state since it's been saved
      setFile(null);
      alert("Saved successfully!");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!setting) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      {/* Basic Company Information */}
      <Typography variant="h6" sx={{ color: "primary.main", mt: 2 }}>
        Basic Information
      </Typography>
      <TextField
        label="Company Name"
        value={setting.name || ""}
        onChange={(e) => setSetting({ ...setting, name: e.target.value })}
      />

      {/* Logo Upload */}
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Button
            variant="outlined"
            component="label"
            sx={{ minWidth: "140px" }}
          >
            {file ? "Change Logo" : "Upload Logo"}
            <input
              hidden
              type="file"
              accept="image/*,image/svg+xml"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>
          {file && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setFile(null)}
            >
              Cancel
            </Button>
          )}
          {setting.logo && !file && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setSetting({ ...setting, logo: null })}
            >
              Remove Logo
            </Button>
          )}
          {setting.logo && !file ? (
            <Typography variant="caption">Current logo set</Typography>
          ) : file ? (
            <Typography variant="caption" color="success.main">
              New logo selected
            </Typography>
          ) : (
            <Typography variant="caption" color="text.secondary">
              No logo uploaded
            </Typography>
          )}
        </Stack>

        {/* Logo Preview */}
        {(setting.logo || file) && (
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Logo Preview:
            </Typography>
            <div
              style={{
                border: "2px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fafafa",
                textAlign: "center",
                maxWidth: "320px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {file && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="New logo preview"
                  style={{
                    maxHeight: "100px",
                    maxWidth: "220px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              ) : setting.logo ? (
                <img
                  src={setting.logo}
                  alt="Current logo"
                  style={{
                    maxHeight: "100px",
                    maxWidth: "220px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              ) : null}
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 2, color: "text.secondary", fontWeight: "medium" }}
              >
                {file ? `New logo: ${file.name}` : "Current logo"}
              </Typography>
              {file && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                >
                  Size: {(file.size / 1024).toFixed(1)} KB
                </Typography>
              )}
            </div>
          </Stack>
        )}
      </Stack>

      {/* Contact Information */}
      <Typography variant="h6" sx={{ color: "primary.main", mt: 3 }}>
        Contact Information
      </Typography>
      <TextField
        label="Company Address"
        value={setting.address || ""}
        onChange={(e) => setSetting({ ...setting, address: e.target.value })}
        multiline
        minRows={2}
        helperText="Full company address for payslips and documents"
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Phone Number"
          value={setting.phone || ""}
          onChange={(e) => setSetting({ ...setting, phone: e.target.value })}
          helperText="Main company phone"
        />
        <TextField
          label="Email Address"
          type="email"
          value={setting.email || ""}
          onChange={(e) => setSetting({ ...setting, email: e.target.value })}
          helperText="Contact email for inquiries"
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Website"
          value={setting.website || ""}
          onChange={(e) => setSetting({ ...setting, website: e.target.value })}
          helperText="Company website URL"
        />
        <TextField
          label="Registration Number"
          value={setting.registration_number || ""}
          onChange={(e) =>
            setSetting({ ...setting, registration_number: e.target.value })
          }
          helperText="Tax ID or registration number"
        />
      </Stack>

      {/* Theme & Appearance */}
      <Typography variant="h6" sx={{ color: "primary.main", mt: 3 }}>
        Theme & Appearance
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Primary Color"
          value={setting.primary_color || ""}
          onChange={(e) =>
            setSetting({ ...setting, primary_color: e.target.value })
          }
        />
        <TextField
          label="Secondary Color"
          value={setting.secondary_color || ""}
          onChange={(e) =>
            setSetting({ ...setting, secondary_color: e.target.value })
          }
        />
        <FormControl fullWidth>
          <InputLabel>Theme</InputLabel>
          <Select
            label="Theme"
            value={setting.theme_mode || "light"}
            onChange={(e) =>
              setSetting({ ...setting, theme_mode: e.target.value })
            }
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Business Configuration */}
      <Typography variant="h6" sx={{ color: "primary.main", mt: 3 }}>
        Business Configuration
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Commission Based</InputLabel>
        <Select
          label="Commission Based"
          value={setting.commission_enabled ? "yes" : "no"}
          onChange={(e) =>
            setSetting({
              ...setting,
              commission_enabled: e.target.value === "yes",
            })
          }
        >
          <MenuItem value="no">No</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Advanced Settings (JSON)"
        value={JSON.stringify(setting.extras || {})}
        onChange={(e) => {
          try {
            setSetting({
              ...setting,
              extras: JSON.parse(e.target.value || "{}"),
            });
          } catch {
            /* ignore */
          }
        }}
        multiline
        minRows={3}
        helperText="Advanced configuration in JSON format"
      />

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button disabled={loading} variant="contained" onClick={save}>
          Save
        </Button>
        <Button disabled={loading} onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Stack>
    </Stack>
  );
}
