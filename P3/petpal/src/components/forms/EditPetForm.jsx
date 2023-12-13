const EditPetForm = ({
  pet,
  handleSubmit,
  handleFormChange,
  handleFileChange,
  currentPetImage,
  handleEditToggle,
}) => {
  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <form onSubmit={handleSubmit} id="pet-profile-edit-form">
          {/* Add form fields for pet properties */}
          <div className="mb-3">
            <label>Name: </label>
            <input
              name="name"
              className="form-control"
              value={pet?.name || ""}
              onChange={handleFormChange}
            />
          </div>

          <div className="mb-3">
            <label>Description: </label>
            <textarea
              name="description"
              className="form-control"
              value={pet?.description || ""}
              onChange={handleFormChange}
            />
          </div>

          <div className="mb-3">
            <label>Species: </label>
            {/* Add more fields as needed for species, breed, age, etc. */}
          </div>
          <div className="mb-3">
            <label>Pet Image: </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            {pet?.image && (
              <img
                src={currentPetImage}
                alt="Pet"
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

export default EditPetForm;
