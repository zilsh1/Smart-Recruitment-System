import React from "react";
import style from "./style.module.css";

const JobDetailModal = ({ job, onClose }) => {
  return (
    <div className={style.modalBackdrop}>
      <div className={style.modalContent}>
        <button className={style.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={style.modalHeader}>
          <img
            src={job.company.logo ? `http://localhost:8000${job.company.logo}` : "https://via.placeholder.com/50"}
            alt={`${job.company.name} Logo`}
            className={style.companyLogo}
          />
          <h2>{job.company.name}</h2>
        </div>
        <h3>{job.title}</h3>
        <p><strong>Salary:</strong> {job.salary_range}</p>
        <p><strong>Employee Type:</strong> {job.employment_type}</p>
        <p><strong>Required Skills:</strong> {job.skills}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default JobDetailModal;
