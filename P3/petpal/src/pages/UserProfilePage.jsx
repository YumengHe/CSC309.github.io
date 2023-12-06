import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, fetchWithToken } from "../services/utils";
import EditUserProfileForm from "../components/forms/EditUserProfileForm";

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
    return `${API_BASE_URL}/media/user_profiles/${user?.profile_pic}`;
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
    <div className="container mt-4">
      <h1 className="text-center mb-3">User Profile</h1>
      {error ? (
        <div
          className="alert alert-danger"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      ) : (
        <div id="user-profile" className="card">
          {isEditMode ? (
            <EditUserProfileForm
              user={user}
              handleSubmit={handleSubmit}
              handleFormChange={handleFormChange}
              handleFileChange={handleFileChange}
              currentProfilePic={currentProfilePic}
              handleEditToggle={handleEditToggle}
            />
          ) : (
            <div id="user-profile-view" className="card-body">
              <p>
                <strong>User ID:</strong> {user?.id}
              </p>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>First Name:</strong> {user?.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {user?.last_name}
              </p>
              <p>
                <strong>Address:</strong> {user?.address}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
              <p>
                <strong>Profile Picture:</strong>
                <img
                  src={currentProfilePic}
                  alt="Profile Pic"
                  className="img-thumbnail mt-2"
                  style={{ width: "200px" }}
                />
              </p>
              {currentUser?.id === parseInt(userId) && (
                <button className="btn btn-primary" onClick={handleEditToggle}>
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
