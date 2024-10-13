import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Reviewc.css"
import image1 from "./client1.jpg";
import image2 from "./client2.jpg";
import image3 from "./client3.jpg";
import image4 from "./client4.jpg";

const Reviewc = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      text: "JobFusion connected me with the perfect tech role. The platform is user-friendly and offers diverse opportunities that match my skills. I highly recommend it to anyone in IT!",
      image: image1,
      name: "Sarah Johnson",
      profession: "Software Engineer (IT)",
    },
    {
      text: "Thanks to JobFusion, I found a great position in mechanical engineering. The variety of job listings and the support from the team were exceptional. It's a must-use for any engineer!",
      image: image2,
      name: "Michael Thompson",
      profession: "Mechanical Engineer",
    },
    {
      text: "Finding a job in civil engineering was a breeze with JobFusion. The platform's specialized filters ensured I found exactly what I was looking for.",
      image: image3,
      name: "Emily Davis",
      profession: "Civil Engineer",
    },
    {
      text: "JobFusion is an excellent resource for engineers. I quickly found a job in the electrical field that met all my career goals. Highly recommended!",
      image: image4,
      name: "James Walker",
      profession: "Electrical Engineer",
    },
  ];

  return (
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
      <div className="container">
        <h1 className="text-center mb-5">Our Clients Say!!!</h1>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-item rounded p-4 ${
                index === activeSlide ? "active" : ""
              }`}
            >
              <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
              <p>{testimonial.text}</p>
              <div className="d-flex align-items-center">
                <img
                  className="img-fluid flex-shrink-0 rounded"
                  src={testimonial.image}
                  alt={`Client ${index + 1}`}
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="ps-3">
                  <h5 className="mb-1">{testimonial.name}</h5>
                  <small>{testimonial.profession}</small>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Reviewc;
