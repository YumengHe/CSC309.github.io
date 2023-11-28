import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user state

  // Function to update user state
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Add PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
