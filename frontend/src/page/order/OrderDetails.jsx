import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cancelOrder, getOrderById } from "../../services/orderService";

function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
   
    useEffect(() => {
         const fetchOrderDetails = async () => {
           try {
             const data = await getOrderById(id);
             console.log("Order Details:", data.items);
             console.log("Order Details:", data.items.foodName);
             setOrder(data);
           } catch (error) {
             console.log(error);
           }
         };
        fetchOrderDetails();
    }, [id])
    if (!order) {
        return <h2>Loding...</h2>
    }
    const handleCancelOrder = async () => {
        const confrimCancel = window.confirm("Are you sure want to cacel this order?");
        if (!confrimCancel) return;

        try {
            await cancelOrder(id);
            alert("Order cancelled successfully!");
            const data = await getOrderById(id);
             setOrder(data);
        } catch (error) {
            console.log(error)
            alert("Falied to cancel order!");
        }
    }
    return (
      <div>
            <h1>OrderDetails</h1>
            <p>Order Id: {order.id}</p>
            <p>Token Number: {order.tokenNumber}</p>
            <p>status: {order.status}</p>
            <p>Total Amount: { order.totalAmount }</p>
            <p>order Time: {order.orderTime}</p>

            {
                order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
                    <button onClick={handleCancelOrder}>
                        Cancel Order
                    </button>
                )
            }
            
            <h2>Items</h2>

            {order.items?.map((item) => {
                return (
                    <div key={item.id}>
                  <p>Food: {item.foodName}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Subtotal: ₹{item.subtotal}</p>
                  <hr />
                </div>
                )
            })}
      </div>
    );
}
export default OrderDetails;