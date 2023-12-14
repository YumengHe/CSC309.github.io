import { useNavigate } from "react-router-dom";

const PetProfileView = ({
  pet,
  handleEditToggle,
  isEditable,
  currentImage,
  handleDeleteUser,
  currentUser,
  isAppliable,
}) => {
  const navigate = useNavigate();
  const handleDeleteClick = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this pet? This action cannot be undone.",
      )
    ) {
      handleDeleteUser(pet?.id);
    }
  };
  return (
    <div id="pet-profile-view" className="card-body">
      <p>
        <strong>Pet ID:</strong> {pet?.id}
      </p>
      <p>
        <strong>Name:</strong> {pet?.name}
      </p>
      <p>
        <strong>Shelter:</strong> {pet?.shelter}
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
            src={currentImage}
            alt={pet.name}
            className="img-thumbnail mt-2"
            style={{ width: "200px" }}
          />
        </p>
      )}
      {isEditable && (
        <>
          <button className="btn btn-primary" onClick={handleEditToggle}>
            Edit Pet Profile
          </button>
          <button className="btn btn-primary" onClick={handleDeleteClick}>
            Delete Pet Profile
          </button>
        </>
      )}
      {isAppliable && (
        <button
          className="btn btn-primary"
          onClick={(petId) => navigate(`/applications/pet/${pet?.id}`)}
        >
          Apply Now!
        </button>
      )}
    </div>
  );
};

export default PetProfileView;
