/* eslint-disable */
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonVcardFill, CollectionFill, BellFill } from "react-bootstrap-icons";

export const generateApplicationSidebar = (userId) => [
    // { path: `/user-profile/${userId}`, label: "Profile", icon: <PersonVcardFill /> },
    { path: "/applications", label: "Applications", icon: <CollectionFill /> },
    { path: "/notifications", label: "Notifications", icon: <BellFill /> },
];

const Sidebar = ({ navItems }) => {
    const location = useLocation();
    const url = location.pathname;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();

    if (!currentUser) {
        navigate("/login");
    }
    return (
        <div className="side_nav">
            <div className="list-group list-group-flush border border-start-0 border-2 rounded-end">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`list-group-item list-group-item-action py-3 lh-sm border-0 ${
                            url.startsWith(item.path) ? "active" : ""
                        }`}
                    >
                        <div className="w-100 fw-bolder ps-3 main-dark-color">
                            {item.icon}
                            <span className="ps-2 align-bottom">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
