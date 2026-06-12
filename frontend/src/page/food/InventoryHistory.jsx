import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import '../../css/Food.css';

function InventoryHistory() {
  const [foods, setFoods] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await foodService.getAllFoods();
      setFoods(res.data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (id) => {
    try {
      const res = await foodService.getAllHistory(id);
      setHistory(prev => {
        const filtered = prev.filter(h => h.foodId !== id);
        return [...filtered, ...res.data];
      });
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'history' && foods.length > 0) {
      const allHistory = [];
      for (const food of foods) {
        try {
          const res = await foodService.getAllHistory(food.id);
          allHistory.push(...res.data);
        } catch {}
      }
      allHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
      setHistory(allHistory);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await foodService.updateStock(id, parseInt(editQty));
      await loadData();
      setEditingId(null);
      setEditQty('');
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const lowStock = foods.filter(f => f.quantity > 0 && f.quantity < 5);
  const outOfStock = foods.filter(f => f.quantity <= 0);

  return (
    <div className="food-page-container">
      <FoodNavbar />
      <div className="food-content-wrap">
        <div className="page-header">
          <div className="page-title-section">
            <h1>Inventory Management</h1>
            <p className="page-subtitle">Monitor stock levels and view update history.</p>
          </div>
          <Link to="/admin/foods" className="btn-cancel" style={{ textDecoration: 'none' }}>← Back</Link>
        </div>

        {/* Stats */}
        <div className="stats-banner">
          <div className="stat-card">
            <div className="stat-icon-wrap icon-blue">📦</div>
            <div className="stat-info">
              <span className="stat-number">{foods.length}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap icon-orange">⚠️</div>
            <div className="stat-info">
              <span className="stat-number">{lowStock.length}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap icon-red">🚫</div>
            <div className="stat-info">
              <span className="stat-number">{outOfStock.length}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="inventory-tabs">
          <button className={`inventory-tab ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => handleTabChange('stock')}>Stock Levels</button>
          <button className={`inventory-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => handleTabChange('history')}>Update History</button>
        </div>

        {loading ? (
          <div className="loading-indicator-container"><div className="loading-spinner" /></div>
        ) : (
          <>
            {/* Stock Levels Tab */}
            {activeTab === 'stock' && (
              <div className="table-dashboard-wrapper">
                <div className="admin-table-container">
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Update Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foods.map(food => {
                          const isOut = food.quantity <= 0;
                          const isLow = food.quantity > 0 && food.quantity < 5;
                          return (
                            <tr key={food.id}>
                              <td>#{food.id}</td>
                              <td>{food.name}</td>
                              <td>{food.category}</td>
                              <td><strong>{food.quantity}</strong></td>
                              <td>
                                <span className={`food-badge-stock ${isOut ? 'badge-outofstock' : isLow ? 'badge-lowstock' : 'badge-instock'}`} style={{ position: 'static', boxShadow: 'none' }}>
                                  {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                </span>
                              </td>
                              <td>
                                {editingId === food.id ? (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input type="number" min="0" value={editQty} onChange={e => setEditQty(e.target.value)} className="price-input" />
                                    <button className="btn-submit" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleUpdateStock(food.id)}>Save</button>
                                    <button className="btn-cancel" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                                  </div>
                                ) : (
                                  <button className="btn-action-icon btn-action-stock" style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                                    onClick={() => { setEditingId(food.id); setEditQty(food.quantity); }}>
                                    ✏️ Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="table-dashboard-wrapper">
                <div className="admin-table-container">
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Food Item</th>
                          <th>Old Qty</th>
                          <th>New Qty</th>
                          <th>Change</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.length === 0 ? (
                          <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No history records yet.</td></tr>
                        ) : history.map((h, i) => {
                          const diff = h.newQuantity - h.oldQuantity;
                          return (
                            <tr key={i}>
                              <td>{h.id}</td>
                              <td>{h.foodName}</td>
                              <td>{h.oldQuantity}</td>
                              <td>{h.newQuantity}</td>
                              <td>
                                <span className={`history-diff-badge ${diff >= 0 ? 'diff-positive' : 'diff-negative'}`}>
                                  {diff >= 0 ? `+${diff}` : diff}
                                </span>
                              </td>
                              <td>{new Date(h.changedAt || h.updateTimestamp).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InventoryHistory;
