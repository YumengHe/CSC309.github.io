import { useState } from "react";

const RegistrationForm = ({ error, onSubmit, navigateToLogin }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    role: "",
    profile_pic: null,
  });

  // useEffect(() => {
  //   console.log("errors in form:", error);
  // }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, profile_pic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the onSubmit prop with userData
    onSubmit(userData);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name={"username"}
                value={userData.username}
                onChange={handleChange}
                placeholder={
                  userData?.role === "shelter"
                    ? "Username (For shelters, it will be your shelter name)"
                    : "Username"
                }
              />
              {error.username && (
                <div className="text-danger">{error.username}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {error.password && (
                <div className="text-danger">{error.password}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {error.email && <div className="text-danger">{error.email}</div>}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={userData.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
              {error.first_name && (
                <div className="text-danger">{error.first_name}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
              {error.last_name && (
                <div className="text-danger">{error.last_name}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              {error.address && (
                <div className="text-danger">{error.address}</div>
              )}
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                name="role"
                value={userData.role}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="seeker">Seeker</option>
                <option value="shelter">Shelter</option>
              </select>
              {error.role && <div className="text-danger">{error.role}</div>}
            </div>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                name="profile_pic"
                onChange={handleFileChange}
              />
              {error.profile_pic && (
                <div className="text-danger">{error.profile_pic}</div>
              )}
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary-cust">
                Register
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <span className="d-inline-block align-middle">
              Already have an account?{" "}
            </span>
            <button
              onClick={navigateToLogin}
              className="btn btn-link d-inline-block align-middle"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
