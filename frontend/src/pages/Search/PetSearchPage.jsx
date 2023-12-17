import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../assets/css/PetSearchPage.css";
import { fetchWithoutToken } from "../../services/utils";

const STATUS_CHOICES = ["available", "pending", "adopted", "withdrawn"];
const GENDER_CHOICES = ["male", "female", "unknown"];
const SIZE_CHOICES = ["small", "medium", "large", "extra_large", "unknown"];
const SORT_OPTIONS = ["Name", "-Name", "Age", "-Age"];
const SPECIES_CHOICES = ["cat", "dog", "others"];

const PetSearchPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams(); // Get search parameters
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Initialize filters with URL query parameters
  const initialFilters = {
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    shelter: searchParams.get("shelter") || "",
    species: searchParams.get("species") || "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    if (sort) {
      params.set("sort", sort);
    }
    return params;
  }, [filters, sort]);

  useEffect(() => {
    // Construct the URL for the API call
    const url = `/pets/?page=${currentPage}&${queryParams.toString()}`;

    fetchWithoutToken(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPets(data.results);
        const pageSize = 10; // Adjust this according to your actual page size
        setTotalPages(Math.ceil(data.count / pageSize));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, queryParams]);

  const updateFiltersAndFetch = (newFilters, newSort = sort) => {
    setFilters(newFilters);
    if (newSort !== sort) setSort(newSort);
    setCurrentPage(1); // Reset page to 1
    setSearchParams({ ...newFilters, sort: newSort });
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    updateFiltersAndFetch(newFilters);
  };

  const handleSortChange = (e) => {
    updateFiltersAndFetch(filters, e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
          <select name="species" onChange={handleFilterChange}>
            <option value="">All Species</option>
            {SPECIES_CHOICES.map((species) => (
              <option key={species} value={species}>
                {species.charAt(0).toUpperCase() + species.slice(1)}
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
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </aside>
      <main className="pet-cards-main">
        <div className="pet-cards-container ">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet?.id}>
                <div className="card">
                  <img
                    src={
                      pet?.image
                        ? pet?.image
                        : "https://icons.veryicon.com/png/o/miscellaneous/fresh-icon-1/cat-62.png"
                    }
                    className="card-img-top"
                    alt={`${pet?.name} picture`}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{pet?.name}</h3>
                    <p className="card-text">Age: {pet?.age || "Unknown"}</p>
                    <p className="card-text">Size: {pet?.size || "Unknown"}</p>
                    <p className="card-text">
                      Gender: {pet?.gender || "Unknown"}
                    </p>
                    <p className="card-text">
                      Status:{" "}
                      {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                    </p>
                    <button
                      className="btn btn-outline-primary-cust"
                      onClick={() => viewDetails(pet.id)}
                    >
                      View Detail
                    </button>
                  </div>
                </div>
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
