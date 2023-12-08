/* eslint-disable */
import React from "react";
import { Link } from "react-router-dom";

const DATE_FORMATTER = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
};

const ApplicationList = ({ applications }) => {
    return (
        <div className="row">
            <div className="application list-group list mb-4 p-0 border">
                {applications?.map((app) => (
                    <Link
                        to={`/applications/${app.id}`}
                        key={app.id}
                        className="list-group-item list-group-item-action d-flex align-items-center gap-lg-3 gap-1 py-3"
                    >
                        <div className="col col-3 col-md-2">
                            <img src={app.petpost.image} alt="pet photo" />
                        </div>
                        <div className="col col-6 col-md-7 flex-fill">
                            <h5 className="mb-0 text-truncate">
                                {`APP${app.id}: ${app.seeker.first_name} wants ${app.petpost.name} from ${app.petpost.shelter.username}`}
                            </h5>
                        </div>
                        <div className="col col-3 me-2">
                            <div className="d-none d-md-block">
                                <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                    Created:{" "}
                                    {new Date(app.created_at).toLocaleString(
                                        undefined,
                                        DATE_FORMATTER
                                    )}
                                </small>
                                <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                    Updated:{" "}
                                    {new Date(app.last_updated).toLocaleString(
                                        undefined,
                                        DATE_FORMATTER
                                    )}
                                </small>
                            </div>
                            <small className="opacity-50 text-nowrap m-0 align-self-center d-flex align-self-center justify-content-end">
                                <div className="d-none d-md-block">
                                    Status:{" "}
                                </div>
                                {app.status.slice(0, 1).toUpperCase() +
                                    app.status.slice(1)}
                            </small>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ApplicationList;
