import { fetchWithoutToken, fetchWithToken } from "./utils";

export const registerUser = async (userData) => {
  // Filter out empty or null fields
  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(
      ([_, value]) => value !== "" && value !== null,
    ),
  );
  const hasProfilePic =
    filteredUserData.profile_pic && filteredUserData.profile_pic.size > 0;
  // console.log(
  //   "filtered data:",
  //   filteredUserData,
  //   "has profile pic:",
  //   hasProfilePic,
  // );

  let response;

  if (hasProfilePic) {
    // Use FormData for the request with a profile picture
    const formData = new FormData();
    for (const key in filteredUserData) {
      formData.append(key, filteredUserData[key]);
    }
    response = await fetchWithoutToken(`/accounts/`, "POST", formData);
  } else {
    // Use JSON for the request without a profile picture
    response = await fetchWithoutToken(
      `/accounts/`,
      "POST",
      JSON.stringify(filteredUserData),
    );
  }

  const responseData = await response.json();
  if (!response.ok) {
    console.error("Registration failed:", responseData);
    throw responseData || "Registration failed";
  }

  return responseData;
};

export const loginUser = async (username, password) => {
  const response = await fetchWithoutToken(`/accounts/auth/`, "POST", {
    username,
    password,
  });

  const responseData = await response.json();
  if (response.ok) {
    localStorage.setItem("accessToken", responseData?.access);
    localStorage.setItem("refreshToken", responseData?.refresh);
    const userData = await getUserInfo(responseData?.user_id);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    console.log("curr user: ", JSON.parse(localStorage.getItem("currentUser")));
  } else {
    console.error("Login failed:", responseData.error);
    throw new Error(responseData.error || "Login failed");
  }
};

export const getUserInfo = async (userId) => {
  if (isLoggedIn() && !userId) {
    return JSON.parse(localStorage.getItem("currentUser"));
  }
  try {
    const response = await fetchWithToken(`/accounts/${userId}/`);

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const isLoggedIn = async () => {
  return !!localStorage.getItem("accessToken");
};

export const getUserId = () => {
  return JSON.parse(localStorage.getItem("currentUser")).id;
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
};
