/* eslint-disable */
import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../services/utils";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import Sidebar from "./Sidebar";
import Paginate from "./Paginate";

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [query, setQuery] = useState({
        page: 1,
        pageSize: 10,
        status: "",
        sort: "",
    });
    const [totalPages, setTotalPages] = useState(1);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();

    const paginate = (pageNumber) => {
        setQuery({ ...query, page: pageNumber });
    };

    useEffect(() => {
        // Navigate to login page if use is not logged in
        if (!currentUser) {
            navigate("/login");
        } else {
            const { page, pageSize: pageSize, status, sort } = query;
            const fetchApplications = async () => {
                try {
                    await fetchWithToken(
                        `/applications/${currentUser.role}?page=${page}&page_size=${pageSize}&status=${status}&sort=${sort}`
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            setApplications(json.results);
                            setTotalPages(Math.ceil(json.count / pageSize));
                        });
                } catch (error) {
                    console.error("Fetching application error:", error);
                }
            };

            fetchApplications();
        }
    }, [query]);

    return currentUser ? (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <Sidebar />
                {/* Main section for application list */}
                <div className="col col-12 col-lg-9">
                    <div className="row">
                        <div className="application list-group list mb-4 p-0 border">
                            {applications ? (
                                applications.map((app) => (
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
                                                {`${app.seeker.first_name} wants ${app.petpost.name} from ${app.petpost.shelter.username}`}
                                            </h5>
                                        </div>
                                        <div className="col col-3 me-2">
                                            <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                                {app.status
                                                    .slice(0, 1)
                                                    .toUpperCase() +
                                                    app.status.slice(1)}
                                            </small>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="main-dark-color h5 ms-3">
                                    You don't have applications.
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="row">
                        {/* <p>{` Page ${query.page} out of ${totalPages} `}</p> */}
                        <Paginate
                            totalPages={totalPages}
                            currentPage={query.page}
                            paginate={paginate}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};
export default ApplicationsList;
