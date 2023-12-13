import React, { useEffect, useState, useCallback } from "react";
import { fetchWithToken } from "../services/utils"; // Adjust the import path as needed

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
      setConversations(data);
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

  return (
    <div>
      <h3>Conversations</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading conversations...</p>
      ) : (
        <div className="conversations-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`message ${
                conversation.created_by === currentUser.id ? "right" : "left"
              }`}
            >
              <p>{conversation.content}</p>
              <span>{new Date(conversation.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send message ..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ApplicationConversation;
