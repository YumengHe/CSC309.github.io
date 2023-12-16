import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

    fetch(
      `http://localhost:8000/pets/?page=${currentPage}&${queryParams.toString()}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPets(data.results);
        // Assuming `query.page_size` is the number of items per page you want to display
        const pageSize = 10; // Fallback to number of items in results if page size not defined
        setTotalPages(Math.ceil(data.count / pageSize));
        console.log(data.count, pageSize);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryParams]);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    setSearchParams(newFilters); // Update URL query parameters
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
