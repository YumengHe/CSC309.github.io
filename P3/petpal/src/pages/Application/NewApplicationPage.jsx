/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Base.css";
import { fetchWithToken } from "../../services/utils";
import ApplicationForm from "../../components/forms/ApplicationForm";

const NewApplicationPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    // const navigate = useNavigate();
    const { petId } = useParams();

    const [fieldErrors, setFieldErrors] = useState({
        adopter_firstname: "",
        adopter_lastname: "",
        adopter_email: "",
        addr_street: "",
        addr_city: "",
        addr_province: "",
        addr_postal: "",
        phone: "",
        phone_type: "",
        have_pet_currently: false,
        family_members: "",
    });

    const handleApplicationSubmit = async (appData) => {
        try {
            const response = await fetchWithToken(`/applications/pet/${petId}/`, "POST", appData);
            const responseData = await response.json();
            if (!response.ok) {
                console.error("Application Submission Failed:", responseData);
                throw responseData;
            } else {
                // Submission succeed
                console.log("SUCCEED", responseData);
            }
        } catch (error) {
            console.error("Application Submission Error:", error);
            if (error && typeof error === "object") {
                console.log(error);
                const formattedError = Object.keys(fieldErrors).reduce((acc, key) => {
                    acc[key] = error[key] ? error[key].join(" ") : "";
                    return acc;
                }, {});
                setFieldErrors(formattedError);
            }
        }
    };
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <h2 className="text-center fs-2 fw-bolder main-dark-color">Adoption Application</h2>
                <div className="col col-12 col-lg-9">
                    <ApplicationForm error={fieldErrors} onSubmit={handleApplicationSubmit} />
                </div>
            </div>
        </div>
    );
};

export default NewApplicationPage;
