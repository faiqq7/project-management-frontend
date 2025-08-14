import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const InvoicesContext = createContext();

export function InvoicesProvider({ children }) {
  const [invoices, setInvoices] = useState([]); // Only in-memory state
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch invoices from backend on mount
    const fetchInvoices = async () => {
      const res = await fetchWithAuth("/api/v1/invoices/");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.results || data);
      }
    };
    fetchInvoices();
  }, [fetchWithAuth]);

  const refreshInvoices = async (params = "") => {
    const res = await fetchWithAuth(`/api/v1/invoices/${params}`);
    if (res.ok) {
      const data = await res.json();
      setInvoices(data.results || data);
    }
  };

  const addInvoice = async (invoice) => {
    const payload = {
      ...invoice,
      // Normalize common field names
      project_id: invoice.project_id || invoice.project,
    };
    delete payload.project;
    const res = await fetchWithAuth("/api/v1/invoices/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
    } else {
      alert("Failed to create invoice in backend.");
    }
  };

  const updateInvoice = async (id, updated) => {
    const res = await fetchWithAuth(`/api/v1/invoices/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices((prev) =>
        Array.isArray(prev)
          ? prev.map((inv) => (inv.id === id ? data : inv))
          : [data],
      );
    } else {
      alert("Failed to update invoice in backend.");
    }
  };

  const removeInvoice = async (id, reason) => {
    const res = await fetchWithAuth(`/api/v1/invoices/${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      setInvoices((prev) =>
        Array.isArray(prev) ? prev.filter((inv) => inv.id !== id) : [],
      );
    } else {
      alert("Failed to delete invoice in backend.");
    }
  };

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        removeInvoice,
        refreshInvoices,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoicesContext);
}
