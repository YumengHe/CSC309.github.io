/* eslint-disable */
// React Number Format Component Example https://glebbahmutov.com/blog/test-react-number-format/
// Phone Number Formatting Made Easy! https://aprilescobar.medium.com/phone-number-formatting-made-easy-1b887872ab2f
import React, { useState, useEffect } from "react";
import { PatternFormat } from "react-number-format";

const PostalInput = ({ value, onChange }) => {
    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        // Check if the input matches the desired pattern
        // Regex - check if input still has chances to become matching https://stackoverflow.com/a/22489941
        const pattern = /^([A-Za-z]|$)(\d|$)([A-Za-z]|$)(\s|$)(\d|$)([A-Za-z]|$)(\d|$)$/;
        if (pattern.test(inputValue) || inputValue === "") {
            onChange(inputValue.toUpperCase()); // Convert to uppercase
        }
    };

    return <input type="text" className="form-control" value={value} onChange={handleInputChange} />;
};

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
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "have_pet_currently" && value == "false") {
            // Clean have_pet_notes field
            appData.have_pet_notes = "";
            // setAppData({ ...appData, have_pet_currently: "" });
        }
        setAppData({ ...appData, [name]: value });
    };

    const handlePostalChange = (value) => {
        setAppData({
            ...appData,
            addr_postal: value,
        });
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
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
        if (!isChecked) {
            alert("Please check the box to confirm understanding.");
        } else {
            onSubmit(filteredAppData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="main-dark-color mb-5 form-group">
            {/* Primary Adopter */}
            <div className="my-4">
                <label className="form-label fw-bold ">
                    Primary Adopter<span className="text-danger">*</span>
                </label>
                <div className="row d-flex justify-content-between mt-2 gap-1 gap-md-0">
                    <div className="col col-12 col-md-6">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="floating_af_name"
                                name="adopter_firstname"
                                placeholder="First name"
                                onChange={handleChange}
                                // required
                            />
                            <label htmlFor="floating_af_name">First name</label>
                        </div>
                        {error.adopter_firstname && <div className="text-danger">{error.adopter_firstname}</div>}
                    </div>
                    <div className="col col-12 col-md-6">
                        <div className="form-floating">
                            <input
                                id="floating_al_name"
                                type="text"
                                className="form-control"
                                name="adopter_lastname"
                                value={appData.adopter_lastname}
                                placeholder="Last Name"
                                onChange={handleChange}
                                // required
                            />
                            <label htmlFor="floating_al_name">Last Name</label>
                        </div>
                        {error.adopter_lastname && <div className="text-danger">{error.adopter_lastname}</div>}
                    </div>
                </div>
                {/* Email */}
                <div className="my-2 col col-12">
                    <div className="form-floating">
                        <input
                            id="floating_a_email"
                            type="email"
                            className="form-control"
                            value={appData.adopter_email}
                            name="adopter_email"
                            placeholder="Email"
                            onChange={handleChange}
                            // required
                        />
                        <label htmlFor="floating_a_email">Email</label>
                    </div>
                    {error.adopter_email && <div className="text-danger">{error.adopter_email}</div>}
                </div>
            </div>

            {/* Co-Adopter */}
            <div className="my-4">
                <label className="form-label fw-bold">Co-Adopter</label>
                <div className="row d-flex justify-content-between mt-2 gap-1 gap-md-0">
                    <div className="col col-12 col-md-6">
                        <div className="form-floating">
                            <input
                                id="floating_caf_name"
                                type="text"
                                className="form-control"
                                value={appData.co_adopter_firstname}
                                name="co_adopter_firstname"
                                placeholder="First Name"
                                onChange={handleChange}
                            />
                            <label htmlFor="floating_caf_name">First Name</label>
                        </div>
                    </div>
                    <div className="col col-12 col-md-6">
                        <div className="form-floating">
                            <input
                                id="floating_cal_name"
                                type="text"
                                className="form-control"
                                value={appData.co_adopter_lastname}
                                name="co_adopter_lastname"
                                placeholder="Last Name"
                                onChange={handleChange}
                            />
                            <label htmlFor="floating_cal_name">Last Name</label>
                        </div>
                    </div>
                </div>
                <div className="col col-12 my-2">
                    <div className="form-floating">
                        <input
                            id="floating_ca_email"
                            type="email"
                            className="form-control"
                            value={appData.co_adopter_email}
                            name="co_adopter_email"
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        <label htmlFor="floating_ca_email">Email</label>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Address<span className="text-danger">*</span>
                </label>
                <div className="form-floating">
                    <input
                        id="floating_street"
                        type="text"
                        className="form-control"
                        value={appData.addr_street}
                        name="addr_street"
                        placeholder="Street"
                        onChange={handleChange}
                        // required
                    />
                    <label htmlFor="floating_street">Street</label>
                </div>
                {error.addr_street && <div className="text-danger">{error.addr_street}</div>}
                <div className="row d-sm-flex mt-2">
                    <div className="col col-7 col-sm-4">
                        <div className="form-floating">
                            <input
                                id="floating_city"
                                type="text"
                                className="form-control"
                                value={appData.addr_city}
                                name="addr_city"
                                placeholder="City"
                                onChange={handleChange}
                                // required
                            />
                            <label htmlFor="floating_city">City</label>
                        </div>
                        {error.addr_city && <div className="text-danger">{error.addr_city}</div>}
                    </div>
                    <div className="col col-5 col-sm-4">
                        <div className="form-floating">
                            <select
                                id="floating_province"
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
                            <label htmlFor="floating_province">Province</label>
                        </div>
                        {error.addr_province && <div className="text-danger">{error.addr_province}</div>}
                    </div>
                    <div className="col col-12 col-sm-4 mt-2 mt-sm-0">
                        <div className="form-floating">
                            {/* <input
                                id="floating_postal"
                                type="text"
                                className="form-control"
                                value={appData.addr_postal}
                                name="addr_postal"
                                placeholder="Postal"
                                onChange={handleChange}
                                onInput={(e) => (e.target.value = ("" + e.target.value).toUpperCase())}
                                // required
                            /> */}
                            <PostalInput value={appData.addr_postal} onChange={handlePostalChange} />
                            <label htmlFor="floating_postal">Postal</label>
                        </div>
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
                    {error.phone && <div className="text-danger">{error.phone}</div>}
                </div>
            </div>
            {/* Residents  */}
            <div className="my-4">
                <label className="form-label fw-bold">
                    Names and ages of all permanent residents of your home (adults/children)
                    <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={appData.family_members}
                    name="family_members"
                    onChange={handleChange}
                    // required
                />
                {error.family_members && <div className="text-danger">{error.family_members}</div>}
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

            {/* Checkbox */}
            <div className="my-4 form-check border border-danger rounded-pill p-3">
                <div className="mx-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="confirmationCheckbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="confirmationCheckbox">
                        I confirm that the information provided is truthful and accurate, and I understand the
                        application <b>cannot</b> be changed after submission.
                    </label>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary-cust" disabled={!isChecked}>
                    Submit Application
                </button>
            </div>
        </form>
    );
};

export default ApplicationForm;
