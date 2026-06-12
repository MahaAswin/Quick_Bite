import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import foodService from '../../services/foodService';
import FoodNavbar from '../../components/food/FoodNavbar';
import { placeOrder } from "../../services/orderService";
import '../../css/Food.css';

const FoodList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Admin view only when accessing via /admin/foods route
  const isAdmin = location.pathname.startsWith('/admin/foods');

  // States
  const [foods, setFoods] = useState([]);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [quantities, setQuantities] = useState({});
  
  // Price Range States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');

  // Pagination States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 4; // Display 4 items per page to show pagination UI clearly

  // Categories list
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

  // Load foods when criteria change (including price range inputs)
  useEffect(() => {
    loadFoodsData();
  }, [selectedCategory, sortOption, searchQuery, appliedMin, appliedMax]);

  // Handle slicing for pagination
  useEffect(() => {
    const startIdx = page * pageSize;
    const endIdx = startIdx + pageSize;
    setDisplayedFoods(foods.slice(startIdx, endIdx));
  }, [foods, page]);

  const loadFoodsData = () => {
    try {
      let data = foodService.getAllFoods();

      // 1. Filter by category
      if (selectedCategory !== 'All') {
        data = data.filter(f => f.category.toLowerCase() === selectedCategory.toLowerCase());
      }

      // 2. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        data = data.filter(f => f.name.toLowerCase().includes(query) || (f.description && f.description.toLowerCase().includes(query)));
      }

      // 3. Filter by Price Range
      if (appliedMin !== '') {
        const minVal = parseFloat(appliedMin);
        if (!isNaN(minVal)) {
          data = data.filter(f => f.price >= minVal);
        }
      }
      if (appliedMax !== '') {
        const maxVal = parseFloat(appliedMax);
        if (!isNaN(maxVal)) {
          data = data.filter(f => f.price <= maxVal);
        }
      }

      // 4. Sort by price
      if (sortOption === 'price-asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-desc') {
        data.sort((a, b) => b.price - a.price);
      }

      setFoods(data);
      setPage(0);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (err) {
      console.error('Failed to load foods:', err);
    }
  };

  // Price range apply handler
  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
  };

  // Delete Handler
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete mock item "${name}"?`)) {
      foodService.deleteFood(id);
      loadFoodsData();
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortOption('default');
    setMinPrice('');
    setMaxPrice('');
    setAppliedMin('');
    setAppliedMax('');
  };  

  const increaseQty = (foodId, maxQty) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.min((prev[foodId] || 1) + 1, maxQty),
    }));
  };

  const decreaseQty = (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max((prev[foodId] || 1) - 1, 1),
    }));
  };

  const handlePlaceOrder = async (food) => {
    try {
      const qty = quantities[food.id] || 1;
      console.log(request);
      if (qty > food.quantity) {
        alert("Not enough stock available");
        return;
      }

      const request = {
        items: [
          {
            foodItemId: food.id,
            quantity: qty,
          },
        ],
      };

      const response = await placeOrder(request);

      alert(
        `Order placed successfully!\nToken Number: ${response.tokenNumber}`,
      );

      navigate("/user/orders/my-orders");
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("RESPONSE:", error.response);

      console.log("DATA:", error.response?.data);

      console.log("STATUS:", error.response?.status);

      alert(JSON.stringify(error.response?.data));
    }
  };

  const isPriceFilterApplied = appliedMin !== '' || appliedMax !== '';

  return (
    <div className="food-page-container">
      <FoodNavbar />
      
      <div className="food-content-wrap">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-section">
            <h1>{isAdmin ? 'Menu Listings Panel' : 'QuickBite Restaurant Menu'}</h1>
            <p className="page-subtitle">
              {isAdmin 
                ? 'Create, edit, or delete items. Toggle roles to test the user browsing experience.' 
                : 'Browse our fresh South Indian meals and snacks. Search, sort, and filter below.'
              }
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
              className="btn-cancel"
              style={{ textDecoration: 'none' }}
            >
              ← Dashboard
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/foods/inventory" className="btn-cancel" style={{ textDecoration: 'none' }}>
                  📦 Manage Stock
                </Link>
                <Link to="/admin/foods/add" className="btn-submit" style={{ textDecoration: 'none' }}>
                  + Add Dish
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="controls-container">
          {/* Row 1: Search Bar & Category Chips */}
          <div className="search-category-row">
            <div className="search-box-wrap">
              <svg className="search-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search food by title (e.g. Idli, Dosa, Biryani)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-filter-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Price Range Inputs, Sort Buttons, & Reset */}
          <div className="price-sorting-row">
            {/* Price Filter Section */}
            <form onSubmit={handlePriceFilterSubmit} className="price-filter-wrap">
              <label>Price Range (₹):</label>
              <input
                type="number"
                placeholder="Min"
                className="price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="price-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <button type="submit" className="btn-filter-apply">Apply Filter</button>
            </form>

            {/* Sorting controls */}
            <div className="sort-controls-wrap">
              <span className="sort-label">Sort:</span>
              <button
                onClick={() => setSortOption(sortOption === 'price-asc' ? 'default' : 'price-asc')}
                className={`btn-sort ${sortOption === 'price-asc' ? 'active' : ''}`}
              >
                Price ↑
              </button>
              <button
                onClick={() => setSortOption(sortOption === 'price-desc' ? 'default' : 'price-desc')}
                className={`btn-sort ${sortOption === 'price-desc' ? 'active' : ''}`}
              >
                Price ↓
              </button>
            </div>
            
            <button type="button" onClick={handleReset} className="btn-logout" style={{ padding: '0.5rem 1rem' }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Menu Listings */}
        {displayedFoods.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">🍲</div>
            <h3>
              {isPriceFilterApplied 
                ? 'No foods found in this price range' 
                : 'No Foods Found'
              }
            </h3>
            <p>Try adjusting your search criteria or resetting filters.</p>
            <button onClick={handleReset} className="btn-submit">Reset Filters</button>
          </div>
        ) : (
          <div className="food-grid">
            {displayedFoods.map((food) => {
              const isLowStock = food.quantity > 0 && food.quantity < 5;
              const isOutOfStock = food.quantity <= 0 || !food.available;
              
              return (
                <div key={food.id} className="food-card">
                  {/* Image Container with Badges Overlay */}
                  <div className="food-image-wrap">
                    {/* 1. Category Badge */}
                    <span className="food-badge-category">{food.category}</span>

                    {/* 2. Availability Badge */}
                    {isOutOfStock ? (
                      <span className="food-badge-stock badge-outofstock">
                        Out of Stock (0)
                      </span>
                    ) : isLowStock ? (
                      <span className="food-badge-stock badge-lowstock">
                        Low Stock ({food.quantity})
                      </span>
                    ) : (
                      <span className="food-badge-stock badge-instock">
                        Available ({food.quantity})
                      </span>
                    )}

                    {/* 3. Food Image */}
                    <img
                      src={
                        food.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                      }
                      alt={food.name}
                      className="food-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                      }}
                    />
                  </div>

                  {/* Details Container */}
                  <div className="food-details-wrap">
                    {/* 4. Food Name */}
                    <h3
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      <span>{food.name}</span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        ID: #{food.id}
                      </span>
                    </h3>

                    {/* 5. Description */}
                    <p className="food-description">
                      {food.description ||
                        "Delectable Indian dish prepared with traditional ingredients."}
                    </p>

                    {/* 6. Quantity Available Section */}
                    <div style={{ margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontWeight: "500",
                        }}
                      >
                        Stock Level:{" "}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          color: isOutOfStock
                            ? "var(--danger)"
                            : isLowStock
                              ? "var(--warning)"
                              : "var(--success)",
                        }}
                      >
                        {food.quantity} servings left
                      </span>
                    </div>

                    {/* 7. Price & 8. Action Buttons */}
                    <div
                      className="food-price-action-row"
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        paddingTop: "1rem",
                        marginTop: "auto",
                      }}
                    >
                      <span className="food-price-lbl">
                        ₹{food.price.toFixed(2)}
                      </span>

                      {isAdmin ? (
                        /* Admin Controls */
                        <div className="action-buttons-cell">
                          <Link
                            to={`/admin/foods/edit/${food.id}`}
                            className="btn-action-icon btn-action-edit"
                            title="Edit Listing Properties"
                            style={{
                              width: "38px",
                              height: "38px",
                              fontSize: "1.05rem",
                            }}
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(food.id, food.name)}
                            className="btn-action-icon btn-action-delete"
                            title="Delete Food Listing"
                            style={{
                              width: "38px",
                              height: "38px",
                              fontSize: "1.05rem",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      ) : (
                        /* User Checkout */
                        <div className="order-section">
                          <div className="qty-selector">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => decreaseQty(food.id)}
                            >
                              -
                            </button>

                            <span className="qty-value">
                              {quantities[food.id] || 1}
                            </span>

                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() =>
                                increaseQty(food.id, food.quantity)
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="btn-card-action"
                            disabled={isOutOfStock}
                            onClick={() => handlePlaceOrder(food)}
                          >
                            {isOutOfStock ? "Sold Out" : "Order Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <span className="pagination-info">
              Showing page <strong>{page + 1}</strong> of <strong>{totalPages}</strong> ({foods.length} items total)
            </span>
            
            <div className="pagination-controls">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(page - 1)} 
                className="btn-page-step"
              >
                ◀
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`btn-page-num ${page === i ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                disabled={page === totalPages - 1} 
                onClick={() => setPage(page + 1)} 
                className="btn-page-step"
              >
                ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;
