const UserProfileView = ({
  user,
  currentProfilePic,
  handleEditToggle,
  currentUser,
  userId,
}) => {
  return (
    <div id="user-profile-view" className="card">
      <div className="card-body">
        <h2 className="card-title">User Profile</h2>
        <p className="card-text">
          <strong>User ID:</strong> {user?.id}
        </p>
        <p className="card-text">
          <strong>Username:</strong> {user?.username}
        </p>
        <p className="card-text">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="card-text">
          <strong>First Name:</strong> {user?.first_name}
        </p>
        <p className="card-text">
          <strong>Last Name:</strong> {user?.last_name}
        </p>
        <p className="card-text">
          <strong>Address:</strong> {user?.address}
        </p>
        <p className="card-text">
          <strong>Role:</strong> {user?.role}
        </p>
        <p className="card-text">
          <strong>Profile Picture:</strong>
          <img
            src={currentProfilePic}
            alt="Profile Pic"
            className="img-thumbnail mt-2"
            style={{ width: "200px" }}
          />
        </p>
        {currentUser?.id === parseInt(userId) && (
          <button className="btn btn-primary-cust" onClick={handleEditToggle}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
