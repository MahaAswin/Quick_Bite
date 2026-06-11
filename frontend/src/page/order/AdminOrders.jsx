import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getAdminOrderByStatus, getAllOrders } from "../../services/orderService";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                console.log(data);
                setOrders(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOrders();
    }, [])

    const handleFilter = async () => {
        try {
            if (selectedStatus === "ALL")
            {
                const data = await getAllOrders();
                setOrders(data);
            }
            else
            {
                const data = await getAdminOrderByStatus(selectedStatus);
                setOrders(data);
            }
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div>
      <h1>AdminOrders</h1>
          <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value) }}>
              <option value="ALL">ALL</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
          </select>
          <button onClick={handleFilter}>Apply Filter</button>
      {orders.map((order) => {
        return (
          <div key={order.key}>
            <h3>Order #{order.id}</h3>
            <p>Token: {order.tokenNumber}</p>
            <p>status: {order.status}</p>
            <p>Total: {order.totalAmount}</p>
            <button onClick={() => navigate(`/admin/orders/${order.id}`)}>
              View Details
            </button>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
export default AdminOrders