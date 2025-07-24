import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const InvoicesContext = createContext();

export function InvoicesProvider({ children }) {
  const [invoices, setInvoices] = useState([]); // Only in-memory state
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch invoices from backend on mount
    const fetchInvoices = async () => {
      const res = await fetchWithAuth('/api/invoice/');
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    };
    fetchInvoices();
  }, [fetchWithAuth]);

  const addInvoice = async (invoice) => {
    const res = await fetchWithAuth('/api/invoice/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices((prev) => [...prev, data]);
    } else {
      alert('Failed to create invoice in backend.');
    }
  };

  const updateInvoice = async (id, updated) => {
    const res = await fetchWithAuth(`/api/invoice/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? data : inv)));
    } else {
      alert('Failed to update invoice in backend.');
    }
  };

  const removeInvoice = async (id) => {
    const res = await fetchWithAuth(`/api/invoice/${id}/`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } else {
      alert('Failed to delete invoice in backend.');
    }
  };

  return (
    <InvoicesContext.Provider value={{ invoices, addInvoice, updateInvoice, removeInvoice }}>
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoicesContext);
} 