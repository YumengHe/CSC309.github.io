/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../services/utils";
import "../../assets/css/ApplicationStyle.css";
import Sidebar, { generateApplicationSidebar } from "../../components/buttons/Sidebar";
import ApplicationSubmitted from "./ChildComponents/ApplicationSubmitted";
import SubmissionStatus from "./ChildComponents/SubmissionStatus";
import { Link45deg } from "react-bootstrap-icons";
import ApplicationConversation from "../ApplicationComment";

const DATE_FORMATTER = {
    year: "numeric",
    month: "short",
    day: "numeric",
};

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
            try {
                const response = await fetchWithToken(`/applications/${currentUser.role}/${appId}/`);
                const jsonData = await response.json();

                if (!response.ok) {
                    if (response.status === 403) {
                        setError(jsonData.detail);
                    } else if (response.status === 404) {
                        setError(`Application not found.`);
                    }
                } else {
                    setApplication(jsonData);
                }
            } catch (error) {
                console.error("Error fetching application data:", error);
                setError("Error fetching data");
            }
        };

        fetchApplicationDetails();
    }, [appId]);

    return currentUser ? (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <div className="col col-12 col-lg-3 mb-4">
                    <Sidebar navItems={generateApplicationSidebar(currentUser.id)} />
                    {app && (
                        <div className="row border rounded mt-4 mx-1 main-dark-color p-3 gap-3 d-flex justify-content-center align-items-center flex-lg-column flex-md-row flex-column">
                            <div className="col">
                                <img
                                    src={app.petpost.image}
                                    alt="pet image"
                                    id="imageInApp"
                                    className="border border-5 rounded object-fit-cover w-100"
                                />
                            </div>
                            <div className="col d-flex flex-column gap-2">
                                <div className="col">
                                    <b>Seeker: </b>
                                    <Link to={`/user-profile/${app.seeker.id}`} className="main-dark-color">
                                        {app.seeker.username}
                                        <Link45deg />
                                    </Link>
                                </div>
                                <div className="col">
                                    <b>Pet: </b>
                                    <Link to={`/pets/${app.petpost.id}`} className="main-dark-color">
                                        {app.petpost.name}
                                        <Link45deg />
                                    </Link>
                                </div>

                                <div className="col">
                                    <b>Shelter: </b>
                                    <Link to={`/user-profile/${app.petpost.shelter.id}`} className="main-dark-color">
                                        {app.petpost.shelter.username}
                                        <Link45deg />
                                    </Link>
                                </div>
                                <div className="col">
                                    <b>Submitted: </b>
                                    {new Date(app.created_at).toLocaleString(undefined, DATE_FORMATTER)}
                                </div>
                                {/* Calculate date different in minutes  https://stackoverflow.com/a/7709819 */}
                                {Math.round(
                                    (((new Date(app.last_updated) - new Date(app.created_at)) % 86400000) % 3600000) /
                                        60000
                                ) <= 1 ? null : (
                                    <div className="col">
                                        <b>Updated: </b>
                                        {new Date(app.last_updated).toLocaleString(undefined, DATE_FORMATTER)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* Main section for application detail */}
                <div className="col col-12 col-lg-8  main-dark-color">
                    {error ? (
                        <div className="col col-12 main-dark-color h5 p-4">{error}</div>
                    ) : app ? (
                        <>
                            {/* Display submitted application */}
                            <ApplicationSubmitted app={app} />
                            <hr className="mb-4 mt-5" />
                            {/* Update application status based on logged-in user role */}
                            <SubmissionStatus app={app} currentUser={currentUser} />
                            <hr className="my-4" />
                            {/* Conversation between seeker & shelter */}
                            <ApplicationConversation applicationId={app.id} currentUser={currentUser} />
                        </>
                    ) : (
                        <>Loading...</>
                    )}
                </div>
            </div>
        </div>
    ) : (
        // Return empty when user not logged-in
        <></>
    );
};

export default ApplicationDetails;
