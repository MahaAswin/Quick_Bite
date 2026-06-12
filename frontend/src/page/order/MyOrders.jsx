import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import "../../css/Order.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-page">
      <div className="page-header">
        <h1 className="order-title">My Orders</h1>

        <button
          className="secondary-btn"
          onClick={() => navigate("/user/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="details-card">
          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h2>Order {order.id}</h2>

              <div className="info-row">
                <strong>Token</strong>
                <span>{order.tokenNumber}</span>
              </div>

              <div className="info-row">
                <strong>Status</strong>
                <span className={order.status.toLowerCase()}>
                  {order.status}
                </span>
              </div>

              <div className="info-row">
                <strong>Total</strong>
                <span>₹{order.totalAmount}</span>
              </div>

              <div className="info-row">
                <strong>Order Time</strong>
                <span>{new Date(order.orderTime).toLocaleString()}</span>
              </div>

              <button
                className="primary-btn"
                onClick={() => navigate(`/user/orders/${order.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
