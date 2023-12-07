/* eslint-disable */
import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../services/utils";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./style.css";
import "./base_style.css";
import Sidebar from "./Sidebar";

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                await fetchWithToken(`/applications/${currentUser.role}`)
                    .then((response) => response.json())
                    .then((json) => {
                        setApplications(json.results);
                    });
            } catch (error) {
                console.error("Fetching application error:", error);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <Sidebar />

                <div className="col col-12 col-lg-9">
                    <div className="application list-group list mb-4 border">
                        {applications?.map((app) => (
                            <Link
                                to={`/applications/${app.id}`}
                                key={app.id}
                                className="list-group-item list-group-item-action d-flex align-items-center gap-lg-3 gap-1 py-3"
                            >
                                <div className="col col-3 col-md-2">
                                    <img
                                        src={app.petpost.image}
                                        alt="pet photo"
                                    />
                                </div>
                                <div className="col col-6 col-md-7 flex-fill">
                                    <h5 className="mb-0 text-truncate">
                                        {app.petpost.name}
                                    </h5>
                                </div>
                                <div className="col col-3 me-2">
                                    <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                        {app.status.slice(0, 1).toUpperCase() +
                                            app.status.slice(1)}
                                    </small>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ApplicationsList;
