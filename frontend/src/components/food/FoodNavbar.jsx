import  { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const FoodNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock role state ('USER' or 'ADMIN')
  const [role, setRole] = useState(() => {
    return localStorage.getItem('quickbite_mock_role') || 'USER';
  });

  useEffect(() => {
    // If role isn't initialized, write it
    if (!localStorage.getItem('quickbite_mock_role')) {
      localStorage.setItem('quickbite_mock_role', 'USER');
    }
  }, []);

  const handleRoleToggle = () => {
    const nextRole = role === 'USER' ? 'ADMIN' : 'USER';
    localStorage.setItem('quickbite_mock_role', nextRole);
    setRole(nextRole);
    
    // Redirect appropriately if switching to USER on an admin page
    if (nextRole === 'USER' && (
      location.pathname === '/foods/add' || 
      location.pathname.startsWith('/foods/edit') || 
      location.pathname === '/foods/inventory' || 
      location.pathname === '/foods/history'
    )) {
      navigate('/foods');
    } else {
      window.location.reload(); // Refresh to update role states across components
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const isAdmin = role === 'ADMIN';

  return (
    <nav className="food-navbar">
      <div className="food-navbar-content">
        <Link to="/foods" className="food-nav-logo">
          <span className="logo-quick">Quick</span>
          <span className="logo-bite">Bite</span>
        </Link>

        <div className="nav-links">
          <Link to="/foods" className={`nav-link ${isActive('/foods')}`}>
            {isAdmin ? 'Manage Menu' : 'Browse Menu'}
          </Link>
          
          {isAdmin && (
            <>
              <Link to="/foods/add" className={`nav-link ${isActive('/foods/add')}`}>
                Add Food
              </Link>
              <Link to="/foods/inventory" className={`nav-link ${isActive('/foods/inventory')}`}>
                Inventory
              </Link>
              <Link to="/foods/history" className={`nav-link ${isActive('/foods/history')}`}>
                Audit Logs
              </Link>
            </>
          )}

          {/* Interactive Role Switcher Toggle */}
          <button 
            onClick={handleRoleToggle} 
            className={`btn-role-switch ${isAdmin ? 'admin-active' : ''}`}
            title="Click to toggle between User and Admin views"
          >
            {isAdmin ? '🔑 Admin View' : '👤 User View'}
          </button>

          <div className="user-profile-nav">
            <span className="profile-name">
              {isAdmin ? 'Chef Admin' : 'Guest Diner'}
            </span>
            <span className={`profile-role-badge ${!isAdmin ? 'user-role' : ''}`}>
              {role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FoodNavbar;
