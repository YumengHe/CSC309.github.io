/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { fetchWithToken } from "../../services/utils";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import "./style.css";
import Sidebar from "./Sidebar";
import Paginate from "./Paginate";
import SortRadioButtons from "./SortRadioButtons";
import ApplicationList from "./List";

const ApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    // const [query, setQuery] = useState({
    //     page: 1,
    //     pageSize: 10,
    //     status: "",
    //     sort: "",
    // });
    const [searchParams, setSearchParams] = useSearchParams();
    const query = useMemo(
        () => ({
            page: parseInt(searchParams.get("page") ?? 1),
            page_size: parseInt(searchParams.get("page_size") ?? 10),
            sort: searchParams.get("sort") ?? "update",
            status: searchParams.get("status") ?? "",
        }),
        [searchParams]
    );

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();
    const location = useLocation();

    const setPagination = (pageNumber) => {
        // setQuery({ ...query, page: pageNumber });
        setSearchParams({ ...query, page: pageNumber });
    };

    const handleSortChange = (newSort) => {
        // Update the sort parameter in the query
        setSearchParams({ ...query, sort: newSort });
    };

    useEffect(() => {
        // Navigate to login page if use is not logged in
        if (!currentUser) {
            navigate("/login");
        } else {
            // const { page, pageSize, status, sort } = query;
            const param = new URLSearchParams(location.search);
            const fetchApplications = async () => {
                try {
                    await fetchWithToken(
                        // `/applications/${currentUser.role}?page=${page}&page_size=${pageSize}&status=${status}&sort=${sort}`
                        `/applications/${currentUser.role}?${param.toString()}`
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            setApplications(json.results);
                            setTotalPages(
                                Math.ceil(json.count / query.page_size)
                            );
                            console.log("APPLICATIONS:", applications);
                            console.log("PARAM:", param.toString());
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
                {applications ? (
                    <div className="col col-12 col-lg-9">
                        <div className="row my-4 justify-content-between">
                            {/* Filter by status */}
                            <div className="col col-12 col-lg-6 my-2 main-dark-color d-flex align-items-center justify-content-lg-start justify-content-center">
                                Filter by Status
                            </div>
                            {/* Sort by datetime */}
                            <SortRadioButtons
                                currentSort={query.sort}
                                onSortChange={handleSortChange}
                            />
                        </div>
                        {/* Applications List */}
                        <ApplicationList applications={applications} />
                        {/* Pagination */}
                        <div className="row">
                            {/* {query.page} out of {totalPages} */}
                            <Paginate
                                totalPages={totalPages}
                                currentPage={query.page}
                                paginate={setPagination}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="col col-12 col-lg-9 main-dark-color h5 p-4">
                        You don't have applications.
                    </div>
                )}
            </div>
        </div>
    ) : (
        <></>
    );
};
export default ApplicationsPage;
