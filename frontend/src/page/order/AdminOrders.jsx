import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminOrderByStatus,
  getAllOrders,
} from "../../services/orderService";
import "../../css/Order.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = async () => {
    try {
      if (selectedStatus === "ALL") {
        fetchOrders();
      } else {
        const data = await getAdminOrderByStatus(selectedStatus);
        setOrders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <h1 className="order-title">Admin Orders</h1>

        <button
          className="secondary-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-card">
          <select
            className="order-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button className="primary-btn" onClick={handleFilter}>
            Apply Filter
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-card">
          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Token</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>{order.tokenNumber}</td>

                  <td>
                    <span className={order.status.toLowerCase()}>
                      {order.status}
                    </span>
                  </td>

                  <td>₹{order.totalAmount}</td>

                  <td>
                    <button
                      className="primary-btn"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
