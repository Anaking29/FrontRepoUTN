import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Edit2, Trash2, Plus, Tags } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
        await api.put(`/categories/${editId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditId(category._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might fail if events are still using it.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error(err);
        alert('Could not delete category');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn" style={{ width: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => { setEditId(null); setFormData({ name: '', description: '' }); setShowModal(true); }}>
          <Plus size={20} /> Create Category
        </button>
      </div>

      <div className="card-grid">
        {categories.map(category => (
          <div key={category._id} className="item-card">
            <div className="item-header">
              <div className="item-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tags size={18} color="var(--primary)" /> {category.name}
              </div>
              <div className="item-actions">
                <button className="icon-btn" onClick={() => handleEdit(category)}><Edit2 size={16} /></button>
                <button className="icon-btn delete" onClick={() => handleDelete(category._id)}><Trash2 size={16} /></button>
              </div>
            </div>
            {category.description && <p className="item-desc">{category.description}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editId ? 'Edit Category' : 'Create Category'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
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

export default Categories;
