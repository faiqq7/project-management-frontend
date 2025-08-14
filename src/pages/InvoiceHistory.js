import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

export default function InvoiceHistory() {
  const { invoiceId } = useParams();
  const { fetchWithAuth } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchWithAuth(`/api/v1/invoices/${invoiceId}/`);
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();
        setInvoice(data);
      } catch (e) {
        setError(e.message || "Failed");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [fetchWithAuth, invoiceId]);

  return (
    <div className="p-12 ml-8">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Invoice History</Typography>
        <Button component={Link} to="/invoices" variant="outlined">
          Back to Invoices
        </Button>
      </Stack>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : invoice ? (
        <>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">Invoice #{invoice.id}</Typography>
              <Typography variant="body2">
                Project: {invoice.project?.name}
              </Typography>
              <Typography variant="body2">Status: {invoice.status}</Typography>
              <Typography variant="body2">Amount: ${invoice.amount}</Typography>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Actor</TableCell>
                  <TableCell>Metadata</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(invoice.activities || []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.created_at}</TableCell>
                    <TableCell>{a.action}</TableCell>
                    <TableCell>{a.message}</TableCell>
                    <TableCell>{a.actor || "-"}</TableCell>
                    <TableCell>
                      <pre style={{ margin: 0, fontFamily: "monospace" }}>
                        {JSON.stringify(a.metadata || {}, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </div>
  );
}
