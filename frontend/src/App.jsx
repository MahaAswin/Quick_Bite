import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import UserDashboard from "./page/dashboard/UserDashboard";
import AdminDashboard from "./page/dashboard/AdminDashboard";


function App(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}/>
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
            <Route path="/admin/dashboard"element={<AdminDashboard />}/>
        </Routes>
        </BrowserRouter>
    )
}

export default App;