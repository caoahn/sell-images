import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import { MOCK_EVENTS } from '../data/mockData';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const fetchEvents = React.useCallback(async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch {
      console.warn('Failed to fetch events, using mock data');
      setEvents(MOCK_EVENTS);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async () => {
    try {
      if (!newEventName) return;
      await api.post('/events', { name: newEventName, date: new Date(), schoolId: null });
      setNewEventName('');
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !uploadFiles) return;

    const formData = new FormData();
    formData.append('eventId', selectedEventId);
    formData.append('price', '5.00'); // Default price
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append('photos', uploadFiles[i]);
    }

    try {
      setUploadMessage('Uploading...');
      // Axios automatically sets Content-Type with boundary for FormData
      await api.post('/photos/upload', formData);
      setUploadMessage('Upload Successful!');
      setUploadFiles(null);
    } catch (err) {
      setUploadMessage('Upload Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Photographer Dashboard</h1>

      {/* Create Event */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Event Name (e.g. Class 1A)"
            className="border p-2 rounded flex-1"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <button onClick={createEvent} className="bg-primary text-white px-6 py-2 rounded">Create</button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Upload Photos</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Select Event</label>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">-- Choose Event --</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name} (Code: {ev.accessCode})</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">Select Photos</label>
            <input
              type="file" multiple
              accept="image/*"
              className="w-full bg-gray-50 border border-gray-300 rounded p-2"
              onChange={(e) => setUploadFiles(e.target.files)}
            />
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-lg font-bold shadow transition-colors">
            Upload & Process Watermark
          </button>

          {uploadMessage && <p className="mt-4 text-blue-600">{uploadMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
