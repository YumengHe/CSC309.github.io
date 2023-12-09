/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PersonVcardFill, CollectionFill } from "react-bootstrap-icons";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const APPLICATION_SIDEBAR = [
    { path: `/user-profile/${currentUser.id}`, label: "Profile", icon: <PersonVcardFill /> },
    { path: "/applications", label: "Application", icon: <CollectionFill /> },
];

const Sidebar = ({ navItems = APPLICATION_SIDEBAR }) => {
    const location = useLocation();
    const url = location.pathname;

    return (
        <div className="side_nav col col-12 col-lg-3 mb-4">
            <div className="list-group list-group-flush border border-start-0 border-2 rounded-end">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`list-group-item list-group-item-action py-3 lh-sm border-0 ${
                            url.startsWith(item.path) ? "active" : ""
                        }`}
                    >
                        <div className="w-100 fw-bolder ps-4 main-dark-color">
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