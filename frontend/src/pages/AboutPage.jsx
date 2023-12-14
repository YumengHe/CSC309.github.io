import React from "react";
import logoImage from "../assets/image/logo.png";
import "../assets/css/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-section">
      <h2>About PetPal</h2>
      <div className="about-content">
        {/* Image */}
        <img src={logoImage} alt="PetPal Logo" className="about-logo" />
        <div className="about-text">
          <p>
            Founded in 2023, PetPal emerged from a simple yet profound idea:
            Every pet deserves a loving home. With countless animals waiting in
            shelters for their forever families, we saw a need to bridge the gap
            and simplify the adoption process.
          </p>
          <p>
            Today, PetPal stands as a testament to the power of community and
            compassion. We&apos;re more than just a platform; we&apos;re a
            movement. A movement of animal lovers, shelters, and volunteers
            committed to creating a world where every pet finds its home.
          </p>
          <p>
            Through our advanced yet user-friendly portal, potential adopters
            can browse through profiles of pets from various shelters, learn
            about their stories, and embark on the fulfilling journey of
            adoption. But our work doesn&apos;t stop at connections. We&apos;re
            invested in educating our community, promoting responsible pet
            ownership, and advocating for the voiceless.
          </p>
          <p>
            Join us, as we continue to transform lives, both furry and human!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
