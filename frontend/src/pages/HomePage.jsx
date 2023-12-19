import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/HomePage.css";
import "../assets/css/Base.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-section">
      <h1>Welcome to the Pet Adoption Website</h1>
      <p>
        PetPal is your go-to platform for seamless pet adoptions, connecting
        rescue animals with loving families. Join our community and discover the
        joy of gaining a lifelong furry companion.
      </p>
      <div className="adoption-steps">
        <div className="step">
          <h2>Step 1: Research</h2>
          <p>
            Start by researching the type of animal you&apos;d like to adopt.
            Consider factors such as size, breed, and temperament.
          </p>
          <button
            className="btn btn-outline-primary-cust"
            onClick={() => navigate(`/search/pets`)}
          >
            Search for it!
          </button>
        </div>
        <div className="step">
          <h2>Step 2: Visit Shelters</h2>
          <p>
            Visit local shelters or browse our online directory to see available
            animals. Spend time interacting with potential pets to find a good
            match.
          </p>
          <button
            className="btn btn-outline-primary-cust"
            onClick={() => navigate(`/search/shelter`)}
          >
            Check them out!
          </button>
        </div>
        <div className="step">
          <h2>Step 3: Submit Application</h2>
          <p>
            Once you&apos;ve found an animal you&apos;re interested in, submit
            an adoption application. This often requires references and may
            include a home visit.
          </p>
          <button
            className="btn btn-outline-primary-cust"
            onClick={() => navigate(`/applications/`)}
          >
            Apply right now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
