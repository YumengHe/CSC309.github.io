/* eslint-disable */
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonVcardFill, CollectionFill } from "react-bootstrap-icons";
import "../../assets/css/ApplicationStyle.css";

const Sidebar = () => {
    const location = useLocation();
    const url = location.pathname;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return currentUser ? (
        <div className="side_nav col col-12 col-lg-3 mb-4">
            <div className="list-group list-group-flush border border-start-0 border-2 rounded-end">
                <Link
                    to={`/user-profile/${currentUser.id}`}
                    className={`list-group-item list-group-item-action py-3 lh-sm border-0 ${
                        url.startsWith("/user-profile") ? "active" : ""
                    }`}
                >
                    <div className="w-100 fw-bolder ps-4 main-dark-color">
                        <PersonVcardFill className="pe-2 align-bottom" size={24} />
                        Profile
                    </div>
                </Link>

                <Link
                    to="/applications"
                    className={`list-group-item list-group-item-action py-3 lh-sm border-0 ${
                        url.startsWith("/applications") ? "active" : ""
                    }`}
                >
                    <div className="w-100 fw-bolder ps-4 main-dark-color">
                        <CollectionFill className="pe-2 align-bottom" size={24} />
                        Applications
                    </div>
                </Link>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default Sidebar;
