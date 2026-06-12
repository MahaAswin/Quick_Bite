import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/dashboardService";
import "../../css/Profile.css";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phoneNo: ""
    });

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await getProfile();

                setProfile(response.data);

            } catch (error) {

                console.log(error);
            }
        };

        fetchProfile();

    }, []);

    return (

        <div className="profile-container">

            <div className="profile-card">

                <h1>👤 My Profile</h1>

                <div className="profile-info">

                    <div className="profile-row">

                        <strong>Name</strong>

                        <span>
                            {profile.name}
                        </span>

                    </div>

                    <div className="profile-row">

                        <strong>Email</strong>

                        <span>
                            {profile.email}
                        </span>

                    </div>

                    <div className="profile-row">

                        <strong>Phone Number</strong>

                        <span>
                            {profile.phoneNo}
                        </span>

                    </div>

                </div>

                <div className="profile-buttons">

                    <button
                        className="update-btn"
                        onClick={() =>
                            navigate("/profile/update")
                        }
                    >
                        Update Profile
                    </button>

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/user/dashboard")
                        }
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Profile;