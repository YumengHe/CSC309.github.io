import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/PetSearchPage.css";
import { fetchWithoutToken } from "../../services/utils";
import Paginate from "../../components/buttons/PageButtons";

const STATUS_CHOICES = ["available", "pending", "adopted", "withdrawn"];
const GENDER_CHOICES = ["male", "female", "unknown"];
const SIZE_CHOICES = ["small", "medium", "large", "extra_large", "unknown"];
const SORT_OPTIONS = ["Name", "-Name", "Age", "-Age"];
const SPECIES_CHOICES = ["cat", "dog", "other"];

const PetSearchPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchParams = new URLSearchParams(useLocation().search);
  const initialFilters = {
    status: searchParams.get("status") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    shelter: searchParams.get("shelter") || "",
    species: searchParams.get("species") || "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  useEffect(() => {
    const updateFilters = {
      status: searchParams.get("status") || "",
      gender: searchParams.get("gender") || "",
      size: searchParams.get("size") || "",
      shelter: searchParams.get("shelter") || "",
      species: searchParams.get("species") || "",
    };
    const newSort = searchParams.get("sort") || "";

    setFilters(updateFilters);
    setSort(newSort);
    setCurrentPage(1); // Reset the page to 1 when filters change
  }, [location.search]); // Listen to changes in search string

  const constructQueryParams = (filters, sort) => {
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
  };

  // Initialize filters with URL query parameters

  useEffect(() => {
    // Fetch data whenever filters, sort, or currentPage changes
    const queryParams = constructQueryParams(filters, sort);
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
  }, [currentPage, filters, sort]);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    const queryParams = constructQueryParams(newFilters, sort);
    navigate(`/search/pets/?${queryParams.toString()}`);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const queryParams = constructQueryParams(filters, newSort);
    navigate(`/search/pets/?${queryParams.toString()}`);
  };

  const setPagination = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {STATUS_CHOICES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
          >
            <option value="">All Species</option>
            {SPECIES_CHOICES.map((species) => (
              <option key={species} value={species}>
                {species.charAt(0).toUpperCase() + species.slice(1)}
              </option>
            ))}
          </select>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">All Genders</option>
            {GENDER_CHOICES.map((gender) => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
          >
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
            value={filters.shelter}
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
      <div className="pet-cards-main">
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
        {pets.length > 0 && (
          <div className="mt-3">
            <Paginate
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={setPagination}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PetSearchPage;
