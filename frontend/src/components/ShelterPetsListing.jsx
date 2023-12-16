import React, { useEffect, useState } from "react";
import { fetchWithoutToken } from "../services/utils";
import { useNavigate } from "react-router-dom";
import Paginate from "./buttons/PageButtons";

const ShelterPetListings = ({ shelterId }) => {
  const [pets, setPets] = useState([]);
  const [totalPets, setTotalPets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Local state for current page
  const navigate = useNavigate();
  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`);
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetchWithoutToken(
          `/pets/?shelter=${shelterId}&page=${currentPage}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        setPets(data.results);
        setTotalPets(data.count); // Set total pets from the response
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [shelterId, currentPage]);

  const setPagination = (pageNumber) => {
    setCurrentPage(pageNumber); // Update the local current page state
  };

  const itemsPerPage = 10; // Assuming 10 items per page, adjust as needed
  const totalPages = Math.ceil(totalPets / itemsPerPage);

  return (
    <div className="shelter-pet-listings pt-4 card-body">
      <div className="row mb-3">
        <h2 className="card-title">Pet Listings</h2>
        {currentUser?.role === "shelter" && currentUser?.id === shelterId ? (
          <div className="col col-12">
            <button
              type="button"
              className="btn btn-primary-cust"
              onClick={() => navigate("/newpet")}
            >
              Add Another Pet
            </button>
          </div>
        ) : null}
      </div>
      <div className="row">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={
                    pet?.image
                      ? pet.image
                      : "https://icons.veryicon.com/png/o/miscellaneous/fresh-icon-1/cat-62.png"
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
                    className="btn btn-outline-primary-cust"
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
      {totalPages > 1 && (
        <div className="mt-3">
          <Paginate
            totalPages={totalPages}
            currentPage={currentPage}
            paginate={setPagination}
          />
        </div>
      )}
    </div>
  );
};

export default ShelterPetListings;
