import React, { useEffect, useState } from "react";
import { fetchWithoutToken } from "../services/utils";
import { useNavigate } from "react-router-dom";

const ShelterPetListings = ({ shelterId }) => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetchWithoutToken(`/pets/?shelter=${shelterId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        setPets(data.results);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [shelterId]);

  return (
    <div className="shelter-pet-listings pt-4">
      <h2>Pet Listings</h2>
      <div className="row">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={
                    pet?.image
                      ? pet.image
                      : "https://source.unsplash.com/short-coated-brown-and-white-puppy-eoqnr8ikwFE"
                  }
                  className="card-img-top"
                  alt={`${pet?.name} picture`}
                />
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <p className="card-text">
                    {pet.description || "No description available"}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePetClick(pet.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No pets available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ShelterPetListings;