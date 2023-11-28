export const API_BASE_URL = "http://localhost:8000";

export const fetchWithToken = async (url, method = "GET", data = null) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json", // Set Content-Type header for JSON data
    Authorization: `Bearer ${accessToken}`,
  };

  const config = {
    headers,
    method,
  };

  // Append data to the configuration based on whether data is present
  if (data) {
    config.body =
      data instanceof FormData || typeof data === "string"
        ? data
        : JSON.stringify(data);
  }

  console.log(
    "sending request to:",
    fullUrl,
    "with config:",
    config,
    "with data:",
    data instanceof FormData ? Object.fromEntries(data) : data,
  );

  return fetch(fullUrl, config).then((response) => {
    return response;
  });
};

export const fetchWithoutToken = async (url, method = "GET", data = null) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  const headers = {
    "Content-Type": "application/json", // Set Content-Type header for JSON data
  };

  const config = {
    method,
    headers,
  };

  // Append data to the configuration based on whether data is present
  if (data) {
    config.body =
      data instanceof FormData || typeof data === "string"
        ? data
        : JSON.stringify(data);
  }

  console.log(
    "sending request to:",
    fullUrl,
    "with config:",
    config,
    "with data:",
    data instanceof FormData ? Object.fromEntries(data) : data,
  );

  return fetch(fullUrl, config).then((response) => {
    return response;
  });
};
