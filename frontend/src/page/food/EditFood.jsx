import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import AccessDenied from '../../components/food/AccessDenied';
import '../../css/Food.css';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Role Protection State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('quickbite_mock_role') === 'ADMIN';
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
    quantity: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

  useEffect(() => {
    setIsAdmin(localStorage.getItem('quickbite_mock_role') === 'ADMIN');
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    try {
      const food = foodService.getFoodById(id);
      setFormData({
        name: food.name || '',
        description: food.description || '',
        price: food.price || '',
        category: food.category || 'Breakfast',
        quantity: food.quantity !== undefined ? food.quantity : '',
        imageUrl: food.imageUrl || ''
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(`Mock Food Listing #${id} could not be retrieved from localStorage.`);
      setLoading(false);
    }
  }, [id, isAdmin]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, quantity, category, description, imageUrl } = formData;
    
    // Validations
    if (!name.trim()) {
      setError('Food name is required');
      return;
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a valid number greater than 0');
      return;
    }

    const parsedQty = parseInt(quantity);
    if (isNaN(parsedQty) || parsedQty < 0) {
      setError('Stock quantity must be a non-negative number');
      return;
    }

    setError('');
    setSuccess('');

    try {
      foodService.updateFood(id, {
        name,
        description,
        price: parsedPrice,
        category,
        quantity: parsedQty,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
      });

      setSuccess(`Success! "${name}" has been updated in local storage.`);
      
      setTimeout(() => {
        navigate('/foods');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Something went wrong saving the food item.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="food-page-container">
        <FoodNavbar />
        <div className="food-content-wrap">
          <AccessDenied />
        </div>
      </div>
    );
  }

  return (
    <div className="food-page-container">
      <FoodNavbar />
      
      <div className="food-content-wrap">
        {/* Back navigation header */}
        <div className="page-header" style={{ maxWidth: '650px', margin: '0 auto 1.5rem auto' }}>
          <div className="page-title-section">
            <Link to="/foods" style={{ color: 'var(--primary-accent)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
              ← Cancel and Back to Listings
            </Link>
            <h1 style={{ fontSize: '1.75rem' }}>Modify Food Properties</h1>
            <p className="page-subtitle">Update values for Item ID: #{id}.</p>
          </div>
        </div>

        {/* Centered Dashboard Form */}
        <div className="form-dashboard-wrapper">
          <div className="form-card-centered">
            {error && <div className="auth-error-banner" style={{ marginBottom: '1.5rem' }}>{error}</div>}
            {success && <div className="auth-success-banner" style={{ marginBottom: '1.5rem' }}>{success}</div>}
            
            {loading ? (
              <div className="loading-indicator-container" style={{ padding: '2rem 0' }}>
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading item properties...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="food-form">
                <div className="form-group">
                  <label htmlFor="name">Food Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-textarea"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grid-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-row">
                  <div className="form-group">
                    <label htmlFor="quantity">Stock Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="imageUrl">Image URL (Optional)</label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <Link to="/foods" className="btn-cancel">
                    Cancel
                  </Link>
                  <button type="submit" className="btn-submit">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFood;
