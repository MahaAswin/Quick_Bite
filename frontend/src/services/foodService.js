// Client-side Mock Database Service using localStorage v2
const MOCK_FOODS_KEY = 'quickbite_mock_foods_v2';
const MOCK_HISTORY_KEY = 'quickbite_mock_history_v2';

// Default mock food data with South Indian dishes
const DEFAULT_FOODS = [
  // Breakfast
  {
    id: 101,
    name: 'Steamed Idli',
    description: 'Soft and fluffy steamed rice cakes, served with sambar and fresh coconut chutney.',
    price: 3.50,
    category: 'Breakfast',
    quantity: 20,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400'
  },
  {
    id: 102,
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with a delicious spiced potato mash, served with chutneys.',
    price: 5.00,
    category: 'Breakfast',
    quantity: 4, // Low Stock (< 5)
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400'
  },
  {
    id: 103,
    name: 'Ven Pongal',
    description: 'Traditional South Indian dish made of rice and yellow moong lentils, seasoned with cumin, black pepper, and ghee.',
    price: 4.50,
    category: 'Breakfast',
    quantity: 15,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' // Placeholder
  },
  // Lunch
  {
    id: 201,
    name: 'South Indian Meals',
    description: 'A complete traditional lunch platter consisting of rice, sambar, rasam, kootu, poriyal, papad, and curd.',
    price: 8.00,
    category: 'Lunch',
    quantity: 12,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400'
  },
  {
    id: 202,
    name: 'Vegetable Fried Rice',
    description: 'Wok-tossed rice with fresh diced carrots, beans, spring onions, and a splash of soy sauce.',
    price: 7.50,
    category: 'Lunch',
    quantity: 8,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-68550d5e2384?w=400'
  },
  {
    id: 203,
    name: 'Hyderabadi Biryani',
    description: 'Fragrant basmati rice layered with aromatic spices and slow-cooked to perfection.',
    price: 10.00,
    category: 'Lunch',
    quantity: 3, // Low Stock
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1563379971899-660589a01cc3?w=400'
  },
  // Dinner
  {
    id: 301,
    name: 'Chapati Kurma',
    description: 'Three soft whole wheat flatbreads served with a rich and flavorful mixed vegetable kurma.',
    price: 4.00,
    category: 'Dinner',
    quantity: 15,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400'
  },
  {
    id: 302,
    name: 'Malabar Parotta',
    description: 'Layered, flaky flatbread made from refined flour, served with spicy salna.',
    price: 5.00,
    category: 'Dinner',
    quantity: 0, // Out of Stock
    available: false,
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400'
  },
  {
    id: 303,
    name: 'Hakka Noodles',
    description: 'Boiled noodles stir-fried with julienned vegetables, soy sauce, and mild white pepper.',
    price: 6.50,
    category: 'Dinner',
    quantity: 10,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'
  },
  // Snacks
  {
    id: 401,
    name: 'Potato Samosa',
    description: 'Two crispy, deep-fried pastry triangles stuffed with spiced potatoes and peas, served with mint chutney.',
    price: 2.00,
    category: 'Snacks',
    quantity: 25,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400'
  },
  {
    id: 402,
    name: 'Veg Puff',
    description: 'Crispy flaky puff pastry sheets baked with a spiced mixed vegetable stuffing.',
    price: 2.50,
    category: 'Snacks',
    quantity: 4, // Low Stock
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400'
  },
  {
    id: 403,
    name: 'Club Sandwich',
    description: 'Toasted bread layers filled with fresh cucumber, tomatoes, lettuce, cheese, and herb spread.',
    price: 4.50,
    category: 'Snacks',
    quantity: 14,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'
  },
  // Beverages
  {
    id: 501,
    name: 'Masala Tea',
    description: 'Hot, freshly brewed milk tea infused with aromatic spices like cardamom, ginger, and cloves.',
    price: 1.50,
    category: 'Beverages',
    quantity: 30,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'
  },
  {
    id: 502,
    name: 'Filter Coffee',
    description: 'Traditional South Indian frothy coffee made with dark roasted coffee chicory blend and hot milk.',
    price: 2.00,
    category: 'Beverages',
    quantity: 20,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'
  },
  {
    id: 503,
    name: 'Mango Juice',
    description: 'Chilled sweet juice extracted from ripe alphonso mangoes.',
    price: 3.50,
    category: 'Beverages',
    quantity: 0, // Out of Stock
    available: false,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'
  },
  // Desserts
  {
    id: 601,
    name: 'Vanilla Ice Cream',
    description: 'Creamy double scoop vanilla ice cream topped with a cherry.',
    price: 4.00,
    category: 'Desserts',
    quantity: 15,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1501443769994-635cdaf765ed2fd?w=400'
  },
  {
    id: 602,
    name: 'Gulab Jamun',
    description: 'Two soft, sweet milk-solid dumplings fried and soaked in cardamom infused warm sugar syrup.',
    price: 3.00,
    category: 'Desserts',
    quantity: 8,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
  },
  {
    id: 603,
    name: 'Chocolate Cake Slice',
    description: 'Rich, moist chocolate sponge cake layered with creamy dark chocolate ganache.',
    price: 4.50,
    category: 'Desserts',
    quantity: 5,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
  }
];

const DEFAULT_HISTORY = [
  {
    id: 1,
    foodId: 101,
    foodName: 'Steamed Idli',
    oldQuantity: 0,
    newQuantity: 20,
    updateTimestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    foodId: 102,
    foodName: 'Masala Dosa',
    oldQuantity: 10,
    newQuantity: 4,
    updateTimestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 3,
    foodId: 302,
    foodName: 'Malabar Parotta',
    oldQuantity: 5,
    newQuantity: 0,
    updateTimestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Helper: Initialize database if empty
const initDb = () => {
  if (!localStorage.getItem(MOCK_FOODS_KEY)) {
    localStorage.setItem(MOCK_FOODS_KEY, JSON.stringify(DEFAULT_FOODS));
  }
  if (!localStorage.getItem(MOCK_HISTORY_KEY)) {
    localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
  }
};

const getFoods = () => {
  initDb();
  return JSON.parse(localStorage.getItem(MOCK_FOODS_KEY));
};

const saveFoods = (foods) => {
  localStorage.setItem(MOCK_FOODS_KEY, JSON.stringify(foods));
};

const getHistory = () => {
  initDb();
  return JSON.parse(localStorage.getItem(MOCK_HISTORY_KEY));
};

const saveHistory = (history) => {
  localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(history));
};

// Log stock history record
const logHistoryRecord = (foodId, foodName, oldQuantity, newQuantity) => {
  const history = getHistory();
  const newLog = {
    id: history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1,
    foodId,
    foodName,
    oldQuantity,
    newQuantity,
    updateTimestamp: new Date().toISOString()
  };
  saveHistory([newLog, ...history]);
};

const mockFoodService = {
  // 1. Food Management CRUD
  getAllFoods: () => {
    return getFoods();
  },

  getFoodById: (id) => {
    const foods = getFoods();
    const food = foods.find(f => f.id === parseInt(id));
    if (!food) throw new Error('Food not found');
    return food;
  },

  addFood: (foodItem) => {
    const foods = getFoods();
    const newId = foods.length > 0 ? Math.max(...foods.map(f => f.id)) + 1 : 101;
    
    const qty = parseInt(foodItem.quantity) || 0;
    const newFood = {
      ...foodItem,
      id: newId,
      quantity: qty,
      available: qty > 0
    };
    
    saveFoods([...foods, newFood]);
    logHistoryRecord(newId, newFood.name, 0, qty);
    return newFood;
  },

  updateFood: (id, updatedItem) => {
    const foods = getFoods();
    const index = foods.findIndex(f => f.id === parseInt(id));
    if (index === -1) throw new Error('Food not found');
    
    const oldQty = foods[index].quantity;
    const newQty = parseInt(updatedItem.quantity) || 0;
    
    const updated = {
      ...foods[index],
      ...updatedItem,
      quantity: newQty,
      available: newQty > 0
    };
    
    foods[index] = updated;
    saveFoods(foods);
    
    if (oldQty !== newQty) {
      logHistoryRecord(parseInt(id), updated.name, oldQty, newQty);
    }
    return updated;
  },

  deleteFood: (id) => {
    const foods = getFoods();
    const filtered = foods.filter(f => f.id !== parseInt(id));
    saveFoods(filtered);
    return true;
  },

  // 2. Inventory Management
  updateStock: (id, quantity) => {
    const foods = getFoods();
    const index = foods.findIndex(f => f.id === parseInt(id));
    if (index === -1) throw new Error('Food not found');
    
    const oldQty = foods[index].quantity;
    const newQty = parseInt(quantity);
    
    foods[index].quantity = newQty;
    foods[index].available = newQty > 0;
    
    saveFoods(foods);
    
    if (oldQty !== newQty) {
      logHistoryRecord(parseInt(id), foods[index].name, oldQty, newQty);
    }
    return foods[index];
  },

  getLowStockFoods: () => {
    const foods = getFoods();
    return foods.filter(f => f.quantity > 0 && f.quantity < 5);
  },

  getAvailableFoods: () => {
    const foods = getFoods();
    return foods.filter(f => f.available);
  },

  getOutOfStockFoods: () => {
    const foods = getFoods();
    return foods.filter(f => f.quantity <= 0);
  },

  // 3. Inventory History
  getAllHistory: () => {
    return getHistory();
  },

  getHistoryByFoodId: (foodId) => {
    const history = getHistory();
    return history.filter(h => h.foodId === parseInt(foodId));
  }
};

export default mockFoodService;
