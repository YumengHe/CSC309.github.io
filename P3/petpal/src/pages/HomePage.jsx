import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome to the Pet Adoption Website</h1>
      <p>
        PetPal is your go-to platform for seamless pet adoptions, connecting
        rescue animals with loving families. Join our community and discover the
        joy of gaining a lifelong furry companion.
      </p>
      <div>
        {pets.length > 0 ? (
          <ul>
            {pets.map((pet) => (
              <li key={pet.id}>
                <h3>{pet.name}</h3>
                <p>Age: {pet.age || "Unknown"}</p>
                <p>Size: {pet.size || "Unknown"}</p>
                <p>Gender: {pet.gender || "Unknown"}</p>
                {/* Add more pet details if needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pets available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
