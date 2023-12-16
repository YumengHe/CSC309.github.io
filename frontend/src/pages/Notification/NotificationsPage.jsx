/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar, { generateApplicationSidebar } from "../../components/buttons/Sidebar";
import FilterButtons from "../../components/buttons/FilterButtons";
import SortRadioButtons from "../../components/buttons/SortButtons";
import Paginate from "../../components/buttons/PageButtons";
import { fetchWithToken } from "../../services/utils";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import NotificationsList from "./List";

const INIT_QUERY_PARAM = {
    page: 1,
    page_size: 10,
    sort: "-creation",
    state: "all",
};

const NotificationsPage = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [reload, setReload] = useState({ reloadToggler: false, itemCount: 0 });
    const query = useMemo(
        () => ({
            page: parseInt(searchParams.get("page") ?? 1),
            page_size: parseInt(searchParams.get("page_size") ?? 10),
            sort: searchParams.get("sort") ?? "-creation",
            state: searchParams.get("state") ?? "all",
        }),
        [searchParams]
    );
    const [showAlert, setShowAlert] = useState({ show: false, msg: "", variant: "" });
    const [showModal, setShowModal] = useState({
        show: false,
        title: "",
        bodyMsg: "",
        notId: "",
        eventLink: "",
        read: false,
    });

    const setPagination = (pageNumber) => {
        // Update page parameter
        setSearchParams({ ...query, page: pageNumber });
    };

    const handleSortChange = (newSort) => {
        // Update sort parameter and set page to 1
        setSearchParams({ ...query, sort: newSort, page: 1 });
    };

    const handleStateChange = (newState) => {
        // Update state parameter and set page to 1
        setSearchParams({ ...query, state: newState, page: 1 });
    };

    const handleDeleteClicked = async () => {
        setShowModal({ ...showModal, show: false });
        try {
            const response = await fetchWithToken(`/notifications/${showModal.notId}/`, "DELETE");
            if (!response.ok) {
                setShowAlert({ show: true, msg: "Notification not found.", variant: "danger" });
            } else {
                // Update succeed
                setShowAlert({ show: true, msg: "Deletion succeed.", variant: "success" });
                // Trigger useEffect dependency, otherwise deleted item still show up
                if (reload.itemCount == 1) {
                    // console.log("INIT QUERY ing...");
                    // Reset search param when running out of items from current fetch
                    setSearchParams(INIT_QUERY_PARAM);
                }
                // console.log("Reloading...", reload);
                setReload({ ...reload, reloadToggler: !reload.reloadToggler });
            }
        } catch (error) {
            console.error("DELETE NOTIFICATION failed:", error);
        }
    };

    const handleMarkReadClicked = async () => {
        setShowModal({ ...showModal, show: false });
        try {
            const response = await fetchWithToken(`/notifications/${showModal.notId}/`, "PUT");
            if (!response.ok) {
                setShowAlert({ show: true, msg: "Notification not found.", variant: "danger" });
            } else {
                // Update succeed
                setShowAlert({ show: true, msg: "Succeed.", variant: "success" });
                // Trigger useEffect dependency, otherwise unread icon won't refresh
                if (reload.itemCount == 1) {
                    // console.log("INIT QUERY ing...");
                    // Reset search param when running out of items from current fetch
                    setSearchParams(INIT_QUERY_PARAM);
                }
                // console.log("Reloading...", reload);
                setReload({ ...reload, reloadToggler: !reload.reloadToggler });
            }
        } catch (error) {
            console.error("MARK NOTIFICATION READ failed:", error);
        }
    };

    const handleViewPageClicked = () => {
        // Mark as read
        if (!showModal.read) {
            fetchWithToken(`/notifications/${showModal.notId}/`, "PUT");
        }
        const USER_REGEX_PATTERN = /^\/(accounts|pets)\/((\d+)|(\?shelter=(\d+)))/;
        const APP_REGEX_PATTERN = /^\/applications\/(([a-z]*\/(\d+))|(\d+)\/conversations)?/;
        const userProfileMatch = showModal.eventLink.match(USER_REGEX_PATTERN);
        const applicationMatch = showModal.eventLink.match(APP_REGEX_PATTERN);
        if (userProfileMatch) {
            // When eventLink in pattern of '/accounts/#/' or '/pets/?shelter=#'
            const id = userProfileMatch[3] || userProfileMatch[5];
            navigate(`/user-profile/${id}`);
        } else if (applicationMatch) {
            // When eventLink in pattern of '/applications/seeker/#/' or '/applications/#/conversations'
            const id = applicationMatch[3] || applicationMatch[4];
            navigate(`/applications/${id}`);
        }
    };

    useEffect(() => {
        // Navigate to login page if use is not logged in
        if (!currentUser) {
            navigate("/login");
        } else {
            const fetchNotifications = async () => {
                const param = new URLSearchParams(location.search);
                try {
                    await fetchWithToken(`/notifications/?${param.toString()}`)
                        .then((response) => response.json())
                        .then((json) => {
                            setNotifications(json.results);
                            setTotalPages(Math.ceil(json.count / query.page_size));
                            setReload({ ...reload, itemCount: json.results?.length });
                            // console.log("NOTIFICATIONS:", json.results.length, json);
                            // console.log("PARAM:", param.toString());
                        });
                } catch (error) {
                    console.error("Fetching applications error:", error);
                }
            };
            fetchNotifications();
        }
    }, [query, reload.reloadToggler]);

    return currentUser ? (
        <div className="container mt-5">
            <div className="row d-lg-flex flex-lg-row justify-content-between">
                <div className="col col-12 col-lg-3 mb-4">
                    <Sidebar navItems={generateApplicationSidebar(currentUser.id)} />
                </div>
                {/* Main section for list */}
                <div className="col col-12 col-lg-9">
                    {showAlert.show ? (
                        <Alert variant={showAlert.variant} onClose={() => setShowAlert(false)} dismissible>
                            {showAlert.msg}
                        </Alert>
                    ) : null}
                    <div className="row my-4 justify-content-between">
                        {/* Filter by state */}
                        <FilterButtons
                            label="State"
                            currentStatus={query.state}
                            onStatusChange={handleStateChange}
                            statusOption={[
                                { value: "all", label: "All" },
                                { value: "read", label: "Read" },
                                { value: "unread", label: "Unread" },
                            ]}
                        />
                        {/* Sort by creation time */}
                        <SortRadioButtons
                            currentSort={query.sort}
                            onSortChange={handleSortChange}
                            sortOption={[
                                { value: "-creation", label: "Newest" },
                                { value: "creation", label: "Oldest" },
                            ]}
                        />
                    </div>
                    {notifications ? (
                        <>
                            {/* Notification List */}
                            <NotificationsList
                                notifications={notifications}
                                onItemClick={(notification) => {
                                    setShowModal({
                                        notId: notification.id,
                                        eventLink: notification.event_link,
                                        read: notification.read,
                                        show: true,
                                        title: "Notification Details",
                                        bodyMsg: (
                                            <>
                                                <p>{notification.content}</p>
                                                <small>
                                                    Received on{" "}
                                                    {new Date(notification.created_at).toLocaleString(undefined, {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        second: "numeric",
                                                        hour12: false,
                                                    })}
                                                </small>
                                            </>
                                        ),
                                    });
                                }}
                            />
                            {/* Pagination */}
                            <div className="row">
                                <Paginate totalPages={totalPages} currentPage={query.page} paginate={setPagination} />
                            </div>
                        </>
                    ) : (
                        // Display when list is empty
                        <div className="col col-12 col-lg-9 main-dark-color h5 p-4">
                            You don't have {query.state === "all" ? "any" : query.state} notifications.
                        </div>
                    )}
                </div>
            </div>
            {/* Display modal with 3 buttons: delete/read/visit detail */}
            <Modal show={showModal.show} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="main-dark-color">{showModal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showModal.bodyMsg}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-danger"
                        className="btn btn-sm me-auto"
                        onClick={() => handleDeleteClicked()}
                    >
                        Delete
                    </Button>
                    {showModal.read ? null : (
                        <Button
                            className="btn btn-outline-primary-cust btn-sm "
                            onClick={() => handleMarkReadClicked()}
                        >
                            Mark as read
                        </Button>
                    )}

                    <Button className="btn btn-primary-cust btn-sm " onClick={() => handleViewPageClicked()}>
                        View Page
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    ) : (
        <></> // Return empty when user not logged-in
    );
};
export default NotificationsPage;
