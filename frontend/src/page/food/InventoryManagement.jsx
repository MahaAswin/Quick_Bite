import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import AccessDenied from '../../components/food/AccessDenied';
import '../../css/Food.css';

const InventoryManagement = () => {
  // Role Protection State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('quickbite_mock_role') === 'ADMIN';
  });

  const [foods, setFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Dashboard statistics
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Inline stock editor states
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(0);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('quickbite_mock_role') === 'ADMIN');
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadInventoryData();
    }
  }, [activeTab, isAdmin]);

  const loadInventoryData = () => {
    try {
      const allFoods = foodService.getAllFoods();
      const lowStockFoods = foodService.getLowStockFoods();
      const availableFoods = foodService.getAvailableFoods();
      const outOfStockFoods = foodService.getOutOfStockFoods();

      setStats({
        total: allFoods.length,
        available: availableFoods.length,
        lowStock: lowStockFoods.length,
        outOfStock: outOfStockFoods.length
      });

      // Populate list based on current selection
      if (activeTab === 'all') {
        setFoods(allFoods);
      } else if (activeTab === 'low-stock') {
        setFoods(lowStockFoods);
      } else if (activeTab === 'available') {
        setFoods(availableFoods);
      } else if (activeTab === 'out-of-stock') {
        setFoods(outOfStockFoods);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    }
  };

  // Start stock editor
  const handleStartEdit = (food) => {
    setEditingId(food.id);
    setEditQty(food.quantity);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const adjustQty = (amount) => {
    setEditQty((prev) => Math.max(0, prev + amount));
  };

  // Save Stock modification
  const handleSaveStock = (id) => {
    try {
      foodService.updateStock(id, editQty);
      setEditingId(null);
      loadInventoryData();
    } catch (err) {
      console.error(err);
      alert('Failed to update stock qty.');
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
        {/* Table & Stats Dashboard Container */}
        <div className="table-dashboard-wrapper">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-section">
              <h1>Inventory & Stock Control</h1>
              <p className="page-subtitle">Track quantities, monitor low stock items, and audit logs.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>
                ← Back to Menu
              </Link>
              <Link to="/foods/history" className="btn-submit" style={{ textDecoration: 'none', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--primary-accent)' }}>
                🕒 System Audit Logs
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stats-banner">
            <div 
              className="stat-card" 
              style={{ cursor: 'pointer', border: activeTab === 'all' ? '1px solid var(--primary-accent)' : '' }} 
              onClick={() => setActiveTab('all')}
            >
              <div className="stat-icon-wrap icon-blue">📋</div>
              <div className="stat-info">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Foods</span>
              </div>
            </div>

            <div 
              className="stat-card" 
              style={{ cursor: 'pointer', border: activeTab === 'available' ? '1px solid var(--primary-accent)' : '' }} 
              onClick={() => setActiveTab('available')}
            >
              <div className="stat-icon-wrap icon-green">✅</div>
              <div className="stat-info">
                <span className="stat-number">{stats.available}</span>
                <span className="stat-label">Available Foods</span>
              </div>
            </div>

            <div 
              className="stat-card" 
              style={{ cursor: 'pointer', border: activeTab === 'low-stock' ? '1px solid var(--primary-accent)' : '' }} 
              onClick={() => setActiveTab('low-stock')}
            >
              <div className="stat-icon-wrap icon-orange">⚠️</div>
              <div className="stat-info">
                <span className="stat-number">{stats.lowStock}</span>
                <span className="stat-label">Low Stock (&lt;5)</span>
              </div>
            </div>

            <div 
              className="stat-card" 
              style={{ cursor: 'pointer', border: activeTab === 'out-of-stock' ? '1px solid var(--primary-accent)' : '' }} 
              onClick={() => setActiveTab('out-of-stock')}
            >
              <div className="stat-icon-wrap icon-red">❌</div>
              <div className="stat-info">
                <span className="stat-number">{stats.outOfStock}</span>
                <span className="stat-label">Out of Stock</span>
              </div>
            </div>
          </div>

          {/* Tab Selection Row */}
          <div className="inventory-tabs">
            <button className={`inventory-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              All Items ({stats.total})
            </button>
            <button className={`inventory-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
              Available ({stats.available})
            </button>
            <button className={`inventory-tab ${activeTab === 'low-stock' ? 'active' : ''}`} onClick={() => setActiveTab('low-stock')}>
              Low Stock ({stats.lowStock})
            </button>
            <button className={`inventory-tab ${activeTab === 'out-of-stock' ? 'active' : ''}`} onClick={() => setActiveTab('out-of-stock')}>
              Out of Stock ({stats.outOfStock})
            </button>
          </div>

          {/* Inventory Table */}
          {foods.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-state-icon">📦</div>
              <h3>No Inventory Records</h3>
              <p>No mock dishes match the tab category "{activeTab}".</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Food Name</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Status Badge</th>
                      <th>Quick Adjust</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => {
                      const isEditing = editingId === food.id;
                      const isLowStock = food.quantity > 0 && food.quantity < 5;
                      const isOutOfStock = food.quantity <= 0;
                      
                      return (
                        <tr key={food.id}>
                          <td>
                            <img 
                              src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'} 
                              alt={food.name} 
                              className="table-img-cell"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
                              }}
                            />
                          </td>
                          <td style={{ fontWeight: '600' }}>{food.name}</td>
                          <td style={{ textTransform: 'capitalize' }}>{food.category}</td>
                          
                          <td style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                            {isEditing ? (
                              <span style={{ color: 'var(--primary-accent)' }}>{editQty}</span>
                            ) : (
                              food.quantity
                            )}
                          </td>
                          
                          {/* Status Badges */}
                          <td>
                            <span className={`food-badge-stock ${
                              isOutOfStock ? 'badge-outofstock' : isLowStock ? 'badge-lowstock' : 'badge-instock'
                            }`} style={{ position: 'static' }}>
                              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Available'}
                            </span>
                          </td>
                          
                          {/* Stock Adjustment Controls */}
                          <td>
                            {isEditing ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <button 
                                  type="button" 
                                  className="btn-page-step"
                                  onClick={() => adjustQty(-5)}
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                  title="-5"
                                >
                                  -5
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-page-step"
                                  onClick={() => adjustQty(-1)}
                                  style={{ width: '32px', height: '32px' }}
                                  title="-1"
                                >
                                  -
                                </button>
                                
                                <input
                                  type="number"
                                  className="price-input"
                                  value={editQty}
                                  onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                                  style={{ width: '55px', textAlign: 'center', padding: '0.4rem 0.25rem' }}
                                  min="0"
                                />

                                <button 
                                  type="button" 
                                  className="btn-page-step"
                                  onClick={() => adjustQty(1)}
                                  style={{ width: '32px', height: '32px' }}
                                  title="+1"
                                >
                                  +
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-page-step"
                                  onClick={() => adjustQty(5)}
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                  title="+5"
                                >
                                  +5
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleStartEdit(food)} 
                                className="btn-logout"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                              >
                                Edit Stock
                              </button>
                            )}
                          </td>
                          
                          {/* Action buttons */}
                          <td>
                            <div className="action-buttons-cell">
                              {isEditing ? (
                                <>
                                  <button 
                                    onClick={() => handleSaveStock(food.id)} 
                                    className="btn-submit"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={handleCancelEdit} 
                                    className="btn-logout"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Link 
                                    to={`/foods/edit/${food.id}`} 
                                    className="btn-action-icon btn-action-edit"
                                    title="Edit properties"
                                  >
                                    ✏️
                                  </Link>
                                  <Link 
                                    to="/foods/history" 
                                    className="btn-action-icon btn-action-history"
                                    title="Stock Update logs"
                                  >
                                    🕒
                                  </Link>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
