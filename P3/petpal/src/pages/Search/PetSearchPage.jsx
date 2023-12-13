import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../assets/css/PetSearchPage.css";

const STATUS_CHOICES = ["available", "pending", "adopted", "withdrawn"];
const GENDER_CHOICES = ["male", "female", "unknown"];
const SIZE_CHOICES = ["small", "medium", "large", "extra_large", "unknown"];
const SORT_OPTIONS = ["Name", "-Name", "Age", "-Age"];

const PetSearchPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(); // Get search parameters
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  // Initialize filters with URL query parameters
  const initialFilters = {
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    shelter: searchParams.get("shelter") || "",
    species: searchParams.get("species") || "", // Add species filter
  };
  const [filters, setFilters] = useState(initialFilters);
  const queryParams = new URLSearchParams();
  useEffect(() => {
    // Append filter parameters to the query string if they exist
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
      if (sort) {
        queryParams.set("sort", sort); // Set the sort parameter
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
  }, [filters, queryParams]);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    setSearchParams(newFilters); // Update URL query parameters
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const viewDetails = (petId) => {
    navigate(`/pets/${petId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pet-search-page">
      <aside className="filter-sort-sidebar">
        {/* Filters Form */}
        <section className="filter-section">
          <h2>Filter</h2>
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
        </section>
        {/* Sort Form */}
        <section className="sort-section">
          <h2>Sort</h2>
          <select name="sort" value={sort} onChange={handleSortChange}>
            <option value="">Sort by...</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </section>
      </aside>
      <main className="pet-cards-main">
        <div className="pet-cards-container">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <h3>{pet.name}</h3>
                <p>Age: {pet.age || "Unknown"}</p>
                <p>Size: {pet.size || "Unknown"}</p>
                <p>Gender: {pet.gender || "Unknown"}</p>
                <p>
                  Status:{" "}
                  {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                </p>
                <button onClick={() => viewDetails(pet.id)}>View Detail</button>
              </div>
            ))
          ) : (
            <p>No pets available at the moment.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PetSearchPage;
