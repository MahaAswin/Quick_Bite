import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import UserDashboard from "./page/dashboard/UserDashboard";
import AdminDashboard from "./page/dashboard/AdminDashboard";

import FoodList from "./page/food/FoodList";
import AddFood from "./page/food/AddFood";
import EditFood from "./page/food/EditFood";
import InventoryManagement from "./page/food/InventoryManagement";
import InventoryHistory from "./page/food/InventoryHistory";

import MyOrders from "./page/order/MyOrders";
import OrderDetails from "./page/order/OrderDetails";
import AdminOrders from "./page/order/AdminOrders";
import AdminOrderDetails from "./page/order/AdminOrderDetails";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Food Module Routes */}
        <Route path="/foods" element={<FoodList />} />
        <Route path="/foods/add" element={<AddFood />} />
        <Route path="/foods/edit/:id" element={<EditFood />} />
        <Route path="/foods/inventory" element={<InventoryManagement />} />
        <Route path="/foods/history" element={<InventoryHistory />} />

        {/* Order Moudle Routes */}
        <Route path="/user/orders/my-orders" element={<MyOrders />} />
        <Route path="/user/orders/:id" element={<OrderDetails />} />
        <Route path="/user/orders/:id/cancel" element={<OrderDetails />} />

        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
