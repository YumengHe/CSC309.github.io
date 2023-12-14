/* eslint-disable */
import React from "react";
import { Link } from "react-router-dom";
import { EnvelopeFill } from "react-bootstrap-icons";

const DATE_FORMATTER = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
};

const NotificationItem = ({ notification, onClick }) => (
    <Link
        to="#"
        onClick={() => onClick(notification)}
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
                    {new Date(notification.created_at).toLocaleString(undefined, DATE_FORMATTER)}
                </small>
            </div>
            <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                <div className="d-none d-md-block">State: </div>
                {notification.read ? "Read" : "Unread"}
            </small>
        </div>
    </Link>
);

export default NotificationItem;
