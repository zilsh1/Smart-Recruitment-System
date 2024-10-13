import axios from "axios";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack'; // Import useSnackbar from notistack
import Spinner from "../Component/Spinner";
import style from "./style.module.css";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
    location: "",
    industry: "",
    name: "",
    website: "",
    description: "",
    logo: null,
  });

  const {
    name,
    email,
    password,
    re_password,
    location,
    industry,
    website,
    description,
    logo,
  } = formData;

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0], // Ensure file is stored correctly
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText("");

    if (password !== re_password) {
      setText("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
    } catch (err) {
      enqueueSnackbar(err.message || "Failed to register", { variant: "error" });
      setText("Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/company/register/",
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.company.id);
      localStorage.setItem("jobseekerEmail", response.data.company.id);
      enqueueSnackbar("Successfully registered! Now you can log in.", { variant: "success" });
      navigate("/company/login"); // Redirect to login page
    } catch (err) {
      if (err.response) {
        enqueueSnackbar(`This email is already in use, try with another: ${err.response.data.error}`, { variant: "error" });
      } else if (err.request) {
        enqueueSnackbar("No response from server. Please try again later.", { variant: "error" });
      } else {
        enqueueSnackbar(`Error: ${err.message}`, { variant: "error" });
      }
    }
  };

  return (
    <div
      className={style.Register}
      style={{
        height: "220vh",
        paddingTop: "50px",
      }}
    >
      <form
        className={style.register_form}
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <p className={style.register_title}>
          <FaUserPlus /> &nbsp; Register
        </p>
        <p className={style.register_message}>
          Signup now and get full access to our app.
        </p>
        <div className={style.register_grid}>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Enter your company name"
              required
            />
            <span>Company Name</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            <span>Email</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="location"
              onChange={handleChange}
              placeholder="Enter your company location"
              required
            />
            <span>Location</span>
          </label>
        </div>

        <div className={style.register_grid}>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="website"
              onChange={handleChange}
              placeholder="Enter your website"
              required
            />
            <span>Website</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="industry"
              onChange={handleChange}
              placeholder="Enter your company industry"
              required
            />
            <span>Industry</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="description"
              onChange={handleChange}
              placeholder="Enter something about your company"
              required
            />
            <span>About Company</span>
          </label>
        </div>

        <div className={style.register_grid}>
          <label>
            <input
              className={style.register_input}
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <span>Password</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="password"
              name="re_password"
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <span>Confirm password</span>
          </label>
          <label>
            <input
              className={style.register_input}
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
            />
            <span>Company logo</span>
          </label>
        </div>

        {/* Error Message Display */}
        {text && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {text}
          </p>
        )}

        <button type="submit" className={style.registerForm_button}>
          Register your company
        </button>
        <p className={style.signin}>
          Already have a company account?{" "}
          <Link to="/company/login" className={style.signintext}>
            Log in
          </Link>
        </p>
      </form>
      <div style={{ display: "grid", placeContent: "center", padding: "20px" }}>
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default CompanyRegister;
