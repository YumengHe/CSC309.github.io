/* eslint-disable */
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { fetchWithToken } from "../../../services/utils";

const StatusUpdate = ({ app, currentUser }) => {
    const [showModal, setShowModal] = useState({
        show: false,
        title: "",
        bodyMsg: "",
        primaryActionLabel: "",
        handlePrimaryAction: null,
        newStatus: "",
    });
    const [showAlert, setShowAlert] = useState({ show: false, msg: "", variant: "" });

    const handleStatusUpdate = async (newStatus) => {
        setShowModal({ ...showModal, show: false });
        try {
            // // Prepare FormData to be sent as request body
            const formData = new FormData();
            formData.append("status", newStatus);
            const response = await fetchWithToken(`/applications/${currentUser.role}/${app.id}/`, "PUT", formData);
            const data = await response.json();
            // for (const [key, value] of formData.entries()) {
            //     console.log({ key, value });
            // }
            if (!response.ok) {
                if (response.status === 403 || response.status === 400) {
                    setShowAlert({
                        show: true,
                        msg: data.error || data.detail,
                        variant: "danger",
                    });
                } else {
                    console.log("ERROR unexpected");
                }
            } else {
                // Update succeed
                app.status = newStatus;
                setShowAlert({
                    show: true,
                    msg: "Update succeed.",
                    variant: "success",
                });
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    const renderSeekerActions = () => {
        return (
            <>
                <div className="col col-12 pb-1">
                    If you wish to withdraw your application, click the withdraw button.
                </div>
                <div className="col col-12 d-flex justify-content-center">
                    <div className="col col-8 col-md-6 d-flex justify-content-center">
                        <button
                            className="btn btn-outline-primary-cust btn-sm"
                            onClick={() =>
                                setShowModal({
                                    show: true,
                                    title: "Withdraw Confirmation",
                                    bodyMsg:
                                        "Are you sure you want to withdraw your application? This action cannot be undone.",
                                    primaryActionLabel: "Withdraw",
                                    handlePrimaryAction: handleStatusUpdate,
                                    newStatus: "withdrawn",
                                })
                            }
                        >
                            Withdraw My Application
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const renderShelterActions = () => {
        return (
            <>
                <div className="col col-12 pb-1">
                    You can choose to either accept or deny the application by using the respective buttons below.
                </div>
                <div className="col col-12 d-flex p-0">
                    <div className="col d-flex justify-content-center">
                        <button
                            className="btn btn-outline-primary-cust btn-sm px-2 px-md-5"
                            onClick={() =>
                                setShowModal({
                                    show: true,
                                    title: "Accept Confirmation",
                                    bodyMsg:
                                        "Are you sure you want to accept the application? This action cannot be undone.",
                                    primaryActionLabel: "Accept",
                                    handlePrimaryAction: handleStatusUpdate,
                                    newStatus: "accepted",
                                })
                            }
                        >
                            Accept
                        </button>
                    </div>
                    <div className="col d-flex justify-content-center">
                        <button
                            className="btn btn-outline-primary-cust btn-sm px-2 px-md-5"
                            onClick={() =>
                                setShowModal({
                                    show: true,
                                    title: "Deny Confirmation",
                                    bodyMsg:
                                        "Are you sure you want to deny the application? This action cannot be undone.",
                                    primaryActionLabel: "Deny",
                                    handlePrimaryAction: handleStatusUpdate,
                                    newStatus: "denied",
                                })
                            }
                        >
                            Deny
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <h5 className="text-start fw-bolder" id="SubmissionStatus">
                Submission Status
            </h5>
            <div className="row m-1 m-md-4 mb-2">
                <div className="col col-12">
                    <p>
                        The status of your current application is <b>{app.status.toUpperCase()}</b>.{" "}
                    </p>
                    <p>
                        For further questions, please leave a message to the{" "}
                        {currentUser.role === "seeker" ? "shelter" : "seeker"} using the conversation box below.
                    </p>
                </div>
                {currentUser.role === "seeker" && ["pending", "accepted"].includes(app.status)
                    ? renderSeekerActions()
                    : null}
                {currentUser.role === "shelter" && "pending" === app.status ? renderShelterActions() : null}

                {/* {currentUser.role === "seeker" ? (
                    <>
                        {["pending", "accepted"].includes(app.status) ? (
                            // Seeker can withdrawn application only when application status is pending/accepted
                            <>
                                <div className="col col-12 pb-1">
                                    If you wish to withdraw your application, click the withdraw button.
                                </div>
                                <div className="col col-12 d-flex justify-content-center">
                                    <div className="col col-8 col-md-6 d-flex justify-content-center">
                                        <button
                                            className="btn btn-outline-primary-cust btn-sm"
                                            onClick={() =>
                                                setShowModal({
                                                    show: true,
                                                    title: "Withdraw Confirmation",
                                                    bodyMsg:
                                                        "Are you sure you want to withdraw your application? This action cannot be undone.",
                                                    primaryActionLabel: "Withdraw",
                                                    handlePrimaryAction: handleStatusUpdate,
                                                    newStatus: "withdrawn",
                                                })
                                            }
                                        >
                                            Withdraw My Application
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </>
                ) : (
                    // when current logged-in user is shelter
                    <>
                        {"pending" === app.status ? (
                            // Seeker can withdrawn application only when application status is pending/accepted
                            <>
                                <div className="col col-12 pb-1">
                                    You can choose to either accept or deny the application by using the respective
                                    buttons below.
                                </div>
                                <div className="col col-12 d-flex p-0">
                                    <div className="col d-flex justify-content-center">
                                        <button
                                            className="btn btn-outline-primary-cust btn-sm px-2 px-md-5"
                                            onClick={() =>
                                                setShowModal({
                                                    show: true,
                                                    title: "Accept Confirmation",
                                                    bodyMsg:
                                                        "Are you sure you want to accept the application? This action cannot be undone.",
                                                    primaryActionLabel: "Accept",
                                                    handlePrimaryAction: handleStatusUpdate,
                                                    newStatus: "accepted",
                                                })
                                            }
                                        >
                                            Accept
                                        </button>
                                    </div>
                                    <div className="col d-flex justify-content-center">
                                        <button
                                            className="btn btn-outline-primary-cust btn-sm px-2 px-md-5"
                                            onClick={() =>
                                                setShowModal({
                                                    show: true,
                                                    title: "Deny Confirmation",
                                                    bodyMsg:
                                                        "Are you sure you want to deny the application? This action cannot be undone.",
                                                    primaryActionLabel: "Deny",
                                                    handlePrimaryAction: handleStatusUpdate,
                                                    newStatus: "denied",
                                                })
                                            }
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </>
                )} */}
            </div>
            {/* Display confirmation modal on withdrawn */}
            <Modal show={showModal.show} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="main-dark-color">{showModal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{showModal.bodyMsg}</Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-outline-primary-cust" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="btn btn-primary-cust"
                        onClick={() => showModal.handlePrimaryAction(showModal.newStatus)}
                    >
                        {showModal.primaryActionLabel}
                    </Button>
                </Modal.Footer>
            </Modal>
            {showAlert.show ? (
                <Alert variant={showAlert.variant} onClose={() => setShowAlert(false)} dismissible>
                    {showAlert.msg}
                </Alert>
            ) : null}
        </>
    );
};
export default StatusUpdate;
