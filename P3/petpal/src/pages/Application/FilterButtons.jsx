/* eslint-disable */
import React from "react";

const FilterButtons = ({ currentStatus, onStatusChange }) => {
    const STATUS_OPTIONS = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "denied", label: "Denied" },
        { value: "withdrawn", label: "Withdrawn" },
    ];

    return (
        <div className="col col-12 col-lg-6 my-2 p-0 main-dark-color d-flex align-items-center justify-content-lg-start justify-content-center">
            <label className="text-nowrap pe-1 pe-lg-2 fw-bold">Status</label>
            <div className="btn-group" role="group">
                {STATUS_OPTIONS.map((option) => (
                    <label
                        className={`btn btn-outline-primary-cust text-nowrap py-1 px-1 ${
                            currentStatus === option.value ? "active" : ""
                        }`}
                        htmlFor={`filter-${option.value}`}
                        key={option.value}
                    >
                        <input
                            type="radio"
                            className="btn-check"
                            id={`filter-${option.value}`}
                            value={option.value}
                            checked={currentStatus === option.value}
                            onChange={() => onStatusChange(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FilterButtons;
