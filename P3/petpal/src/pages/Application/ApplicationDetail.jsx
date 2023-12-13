/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../services/utils";
import Sidebar from "../../components/buttons/Sidebar";
import ApplicationSubmitted from "./ApplicationSubmitted";
import StatusUpdateButton from "./StatusUpdateButton";

const ApplicationDetails = () => {
    const { appId } = useParams();
    const [app, setApplication] = useState(null);
    const [error, setError] = useState("");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        const fetchApplicationDetails = async () => {
            // try {
            //     await fetchWithToken(`/applications/seeker/${appId}/`)
            //         .then((response) => response.json())
            //         .then((json) => {
            //             setApplication(json);
            //         });
            // } catch (error) {
            //     console.error("Error fetching application details:", error);
            // }

            try {
                const response = await fetchWithToken(`/applications/${currentUser.role}/${appId}/`);
                if (!response.ok) {
                    if (response.status === 403) {
                        setError("You do not have permission to view this application."); // Set the appropriate error message
                    } else if (response.status === 404) {
                        setError(`Application not found.`);
                    }
                } else {
                    const jsonData = await response.json();
                    setApplication(jsonData);
                }
            } catch (error) {
                console.error("Error fetching application data:", error);
                setError("Error fetching data");
            }
        };

        fetchApplicationDetails();
    }, [appId]);

    return (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <Sidebar />
                {/* Main section for application detail */}
                <div className="col col-12 col-lg-8  main-dark-color">
                    {error ? (
                        <div className="col col-12 main-dark-color h5 p-4">{error}</div>
                    ) : app ? (
                        <>
                            {/* Display submitted application */}
                            <ApplicationSubmitted app={app} />
                            {/* Update application status based on logged-in user role */}
                            <StatusUpdateButton app={app} />
                            {/* Conversation between seeker & shelter */}
                        </>
                    ) : (
                        <>Loading...</>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
