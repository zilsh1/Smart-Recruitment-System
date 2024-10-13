import axios from "axios";
import React, { useState } from "react";
import { FaBuilding } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Component/Spinner";
import style from "./style.module.css";

const CompanyLogin = () => {
  const [email, setemail] = useState("");
  const [loading, setloading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirect = (id) => {
    setloading(true);
    setTimeout(() => {
      navigate(`/company-profile/${parseInt(id) - 1}`);
      window.location.reload();
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      console.log(response.data);
      localStorage.setItem("jobseekerEmail", parseInt(response.data.id) - 1);
      redirect(response.data.id);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/company/login/",
        credentials
      );
      return response;
    } catch (error) {
      setError("Invalid Login");
      throw new Error(
        error.response?.data?.error || "Login failed, please try again."
      );
    }
  };

  return (
    <div
      className={style.Register}
    >
      <form className={`${style.register_form} p-5`} onSubmit={handleSubmit}>
        <p className={style.register_title}>
          <FaBuilding />
          &nbsp; Company Login
        </p>
        <p className={style.register_message}>Welcome back !!!</p>

        <label>
          <input
            className={style.register_input}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter your register email"
            required
          />
          <span>Email</span>
        </label>
        <label>
          <input
            className={style.register_input}
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>Password</span>
        </label>
        {error && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            <p>{error}</p>
          </div>
        )}

        <button className={style.registerForm_button} type="submit">
          Login
        </button>
        <p className={style.signin}>
          Do not have an account? <Link to="/company/register" className={style.signintext}>Register you comapny</Link>
        </p>
      </form>
      <div style={{ display: "grid", placeContent: "center", padding: "20px" }}>
        {loading ? <Spinner /> : <></>}
      </div>
    </div>
  );
};

export default CompanyLogin;
