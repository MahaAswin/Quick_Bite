import { useState } from "react";
import { registerUser } from "../../services/authService";

function Register() {

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
        console.log(response.data);
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
            </form>
        </div>
    );
}

export default Register;