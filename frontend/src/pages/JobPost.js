import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import Spinner from "../Component/Spinner";
import Modal from "react-modal";
import style from "./style.module.css";

const JobPost = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // For modal
  const userEmail = localStorage.getItem("jobseekerEmail");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/jobs/");
        const today = new Date();
        const validPosts = response.data.filter((job) => new Date(job.deadline) >= today);
        setJobs(validPosts);
      } catch (err) {
        setError("Failed to fetch job postings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const checkResume = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(`http://localhost:8000/profile/${userEmail}/`);
          setHasResume(!!response.data.resume);
        } catch (err) {
          setHasResume(false);
        }
      }
    };

    checkResume();
  }, [userEmail]);

  const handleApply = async (jobId) => {
    if (!userEmail) {
      enqueueSnackbar("Please login to apply for the job", { variant: "warning" });
      return;
    }

    if (!hasResume) {
      enqueueSnackbar("Please upload your resume to apply for jobs", { variant: "warning" });
      return;
    }

    try {
      await axios.post(`http://localhost:8000/apply/${jobId}/${userEmail}/`);
      enqueueSnackbar("Applied successfully!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("You have already applied for this job", { variant: "info" });
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h5 className="text-danger">{error}</h5>
      </div>
    );
  }

  return (
    <div className={`container py-5 ${style.posts}`}>
      <h3 className="text-center mb-4">Top Jobs</h3>
      {jobs.length === 0 ? (
        <div className="text-center">
          <h5>No job postings available at the moment.</h5>
        </div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job.id} className="col-md-6 col-lg-4 mb-4">
              <div className={`card ${style.postcard} h-100`}>
                <div className={`d-flex align-items-center ${style.cardHeader}`}>
                  <div className={style.companyInfo}>
                    <img
                      src={
                        job.company.logo
                          ? `http://localhost:8000${job.company.logo}`
                          : "https://via.placeholder.com/50"
                      }
                      className="img-thumbnail"
                      alt={`${job.company.name} Logo`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className={style.companyName}>{job.company.name}</h5>
                  </div>
                  <button className={`btn ${style.bookmarkBtn}`}>
                    <FaRegBookmark />
                  </button>
                </div>
                <div className={style.cardBody}>
                  <h4 className={style.jobTitle}>{job.title}</h4>
                  <p className={style.salary}>Salary: {job.salary_range}/-</p>
                </div>
                <div className="d-flex justify-content-between">
                  <button className={`btn ${style.jobpostbtn}`} onClick={() => openModal(job)}>
                    <BiMessageSquareDetail />
                    &nbsp;Details
                  </button>
                  <button className={`btn ${style.jobpostbtn}`} onClick={() => handleApply(job.id)}>
                    <MdSend />
                    &nbsp;Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Job Details */}
      {selectedJob && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          contentLabel="Job Details"
          className={style.modalContent}
          overlayClassName={style.modalOverlay}
        >
          <button onClick={closeModal} className={style.closeButton}>
            &times;
          </button>
          <div className={style.modalHeader}>
            <img
              src={
                selectedJob.company.logo
                  ? `http://localhost:8000${selectedJob.company.logo}`
                  : "https://via.placeholder.com/50"
              }
              alt={`${selectedJob.company.name} Logo`}
              className={style.companyLogo}
            />
            <h2>{selectedJob.company.name}</h2>
          </div>
          <h3>{selectedJob.title}</h3>
          <p><strong>Salary:</strong> {selectedJob.salary_range}</p>
          <p><strong>Type:</strong> {selectedJob.employment_type}</p>
          <p><strong>Skills:</strong> {selectedJob.skills}</p>
          <p><strong>Description:</strong> {selectedJob.description}</p>
          <p><strong>Deadline:</strong> {new Date(selectedJob.deadline).toLocaleDateString()}</p>
          <button onClick={closeModal} className="btn btn-secondary">Close</button>
        </Modal>
      )}
    </div>
  );
};

export default JobPost;
