import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetProfileView from "../components/PetProfileView";
import EditPetProfileForm from "../components/forms/EditPetForm";
import { fetchWithoutToken } from "../services/utils";

const PetProfilePage = () => {
  const [pet, setPet] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const { petId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchPetProfile();
  }, [petId, isEditMode]);

  const fetchPetProfile = async () => {
    try {
      const response = await fetchWithoutToken(`/pets/${petId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const petData = await response.json();
      setPet(petData);
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setError("An error occurred while fetching pet data.");
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = async (editedPetData) => {};

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!pet) {
    navigate("/search/pets/");
    return <div>Loading...</div>;
  }

  const canEdit = currentUser?.id === pet.shelter;

  return (
    <div className="container mt-4">
      <h2> Pet Details </h2>
      <h1 className="text-center mb-3">Pet Profile: {pet.name}</h1>
      <div className="card">
        {isEditMode && canEdit ? (
          <EditPetProfileForm
            pet={pet}
            handleSubmit={handleSubmit}
            handleFormChange={(e) =>
              setPet({ ...pet, [e.target.name]: e.target.value })
            }
            handleFileChange={(e) => {}}
            handleEditToggle={handleEditToggle}
          />
        ) : (
          <PetProfileView
            pet={pet}
            handleEditToggle={handleEditToggle}
            isEditable={canEdit}
          />
        )}
      </div>
    </div>
  );
};

export default PetProfilePage;
