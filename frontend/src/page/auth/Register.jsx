import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "../../css/Register.css";

function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo: ""
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
    const response = await registerUser(formData);

    alert("Registration Successful");

    navigate("/login");

    } catch (error) {
        console.log(error);
        alert("Registration Failed");
    }
    };

    return (
        <div className="register">
            <h2>QuickBite - Sign Up</h2>

            <form className="register-form"onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />

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

                <input
                    type="text"
                    name="phoneNo"
                    placeholder="Phone No"
                    value={formData.phoneNo}
                    onChange={handleChange}
                />

                <button type="submit">Sign Up</button>

                <button type="reset">Reset</button>

                <p className="auth-link">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>
                        Login Here
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Register;