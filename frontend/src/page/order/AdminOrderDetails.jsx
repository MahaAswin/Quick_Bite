import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminOrderById,
  updateOrderStatus,
} from "../../services/orderService";
import "../../css/Order.css";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getAdminOrderById(id);

        setOrder(data);
        setSelectedStatus(data.status);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <h2>Loading...</h2>;
  }

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(id, selectedStatus);

      alert("Status updated successfully!");

      const updatedOrder = await getAdminOrderById(id);

      setOrder(updatedOrder);
      setSelectedStatus(updatedOrder.status);
    } catch (error) {
      console.log(error);
      alert("Failed to update status!");
    }
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <h1 className="order-title">Admin Order Details</h1>

        <button
          className="secondary-btn"
          onClick={() => navigate("/admin/orders")}
        >
          ← Back To Orders
        </button>
      </div>

      {/* Top Section */}

      <div className="admin-details-grid">
        {/* Left Card */}

        <div className="admin-details-card">
          <h2>Order Information</h2>

          <div className="admin-info-row">
            <span className="admin-info-label">Order ID</span>
            <span className="admin-info-value">{order.id}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Token Number</span>
            <span className="admin-info-value">{order.tokenNumber}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Status</span>
            <span className="admin-info-value">
              <span className={order.status.toLowerCase()}>{order.status}</span>
            </span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Total Amount</span>
            <span className="admin-info-value">₹{order.totalAmount}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Order Time</span>
            <span className="admin-info-value">
              {new Date(order.orderTime).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Card */}

        <div className="admin-details-card">
          <h2>Update Order Status</h2>

          <select
            className="order-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <br />
          <br />

          <button className="success-btn" onClick={handleUpdateStatus}>
            Update Status
          </button>
        </div>
      </div>

      {/* Items Section */}

      <h2 className="section-title">Order Items</h2>

      <div className="items-grid">
        {order.items?.map((item) => (
          <div className="item-card" key={item.id}>
            <h3>{item.foodName}</h3>

            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>

            <p>
              <strong>Price:</strong> ₹{item.price}
            </p>

            <p>
              <strong>Subtotal:</strong> ₹{item.subtotal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrderDetails;
