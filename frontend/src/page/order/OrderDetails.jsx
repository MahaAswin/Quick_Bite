import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderById } from "../../services/orderService";
import "../../css/Order.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <h2>Loading...</h2>;
  }

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      await cancelOrder(id);

      alert("Order cancelled successfully!");

      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.log(error);
      alert("Failed to cancel order!");
    }
  };

  return (
    <div className="order-page">
      {/* Header */}

      <div className="page-header">
        <h1 className="order-title">Order Details</h1>

        <button
          className="secondary-btn"
          onClick={() => navigate("/user/orders/my-orders")}
        >
          ← Back To Orders
        </button>
      </div>

      {/* Order Info */}

      <div className="details-grid">
        <div className="details-card">
          <h2>Order Information</h2>

          <div className="info-row">
            <strong>Order ID</strong>
            <span>{order.id}</span>
          </div>

          <div className="info-row">
            <strong>Token Number</strong>
            <span>{order.tokenNumber}</span>
          </div>

          <div className="info-row">
            <strong>Status</strong>

            <span className={order.status.toLowerCase()}>{order.status}</span>
          </div>

          <div className="info-row">
            <strong>Total Amount</strong>
            <span>₹{order.totalAmount}</span>
          </div>

          <div className="info-row">
            <strong>Order Time</strong>
            <span>{order.orderTime}</span>
          </div>

          {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
            <button
              className="danger-btn"
              onClick={handleCancelOrder}
              style={{ marginTop: "20px" }}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Items */}

      <h2 className="section-title">Ordered Items</h2>

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

export default OrderDetails;
