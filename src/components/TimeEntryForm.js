import React, { useState } from 'react';

export default function TimeEntryForm({ onSubmit, billing }) {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('On-going');
  const [error, setError] = useState('');

  const handleStatusChange = (value) => {
    setStatus(status === value ? 'On-going' : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (billing === 'Hourly') {
      if (!date || !hours) {
        setError('Date and Hours are required.');
        return;
      }
      setError('');
      onSubmit({ date, hours, description, status });
      setDate('');
      setHours('');
      setDescription('');
      setStatus('On-going');
    } else if (billing === 'Fixed') {
      if (status !== 'Completed' && status !== 'Cancelled') {
        setError('You must select Completed or Cancelled for Fixed projects.');
        return;
      }
      setError('');
      onSubmit({ status, description });
      setDescription('');
      setStatus('On-going');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white flex flex-col gap-3 max-w-xl">
      {billing === 'Hourly' && (
        <>
          <input
            type="date"
            name="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            min="0"
            step="0.1"
            name="hours"
            placeholder="Hours"
            value={hours}
            onChange={e => setHours(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
        </>
      )}
      {/* Description is always optional */}
      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded px-3 py-2"
      />
      {/* Status logic */}
      {billing === 'Hourly' && (
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              value="Completed"
              checked={status === 'Completed'}
              onChange={() => handleStatusChange('Completed')}
            />
            Completed
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              value="Cancelled"
              checked={status === 'Cancelled'}
              onChange={() => handleStatusChange('Cancelled')}
            />
            Cancelled
          </label>
          <span className="text-gray-500 text-sm">(Optional, default is On-going)</span>
        </div>
      )}
      {billing === 'Fixed' && (
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              value="Completed"
              checked={status === 'Completed'}
              onChange={() => handleStatusChange('Completed')}
            />
            Completed
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              value="Cancelled"
              checked={status === 'Cancelled'}
              onChange={() => handleStatusChange('Cancelled')}
            />
            Cancelled
          </label>
          <span className="text-gray-500 text-sm">(Required for Fixed projects)</span>
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded">Log Time</button>
    </form>
  );
} 