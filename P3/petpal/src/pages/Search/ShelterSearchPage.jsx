import { useLocation } from "react-router-dom";

function ShelterSearchPage() {
  const location = useLocation();

  const getAllQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of queryParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const filters = getAllQueryParams();

  return (
    <div>
      <h1>Shelter Search Page</h1>
      <p>Filters: {JSON.stringify(filters)}</p>
    </div>
  );
}

export default ShelterSearchPage;
