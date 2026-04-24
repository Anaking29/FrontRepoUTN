import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, MapPin, Clock, Edit2, Trash2, Plus } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/events/${editId}`, formData);
      } else {
        await api.post('/events', formData);
      }
      setShowModal(false);
      setFormData({ title: '', description: '', date: '', location: '', category: '' });
      setEditId(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving event');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      category: event.category._id
    });
    setEditId(event._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Your Events</h1>
        <button className="btn" style={{ width: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => { setEditId(null); setFormData({ title: '', description: '', date: '', location: '', category: '' }); setShowModal(true); }}>
          <Plus size={20} /> Create Event
        </button>
      </div>

      <div className="card-grid">
        {events.map(event => (
          <div key={event._id} className="item-card">
            <div className="item-header">
              <div className="item-title">{event.title}</div>
              <div className="item-actions">
                <button className="icon-btn" onClick={() => handleEdit(event)}><Edit2 size={16} /></button>
                <button className="icon-btn delete" onClick={() => handleDelete(event._id)}><Trash2 size={16} /></button>
              </div>
            </div>
            {event.description && <p className="item-desc">{event.description}</p>}
            <div className="item-meta">
              <div className="meta-row">
                <Calendar size={14} /> {new Date(event.date).toLocaleString()}
              </div>
              <div className="meta-row">
                <MapPin size={14} /> {event.location}
              </div>
              <div className="meta-row" style={{ marginTop: '8px' }}>
                <span className="badge">{event.category?.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editId ? 'Edit Event' : 'Create Event'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required disabled={categories.length === 0}>
                  {categories.length === 0 ? (
                    <option value="">⚠️ Please create a category first!</option>
                  ) : (
                    <option value="">Select a category</option>
                  )}
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <div className="error-message" style={{ marginTop: '4px' }}>
                    You must go to the Categories tab and create one before creating an event.
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
