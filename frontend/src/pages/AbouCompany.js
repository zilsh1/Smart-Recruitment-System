import React, { useState, useEffect, useRef } from 'react';
import './AboutCompany.css'; // Import your CSS file
import image1 from "./About.jpg"; // Import your image file

const CompanySection = () => {
  const [isInView, setIsInView] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0); // New counter
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      let jobCount = 0;
      let employeeCount = 0;
      let companyCount = 0;
      let projectCount = 0; // New counter

      const interval = setInterval(() => {
        if (jobCount < 1200) jobCount += 20;
        if (employeeCount < 3400) employeeCount += 60;
        if (companyCount < 350) companyCount += 6;
        if (projectCount < 300) projectCount += 5; // New counter increment

        setTotalJobs(jobCount);
        setTotalEmployees(employeeCount);
        setTotalCompanies(companyCount);
        setTotalProjects(projectCount); // Update state

        if (jobCount >= 1200 && employeeCount >= 3400 && companyCount >= 350 && projectCount >= 300) {
          clearInterval(interval);
        }
      }, 50); // Update interval
    }
  }, [isInView]);

  return (
    <div className="company-section">
      <div className="company-content">
        <div className="company-info">
          <h1>About Our Company</h1>
          <p>
            Welcome to <strong>JobFusion</strong>, where we connect talent with opportunity. Our platform is designed to make job searching effortless and efficient. With cutting-edge technology, we offer a seamless experience to both job seekers and employers. Our mission is to simplify the job search process and help you find the perfect job or candidate.
          </p>
          <p>
            We pride ourselves on our innovative approach and commitment to customer satisfaction. Our team is dedicated to providing the best service possible and continuously improving our platform to meet your needs.
          </p>
          <p>At JobFusion, we not only connect job seekers with employers but also foster career growth by providing resources, guidance, and tools tailored to individual needs.</p>
        </div>
        <div className="company-photo">
          <img src={image1} alt="Company" />
        </div>
      </div>
      <hr className="separator" /> {/* Line separator */}
      <div className="metrics" ref={ref}>
        <h2 className="metrics-title">Statistics of Our Website and Company</h2> {/* Title above counters */}
        <div className="metrics-content">
          <div className="metric-card">
            <h2 className="metric-number">+{totalJobs}</h2>
            <p className="metric-label">Total Jobs</p>
          </div>
          <div className="metric-card">
            <h2 className="metric-number">+{totalEmployees}</h2>
            <p className="metric-label">Hired Employees</p>
          </div>
          <div className="metric-card">
            <h2 className="metric-number">+{totalCompanies}</h2>
            <p className="metric-label">Total Companies</p>
          </div>
          <div className="metric-card">
            <h2 className="metric-number">+{totalProjects}</h2>
            <p className="metric-label">Total Visitors</p> {/* Fixed typo */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySection;