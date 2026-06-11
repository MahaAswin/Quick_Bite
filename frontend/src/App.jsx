import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import UserDashboard from "./page/dashboard/UserDashboard";
import AdminDashboard from "./page/dashboard/AdminDashboard";
import MyOrders from "./page/order/MyOrders";
import OrderDetails from "./page/order/OrderDetails";
import AdminOrders from "./page/order/AdminOrders";
import AdminOrderDetails from "./page/order/AdminOrderDetails";


function App(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}/>
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
            <Route path="/user/orders/my-orders" element={<MyOrders/>}/>
            <Route path="/user/orders/:id" element={<OrderDetails />}/>
            <Route path="/user/orders/:id/cancel" element={<OrderDetails />}/>
            <Route path="/admin/dashboard"element={<AdminDashboard />}/>
            <Route path="/admin/orders"element={<AdminOrders />}/>
            <Route path="/admin/orders/:id"element={<AdminOrderDetails />}/>
        </Routes>
        </BrowserRouter>
    )
}

export default App;