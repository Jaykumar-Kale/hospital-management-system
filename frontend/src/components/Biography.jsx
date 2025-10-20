import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="Dr. Mansi Karanjkar" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>About Dr. Mansi Karanjkar</h3>
          <p>
            Dr. Mansi Karanjkar is a distinguished mental health professional with extensive 
            experience in counselling and psychological therapy. She specializes in providing 
            comprehensive mental health services with a focus on mindfulness-based approaches.
          </p>
          <p>
            With over a decade of experience in clinical psychology, Dr. Karanjkar has 
            helped numerous individuals overcome various mental health challenges through 
            personalized counselling sessions.
          </p>
          <p>
            At MindFit Counselling, we believe in creating a safe, non-judgmental space 
            where clients can explore their thoughts and emotions freely. Our approach 
            combines traditional therapeutic methods with modern psychological techniques.
          </p>
          <p>
            Dr. Karanjkar specializes in treating anxiety, depression, relationship issues, 
            and stress management. She employs evidence-based practices while maintaining 
            a warm and empathetic environment for her clients.
          </p>
          <p>
            Our mission is to promote mental well-being and help individuals achieve 
            their full potential through professional counselling and guidance.
          </p>
          <p>
            Schedule a consultation today and take the first step towards your mental 
            wellness journey with Dr. Mansi Karanjkar.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;
