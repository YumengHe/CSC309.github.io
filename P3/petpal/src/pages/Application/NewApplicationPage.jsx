/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Base.css";
import { fetchWithToken } from "../../services/utils";
import ApplicationForm from "../../components/forms/ApplicationForm";

const NewApplicationPage = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const { petId } = useParams();
    const initialFieldErrors = {
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
    };
    const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
    const [isSubmissionAllowed, setIsSubmissionAllowed] = useState({ allowed: null, msg: "" });
    useEffect(() => {
        checkSubmissionAllowed();
    }, []);

    const checkSubmissionAllowed = async () => {
        try {
            const response = await fetchWithToken(`/applications/pet/${petId}/`, "POST");
            const responseData = await response.json();
            if (!response.ok) {
                // Handle 403 forbidden access & submission to unavailable/expiry pets
                if (
                    (response.status === 403 || response.status === 400) &&
                    (responseData.error || responseData.detail)
                ) {
                    // console.log(responseData.error || responseData.detail);
                    setIsSubmissionAllowed({ allowed: false, msg: responseData.error || responseData.detail });
                } else if (response.status === 404) {
                    setIsSubmissionAllowed({
                        allowed: false,
                        msg: "Unable to submit applications for pets not found.",
                    });
                } else {
                    setIsSubmissionAllowed({ allowed: true, msg: "" });
                }
            }
        } catch (error) {
            console.error("CheckSubmissionAllowed Error:", error);
        }
    };
    const handleApplicationSubmit = async (appData) => {
        setFieldErrors(initialFieldErrors); // clean previous error
        try {
            const response = await fetchWithToken(`/applications/pet/${petId}/`, "POST", appData);
            const responseData = await response.json();
            if (!response.ok) {
                console.error("Application Submission Failed:", responseData);
                throw responseData;
            } else {
                // Submission succeed
                console.log("Application Submission SUCCEED", responseData);
                navigate(`/applications/${responseData.id}`);
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

    if (!currentUser) {
        navigate("/login");
    }

    return isSubmissionAllowed.allowed && currentUser ? (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <h2 className="text-center fs-2 fw-bolder main-dark-color">Adoption Application</h2>
                <div className="col col-12 col-lg-9">
                    <ApplicationForm error={fieldErrors} onSubmit={handleApplicationSubmit} />
                </div>
            </div>
        </div>
    ) : (
        <>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center py-5">
                    <div className="col col-10">
                        <p className="fs-4 main-dark-color text-center">{isSubmissionAllowed.msg}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewApplicationPage;
