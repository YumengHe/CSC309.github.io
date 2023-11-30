import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  // Function to update user state
  const updateUser = (userData) => {
    setId(userData.id);
    setUsername(userData.username);
    setEmail(userData.email);
    setFirstName(userData.first_name);
    setLastName(userData.last_name);
    setAddress(userData.address);
    setProfilePic(userData.profile_pic);
  };

  return (
    <UserContext.Provider
      value={{
        id,
        username,
        email,
        firstName,
        lastName,
        address,
        profilePic,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Add PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
