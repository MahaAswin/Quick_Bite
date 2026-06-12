import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../services/dashboardService";
import "../../css/AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalAdmin: 0,
        totalAccount: 0,
        totalOrder: 0,
        pendingOrder: 0,
        completedOrder: 0
    });

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await getAdminDashboard();

                console.log("ADMIN DASHBOARD DATA");
                console.log(response.data);

                setDashboard(response.data);

            } catch (error) {

                console.log(error);
            }
        };

        fetchDashboard();

    }, []);

    return (

        <div className="admin-dashboard">

            <div className="admin-header">

                <h1 className="admin-title">
                    👨‍💼 QuickBite Admin Dashboard
                </h1>

            </div>

            <div className="admin-stats">

                <div className="admin-card">
                    <h3>Total Users</h3>
                    <h1>{dashboard.totalUsers}</h1>
                </div>

                <div className="admin-card">
                    <h3>Total Admins</h3>
                    <h1>{dashboard.totalAdmin}</h1>
                </div>

                <div className="admin-card">
                    <h3>Total Accounts</h3>
                    <h1>{dashboard.totalAccount}</h1>
                </div>

                <div className="admin-card">
                    <h3>Total Orders</h3>
                    <h1>{dashboard.totalOrder}</h1>
                </div>

                <div className="admin-card">
                    <h3>Pending Orders</h3>
                    <h1>{dashboard.pendingOrder}</h1>
                </div>

                <div className="admin-card">
                    <h3>Completed Orders</h3>
                    <h1>{dashboard.completedOrder}</h1>
                </div>

            </div>

            <div className="admin-actions">

                <button
                    className="manage-food-btn"
                    onClick={() => navigate("/foods")}
                >
                    Manage Foods
                </button>

                <button
                    className="view-orders-btn"
                    onClick={() => navigate("/order")}
                >
                    View Orders
                </button>

                <button
                    className="admin-logout-btn"
                    onClick={() => {

                        localStorage.removeItem("token");

                        navigate("/login");
                    }}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default AdminDashboard;