import axios from "axios";
import React, { useEffect, useState } from "react";

const Demo = () => {
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/first/")
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(data);
  return (
    <div>
      {data.map((user, index) => (
        <div key={user.id}>
          <h4>{user.username}</h4>
          <h4>{user.id}</h4>
          <h4>{user.email}</h4>
          <h4>{user.created_at}</h4>
          <h4>{user.role}</h4>
          <h4>{user.address}</h4>
          <h4>{user.skills}</h4>
          <h4>{user.mobile}</h4>
          <h4>{user.exeperience}</h4>
          <img
            src={`http://localhost:8000/media/${user.profile_image}`}
            alt="Profile"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default Demo;
