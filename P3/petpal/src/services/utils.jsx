export const API_BASE_URL = "http://localhost:8000";

export const fetchWithToken = async (url, method = "GET", data = null) => {
  const fullUrl = `${API_BASE_URL}${url}`;
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (accessToken === null) {
    // If there's no access token, make a request without a token
    return await fetchWithoutToken(url, method, data);
  }

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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
  const headers = {};

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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
