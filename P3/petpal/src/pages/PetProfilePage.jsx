import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetProfileView from "../components/PetProfileView";
import EditPetProfileForm from "../components/forms/EditPetForm";
import {
  API_BASE_URL,
  fetchWithoutToken,
  fetchWithToken,
} from "../services/utils";

const PetProfilePage = () => {
  const [pet, setPet] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { petId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchPetProfile();
  }, [petId, isEditMode]);

  const currentImage = useMemo(() => {
    if (imagePreviewUrl) {
      console.log("here1");
      return imagePreviewUrl;
    }
    if (pet?.image && !pet?.image.startsWith(API_BASE_URL)) {
      console.log(`${API_BASE_URL}${pet?.image}`);
      return `${API_BASE_URL}${pet?.image}`;
    }
    return null;
  }, [pet?.image, imagePreviewUrl]);

  const fetchPetProfile = async () => {
    try {
      const response = await fetchWithoutToken(`/pets/${petId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const petData = await response.json();
      setPet({ ...petData, originalData: petData });
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setError("An error occurred while fetching pet data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    let isFormDataUsed = false;

    Object.entries(pet).forEach(([key, value]) => {
      if (key !== "originalData") {
        const originalValue = pet.originalData[key];
        if (typeof value !== "object" && value !== originalValue) {
          formData.append(key, value);
          isFormDataUsed = true;
        } else if (value instanceof File && isFileChanged(key, value)) {
          formData.append(key, value);
          isFormDataUsed = true;
        }
      }
    });
    if (!isFormDataUsed) {
      console.log("No changes detected.");
      return; // Exit the function if no changes have been made
    }

    for (const [key, value] of formData.entries()) {
      console.log({ key, value });
    }
    try {
      const response = await fetchWithToken(
        `/pets/${petId}/`,
        "PATCH",
        formData,
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError("You do not have permission to edit this pet post.");
        } else if (response.status === 400) {
          const fieldErrors = [];
          for (const field in data) {
            // Assuming each field's errors are in an array
            fieldErrors.push(`${field}: ${data[field].join(", ")}`);
          }
          setError(fieldErrors.join("<br>"));
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        // Update the user context with the new current user data
        setPet({ ...data, originalData: data });
        setIsEditMode(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating pet data:", error);
      setError("An error occurred while updating pet data.");
    }
  };

  function isFileChanged(key, value) {
    console.log("profile changed?", value && value instanceof File);
    return value && value instanceof File;
  }

  const handleEditToggle = () => {
    setError("");
    setIsEditMode(!isEditMode);
  };

  const handleFormChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPet({ ...pet, [e.target.name]: file });
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleDeleteUser = async (petId) => {
    try {
      const response = await fetchWithToken(`/pets/${petId}/`, "DELETE");
      if (response.ok) {
        console.log(`Pet ${pet?.name} deleted successfully.`);
        // logoutUser();
        navigate("/search/pets/");
        window.confirm(`Pet ${pet?.name} deleted successfully.`);
      }

      // Add any post-deletion logic here, like redirecting or updating UI
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!pet) {
    navigate("/search/pets/");
    return <div>Loading...</div>;
  }

  const canEdit = currentUser?.id === pet.shelter;
  const canApply = currentUser?.role === "seeker";
  // const canEdit = true;

  return (
    <div className="container mt-4">
      <h2> Pet Details </h2>
      <h1 className="text-center mb-3">Pet Profile: {pet.name}</h1>
      <div className="card">
        {isEditMode && canEdit ? (
          <EditPetProfileForm
            pet={pet}
            handleSubmit={handleSubmit}
            handleEditToggle={handleEditToggle}
            handleFormChange={handleFormChange}
            handleFileChange={handleFileChange}
            currentImage={currentImage}
          />
        ) : (
          <PetProfileView
            pet={pet}
            handleEditToggle={handleEditToggle}
            currentImage={currentImage}
            handleDeleteUser={handleDeleteUser}
            currentUser={currentUser}
            isEditable={canEdit}
            isAppliable={canApply}
          />
        )}
      </div>
    </div>
  );
};

export default PetProfilePage;
