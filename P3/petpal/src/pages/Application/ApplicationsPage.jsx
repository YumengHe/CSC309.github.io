/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { fetchWithToken } from "../../services/utils";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "../../assets/css/ApplicationStyle.css";
import Sidebar, { generateApplicationSidebar } from "../../components/buttons/Sidebar";
import Paginate from "../../components/buttons/PageButtons";
import SortRadioButtons from "../../components/buttons/SortButtons";
import ApplicationList from "./ChildComponents/ApplicationsList";
import FilterButtons from "../../components/buttons/FilterButtons";

const ApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = useMemo(
        () => ({
            page: parseInt(searchParams.get("page") ?? 1),
            page_size: parseInt(searchParams.get("page_size") ?? 10),
            sort: searchParams.get("sort") ?? "update",
            status: searchParams.get("status") ?? "all",
        }),
        [searchParams]
    );

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();
    const location = useLocation();

    const setPagination = (pageNumber) => {
        // Update page parameter
        setSearchParams({ ...query, page: pageNumber });
    };

    const handleSortChange = (newSort) => {
        // Update sort parameter and set page to 1
        setSearchParams({ ...query, sort: newSort, page: 1 });
    };

    const handleStatusChange = (newStatus) => {
        // Update status parameter and set page to 1
        setSearchParams({ ...query, status: newStatus, page: 1 });
    };

    useEffect(() => {
        // Navigate to login page if use is not logged in
        if (!currentUser) {
            navigate("/login");
        } else {
            const param = new URLSearchParams(location.search);
            const fetchApplications = async () => {
                try {
                    await fetchWithToken(
                        `/applications/${currentUser.role}?${param.toString()}`
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            setApplications(json.results);
                            setTotalPages(Math.ceil(json.count / query.page_size));
                            // console.log("APPLICATIONS:", applications);
                            // console.log("PARAM:", param.toString());
                        });
                } catch (error) {
                    console.error("Fetching applications error:", error);
                }
            };

            fetchApplications();
        }
    }, [query]);

    return currentUser ? (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <Sidebar navItems={generateApplicationSidebar(currentUser.id)} />
                {/* Main section for application list */}
                <div className="col col-12 col-lg-9">
                    <div className="row my-4 justify-content-between">
                        {/* Filter by status */}
                        <FilterButtons currentStatus={query.status} onStatusChange={handleStatusChange} />
                        {/* Sort by datetime */}
                        <SortRadioButtons currentSort={query.sort} onSortChange={handleSortChange} />
                    </div>
                    {applications ? (
                        <>
                            {/* Applications List */}
                            <ApplicationList applications={applications} />
                            {/* Pagination */}
                            <div className="row">
                                <Paginate totalPages={totalPages} currentPage={query.page} paginate={setPagination} />
                            </div>
                        </>
                    ) : (
                        // Display when applications list is empty
                        <div className="col col-12 col-lg-9 main-dark-color h5 p-4">
                            You don't have {query.status === "all" ? "any" : query.status} applications.
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        // Return empty when user not logged-in
        <></>
    );
};
export default ApplicationsPage;
