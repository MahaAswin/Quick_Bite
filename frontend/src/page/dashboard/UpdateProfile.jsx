import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import "../../css/UpdateProfile.css"

function UpdateProfile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        phoneNo: ""
    });

    useEffect(() => {

        const fetchProfile = async () => {

            const response = await getProfile();

            setProfile({
                name: response.data.name,
                phoneNo: response.data.phoneNo
            });
        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await updateProfile(profile);

        alert("Profile Updated");

        navigate("/profile");
    };

    return (

    <div className="update-profile-container">

        <div className="update-profile-card">

            <h1>Update Profile</h1>

            <form
                className="update-profile-form"
                onSubmit={handleSubmit}
            >

                <label>Name</label>

                <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                />

                <label>Phone Number</label>

                <input
                    type="text"
                    name="phoneNo"
                    value={profile.phoneNo}
                    onChange={handleChange}
                />

                <div className="update-buttons">

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/profile")}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    </div>
);
}
export default UpdateProfile;