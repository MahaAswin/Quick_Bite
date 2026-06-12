import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import UserDashboard from "./page/dashboard/UserDashboard";
import AdminDashboard from "./page/dashboard/AdminDashboard";
import Profile from "./page/dashboard/Profile";
import UpdateProfile from "./page/dashboard/UpdateProfile";
import AddFood from "./page/food/AddFood";
import FoodList from "./page/food/FoodList";
import EditFood from "./page/food/EditFood";
import Inventory from "./page/food/InventoryHistory";

function App(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}/>
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
            <Route path="/admin/dashboard"element={<AdminDashboard />}/>
            <Route path="/profile"element={<Profile/>}/>
            <Route path="/profile/update"element={<UpdateProfile/>}/>
            <Route path="/foods" element={<FoodList />} />
            <Route path="/foods/add" element={<AddFood />} />
            <Route path="/foods/edit/:id"element={<EditFood />}/>
            <Route path="/foods/inventory" element={<Inventory />} />

            {/* Admin food routes - linked from AdminDashboard */}
            <Route path="/admin/foods" element={<FoodList />} />
            <Route path="/admin/foods/add" element={<AddFood />} />
            <Route path="/admin/foods/edit/:id" element={<EditFood />} />

        </Routes>
        </BrowserRouter>
    )
}

export default App;