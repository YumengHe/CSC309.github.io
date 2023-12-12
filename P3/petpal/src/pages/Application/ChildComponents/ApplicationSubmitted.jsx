/* eslint-disable */
import React from "react";

const ApplicationSubmitted = ({ app }) => {
    return (
        <>
            <h2 className="text-center fs-2 fw-bolder">Submitted Application</h2>
            <form>
                {/* Adopter's Name  */}
                <div className="my-4">
                    <label className="form-label fw-bold">Adopter's Name</label>
                    <input type="text" className="form-control" disabled value={app.adopter_firstname} />
                    <input type="text" className="form-control mt-2" disabled value={app.adopter_lastname} />
                </div>
                {/* Co-Adopter's Name */}
                <div className="my-4">
                    <label className="form-label fw-bold">Co-Adopter's Name</label>
                    <input type="text" className="form-control" disabled value={app.co_adopter_firstname ?? ""} />
                    <input type="text" className="form-control mt-2" disabled value={app.co_adopter_lastname ?? ""} />
                </div>
                {/* Address */}
                <div className="my-4">
                    <label className="form-label fw-bold">Address</label>
                    <input type="text" className="form-control mb-2" disabled value={app.addr_street} />
                    <div className="row d-sm-flex ">
                        <div className="col col-sm-4">
                            <input type="text" className="form-control" disabled value={app.addr_city} />
                        </div>
                        <div className="col-3 col-sm-4">
                            <input type="text" className="form-control" disabled value={app.addr_province} />
                        </div>
                        <div className="col col-sm-4">
                            <input type="text" className="form-control" disabled value={app.addr_postal} />
                        </div>
                    </div>
                </div>
                {/* Email */}
                <div className="my-4">
                    <label className="form-label fw-bold">Adopter's Email</label>
                    <input type="email" className="form-control" disabled value={app.adopter_email} />
                </div>
                <div className="my-4">
                    <label className="form-label fw-bold">Co-Adopter's Email</label>
                    <input type="email" className="form-control" disabled value={app.co_adopter_email ?? ""} />
                </div>
                {/* Phone Number */}
                <div className="my-4">
                    <label className="form-label fw-bold">Phone Number</label>
                    <div className="row d-flex">
                        <div className="col col-4">
                            <select className="form-control" disabled value={app.phone_type}>
                                <option value="cell">Cell</option>
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                            </select>
                        </div>
                        <div className="col col-8">
                            <input type="tel" className="form-control col col-lg-4" disabled value={app.phone} />
                        </div>
                    </div>
                </div>
                {/* Residents */}
                <div className="my-4">
                    <label className="form-label fw-bold">
                        Names and ages of all permanent residents of your home (adults/children)
                    </label>
                    <input type="text" className="form-control" value={app.family_members} disabled />
                </div>
                {/* Current Pets */}
                <div className="my-4">
                    <label className="form-label fw-bold">Do you currently have any pets?</label>
                    <select className="form-control" disabled value={app.have_pet_currently}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
                {/* List of Pets */}
                <div className="my-4">
                    <label className="form-label fw-bold">If you currently have pets, please list them below.</label>
                    <input type="text" className="form-control" value={app.have_pet_notes ?? ""} disabled />
                </div>
            </form>
        </>
    );
};

export default ApplicationSubmitted;
