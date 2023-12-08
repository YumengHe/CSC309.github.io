import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils";

const ApplicationComments = ({ applicationId, seekerUsername }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {}, [applicationId]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="conversation">
      <h3>Conversations</h3>
      <div className="messages">
        {loading ? (
          <p>Loading...</p>
        ) : (
          messages.map((msg) => (
            <div
              className={`message ${
                msg.sender === "Shelter Rep" ? "left" : "right"
              }`}
              key={msg.id}
            >
              <span className="sender">{msg.sender}</span>
              <p>{msg.text}</p>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send message ..."
        />
        <button type="submit">➤</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ApplicationComments;
