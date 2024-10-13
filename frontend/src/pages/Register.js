import axios from "axios";
import React, { useState } from "react";
import { FaUserEdit } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';  // Importing enqueueSnackbar for notifications
import Spinner from "../Component/Spinner";
import style from "./style.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();  // Initializing snackbar
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
    mobile: "",
    address: "",
    role: "",
  });

  const { username, email, password, re_password, mobile, address, role } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateMobile = (mobile) => {
    const isNumeric = /^[0-9]+$/.test(mobile); // Check if all characters are numeric
    const isTenDigits = mobile.length === 10; // Check if it's exactly 10 digits

    if (!isNumeric && !isTenDigits) {
      return "Mobile number must be 10 digits and numeric";
    } else if (!isNumeric) {
      return "Mobile number must be numeric";
    } else if (!isTenDigits) {
      return "Mobile number must be exactly 10 digits";
    }
    return null;  // No error if the number is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText("");

    if (password !== re_password) {
      setText("Passwords do not match");
      return;
    }

    const mobileError = validateMobile(mobile);
    if (mobileError) {
      setText(mobileError);
      return;
    }

    setLoading(true);
    try {
      await registerUser({ username, email, password, mobile, address, role });
    } catch (err) {
      if (err.response && err.response.data.error) {
        // Specific error handling based on server response
        const errorMessage = err.response.data.error;
        enqueueSnackbar(errorMessage, { variant: "error" });
      } else {
        // General error handling
        enqueueSnackbar("Email, username, or mobile number already exists!", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/register/",
        userData
      );
      localStorage.setItem("jobseekerEmail", username);
      enqueueSnackbar("You have successfully registered!", { variant: "success" });
      
      // Show success message, then redirect to login after a 3-second delay
      setTimeout(() => {
        navigate("/login");  // Redirect to login page
      }, 3000);  // 3 seconds delay

    } catch (err) {
      if (err.response) {
        // Custom error handling for duplicate or existing fields
        const { error } = err.response.data;
        if (error.includes("email") || error.includes("username") || error.includes("mobile")) {
          enqueueSnackbar("Email, username, or mobile number already exists!", { variant: "error" });
        } else {
          enqueueSnackbar(`Registration Failed: ${error}`, { variant: "error" });
        }
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
        height: "200vh",
        paddingTop: "50px",
      }}
    >
      <form className={style.register_form} onSubmit={handleSubmit}>
        <p className={style.register_title}>
          <FaUserEdit /> &nbsp; Register
        </p>
        <p className={style.register_message}>
          Signup now and get full access to our app.
        </p>

        {/* First row with 3 fields */}
        <div className={style.register_row}>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            <span>Username</span>
          </label>

          <label>
            <input
              className={style.register_input}
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <span>Email</span>
          </label>

          <label>
            <input
              className={style.register_input}
              type="text"
              name="role"
              onChange={handleChange}
              placeholder="Enter your role"
              required
            />
            <span>Role</span>
          </label>
        </div>

        {/* Second row with 3 fields */}
        <div className={style.register_row}>
          <label>
            <input
              className={style.register_input}
              type="text"
              name="mobile"
              onChange={handleChange}
              placeholder="Enter your mobile number"
              maxLength="10"
              required
            />
            <span>Mobile</span>
          </label>

          <label>
            <input
              className={style.register_input}
              type="text"
              name="address"
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
            <span>Address</span>
          </label>

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
        </div>

        {/* Third row with 1 field */}
        <div className={style.register_row}>
          <label>
            <input
              className={style.register_input}
              type="password"
              name="re_password"
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <span>Confirm Password</span>
          </label>
        </div>

        <button type="submit" className={style.registerForm_button}>
          Register
        </button>

        <p className={style.signin}>
          Already have an account? <Link to="/login" className={style.signintext}>Log in</Link>
        </p>
        <h4>{text}</h4>
      </form>

      <div style={{ display: "grid", placeContent: "center", padding: "20px" }}>
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Register;