import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoicesContext";
import { useProjects } from "../context/ProjectsContext";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

export default function ProjectInvoices() {
  const { projectId } = useParams();
  const { invoices, removeInvoice } = useInvoices();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const { fetchWithAuth } = useContext(AuthContext);

  const project = projects.find((p) => String(p.id) === String(projectId));
  const projectInvoices = invoices.filter(
    (inv) => String(inv.project?.id) === String(projectId),
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Button variant="text" onClick={() => navigate("/invoices")}>
        &larr; Back to All Invoices
      </Button>
      {project ? (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Invoices for {project.name}
          </Typography>
          {projectInvoices.length === 0 ? (
            <Typography color="text.secondary">
              No invoices for this project yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {Array.isArray(projectInvoices)
                ? projectInvoices.map((inv) => (
                    <Card key={inv.id}>
                      <CardContent>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
                          {inv.due_date && (
                            <Chip label={`Due: ${inv.due_date}`} size="small" />
                          )}
                        </Stack>
                        <Typography>Amount: ${inv.amount}</Typography>
                        {inv.note && (
                          <Typography variant="body2" color="text.secondary">
                            {inv.note}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={async () => {
                              const res = await fetchWithAuth(
                                `/api/v1/invoices/${inv.id}/download_pdf/`,
                                { method: "GET" },
                              );
                              if (res.ok) {
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `invoice_${inv.id}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                                window.URL.revokeObjectURL(url);
                              } else {
                                alert("Failed to download invoice PDF.");
                              }
                            }}
                          >
                            Download PDF
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              window.open(
                                `/api/v1/invoices/${inv.id}/view_pdf/`,
                                "_blank",
                              )
                            }
                          >
                            View PDF
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={async () => {
                              const reason = window.prompt(
                                "Please provide a reason for deleting this invoice:",
                              );
                              if (!reason) return;
                              try {
                                await removeInvoice(inv.id, reason);
                              } catch {
                                // no-op
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                : null}
            </Stack>
          )}
        </>
      ) : (
        <Typography color="error">Project not found.</Typography>
      )}
    </div>
  );
}
