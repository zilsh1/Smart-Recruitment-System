import React, { useState } from "react";
import { FaHome, FaBuilding } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./Logo.jpeg"; // Replace with the actual path to your logo
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [email] = useState(localStorage.getItem("jobseekerEmail"));
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClose = () => {
    setIsCollapsed(true);
  };

  const isNumber = (value) => typeof value === "number" && !isNaN(value);
  const isStringContainingDigits = (value) =>
    typeof value === "string" && /^[0-9]+$/.test(value);

  const checkUser = isNumber(email) || isStringContainingDigits(email);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top m-2" style={{ borderRadius: "20px" }}>
      <div className="container">
        <a className="navbar-brand" href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="JobFusion Logo" className="rounded-pill" width="40" />
          <span style={{ marginLeft: '10px', color: 'green', fontSize: '22px', fontFamily: "'Roboto', sans-serif" }}>
            JobFusion
          </span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{ border: 'none' }}
        >
          <FaBars style={{ color: 'green', fontSize: '24px' }} />
        </button>
        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={handleClose}
                style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
              >
                <FaHome /> Home
              </Link>
            </li>
            {email ? (
              checkUser ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/posts"
                      onClick={handleClose}
                      style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                    >
                      Posts
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/company-profile/${email}`}
                      onClick={handleClose}
                      style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                    >
                      <FaBuilding /> Company
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/jobs"
                      onClick={handleClose}
                      style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                    >
                      Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/profile/${email}`}
                      onClick={handleClose}
                      style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                    >
                      Profile Edit
                    </Link>
                  </li>
                </>
              )
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={handleClose}
                    style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/company/login"
                    onClick={handleClose}
                    style={{ color: 'green', fontFamily: "'Roboto', sans-serif", fontSize: '18px' }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
