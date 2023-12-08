const UserProfileView = ({
  user,
  currentProfilePic,
  handleEditToggle,
  currentUser,
  userId,
}) => {
  return (
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
  );
};

export default UserProfileView;
