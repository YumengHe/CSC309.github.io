const EditUserProfileForm = ({
  user,
  handleSubmit,
  handleFormChange,
  handleFileChange,
  currentProfilePic,
  handleEditToggle,
}) => {
  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <form onSubmit={handleSubmit} id="user-profile-edit-form">
          <div className="mb-3">
            <label>Username: </label>
            <input
              name="username"
              className="form-control"
              value={user?.username || ""}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label>Email: </label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={user?.email}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label>First Name: </label>
            <input
              name="first_name"
              className="form-control"
              value={user?.first_name}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label>Last Name: </label>
            <input
              name="last_name"
              className="form-control"
              value={user?.last_name}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label>Address: </label>
            <input
              name="address"
              className="form-control"
              value={user?.address}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label>Profile Picture: </label>
            <input
              name="profile_pic"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            {user?.profile_pic && (
              <img
                src={currentProfilePic}
                alt="Profile"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-secondary ms-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfileForm;
