import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import style from "./style.module.css";

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [job, setJob] = useState({
    title: "",
    description: "",
    salary_range: "",
    employment_type: "",
    skills: "",
    posted_by: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const deadlinedate = new Date(job.deadline);
    if (deadlinedate <= today) {
      enqueueSnackbar("Deadline should be greater than today", {
        variant: "error",
      });
    } else {
      axios
        .post("http://localhost:8000/jobs/create/", {
          ...job,
          company: id,
        })
        .then((response) => {
          enqueueSnackbar("Post created successfully", { variant: "success" });
          navigate("/");
        })
        .catch((error) => {
          console.error("Error creating job:", error);
          enqueueSnackbar("Error creating post", { variant: "error" });
        });
    }
  };

  return (
    <div className={style.Register}>
      <form className={style.register_form} onSubmit={handleSubmit}>
        <p className={style.register_title}>
          <IoMdCreate /> &nbsp; Create Post
        </p>
        
        <div className={style.register_flex}>
          <label className={style.register_label}>
            <input
              className={style.register_input}
              type="text"
              name="title"
              onChange={handleChange}
              placeholder="Enter your post title"
              required
            />
            <span>Create Title</span>
          </label>
          <label className={style.register_label}>
            <input
              className={style.register_input}
              type="text"
              name="salary_range"
              onChange={handleChange}
              placeholder="Enter salary"
              required
            />
            <span>Salary Range (in text)</span>
          </label>
        </div>

        <div className={style.register_flex}>
          <label className={style.register_label}>
            <input
              className={style.register_input}
              type="text"
              name="employment_type"
              onChange={handleChange}
              placeholder="Enter employee type"
              required
            />
            <span>Employment Type</span>
          </label>
          <label className={style.register_label}>
            <input
              className={style.register_input}
              type="text"
              name="skills"
              onChange={handleChange}
              placeholder="Enter skill for job require"
              required
            />
            <span>Required Skill</span>
          </label>
        </div>

        <label className={style.register_label}>
          <input
            className={style.register_input}
            type="text"
            name="posted_by"
            onChange={handleChange}
            placeholder="Enter admin name"
            required
          />
          <span>Posted By</span>
        </label>

        <label className={style.register_label}>
          <input
            className={style.register_input}
            type="text"
            name="description"
            onChange={handleChange}
            placeholder="Description about company"
            required
          />
          <span>Add Description</span>
        </label>

        <label className={style.register_label}>
          <input
            className={style.register_input}
            type="datetime-local"
            name="deadline"
            onChange={handleChange}
            placeholder="Enter deadline for job"
            required
          />
          <span>Add Deadline</span>
        </label>

        <button type="submit" className={style.registerForm_button}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;