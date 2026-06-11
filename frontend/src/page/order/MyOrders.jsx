import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import {  useNavigate } from "react-router-dom";
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        console.log("order",data);
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOrders();
  },[])
  return (
    <div>
      <h1>My orders</h1>
      {orders.map((order) => {
        return (
          <div key={order.id}>
          <h1>Order #{order.id}</h1>
          <p>token: {order.tokenNumber}</p>
          <p>Status: {order.status}</p>
          <p>Total: {order.totalAmount}</p>
            <p>order time: {order.orderTime}</p>
            <button onClick={() => navigate(`/user/orders/${order.id}`)}>View Details</button>
        </div>
        )
      }
      )}
    </div>
  );
}
export default MyOrders;