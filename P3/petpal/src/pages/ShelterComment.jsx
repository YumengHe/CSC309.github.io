import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils";

const ShelterComments = ({ shelterId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(`/shelter-comments/${shelterId}`);
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Error fetching comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [shelterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetchWithToken(
        `/shelter-comments/${shelterId}`,
        "POST",
        { text: newComment },
      );
      const data = await response.json(); // Get JSON response regardless of response.ok
      if (response.ok) {
        setNewComment("");
        // Optionally refetch comments or add the new comment to the list
      } else {
        // Display a more specific error message from the server response
        setError(`Error posting comment: ${data.message || response.status}`);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Error posting comment: " + err.message);
    }
  };

  return (
    <div>
      <h3>Shelter Comments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <p> {comment.text}</p>
          </div>
        ))
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ marginBottom: "10px" }} // Add some space between the text area and the button
        />
        <button type="submit">Post Comment</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ShelterComments;
