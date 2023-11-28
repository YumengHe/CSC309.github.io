class User {
  constructor(
    id,
    username,
    email,
    firstName,
    lastName,
    address,
    role,
    profilePic,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.role = role;
    this.profilePic = profilePic;
  }

  // Client-side validation to align with your backend serializer
  static validate(userData) {
    const errors = {};

    if (!["seeker", "shelter"].includes(userData.role)) {
      errors.role = "Role must be one of 'seeker' or 'shelter'";
    }

    if (userData.role === "shelter" && !userData.address) {
      errors.address = "Shelter must have an address";
    }

    return errors;
  }
}

export default User;
