import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { API_BASE_URL, fetchWithoutToken } from "../../services/utils";
import Paginate from "../../components/buttons/PageButtons";

function ShelterSearchPage() {
  const location = useLocation();
  const [shelters, setShelters] = useState([]);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchSubmit = () => {
    const searchPath = `/search/shelter?${
      searchName ? `name=${encodeURIComponent(searchName)}` : ""
    }`;
    navigate(searchPath);
  };

  // New states for pagination
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams.get("page") ?? 1);

  // Existing useEffect with modifications for pagination
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get("name")
      ? `&name=${encodeURIComponent(queryParams.get("name"))}`
      : "";
    const pageParam = `&page=${currentPage}`;

    const fetchUrl = `/accounts/list/?role=shelter${searchParam}${pageParam}`;

    // Fetch shelters with pagination
    fetchWithoutToken(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setShelters(data?.results || []);
        setTotalPages(Math.ceil(data?.count / 10)); // Assuming 10 shelters per page
      })
      .catch((error) => {
        console.error("Error fetching shelters:", error);
      });
  }, [location.search, currentPage]);

  const setPagination = (pageNumber) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: pageNumber });
  };

  useEffect(() => {
    console.log(totalPages, currentPage);
  }, [totalPages, currentPage]);

  return (
    <div className="container mt-3">
      <h1 className="my-4 display-4">Shelter Search Page</h1>
      <div className="row">
        {/* Filters Column */}
        <div className="col-md-4 p-2 filter-sort-sidebar">
          <section className="filter-section">
            <h2>Search</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary-cust mb-3"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </section>
        </div>

        {/* Shelters Column */}
        <div className="col-md-8">
          <div className="row">
            {shelters.length > 0 ? (
              shelters.map((shelter) => (
                <div key={shelter?.id} className="col-md-6 mb-3">
                  <div className="card">
                    <img
                      src={`${API_BASE_URL}/media/user_profiles/${shelter?.profile_pic}`}
                      className="card-img-top"
                      alt={`${shelter?.username}'s profile picture`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{shelter?.username}</h5>
                      <p className="card-text">
                        Email: {shelter?.email || "N/A"}
                      </p>
                      <p className="card-text">
                        Address: {shelter?.address || "N/A"}
                      </p>
                      <Link
                        to={`/user-profile/${shelter?.id}`}
                        className="btn btn-outline-primary-cust"
                      >
                        Visit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No shelters found.</p>
            )}
          </div>
          {shelters.length > 0 && (
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
    </div>
  );
}

export default ShelterSearchPage;
