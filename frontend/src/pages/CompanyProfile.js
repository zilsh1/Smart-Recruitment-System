import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdBusiness, MdLocationOn, MdDescription, MdEdit } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { AiOutlineGlobal } from "react-icons/ai";
import { BsBuilding } from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Applications from "./Applications";
import { Modal, Button, Form } from "react-bootstrap";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/company-profile/${id}/`);
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/applications/${id}/`);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchCompanyData();
    fetchApplications();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("jobseekerEmail");
    navigate("/");
    window.location.reload();
  };

  const handleEditClick = (company) => {
    setEditData(company);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/company-profile/${id}/`, editData);
      setShowEditModal(false);
      const response = await axios.get(`http://localhost:8000/company-profile/${id}/`);
      setCompanyData(response.data);
    } catch (error) {
      console.error("Error updating company data:", error);
    }
  };

  if (!companyData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #32a852, #b2d3b8)", // Full page green gradient background
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white", // White background for profile box
            padding: "40px",
            borderRadius: "15px",
            maxWidth: "800px",
            width: "100%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <h1 className="text-center mb-5 text-secondary">
            <HiOutlineOfficeBuilding /> &nbsp;&nbsp;Company Profile
          </h1>

          {companyData.map((company) => (
            <div key={company.id}>
              {/* Centered Rounded Logo */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={company.logo ? `http://localhost:8000${company.logo}` : "https://via.placeholder.com/150"}
                  alt="Company Logo"
                  style={{
                    borderRadius: "50%",
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Company Name */}
              <h2 style={{ marginTop: "20px", textAlign: "center" }}>
                <BsBuilding /> &nbsp;{company.name}
              </h2>

              {/* Company Details */}
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <div style={{ marginBottom: "15px" }}>
                  <h6 style={{ display: "inline-block", marginRight: "10px" }}>
                    <MdLocationOn /> Location:
                  </h6>
                  <h5 style={{ display: "inline-block" }}>{company.location}</h5>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h6 style={{ display: "inline-block", marginRight: "10px" }}>
                    <AiOutlineGlobal /> Website:
                  </h6>
                  <h5 style={{ display: "inline-block" }}>{company.website}</h5>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h6 style={{ display: "inline-block", marginRight: "10px" }}>
                    <MdBusiness /> Industry:
                  </h6>
                  <h5 style={{ display: "inline-block" }}>{company.industry}</h5>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h6 style={{ display: "inline-block", marginRight: "10px" }}>
                    <MdDescription /> Description:
                  </h6>
                  <h5 style={{ display: "inline-block" }}>{company.description}</h5>
                </div>
              </div>

              {/* Edit and Logout Buttons */}
              <div style={{ marginTop: "30px" }}>
                <button
                  className="btn"
                  onClick={() => handleEditClick(company)}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "10px 20px",
                    marginRight: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <MdEdit /> &nbsp; Edit
                </button>
                <button
                  className="btn"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                  }}
                >
                  <FaPowerOff /> &nbsp; Logout
                </button>
                <button
                  className="btn"
                  onClick={() => setShowApplicationsModal(true)}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px 20px",
                    marginLeft: "10px",
                    borderRadius: "5px",
                  }}
                >
                  Show Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Modal */}
      <Modal show={showApplicationsModal} onHide={() => setShowApplicationsModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Applications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applications.length === 0 ? (
            <h4 style={{ textAlign: "center" }}><Applications/></h4>
          ) : (
            <div className="row">
              {applications.map((application, index) => (
                <div className="col-md-12" key={index} style={{ marginBottom: "10px" }}>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "10px",
                      width: "100%",
                      background: "#f9f9f9",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0 }}>Position: {application.position}</h5>
                      <h6 style={{ margin: 0 }}>Applicant Name: {application.applicant_name}</h6>
                      <p style={{ margin: 0 }}>{application.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompanyLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editData.location || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompanyWebsite">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={editData.website || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompanyIndustry">
              <Form.Label>Industry</Form.Label>
              <Form.Control
                type="text"
                name="industry"
                value={editData.industry || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCompanyDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editData.description || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CompanyProfile;
