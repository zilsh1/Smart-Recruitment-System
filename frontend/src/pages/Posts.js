import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Spinner from "../Component/Spinner";
import style from "./style.module.css";
const Posts = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [posts, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("jobseekerEmail");
  useEffect(() => {
    axios
      .get(`http://localhost:8000/jobs/${id}/`)
      .then((response) => {
        const today = new Date();
        const validPosts = response.data.filter((job) => {
          const deadline = new Date(job.deadline);
          return deadline >= today;
        });
        setPost(validPosts);
        console.log(posts);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const Deletepost = (id) => {
    axios
      .delete(`http://localhost:8000/jobs/${id}/delete/`)
      .then(() => {
        enqueueSnackbar("Post deleted successfully", { variant: "success" });
        setPost(posts.filter((job) => job.id !== id));
      })
      .catch((err) => {
        enqueueSnackbar("Error deleting post", { variant: "error" });
      });
  };
  const createpost = () => {
    navigate(`/createpost/${id}/`);
  };

  if (!posts) {
    return (
      <div style={{ height: "100vh", display: "grid", placeContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className={`container pt-5  ${style.posts}`}>
        {posts.length === 0 ? (
          <div className="p-5">
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              Have not posted anything yet ?{" "}
            </p>
            <button
              className="btn btn-lg d-block btn-outline-dark mx-auto mt-5"
              onClick={createpost}
            >
              <MdAdd />
              &nbsp;Create Post
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-center">Your Posts</h3>
            <div className={`pt-4 ${style.main_card}`}>
              {posts.map((job, index) => (
                <div key={index} className={` mb-4 ${style.postcard}`}>
                  <div
                    className="d-flex align-items-center justify-content-between mb-3"
                    style={{ gap: "10px" }}
                  >
                    <p>
                      Posted &nbsp;
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                    <button
                      className={`btn btn-sm mb-3`}
                      style={{
                        backgroundColor: "darkblue",
                        color: "white",
                        borderRadius: "20px",
                      }}
                      onClick={() => Deletepost(job.id)}
                    >
                      <MdDelete />
                      &nbsp;Delete
                    </button>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <img
                      src={
                        job.company.logo
                          ? `http://localhost:8000${job.company.logo}`
                          : "https://th.bing.com/th/id/OIP.bFnlih-i5mO2tVh6RsTjVQAAAA?cb=13&rs=1&pid=ImgDetMain"
                      }
                      alt="post"
                      className="img-thumbnail"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "black",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="my-auto">{job.company.name}</h5>
                  </div>
                  <h4 className="mb-2">{job.title}</h4>
                  <p className="mb-3">{job.description}</p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <div className={`${style.postText} px-2`}>
                      {job.salary_range}/-
                    </div>
                    <div className={`${style.postText} px-2`}>
                      {job.employment_type}
                    </div>
                    <div className={`${style.postText} px-2`}>{job.skills}</div>
                  </div>
                  <h5>
                    <b>Deadline : </b>
                    {new Date(job.deadline).toLocaleDateString()}
                  </h5>
                </div>
              ))}
            </div>

            <button
              className="btn btn-lg d-block btn-outline-dark mx-auto mt-5"
              onClick={createpost}
            >
              <MdAdd />
              &nbsp;Create Post
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Posts;