import axios from "axios";
import React, { useState } from "react";
import { FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Component/Spinner";
import style from "./style.module.css";

const Login = () => {
  const [username, setusername] = useState("");
  const [loading, setloading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirect = () => {
    setloading(true);
    setTimeout(() => {
      navigate(`/profile/${username}`);
      window.location.reload();
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("jobseekerEmail", username);
      redirect();
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
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
          <FaSignInAlt />
          &nbsp; Login
        </p>
        <p className={style.register_message}>Welcome back !!!</p>

        <label>
          <input
            className={style.register_input}
            type="text"
            name="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            placeholder="Enter you username"
            required
          />
          <span>Username</span>
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

        <button className={style.registerForm_button}type="submit">
          Login
        </button>
        <p className={style.signin}>
          Do not have an account? <Link to="/register" className={style.signintext}>Create you account</Link>
        </p>
      </form>
      <div style={{ display: "grid", placeContent: "center", padding: "20px" }}>
        {loading ? <Spinner /> : <></>}
      </div>
    </div>
  );
};

export default Login;