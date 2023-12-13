/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar, { generateApplicationSidebar } from "../../components/buttons/Sidebar";
import FilterButtons from "../../components/buttons/FilterButtons";
import SortRadioButtons from "../../components/buttons/SortButtons";
import Paginate from "../../components/buttons/PageButtons";
import { fetchWithToken } from "../../services/utils";
import { EnvelopeFill } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const DATE_FORMATTER = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
};

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
                navigate("/notifications");
            }
        } catch (error) {
            console.error("DELETE NOTIFICATION failed:", error);
        }
    };

    const handleMarkReadClicked = async () => {
        setShowModal({ ...showModal, show: false });
        console.log("READ CLICKED");
        try {
            const response = await fetchWithToken(`/notifications/${showModal.notId}/`, "PUT");
            if (!response.ok) {
                setShowAlert({ show: true, msg: "Notification not found.", variant: "danger" });
            } else {
                // Update succeed
                setShowAlert({ show: true, msg: "Succeed.", variant: "success" });
                // Set query param to reload list, otherwise unread icon won't refresh
                setSearchParams(INIT_QUERY_PARAM);
            }
        } catch (error) {
            console.error("MARK NOTIFICATION READ failed:", error);
        }
    };

    const handleViewPageClicked = () => {};

    useEffect(() => {
        // Navigate to login page if use is not logged in
        if (!currentUser) {
            navigate("/login");
        } else {
            const param = new URLSearchParams(location.search);
            const fetchNotifications = async () => {
                try {
                    await fetchWithToken(`/notifications/?${param.toString()}`)
                        .then((response) => response.json())
                        .then((json) => {
                            setNotifications(json.results);
                            setTotalPages(Math.ceil(json.count / query.page_size));
                            // console.log("NOTIFICATIONS:", notifications);
                            // console.log("PARAM:", param.toString());
                        });
                } catch (error) {
                    console.error("Fetching applications error:", error);
                }
            };

            fetchNotifications();
        }
    }, [query]);

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
                            <div className="row">
                                <div className="application list-group list mb-4 p-0 border">
                                    {notifications?.map((notification) => (
                                        <a
                                            // to={`/applications/${notification.id}`}
                                            key={notification.id}
                                            onClick={() =>
                                                setShowModal({
                                                    notId: notification.id,
                                                    eventLink: notification.event_link,
                                                    show: true,
                                                    title: "Notification Details",
                                                    bodyMsg: (
                                                        <>
                                                            <p>{notification.content}</p>
                                                            <small>
                                                                Received on{" "}
                                                                {new Date(notification.created_at).toLocaleString(
                                                                    undefined,
                                                                    { dateStyle: "full", timeStyle: "medium" }
                                                                )}
                                                            </small>
                                                        </>
                                                    ),
                                                })
                                            }
                                            className="list-group-item list-group-item-action d-flex align-items-center gap-lg-3 gap-1 py-3"
                                        >
                                            <div className="col col-1 main-dark-color d-flex justify-content-center">
                                                {notification.read ? null : <EnvelopeFill />}
                                            </div>
                                            <div className="col col-6 col-md-7 flex-fill">
                                                <h6 className="mb-0 text-truncate">{notification.content}</h6>
                                            </div>
                                            <div className="col col-3 me-2">
                                                <div className="d-none d-md-block">
                                                    <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                                        {new Date(notification.created_at).toLocaleString(
                                                            undefined,
                                                            DATE_FORMATTER
                                                        )}
                                                    </small>
                                                </div>
                                                <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                                    <div className="d-none d-md-block">State: </div>
                                                    {notification.read ? "Read" : "Unread"}
                                                </small>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
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
            <Modal show={showModal.show} onHide={() => setShowModal(false)} centered backdrop="static" keyboard={false}>
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
                    <Button className="btn btn-outline-primary-cust btn-sm " onClick={() => handleMarkReadClicked()}>
                        Mark as read
                    </Button>
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
