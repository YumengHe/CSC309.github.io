import React, { useState } from "react"; // Import useState here
import { useNavigate } from "react-router-dom";
import NewPetForm from "../components/forms/NewPetForm";
import { fetchWithToken } from "../services/utils";

const NewPetPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleNewPetSubmit = async (formData) => {
    try {
      const response = await fetchWithToken("/pets/newpet/", "POST", formData);

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }

      // If you want to use the newPet for something, like redirecting:
      const newPet = await response.json();
      navigate(`/pets/${newPet.id}`); // Use navigate from react-router-dom

      // If you're not using the newPet variable, you can comment out or remove these lines.
    } catch (err) {
      setError(err.message);
    }
  };

  // check for user log in
  if (!currentUser) {
    navigate("/login");
  }

  return (
    <div className="new-pet-page">
      <h1>Create a New Pet</h1>
      <NewPetForm error={error} onSubmit={handleNewPetSubmit} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NewPetPage;
