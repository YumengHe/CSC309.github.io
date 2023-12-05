import { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(username, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setPassword("");
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
        handleLogin={handleLogin}
        navigateToRegister={navigateToRegister}
      />
    </div>
  );
};

export default LoginPage;
