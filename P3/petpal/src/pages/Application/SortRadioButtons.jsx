/* eslint-disable */
import React from "react";

const SortRadioButtons = ({ currentSort, onSortChange }) => {
    return (
        <div className="col col-12 col-lg-6 my-2 main-dark-color d-flex align-items-center justify-content-lg-end justify-content-center">
            <label className="text-nowrap pe-2 fw-bold">Sort By</label>
            <div className="btn-group" role="group">
                <input
                    className="btn-check"
                    type="radio"
                    id="newest"
                    value="-creation"
                    checked={currentSort === "-creation"}
                    onChange={() => onSortChange("-creation")}
                />
                <label
                    htmlFor="newest"
                    className="btn btn-outline-primary-cust py-1 px-2 text-nowrap"
                >
                    Newest
                </label>

                <input
                    className="btn-check"
                    type="radio"
                    id="oldest"
                    value="creation"
                    checked={currentSort === "creation"}
                    onChange={() => onSortChange("creation")}
                />
                <label
                    htmlFor="oldest"
                    className="btn btn-outline-primary-cust py-1 px-2 text-nowrap"
                >
                    Oldest
                </label>

                <input
                    className="btn-check"
                    type="radio"
                    id="most_updated"
                    value="update"
                    checked={currentSort === "update"}
                    onChange={() => onSortChange("update")}
                />
                <label
                    htmlFor="most_updated"
                    className="btn btn-outline-primary-cust py-1 px-2 text-nowrap"
                >
                    Most Updated
                </label>
            </div>
        </div>
    );
};

export default SortRadioButtons;
