import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";

const AppliedJob = ({ username }) => {
  const [appliedJobs, setAppliedjobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/applied-jobs/${username}/`
        );
        setAppliedjobs(response.data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        setError("Failed to fetch applied jobs.");
      }
    };

    fetchAppliedJobs();
  }, [username]);

  if (error) {
    return <div>{error}</div>;
  }

  if (appliedJobs.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          display: "grid",
          placeContent: "center",
        }}
      >
          <span   >Not yet Applied</span>
      </div>
    );
  }

  return (
    <div className="container mb-5">
      <h4 className="mb-5">Applied Jobs</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Job Role</th>
              <th scope="col">Company</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map((job, index) => (
              <tr key={index}>
                <td>{new Date(job.applied_date).toLocaleDateString()}</td>
                <td>{job.job_role}</td>
                <td>{job.company_name}</td>
                <td
                  className={`${
                    job.status === "Approved"
                      ? "text-success"
                      : job.status === "Rejected"
                      ? "text-danger"
                      : ""
                  }`}
                  style={{ fontWeight: "bold" }}
                >
                  {job.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppliedJob;