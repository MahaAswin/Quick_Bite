import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import AccessDenied from '../../components/food/AccessDenied';
import '../../css/Food.css';

const InventoryHistory = () => {
  // Role Protection State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('quickbite_mock_role') === 'ADMIN';
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('quickbite_mock_role') === 'ADMIN');
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadHistoryLogs();
    }
  }, [isAdmin]);

  const loadHistoryLogs = () => {
    try {
      const logs = foodService.getAllHistory();
      setHistory(logs);
    } catch (err) {
      console.error('Failed to load history logs:', err);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all mock audit history logs?')) {
      localStorage.setItem('quickbite_mock_history', JSON.stringify([]));
      loadHistoryLogs();
    }
  };

  const formatTimestamp = (timestampString) => {
    if (!timestampString) return 'N/A';
    try {
      const date = new Date(timestampString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return timestampString;
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
        {/* Table Dashboard Container */}
        <div className="table-dashboard-wrapper">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-section">
              <Link to="/foods/inventory" style={{ color: 'var(--primary-accent)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                ← Back to Inventory Manager
              </Link>
              <h1>System Audit Logs</h1>
              <p className="page-subtitle">Historical log of all stock quantity changes.</p>
            </div>

            {history.length > 0 && (
              <button onClick={handleClearLogs} className="btn-logout" style={{ padding: '0.6rem 1rem' }}>
                Clear Audit Logs
              </button>
            )}
          </div>

          {/* Audit Log Table */}
          {history.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-state-icon">🕒</div>
              <h3>No Audit History Found</h3>
              <p>Adjust stock levels in the Inventory Manager to write logs.</p>
              <Link to="/foods/inventory" className="btn-submit" style={{ textDecoration: 'none' }}>
                Open Inventory Manager
              </Link>
            </div>
          ) : (
            <div className="admin-table-container">
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Log ID</th>
                      <th>Food Name</th>
                      <th>Old Quantity</th>
                      <th>New Quantity</th>
                      <th>Change Delta</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((log) => {
                      const diff = log.newQuantity - log.oldQuantity;
                      const isIncrease = diff >= 0;
                      
                      return (
                        <tr key={log.id}>
                          <td style={{ color: 'var(--text-muted)' }}>#{log.id}</td>
                          <td style={{ fontWeight: '600' }}>{log.foodName}</td>
                          <td>{log.oldQuantity}</td>
                          <td>{log.newQuantity}</td>
                          <td>
                            <span className={`history-diff-badge ${isIncrease ? 'diff-positive' : 'diff-negative'}`}>
                              {isIncrease ? `+${diff}` : diff}
                            </span>
                          </td>
                          <td style={{ fontWeight: '500' }}>{formatTimestamp(log.updateTimestamp)}</td>
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

export default InventoryHistory;
