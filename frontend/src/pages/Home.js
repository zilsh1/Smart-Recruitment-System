import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import JobPost from "./JobPost"; // Ensure JobPost handles job display
import style from "./style.module.css";
import About from "./AbouCompany";
import Reviewc from "./Reviewc";

const Home = () => {
  const [email] = useState(localStorage.getItem("jobseekerEmail"));

  const isNumber = (value) => typeof value === "number" && !isNaN(value);
  const isStringContainingDigits = (value) =>
    typeof value === "string" && /^[0-9]+$/.test(value);

  const checkUser = isNumber(email) || isStringContainingDigits(email);

  return (
    <>
      {!checkUser ? (
        <>
          <div
            className={style.login_form}
            style={{
              backgroundColor: "#e8f5e9", // Light green background
              display: "grid",
              placeContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Add shadow for depth
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid #81c784", // Lighter green border
            }}
          >
            <div>
              <h6 className={style.no1} style={{ color: "#388e3c", fontWeight: "bold" }}>
                JobFusion - Your Career Awaits
              </h6>
              <h1 className={style.heading} style={{ color: "#2e7d32", fontWeight: "bold" }}>
                Find Your Perfect Job <br />
                <span>
                  With
                  <span style={{ color: "#81c784" }}> Us!</span>
                </span>
              </h1>
              <br />
              <div className="mb-3">
                <div className="input-group">
                  <input
                    style={{
                      padding: "15px",
                      borderTopLeftRadius: "25px",
                      borderBottomLeftRadius: "25px",
                      border: "2px solid #81c784", // Lighter green border
                      outline: "none",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)", // Subtle inner shadow
                    }}
                    id="custom-skill"
                    type="text"
                    className="form-control"
                    placeholder="Search for jobs, companies..."
                  />
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#2e7d32", // Dark green button
                      color: "white",
                      height: "57px",
                      borderTopRightRadius: "25px",
                      borderBottomRightRadius: "25px",
                      border: "2px solid #2e7d32", // Dark green border
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Shadow for button
                    }}
                    type="button"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              <br />
              <br />
            </div>
          </div>
          <JobPost /> {/* JobPost component will display the latest jobs */}
          <p style={{ textAlign: "center", color: "#388e3c" }}>
            Want to see more jobs? Please log in to your account!
          </p>
          <About />
          <Reviewc />
        </>
      ) : (
        <>
          <div
            className={style.login_form}
            style={{
              backgroundColor: "#e8f5e9", // Light green background
              display: "grid",
              placeContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Add shadow for depth
              padding: "40px",
              borderRadius: "20px",
              border: "2px solid #81c784", // Lighter green border
            }}
          >
            <div>
              <h6 className={style.no1} style={{ color: "#388e3c", fontWeight: "bold" }}>
                JobFusion - Your Career Awaits
              </h6>
              <h1 className={`mt-5 pt-5 ${style.heading}`} style={{ color: "#2e7d32", fontWeight: "bold" }}>
                Connect with Top Talent <br />
                <span>
                  and Enhance Your
                  <span style={{ color: "#81c784" }}> Business</span>
                </span>
              </h1>
              <br />
              <br />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;