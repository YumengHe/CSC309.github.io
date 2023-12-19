/* eslint-disable */
import React, { useCallback, useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils"; // Adjust the import path as needed
import { Spinner, Alert } from "react-bootstrap";
import { SendFill } from "react-bootstrap-icons";
import Paginate from "../components/buttons/PageButtons";

const ApplicationConversation = ({ applicationId, currentUser }) => {
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ errorMsg: "", variant: "danger" });
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    // Define fetchConversations inside the component
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`/applications/${applicationId}/conversations/?page=${page}`);
            if (!response.ok) {
                console.log("NOT OK");
                if (response.status == 404) {
                    console.log("404");
                    setError({ errorMsg: "You don't have any conversation yet.", variant: "info" });
                }
            } else {
                const data = await response.json();
                console.log(data);
                setConversations(data.results);
                setTotalPages(Math.ceil(data.count / 10));
            }
        } catch (err) {
            console.error("Error fetching application data:", error);
            setError({ ...error, errorMsg: "Error fetching conversations" });
        } finally {
            setLoading(false);
        }
    }, [applicationId, page]);

    // useEffect hook to load conversations
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const setPagination = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError({}); // Clean previous error msg

        if (!newMessage.trim()) return;

        try {
            const response = await fetchWithToken(
                `/applications/${applicationId}/conversations/`,
                "POST",
                JSON.stringify({ content: newMessage })
            );
            if (!response.ok) throw new Error("Network response was not ok");
            setNewMessage("");
            await fetchConversations(); // Refetch the conversations
        } catch (err) {
            setError({ ...error, errorMsg: "Error sending message" });
        }
    };

    return (
        <>
            <h5 className="text-start fw-bolder pb-2" id="Conversation">
                Conversation
            </h5>
            {error.errorMsg && <Alert variant={error.variant}>{error.errorMsg}</Alert>}
            {/* Send message box */}
            <div className="input-group py-1">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Send message ..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <span className="input-group-text main-dark-color" onClick={handleSendMessage}>
                    <SendFill />
                </span>
            </div>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <div className={`border rounded p-3 px-md-5 ${totalPages === 0 ? "d-none" : ""}`} id="conversation">
                        {/* Pagination */}
                        {totalPages > 1 ? (
                            <div className="row">
                                <Paginate totalPages={totalPages} currentPage={page} paginate={setPagination} />
                            </div>
                        ) : null}
                        {/* Each conversation box */}
                        {conversations.map((conversation) => (
                            <div key={conversation.id} className={`row ${conversation.created_by.role}_conv`}>
                                <div className="col col-4 col-md-2 text-nowrap small text-muted fs-6 fw-bold">
                                    {conversation.created_by.role === "shelter"
                                        ? "Shelter Rep"
                                        : conversation.created_by.username}
                                </div>
                                <div className="w-100"></div>
                                <div className="col col-8 border rounded">
                                    <div className="p-3">{conversation.content}</div>
                                </div>
                                <div className="col col-4 text-wrap align-self-center timestamp">
                                    {new Date(conversation.created_at).toLocaleString(undefined, { hour12: false })}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                // <ListGroup className="mb-3">
                //     {conversations?.map((conversation) => (
                //         <ListGroup.Item
                //             key={conversation.id}
                //             className={`d-flex justify-content-between align-items-start ${
                //                 conversation.created_by === currentUser.id ? "text-right" : ""
                //             }`}
                //         >
                //             <div className="ms-2 me-auto">
                //                 <div className="fw-bold">{getDisplayName(conversation)}</div>
                //                 <div>{conversation.content}</div>
                //                 <div className="text-muted">{new Date(conversation.created_at).toLocaleString()}</div>
                //             </div>
                //         </ListGroup.Item>
                //     ))}
                // </ListGroup>
            )}
            {/* <Form onSubmit={handleSubmit} className="mt-3">
                        <Form.Group className="mb-3" controlId="messageInput">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Send message ..."
                            />
                        </Form.Group>
                        <div>
                            <button type="submit" className="btn btn-primary-cust">
                                Send
                            </button>
                        </div>
                    </Form> */}
        </>
    );
};

export default ApplicationConversation;
