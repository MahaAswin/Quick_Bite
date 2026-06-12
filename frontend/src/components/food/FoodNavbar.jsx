import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FoodNavbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/foods');
  const role = isAdmin ? 'ADMIN' : 'USER';

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="food-navbar">
      <div className="food-navbar-content">
        <Link to="/foods" className="food-nav-logo">
          <span className="logo-quick">Quick</span>
          <span className="logo-bite">Bite</span>
        </Link>

        <div className="nav-links">
          <Link to={isAdmin ? '/admin/foods' : '/foods'} className={`nav-link ${isActive(isAdmin ? '/admin/foods' : '/foods')}`}>
            {isAdmin ? 'Manage Menu' : 'Browse Menu'}
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/foods/add" className={`nav-link ${isActive('/admin/foods/add')}`}>
                Add Food
              </Link>
              <Link to="/foods/inventory" className={`nav-link ${isActive('/foods/inventory')}`}>
                Inventory
              </Link>
            </>
          )}

          {/* Role toggle removed — role is determined by login, not manually toggled */}
          {/* <button onClick={handleRoleToggle} className={`btn-role-switch ${isAdmin ? 'admin-active' : ''}`}>
            {isAdmin ? '🔑 Admin View' : '👤 User View'}
          </button> */}

          <div className="user-profile-nav">
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
