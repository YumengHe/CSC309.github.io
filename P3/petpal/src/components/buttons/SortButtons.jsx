/* eslint-disable */
import React from "react";

const SortRadioButtons = ({ currentSort, onSortChange }) => {
    const SORT_OPTIONS = [
        { value: "-creation", label: "Newest" },
        { value: "creation", label: "Oldest" },
        { value: "update", label: "Most Updated" },
    ];
    return (
        <div className="col col-12 col-lg-5 my-2 p-0 main-dark-color d-flex align-items-center justify-content-lg-end justify-content-center">
            <label className="text-nowrap pe-2 fw-bold">Sort</label>
            <div className="btn-group" role="group">
                {SORT_OPTIONS.map((sortBy) => (
                    <label
                        key={sortBy.value}
                        htmlFor={`sort-${sortBy.value}`}
                        className={`btn btn-outline-primary-cust p-1 text-nowrap ${
                            currentSort === sortBy.value ? "active" : ""
                        }`}
                    >
                        <input
                            className="btn-check"
                            type="radio"
                            id={`sort-${sortBy.value}`}
                            value={sortBy.value}
                            checked={currentSort === sortBy.value}
                            onChange={() => onSortChange(sortBy.value)}
                        />
                        <small>{sortBy.label}</small>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default SortRadioButtons;
