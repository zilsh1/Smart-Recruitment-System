import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import style from "./style.module.css"; // Assuming you're using CSS modules
import logo from "./Logo.jpeg";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer_container}>
        {/* Job Portal Services */}
        <div className={style.footer_section}>
          <h4 className={style.footer_title}>Job Portal Services</h4>
          <ul className={style.footer_links}>
            <li>
              <Link to="/post-job" className={style.footer_link}>
                Post a Job
              </Link>
            </li>
            <li>
              <Link to="/search-resumes" className={style.footer_link}>
                Search Resumes
              </Link>
            </li>
            <li>
              <Link to="/job-alerts" className={style.footer_link}>
                Job Alerts
              </Link>
            </li>
            <li>
              <Link to="/resources" className={style.footer_link}>
                Resources
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className={style.footer_section}>
          <h4 className={style.footer_title}>Follow Us</h4>
          <div className={style.footer_socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className={style.footer_social_icon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className={style.footer_social_icon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className={style.footer_social_icon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className={style.footer_social_icon} />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className={style.footer_section}>
          <h4 className={style.footer_title}>Contact Us</h4>
          <p className={style.footer_contact}>
            123 Job Fusion St, Suite 100<br />
            City, State 12345<br />
            Email: support@jobportal.com<br />
            Phone: (123) 456-7890
          </p>
        </div>

        {/* Image Section */}
        <div className={style.footer_section}>
          <h4 className={style.footer_title}>Our Logo</h4>
          <img src={logo} alt="JobHunt Logo" className={style.footer_image} />
        </div>
      </div>

      {/* Copyright */}
      <div className={style.footer_bottom}>
        <p>&copy; {new Date().getFullYear()} JobFusion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
