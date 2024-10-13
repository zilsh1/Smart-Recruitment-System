import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { FaMobile } from "react-icons/fa";
import { MdEmail, MdFileDownloadDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import Spinner from "../Component/Spinner";
import style from "./style.module.css";

const Applications = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const id = localStorage.getItem("jobseekerEmail");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/company/${id}/applications/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const validData = response.data.filter(
            (job) => job.status !== "Rejected" && job.status !== "Approved"
          );
          setData(validData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const accept = async (applicationId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/application/accept/${applicationId}/`
      );
      enqueueSnackbar("Application accepted", { variant: "success" });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Application accepted", { variant: "success" });
      setLoading(false);
      console.error("Error accepting application", error);
    }
  };

  const reject = async (applicationId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/application/reject/${applicationId}/`
      );
      enqueueSnackbar("Application rejected", { variant: "error" });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Error rejecting application", { variant: "error" });
      setLoading(false);
      console.error("Error rejecting application", error);
    }
  };

  if (!data.length && !loading) {
    return <div>No applications right now</div>;
  }

  return (
    <div className="container pt-5 mb-5" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4">Job Applications</h2>

      {data.length === 0 && <h5 className="text-center">No applications right now</h5>}

      <div className="row">
        {data.map((item, index) => (
          <div key={index} className="col-md-12 mb-4">
            <div className="card p-4 shadow-sm" style={{ borderRadius: "8px" }}>
              <div className="d-flex align-items-center">
                {/* Profile Picture */}
                <div className="me-4">
                  <img
                    src={
                      item.user.profile_image
                        ? item.user.profile_image
                        : "https://th.bing.com/th/id/R.c3631c652abe1185b1874da24af0b7c7?rik=XBP%2fc%2fsPy7r3HQ&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-circled-user-icon-2240.png&ehk=z4ciEVsNoCZtWiFvQQ0k4C3KTQ6wt%2biSysxPKZHGrCc%3d&risl=&pid=ImgRaw&r=0"
                    }
                    alt="profile"
                    className="rounded-circle"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* User Info */}
                <div>
                  <h5 className="mb-1">@{item.user.username}</h5>
                  <p className="mb-1" style={{ fontSize: "0.9rem", color: "#555" }}>
                    <MdEmail /> {item.user.email}
                  </p>
                  <p className="mb-1" style={{ fontSize: "0.9rem", color: "#555" }}>
                    <FaMobile /> {item.user.mobile}
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate(`/applieduserinfo/${item.user.username}`)
                    }
                  >
                    View Details & Resume
                  </button>
                </div>
              </div>

              {/* Job Info */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Job Title: </strong>
                    {item.job.title}
                  </p>
                  <p className="mb-1">
                    <strong>Employment Type: </strong>
                    {item.job.employment_type}
                  </p>
                  <p className="mb-1">
                    <strong>Salary Range: </strong>
                    {item.job.salary_range}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Required Skills: </strong>
                    {item.job.skills}
                  </p>
                  <p className="mb-1">
                    <strong>Posted On: </strong>
                    {new Date(item.job.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-3">
                <button
                  className="btn btn-danger"
                  onClick={() => reject(item.id)}
                >
                  <RxCross2 /> Decline
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => accept(item.id)}
                >
                  <MdFileDownloadDone /> Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spinner */}
      <div className="text-center mt-4">
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Applications;
