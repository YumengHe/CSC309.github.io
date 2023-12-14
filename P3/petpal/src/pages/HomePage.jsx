import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/HomePage.css";
import "../assets/css/Base.css";

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pet listings from the backend
    fetch("http://localhost:8000/pets/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPets(data.results); // Set the pet listings in state
      })
      .catch((error) => {
        setError(error.message); // Set any errors that occur during fetch
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the fetch is complete
      });
  }, []);

  const viewDetails = (petId) => {
    navigate(`/pets/${petId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
      <ul className="pets-list">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <li key={pet.id} className="pet-item">
              <h3>{pet.name}</h3>
              <p>Age: {pet.age || "Unknown"}</p>
              <p>Size: {pet.size || "Unknown"}</p>
              <p>Gender: {pet.gender || "Unknown"}</p>
              <p>
                Status:{" "}
                {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
              </p>
              <button
                className="btn btn-outline-primary-cust"
                onClick={() => viewDetails(pet.id)}
              >
                View Detail
              </button>
            </li>
          ))
        ) : (
          <p>No pets available at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
