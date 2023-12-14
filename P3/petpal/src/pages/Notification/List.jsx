/* eslint-disable */
import React from "react";
import NotificationItem from "./Item";

const NotificationsList = ({ notifications, onItemClick }) => (
    <div className="row">
        <div className="application list-group list mb-4 p-0 border">
            {notifications?.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onClick={onItemClick} />
            ))}
        </div>
    </div>
);

export default NotificationsList;
