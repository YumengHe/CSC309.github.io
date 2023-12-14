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
          {/* Species Field */}
          <div className="mb-3">
            <label htmlFor="species">Species: </label>
            <select
              id="species"
              name="species"
              className="form-control"
              value={pet?.species || ""}
              onChange={handleFormChange}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Breed Field */}
          <div className="mb-3">
            <label htmlFor="breed">Breed: </label>
            <input
              id="breed"
              name="breed"
              className="form-control"
              value={pet?.breed || ""}
              onChange={handleFormChange}
            />
          </div>

          {/* Age Field */}
          <div className="mb-3">
            <label htmlFor="age">Age: </label>
            <input
              id="age"
              name="age"
              type="number"
              className="form-control"
              value={pet?.age || ""}
              onChange={handleFormChange}
            />
          </div>

          {/* Size Field */}
          <div className="mb-3">
            <label htmlFor="size">Size: </label>
            <select
              id="size"
              name="size"
              className="form-control"
              value={pet?.size || ""}
              onChange={handleFormChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra_large">Extra Large</option>
            </select>
          </div>

          {/* Color Field */}
          <div className="mb-3">
            <label htmlFor="color">Color: </label>
            <input
              id="color"
              name="color"
              className="form-control"
              value={pet?.color || ""}
              onChange={handleFormChange}
            />
          </div>

          {/* Gender Field */}
          <div className="mb-3">
            <label htmlFor="gender">Gender: </label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={pet?.gender || ""}
              onChange={handleFormChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Image Field */}
          <div className="mb-3">
            <label htmlFor="image">Pet Image: </label>
            <input
              id="image"
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
