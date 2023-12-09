import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const STATUS_CHOICES = ["available", "pending", "adopted", "withdrawn"];
const GENDER_CHOICES = ["male", "female", "unknown"];
const SIZE_CHOICES = ["small", "medium", "large", "extra_large", "unknown"];

const PetSearchPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(); // Get search parameters

  // Initialize filters with URL query parameters
  const initialFilters = {
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    shelter: searchParams.get("shelter") || "",
    species: searchParams.get("species") || "", // Add species filter
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    // Append filter parameters to the query string if they exist
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    fetch(`http://localhost:8000/pets/?${queryParams.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPets(data.results);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    setSearchParams(newFilters); // Update URL query parameters
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Available Pets</h1>
      {/* Filters Form */}
      <div>
        <select name="status" onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          {STATUS_CHOICES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select name="gender" onChange={handleFilterChange}>
          <option value="">All Genders</option>
          {GENDER_CHOICES.map((gender) => (
            <option key={gender} value={gender}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </option>
          ))}
        </select>
        <select name="size" onChange={handleFilterChange}>
          <option value="">All Sizes</option>
          {SIZE_CHOICES.map((size) => (
            <option key={size} value={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="shelter"
          placeholder="Shelter ID"
          onChange={handleFilterChange}
        />
      </div>

      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <h3>{pet.name}</h3>
              <p>Age: {pet.age || "Unknown"}</p>
              <p>Size: {pet.size || "Unknown"}</p>
              <p>Gender: {pet.gender || "Unknown"}</p>
              <p>
                Status: {""}
                {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
              </p>
              {/* More pet details can be added here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pets available at the moment.</p>
      )}
    </div>
  );
};

export default PetSearchPage;
