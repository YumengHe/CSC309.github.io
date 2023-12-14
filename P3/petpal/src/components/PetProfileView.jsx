const PetProfileView = ({ pet, handleEditToggle, isEditable }) => {
  return (
    <div id="pet-profile-view" className="card-body">
      <p>
        <strong>Pet ID:</strong> {pet?.id}
      </p>
      <p>
        <strong>Name:</strong> {pet?.name}
      </p>
      <p>
        <strong>Description:</strong> {pet?.description}
      </p>
      <p>
        <strong>Species:</strong> {pet?.species}
      </p>
      <p>
        <strong>Breed:</strong> {pet?.breed}
      </p>
      <p>
        <strong>Age:</strong> {pet?.age}
      </p>
      <p>
        <strong>Size:</strong> {pet?.size}
      </p>
      <p>
        <strong>Color:</strong> {pet?.color}
      </p>
      <p>
        <strong>Gender:</strong> {pet?.gender}
      </p>
      <p>
        <strong>Status:</strong> {pet?.status}
      </p>
      {pet?.image && (
        <p>
          <strong>Pet Image:</strong>
          <img
            src={pet.image}
            alt={pet.name}
            className="img-thumbnail mt-2"
            style={{ width: "200px" }}
          />
        </p>
      )}
      {isEditable && (
        <button className="btn btn-primary" onClick={handleEditToggle}>
          Edit Pet Profile
        </button>
      )}
    </div>
  );
};

export default PetProfileView;
