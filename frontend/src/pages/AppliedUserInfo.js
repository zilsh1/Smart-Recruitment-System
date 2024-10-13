import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaAddressCard, FaBackward } from "react-icons/fa";
import { MdCastForEducation, MdEmail, MdPermContactCalendar } from "react-icons/md";
import { SiSkillshare } from "react-icons/si"; // Skill icon
import { useParams } from "react-router-dom";

function AppliedUserInfo() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/profile/${username}/`);
        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, [username]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ 
      height: "100vh", 
      display: "grid", 
      placeContent: "center", 
      background: "linear-gradient(to right, #32a852, #b2d3b8)"

    }}>
      <div style={{
        backgroundColor: "white", 
        borderRadius: "20px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
        padding: "30px", // Increased padding
        width: "400px", // Increased width
        textAlign: "center", 
        position: "relative"
      }}>
        <div style={{ position: "absolute", top: "15px", left: "15px" }}>
          <button onClick={() => window.history.back()} className="btn btn-sm btn-light">
            <FaBackward />
          </button>
        </div>
        <div>
          <img
            src={
              profile && profile.profile_image
                ? `http://localhost:8000${profile.profile_image}`
                : "https://th.bing.com/th/id/R.c3631c652abe1185b1874da24af0b7c7?rik=XBP%2fc%2fsPy7r3HQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-circled-user-icon-2240.png&ehk=z4ciEVsNoCZtWiFvQQ0k4C3KTQ6wt%2biSysxPKZHGrCc%3d&risl=&pid=ImgRaw&r=0"
            }
            alt="User Profile"
            style={{
              width: "120px", // Increased size
              height: "120px", // Increased size
              borderRadius: "50%", // Rounded image
              marginBottom: "20px" // Space below the image
            }}
          />
        </div>
        {profile ? (
          <div style={{ padding: "10px" }}>
            <h1>@&nbsp;{profile.username}</h1>
            <p style={{ margin: "5px 0" }}>
              <MdEmail /> {profile.email}
            </p>
            <p style={{ margin: "5px 0" }}>
              <MdPermContactCalendar /> {profile.mobile}
            </p>
            <p style={{ margin: "5px 0" }}>
              <FaAddressCard /> {profile.address}
            </p>
            <div style={{ margin: "5px 0", textAlign: "left" }}>
              <h3>Skills:</h3>
              <p>
                {profile.skills 
                  ? profile.skills.split(',').map(skill => (
                    <span key={skill} style={{
                      display: "inline-block", 
                      background: "#e0f2f1", 
                      borderRadius: "12px", 
                      padding: "5px 10px", 
                      margin: "5px", 
                      fontSize: "14px"
                    }}>
                      <SiSkillshare style={{ marginRight: "5px" }} /> {skill.trim()}
                    </span>
                  ))
                  : "No skills available"}
              </p>
            </div>
            <p style={{ margin: "5px 0" }}>
              <MdCastForEducation /> {profile.education || "No education available"}
            </p>
            <p style={{ margin: "5px 0" }}>
              {profile.exeperience || "No experience available"} Years
            </p>
            <a
              href={`http://localhost:8000${profile.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "#388e3c", // Button color
                padding: "10px 15px",
                borderRadius: "5px",
                display: "inline-block",
                marginTop: "10px"
              }}
            >
              View Resume
            </a>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default AppliedUserInfo;