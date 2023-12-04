import RegistrationForm from "../components/forms/RegistrationForm";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import { useState } from "react";

const RegistrationPage = () => {
  // State for individual field errors
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
    address: "",
    role: "",
    profile_pic: "",
  });
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const handleRegistrationSubmit = async (userData) => {
    setFieldErrors({
      username: "",
      password: "",
      address: "",
      role: "",
      profile_pic: "",
    });
    try {
      await registerUser(userData);
      navigate("/");
    } catch (error) {
      console.error("registration error:", error);
      // Parse error object and set field errors
      if (error && typeof error === "object") {
        const newErrors = Object.keys(fieldErrors).reduce((acc, key) => {
          acc[key] = error[key] ? error[key].join(" ") : "";
          return acc;
        }, {});

        setFieldErrors(newErrors);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <RegistrationForm
        error={fieldErrors}
        onSubmit={handleRegistrationSubmit}
        navigateToLogin={navigateToLogin}
      />
    </div>
  );
};

export default RegistrationPage;
