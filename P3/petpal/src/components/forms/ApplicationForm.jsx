/* eslint-disable */
// React Number Format Component Example https://glebbahmutov.com/blog/test-react-number-format/
import React, { useState, useEffect } from "react";
import { PatternFormat } from "react-number-format";

const ApplicationForm = ({ error, onSubmit }) => {
    const [appData, setAppData] = useState({
        adopter_firstname: "",
        adopter_lastname: "",
        adopter_email: "",
        addr_street: "",
        addr_city: "",
        addr_province: "",
        addr_postal: "",
        phone: "",
        phone_type: null,
        have_pet_currently: null,
        have_pet_notes: "",
        family_members: "",
        co_adopter_firstname: "",
        co_adopter_lastname: "",
        co_adopter_email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppData({
            ...appData,
            [name]: value,
            have_pet_notes: appData.have_pet_currently === true ? appData.have_pet_notes : "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out empty or null fields
        const filteredAppData = Object.fromEntries(
            Object.entries(appData).filter(([_, value]) => value !== "" && value !== null)
        );
        // Append "+1" as a prefix if "phone" exists
        if ("phone" in filteredAppData) {
            filteredAppData["phone"] = "+1" + filteredAppData["phone"];
        }
        console.log("HANDLE_SUBMIT", filteredAppData);
        onSubmit(filteredAppData);
    };

    return (
        <form onSubmit={handleSubmit} className="main-dark-color mb-5">
            {/* Adopter's Name  */}
            <div className="my-4">
                <label className="form-label fw-bold ">
                    Adopter's Name<span className="text-danger">*</span>
                </label>
                <div className="row d-flex justify-content-between mt-2 gap-1 gap-md-0">
                    <div className="col col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            value={appData.adopter_firstname}
                            name="adopter_firstname"
                            placeholder="First Name"
                            onChange={handleChange}
                            // required
                        />
                        {error.adopter_firstname && <div className="text-danger">{error.adopter_firstname}</div>}
                    </div>
                    <div className="col col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="adopter_lastname"
                            value={appData.adopter_lastname}
                            placeholder="Last Name"
                            onChange={handleChange}
                            // required
                        />
                        {error.adopter_lastname && <div className="text-danger">{error.adopter_lastname}</div>}
                    </div>
                </div>
            </div>
            {/* Email */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Adopter's Email<span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    className="form-control"
                    value={appData.adopter_email}
                    name="adopter_email"
                    placeholder="Email"
                    onChange={handleChange}
                    // required
                />
                {error.adopter_email && <div className="text-danger">{error.adopter_email}</div>}
            </div>
            {/* Co-Adopter's Name */}
            <div className="my-4">
                <label className="form-label fw-bold">Co-Adopter's Name</label>
                <div className="row d-flex justify-content-between mt-2 gap-1 gap-md-0">
                    <div className="col col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            value={appData.co_adopter_firstname}
                            name="co_adopter_firstname"
                            placeholder="First Name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col col-12 col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            value={appData.co_adopter_lastname}
                            name="co_adopter_lastname"
                            placeholder="Last Name"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            {/* Co-Adopter's Email */}
            <div className="my-4">
                <label className="form-label fw-bold">Co-Adopter's Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={appData.co_adopter_email}
                    name="co_adopter_email"
                    placeholder="Email"
                    onChange={handleChange}
                />
            </div>
            {/* Address */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Address<span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={appData.addr_street}
                    name="addr_street"
                    placeholder="Street"
                    onChange={handleChange}
                    // required
                />
                {error.addr_street && <div className="text-danger">{error.addr_street}</div>}
                <div className="row d-sm-flex mt-2">
                    <div className="col col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            value={appData.addr_city}
                            name="addr_city"
                            placeholder="City"
                            onChange={handleChange}
                            // required
                        />
                        {error.addr_city && <div className="text-danger">{error.addr_city}</div>}
                    </div>
                    <div className="col-3 col-sm-4">
                        <select
                            className="form-control"
                            value={appData.addr_province}
                            name="addr_province"
                            onChange={handleChange}
                            // required
                        >
                            <option value="" disabled>
                                Choose...
                            </option>
                            <option value="AB">AB</option>
                            <option value="BC">BC</option>
                            <option value="MB">MB</option>
                            <option value="NB">NB</option>
                            <option value="NL">NL</option>
                            <option value="NS">NS</option>
                            <option value="NT">NT</option>
                            <option value="NU">NU</option>
                            <option value="ON">ON</option>
                            <option value="PE">PE</option>
                            <option value="QC">QC</option>
                            <option value="SK">SK</option>
                            <option value="YT">YT</option>
                        </select>
                        {error.addr_province && <div className="text-danger">{error.addr_province}</div>}
                    </div>
                    <div className="col col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            value={appData.addr_postal}
                            name="addr_postal"
                            placeholder="Postal"
                            onChange={handleChange}
                            // required
                        />
                        {error.addr_postal && <div className="text-danger">{error.addr_postal}</div>}
                    </div>
                </div>
            </div>
            {/* Phone */}
            <div className="my-4 row justify-content-between">
                <div className="col col-12 col-md-5">
                    <label className="form-label fw-bold">
                        Phone Type<span className="text-danger">*</span>
                    </label>
                    <select
                        name="phone_type"
                        className="form-control"
                        value={appData.phone_type || ""}
                        onChange={handleChange}
                        // required
                    >
                        <option value="" disabled>
                            Choose...
                        </option>
                        <option value="cell">Cell</option>
                        <option value="home">Home</option>
                    </select>
                    {error.phone_type && <div className="text-danger">{error.phone_type}</div>}
                </div>
                <div className="col col-12 col-md-7">
                    <label className="form-label fw-bold">
                        Phone Number<span className="text-danger">*</span>
                    </label>
                    <PatternFormat
                        name="phone"
                        value={appData.phone}
                        onValueChange={(values) => {
                            handleChange({ target: { name: "phone", value: values.value } });
                        }}
                        className="form-control"
                        data-cy="phone"
                        format="+1 ### ### ####"
                        mask="_"
                        allowEmptyFormatting
                        // required
                    />
                    {/* <div className="input-group">
                        <span className="input-group-text">+1</span>
                        <input
                            type="phone"
                            className="form-control"
                            value={appData.phone}
                            name="phone"
                            onChange={handleChange}
                            // required
                        />
                    </div> */}
                    {error.phone && <div className="text-danger">{error.phone}</div>}
                </div>
            </div>
            {/* Residents  */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Names and ages of all permanent residents of your home (adults/children)
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={appData.family_members}
                    name="family_members"
                    onChange={handleChange}
                />
            </div>
            {/* Current Pets */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Do you currently have any pets?<span className="text-danger">*</span>
                </label>
                <select
                    name="have_pet_currently"
                    className="form-control"
                    value={appData.have_pet_currently || ""}
                    onChange={handleChange}
                    // required
                >
                    <option value="" disabled>
                        Choose...
                    </option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
                {error.have_pet_currently && <div className="text-danger">{error.have_pet_currently}</div>}
            </div>
            {/* List of Pets */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    If yes, please list them below.
                    <span className="text-danger">{appData.have_pet_currently == "true" ? "*" : ""}</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={appData.have_pet_notes}
                    name="have_pet_notes"
                    onChange={handleChange}
                    disabled={appData.have_pet_currently != "true"}
                    required={appData.have_pet_currently == "true"}
                />
            </div>

            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary-cust">
                    Submit Application
                </button>
            </div>
        </form>
    );
};

export default ApplicationForm;
