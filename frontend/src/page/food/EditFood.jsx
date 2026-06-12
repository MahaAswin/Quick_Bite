import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import '../../css/Food.css';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    foodService.getFoodById(id)
      .then(res => {
        const f = res.data;
        setForm({ name: f.name, description: f.description || '', price: f.price, category: f.category, quantity: f.quantity, imageUrl: f.imageUrl || '' });
      })
      .catch(() => setError('Food item not found.'));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || form.quantity === '') { setError('Name, price and quantity are required.'); return; }
    setLoading(true);
    try {
      await foodService.updateFood(id, { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) });
      navigate('/admin/foods');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update food item.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return (
    <div className="food-page-container">
      <FoodNavbar />
      <div className="food-content-wrap">
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>← Back</Link>
      </div>
    </div>
  );

  if (!form) return (
    <div className="food-page-container">
      <FoodNavbar />
      <div className="food-content-wrap loading-indicator-container">
        <div className="loading-spinner" />
      </div>
    </div>
  );

  return (
    <div className="food-page-container">
      <FoodNavbar />
      <div className="food-content-wrap">
        <div className="page-header">
          <div className="page-title-section">
            <h1>Edit Dish</h1>
            <p className="page-subtitle">Update the details for this menu item.</p>
          </div>
          <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>← Back</Link>
        </div>

        <div className="form-dashboard-wrapper">
          <div className="form-card-centered">
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
              </div>
              <div className="form-grid-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
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
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </div>
              <div className="form-actions-row">
                <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>Cancel</Link>
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditFood;
