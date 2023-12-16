import React, { useState } from "react";
import "../../assets/css/Base.css";

const NewPetForm = ({ error, onSubmit }) => {
  const [petData, setPetData] = useState({
    name: "",
    description: "",
    species: "",
    breed: "",
    age: "",
    size: "",
    color: "",
    gender: "",
    status: "available",
    image: null,
    expiry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPetData({ ...petData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(petData).forEach((key) => {
      formData.append(key, petData[key]);
    });
    onSubmit(formData);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Form fields for NewPetForm */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="name"
                value={petData.name}
                onChange={handleChange}
                placeholder="Pet's Name"
                required
              />
              {error.name && <div className="text-danger">{error.name}</div>}
            </div>
            {/* Description field */}
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                value={petData.description}
                onChange={handleChange}
                placeholder="Pet's Description"
              />
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>

            {/* Species field */}
            <div className="mb-3">
              <label>Species</label>
              <select
                className="form-control"
                name="species"
                value={petData.species}
                onChange={handleChange}
              >
                <option value="">Select Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>

            {/* Breed field */}
            <div className="mb-3">
              <label>Breed</label>
              <input
                type="text"
                className="form-control"
                name="breed"
                value={petData.breed}
                onChange={handleChange}
                placeholder="Breed"
              />
              {error.breed && <div className="text-danger">{error.breed}</div>}
            </div>

            {/* Age field */}
            <div className="mb-3">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={petData.age}
                onChange={handleChange}
                placeholder="Age in years"
              />
              {error.age && <div className="text-danger">{error.age}</div>}
            </div>

            {/* Size field */}
            <div className="mb-3">
              <label>Size</label>
              <select
                className="form-control"
                name="size"
                value={petData.size}
                onChange={handleChange}
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra_large">Extra Large</option>
                <option value="unknown">Unknown</option>
              </select>
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>

            {/* Color field */}
            <div className="mb-3">
              <label>Color</label>
              <input
                type="text"
                className="form-control"
                name="color"
                value={petData.color}
                onChange={handleChange}
                placeholder="Color"
              />
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>
            {/* Gender field */}
            <div className="mb-3">
              <label>Gender</label>
              <select
                className="form-control"
                name="gender"
                value={petData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>
            {/* Expiry Date field */}
            <div className="mb-3">
              <label htmlFor="expiry">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                name="expiry"
                value={petData.expiry}
                onChange={handleChange}
                required
              />
              {error.expiry && (
                <div className="text-danger">{error.expiry}</div>
              )}
            </div>
            {/* Repeat for other fields like description, species, breed, etc. */}
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleFileChange}
              />
              {error.image && <div className="text-danger">{error.image}</div>}
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary-cust">
                Create Pet Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPetForm;
