import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useInvoices } from "../context/InvoicesContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Stack,
  Container,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";

function Dashboard() {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { username } = useContext(AuthContext);
  const { fetchWithAuth } = useContext(AuthContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : "Good evening";

  const [analytics, setAnalytics] = useState(null);
  const [month, setMonth] = useState(""); // YYYY-MM
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const url = month
        ? `/api/v1/invoices/analytics/?month=${month}`
        : "/api/v1/invoices/analytics/";
      const res = await fetchWithAuth(url);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        setAnalytics(null);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [fetchWithAuth, month]);

  const revenueSeries = useMemo(() => {
    if (!analytics)
      return {
        x: [],
        net: [],
        gross: [],
        projX: [],
        projNet: [],
        projGross: [],
      };
    const x = analytics.revenue_trend.map(
      (t) =>
        `${t.created_at__year}-${String(t.created_at__month).padStart(2, "0")}`,
    );
    const net = analytics.revenue_trend.map((t) => Number(t.total_net || 0));
    const gross = analytics.revenue_trend.map((t) =>
      Number(t.total_gross || 0),
    );
    const projX = (analytics.revenue_projection || []).map(
      (t) => `${t.year}-${String(t.month).padStart(2, "0")}`,
    );
    const projNet = (analytics.revenue_projection || []).map((t) =>
      Number(t.projected_net || 0),
    );
    const projGross = (analytics.revenue_projection || []).map((t) =>
      Number(t.projected_gross || 0),
    );
    return { x, net, gross, projX, projNet, projGross };
  }, [analytics]);

  const projectsTrend = useMemo(() => {
    if (!analytics?.projects_trend) return { x: [], active: [] };
    const x = analytics.projects_trend.map(
      (t) => `${t.year}-${String(t.month).padStart(2, "0")}`,
    );
    const active = analytics.projects_trend.map((t) =>
      Number(t.active_projects || 0),
    );
    return { x, active };
  }, [analytics]);

  return (
    <div
      className={`flex-1 min-h-screen transition-all duration-300 ${sidebarHovered ? "ml-56" : "ml-16"}`}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ md: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h4">
            {greeting} {username}!
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
          >
            <TextField
              type="month"
              label="Month"
              InputLabelProps={{ shrink: true }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              size="small"
            />
            <Button onClick={() => setMonth("")}>Clear</Button>
          </Stack>
        </Stack>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          analytics && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      alignItems={{ md: "center" }}
                    >
                      <Typography variant="subtitle2">
                        Filter by Month
                      </Typography>
                      <TextField
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        size="small"
                      />
                      {analytics?.month && (
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={2}
                        >
                          <Typography variant="body2">
                            Active Projects:{" "}
                            {analytics.month.active_projects || 0}
                          </Typography>
                          <Typography variant="body2">
                            Total Hours: {analytics.month.hours_total || 0}
                          </Typography>
                          <Typography variant="body2">
                            Paid (Net): ${analytics.month.paid_net_month || 0}
                          </Typography>
                          <Typography variant="body2">
                            Unpaid (Gross): $
                            {analytics.month.unpaid_gross_month || 0}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">
                      Total Invoiced (Month)
                    </Typography>
                    <Typography variant="h6">
                      ${analytics.total_invoiced_month}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">Total Paid</Typography>
                    <Typography variant="h6">
                      ${analytics.total_paid}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">Total Unpaid</Typography>
                    <Typography variant="h6">
                      ${analytics.total_unpaid}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Revenue Trend (Gross vs Net)
                    </Typography>
                    <LineChart
                      height={300}
                      xAxis={[
                        {
                          scaleType: "point",
                          data: [...revenueSeries.x, ...revenueSeries.projX],
                        },
                      ]}
                      series={[
                        {
                          id: "net",
                          label: "Net",
                          data: [
                            ...revenueSeries.net,
                            ...Array(revenueSeries.projNet.length).fill(null),
                          ],
                          color: "#2e7d32",
                        },
                        {
                          id: "gross",
                          label: "Gross",
                          data: [
                            ...revenueSeries.gross,
                            ...Array(revenueSeries.projGross.length).fill(null),
                          ],
                          color: "#1976d2",
                        },
                        {
                          id: "netProj",
                          label: "Projected Net",
                          data: [
                            ...Array(revenueSeries.net.length).fill(null),
                            ...revenueSeries.projNet,
                          ],
                          color: "#66bb6a",
                        },
                        {
                          id: "grossProj",
                          label: "Projected Gross",
                          data: [
                            ...Array(revenueSeries.gross.length).fill(null),
                            ...revenueSeries.projGross,
                          ],
                          color: "#90caf9",
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Status Breakdown
                    </Typography>
                    <PieChart
                      height={300}
                      series={[
                        {
                          data: analytics.status_breakdown.map((s) => ({
                            id: s.status,
                            label: s.status,
                            value: s.count,
                          })),
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>
              {analytics?.month?.hours_by_project?.length ? (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Hours by Project ({month || "Current Month"})
                      </Typography>
                      <BarChart
                        height={300}
                        xAxis={[
                          {
                            scaleType: "band",
                            data: analytics.month.hours_by_project.map(
                              (h) => h.project_name,
                            ),
                          },
                        ]}
                        series={[
                          {
                            data: analytics.month.hours_by_project.map((h) =>
                              Number(h.hours),
                            ),
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ) : null}
              {projectsTrend.x.length ? (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Active Projects by Month
                      </Typography>
                      <BarChart
                        height={300}
                        xAxis={[{ scaleType: "band", data: projectsTrend.x }]}
                        series={[
                          { data: projectsTrend.active, color: "#6a1b9a" },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ) : null}
            </Grid>
          )
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
