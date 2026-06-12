import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDashboard } from "../../services/dashboardService";
import { getMyOrders } from "../../services/orderService";
import "../../css/UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    phoneNo: "Loading...",
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardResponse = await getUserDashboard();

        const orders = await getMyOrders();

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
          (order) => order.status === "PENDING",
        ).length;

        const completedOrders = orders.filter(
          (order) => order.status === "COMPLETED",
        ).length;

        setUser({
          ...dashboardResponse.data,
          totalOrders,
          pendingOrders,
          completedOrders,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🍔 QuickBite Dashboard</h1>

        <button className="profile-btn" onClick={() => navigate("/profile")}>
          👤 Profile
        </button>
      </div>

      <div className="user-info">
        <h2>Welcome, {user.name} !! 👋</h2>

        <p className="dashboard-quote">
          🍔 Hungry? Discover delicious meals and place your order in seconds.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <h1>{user.totalOrders}</h1>
        </div>

        <div className="stat-card">
          <h3>Pending Orders</h3>
          <h1>{user.pendingOrders}</h1>
        </div>

        <div className="stat-card">
          <h3>Completed Orders</h3>
          <h1>{user.completedOrders}</h1>
        </div>
      </div>

      <div className="button-group">
        <button className="food-btn" onClick={() => navigate("/foods")}>
          Food Menu
        </button>

        <button
          className="order-btn"
          onClick={() => navigate("/user/orders/my-orders")}
        >
          My Orders
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");

            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
