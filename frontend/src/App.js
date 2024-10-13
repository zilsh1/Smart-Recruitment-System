import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import AppliedUserInfo from "./pages/AppliedUserInfo";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyRegister from "./pages/CompanyRegister";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Job from "./pages/Job"
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Job />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/createpost/:id" element={<CreatePost />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route
            path="/applieduserinfo/:username"
            element={<AppliedUserInfo />}
          />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
