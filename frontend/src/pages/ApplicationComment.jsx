import React, { useCallback, useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils"; // Adjust the import path as needed
import {
  Container,
  Row,
  Col,
  Form,
  // Button,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";

const ApplicationConversation = ({ applicationId, currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define fetchConversations inside the component
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `/applications/${applicationId}/conversations/`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      setConversations(data.results);
    } catch (err) {
      setError("Error fetching conversations");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // useEffect hook to load conversations
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetchWithToken(
        `/applications/${applicationId}/conversations/`,
        "POST",
        JSON.stringify({ content: newMessage }),
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setNewMessage("");
      await fetchConversations(); // Refetch the conversations
    } catch (err) {
      setError("Error sending message");
    }
  };

  // Function to get the display name based on the role
  // Function to get the display name based on the role
  // Function to get the display name based on the role
  const getDisplayName = (conversation) => {
    // Check the role and display the corresponding name
    if (conversation.created_by === currentUser.id) {
      // If the current user sent the message, display "jack" or "Shelter Rep" based on their role
      return currentUser.role === "seeker"
        ? currentUser.username
        : "Shelter Rep";
    } else {
      // If the other user sent the message, display "Shelter Rep" or their username based on their role
      return conversation.role === "shelter"
        ? "Shelter Rep"
        : conversation.username;
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Conversations</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <ListGroup className="mb-3">
              {conversations?.map((conversation) => (
                <ListGroup.Item
                  key={conversation.id}
                  className={`d-flex justify-content-between align-items-start ${
                    conversation.created_by === currentUser.id
                      ? "text-right"
                      : ""
                  }`}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">
                      {getDisplayName(conversation)}
                    </div>
                    <div>{conversation.content}</div>
                    <div className="text-muted">
                      {new Date(conversation.created_at).toLocaleString()}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Form onSubmit={handleSubmit} className="mt-3">
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationConversation;
