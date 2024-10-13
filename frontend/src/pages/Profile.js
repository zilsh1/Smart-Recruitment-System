import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { IoAddCircle, IoCodeWorking, IoDocument } from "react-icons/io5";
import { Modal, Button } from "react-bootstrap";
import { MdSchool, MdMail, MdExitToApp, MdContactMail, MdWork } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppliedJob from "./AppliedJob";
const Profile = () => {
  const { username } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAppliedJobsModal, setShowAppliedJobsModal] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [predefinedSkills, setPredefinedSkills] = useState([
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "HTML",
    "CSS",
  ]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [EditData, setEditData] = useState({});
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/profile/${username}/`
        );
        setProfile(response.data);
        setEditData(response.data);
        setSelectedSkills(splitArray(response.data.skills));
      } catch (err) {
        setError("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, [username]);

  function handleLogout() {
    localStorage.removeItem("jobseekerEmail");
    setShowModal(false);
    enqueueSnackbar("Successfully Logged out!", { variant: "success" });
    navigate("/");
    window.location.reload();
  }

  function splitArray(arr) {
    return arr ? arr.split(",").map((skill) => skill.trim()) : [];
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim() === "") return;

    // Check for duplicate skills (case-insensitive)
    const skillExists = selectedSkills.some(
      (skill) => skill.toLowerCase() === customSkill.trim().toLowerCase()
    );

    if (skillExists) {
      enqueueSnackbar("Skill already exists", { variant: "warning" });
      return;
    }

    const updatedSkills = [...selectedSkills, customSkill.trim()];

    axios
      .patch(`http://localhost:8000/profile/${username}/update/`, {
        skills: updatedSkills.join(", "),
      })
      .then(() => {
        setProfile((prevData) => ({
          ...prevData,
          skills: updatedSkills.join(", "),
        }));
        setSelectedSkills(updatedSkills);
        setCustomSkill("");
        enqueueSnackbar("Skill Updated successfully", { variant: "success" });
      })
      .catch(() => {
        setError("Failed to update profile");
        enqueueSnackbar("Failed to update", { variant: "error" });
      });
  };

  const handleSkillChange = async (e) => {
    const skill = e.target.value;
    if (skill && !selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill];
      try {
        await axios.patch(`http://localhost:8000/profile/${username}/update/`, {
          skills: updatedSkills.join(", "),
        });

        setProfile((prevData) => ({
          ...prevData,
          skills: updatedSkills.join(", "),
        }));
        setSelectedSkills(updatedSkills);
        enqueueSnackbar("Skills Updated!", { variant: "success" });
      } catch (err) {
        setError("Failed to update profile");
        enqueueSnackbar("Failed to update", { variant: "error" });
      }
    }
  };

  const handleEdit = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resumehandle = (e) => {
    setResume(e.target.files[0]);
  };

  const handleEditsubmit = async (e) => {
    e.preventDefault();

    // Mobile number validation
    if (EditData.mobile && !/^\d{10}$/.test(EditData.mobile)) {
      enqueueSnackbar("Mobile number must be exactly 10 digits", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("username", EditData.username);
    formData.append("email", EditData.email);
    formData.append("role", EditData.role);
    formData.append("mobile", EditData.mobile);
    formData.append("address", EditData.address);
    formData.append("education", EditData.education);
    formData.append("exeperience", EditData.exeperience);
    if (image) formData.append("profile_image", image);
    if (resume) formData.append("resume", resume);

    try {
      await axios.put(
        `http://localhost:8000/profile/${username}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prev) => ({ ...prev, ...EditData }));
      setEdit(false);
      enqueueSnackbar("Profile Updated!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  return (
    <>
      <div
        className="profile-page-wrapper"
        style={{
          width: "100%",
          height: "200vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #32a852, #b2d3b8)",

        }}
      >
        {profile ? (
          <div
            className="profile-card p-4"
            style={{
              width: "60%",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-center">
              <img
                src={
                  profile.profile_image
                    ? `http://localhost:8000${profile.profile_image}`
                    : "https://pluspng.com/img-png/png-user-icon-circled-user-icon-2240.png"
                }
                alt="Profile"
                className="img-thumbnail"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
            </div>

            <div className="text-center mb-4">
              <h5>@{profile.username}</h5>
              <p>
                {profile.exeperience
                  ? `${profile.exeperience} Years Experience`
                  : "No experience added"}
              </p>
            </div>

            <div className="text-center mb-4">
              <div>
                <MdMail /> {profile.email}
              </div>
              <div>
                <MdContactMail /> {profile.mobile}
              </div>
              <div>
                <FaIdCard /> {profile.address}
              </div>
              <div>
                <MdSchool /> {profile.education}
              </div>
              <div>
                <IoCodeWorking /> {profile.role}
              </div>
            </div>

            <div className="skills-section mb-4">
              <h6>Skills:</h6>
              <div
                className="skills-list"
                style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                {selectedSkills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => {
                        const updatedSkills = selectedSkills.filter(
                          (s) => s !== skill
                        );
                        axios
                          .patch(
                            `http://localhost:8000/profile/${username}/update/`,
                            {
                              skills: updatedSkills.join(", "),
                            }
                          )
                          .then(() => {
                            setSelectedSkills(updatedSkills);
                            enqueueSnackbar("Skill removed", {
                              variant: "info",
                            });
                          });
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "white",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="text-center">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setEdit(true)}
              >
                <FaEdit /> Edit Profile
              </Button>

              <Button
                variant="success"
                onClick={() => setShowAppliedJobsModal(true)}
              >
                <MdWork /> Applied Jobs
              </Button>

              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShowSkillForm(true)}
              >
                <IoAddCircle /> Add Skill
              </Button>

              <Button
                variant="info"
                className="ms-2"
                onClick={() =>
                  window.open(`http://localhost:8000${profile.resume}`, "_blank")
                }
              >
                <IoDocument /> View Resume
              </Button>
              <Button
  variant="outline-danger"
  className="ms-2"
  onClick={handleLogout}
  style={{
    backgroundColor: 'red',
    color: 'white',
    borderColor: 'red',
  }}
>
  <MdExitToApp /> Logout
</Button>

            </div>

            {/* Modals for Applied Jobs, Edit Profile, Add Skill */}
            <Modal
              show={Edit}
              onHide={() => setEdit(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleEditsubmit}>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={EditData.mobile}
                      onChange={handleEdit}
                      className="form-control"
                      maxLength="10"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={EditData.address}
                      onChange={handleEdit}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience (Years)</label>
                    <input
                      type="number"
                      name="exeperience"
                      value={EditData.exeperience}
                      onChange={handleEdit}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Education</label>
                    <input
                      type="text"
                      name="education"
                      value={EditData.education}
                      onChange={handleEdit}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={EditData.role}
                      onChange={handleEdit}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Profile Image</label>
                    <input
                      type="file"
                      name="profile_image"
                      onChange={handleImageChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={resumehandle}
                      className="form-control"
                    />
                  </div>

                  <button type="submit" className="btn btn-success mt-2">
                    <GrUpdate /> Update
                  </button>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setEdit(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showSkillForm}
              onHide={() => setShowSkillForm(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add New Skill</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>Select predefined skill</label>
                  <select
                    className="form-control"
                    onChange={handleSkillChange}
                    value=""
                  >
                    <option value="" disabled>
                      -- Select a skill --
                    </option>
                    {predefinedSkills.map((skill, index) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label>Add custom skill</label>
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="form-control"
                  />
                  <Button
                    variant="success"
                    className="mt-2"
                    onClick={handleAddCustomSkill}
                  >
                    Add Skill
                  </Button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSkillForm(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showAppliedJobsModal}
              onHide={() => setShowAppliedJobsModal(false)}
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Applied Jobs</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AppliedJob username={username}/>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAppliedJobsModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default Profile;