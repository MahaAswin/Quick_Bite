import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import {
  getAdminOrderById,
  updateOrderStatus,
} from "../../services/orderService";

function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async (id) => {
      try {
        const data = await getAdminOrderById(id);
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderDetails(id);
  }, [id]);
  if (!order) return <h2>Loding...</h2>;

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(id, selectedStatus);
      alert("status updated successfully!");
      const updateOrder = await getAdminOrderById(id);
      setOrder(updateOrder);
      setSelectedStatus(updateOrder.status);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
      alert("Failed to update status!");
    }
  };
  return (
    <div>
      <h1>AdminOrderDetails</h1>
      <p>Order Id: {order.id}</p>
      <p>Token Number: {order.tokenNumber}</p>
      <p>Status: {order.status}</p>
      <p>Total Amount: {order.totalAmount}</p>
      <p>Order Time: {order.orderTime}</p>

      <h3>Update Order Status</h3>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="PENDING">PENDING</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <button onClick={handleUpdateStatus}>Update status</button>
      <h2>Items</h2>

      {order.items?.map((item) => {
        return (
          <div key={item.id}>
            <p>Food Name: {item.foodName}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {item.price}</p>
            <p>Subtotal: {item.subtotal}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
export default AdminOrderDetails;
