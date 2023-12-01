import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, fetchWithToken } from "../services/utils";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchUserProfile();
  }, [userId, isEditMode]);

  const currentProfilePic = useMemo(() => {
    // If there's a preview URL, return it.
    if (imagePreviewUrl) {
      return imagePreviewUrl;
    }

    // Check if user?.profile_pic already includes API_BASE_URL
    if (user?.profile_pic.startsWith(API_BASE_URL)) {
      return user?.profile_pic;
    }

    // Otherwise, concatenate API_BASE_URL with user?.profile_pic
    return `${API_BASE_URL}/${user?.profile_pic}`;
  }, [user?.profile_pic, imagePreviewUrl]);

  const fetchUserProfile = async () => {
    try {
      console.log("userId in profile page:", userId);
      if (!userId) {
        navigate("/login"); // Redirect to login if no user ID is provided
        return;
      }

      const response = await fetchWithToken(`/accounts/${userId}/`);
      if (!response.ok) {
        if (response.status === 403) {
          // Check if the status code indicates a permission issue
          setError("You do not have permission to view this profile."); // Set the appropriate error message
        } else if (response.status === 404) {
          setError(`User with user_id ${userId} not found.`);
        }
      }
      const userData = await response.json();
      setUser({ ...userData, originalData: userData }); // Assuming the response data is an object
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while fetching user data."); // Handle other errors
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    // Prepare FormData with only the fields that have been changed
    const formData = new FormData();
    let isFormDataUsed = false;

    Object.entries(user).forEach(([key, value]) => {
      if (key !== "originalData") {
        const originalValue = user.originalData[key];
        if (typeof value !== "object" && value !== originalValue) {
          formData.append(key, value);
          isFormDataUsed = true;
        } else if (value instanceof File && isFileChanged(key, value)) {
          formData.append(key, value);
          isFormDataUsed = true;
        }
      }
    });
    if (!isFormDataUsed) {
      console.log("No changes detected.");
      return; // Exit the function if no changes have been made
    }

    for (const [key, value] of formData.entries()) {
      console.log({ key, value });
    }

    try {
      const response = await fetchWithToken(
        `/accounts/${user.id}/`,
        "PATCH",
        formData,
      );
      const data = await response.json();
      console.log("data:", data);

      if (!response.ok) {
        if (response.status === 403) {
          setError("You do not have permission to edit this profile.");
        } else if (response.status === 400) {
          const fieldErrors = [];
          for (const field in data) {
            // Assuming each field's errors are in an array
            fieldErrors.push(`${field}: ${data[field].join(", ")}`);
          }
          setError(fieldErrors.join("<br>"));
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        // Update the user context with the new current user data
        setUser({ ...data, originalData: data });
        if (localStorage?.currentUser?.id === user.id) {
          console.log("updating user context with data: ", data);
          localStorage.setItem("currentUser", JSON.stringify(data));
        }

        setIsEditMode(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("An error occurred while updating user data.");
    }
  };

  function isFileChanged(key, value) {
    console.log("profile changed?", value && value instanceof File);
    return value && value instanceof File;
  }

  const handleEditToggle = () => {
    setError(""); // Clear any previous error messages
    setIsEditMode(!isEditMode);
    console.log("isEditMode:", isEditMode);
  };

  const handleFormChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, [e.target.name]: file });
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <h1>User Profile</h1>
      {error ? (
        <div
          className="error-message"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      ) : (
        <div id="user-profile">
          {isEditMode ? (
            <form onSubmit={handleSubmit} id="user-profile-edit-form">
              <div>
                <label>Username: </label>
                <input
                  name="username"
                  value={user?.username || ""}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  name="email"
                  type="email"
                  value={user?.email}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>First Name: </label>
                <input
                  name="first_name"
                  value={user?.first_name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>Last Name: </label>
                <input
                  name="last_name"
                  value={user?.last_name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>Address: </label>
                <input
                  name="address"
                  value={user?.address}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>Profile Picture: </label>
                <input
                  name="profile_pic"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {user?.profile_pic && (
                  <img
                    src={currentProfilePic}
                    alt="Profile"
                    style={{ width: "200px" }}
                  />
                )}
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleEditToggle}>
                Cancel
              </button>
            </form>
          ) : (
            <div id="user-profile-view">
              <p>User ID: {user?.id}</p>
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
              <p>First Name: {user?.first_name}</p>
              <p>Last Name: {user?.last_name}</p>
              <p>Address: {user?.address}</p>
              <p>Role: {user?.role}</p>
              <p>
                Profile Picture:{" "}
                <img
                  src={currentProfilePic}
                  alt="Profile Pic"
                  style={{ width: "200px" }}
                />
              </p>
              {currentUser?.id === parseInt(userId) && (
                <button onClick={handleEditToggle}>Edit Profile</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
