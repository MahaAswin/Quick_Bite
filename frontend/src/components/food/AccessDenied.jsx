import React from 'react';

const AccessDenied = () => {
  const handleToggleAdmin = () => {
    localStorage.setItem('quickbite_mock_role', 'ADMIN');
    window.location.reload();
  };

  return (
    <div className="access-denied-card">
      <div className="denied-icon">🔒</div>
      <h2 className="denied-title">Administrator Access Required</h2>
      <p className="denied-text">
        This page is restricted to administrators. To view this panel, adjust mock settings or use the role selector toggle in the header.
      </p>
      <button onClick={handleToggleAdmin} className="btn-submit" style={{ width: '100%' }}>
        Toggle Admin Role & Refresh
      </button>
    </div>
  );
};

export default AccessDenied;
