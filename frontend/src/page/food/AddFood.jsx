import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import '../../css/Food.css';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

function AddFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Breakfast', quantity: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) { setError('Name, price and quantity are required.'); return; }
    setLoading(true);
    try {
      await foodService.addFood({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
      navigate('/admin/foods');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-page-container">
      <FoodNavbar />
      <div className="food-content-wrap">
        <div className="page-header">
          <div className="page-title-section">
            <h1>Add New Dish</h1>
            <p className="page-subtitle">Fill in the details to add a new item to the menu.</p>
          </div>
          <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>← Back</Link>
        </div>

        <div className="form-dashboard-wrapper">
          <div className="form-card-centered">
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Masala Dosa" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} placeholder="Brief description of the dish..." />
              </div>
              <div className="form-grid-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-actions-row">
                <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>Cancel</Link>
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Adding...' : 'Add Dish'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFood;
