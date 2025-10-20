import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
            Welcome to MinFit Counselling, led by Dr. Mansi Karanjakar. We provide 
            professional mental health services and counselling in a safe, supportive 
            environment. Our approach focuses on holistic well-being, helping you 
            develop effective coping strategies and achieve emotional balance. 
            Dr. Karanjakar and her team are committed to guiding you through your 
            mental health journey with expertise and compassion.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
