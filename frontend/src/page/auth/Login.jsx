import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../css/Login.css";

function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await loginUser(formData);

        localStorage.setItem(
            "token",
            response.data.token
        );

        if(response.data.role === "ADMIN"){
            navigate("/admin/dashboard");
        }
        else{
            navigate("/user/dashboard");
        }

    } catch (error) {

        console.log(error);

        alert("Login Failed");
    }
};

    return (
        <div className="login">
            <h2>QuickBite - Login</h2>
            <form className="login-form"onSubmit={handleSubmit} autoComplete="off">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

                <p className="auth-link">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register Here
                    </span>
                </p>

            </form>

        </div>
    );
}

export default Login;

