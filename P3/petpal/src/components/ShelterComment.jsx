import React, { useEffect, useState } from "react";
import {
  API_BASE_URL,
  fetchWithToken,
  fetchWithTokenWithFullUrl,
} from "../services/utils";

const ShelterComments = ({ shelterId }) => {
  const [comments, setComments] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch comments function with pagination support
  const fetchComments = async (pageUrl) => {
    setLoading(true);
    try {
      const url =
        pageUrl || `${API_BASE_URL}/comments/shelter-comments/${shelterId}/`;
      const response = await fetchWithTokenWithFullUrl(url);
      const data = await response.json();
      console.log("comments:", data);
      setComments(data?.results);
      setNextPage(data?.next);
      setPrevPage(data?.previous);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.getText);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of comments
  useEffect(() => {
    fetchComments();
  }, [shelterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetchWithToken(
        `/comments/shelter-comments/${shelterId}/`,
        "POST",
        { text: newComment },
      );
      const data = await response.json();
      if (response.ok) {
        setNewComment("");
        fetchComments(); // Refetch comments to include the new one
      } else {
        setError(`Error posting comment: ${data.message || response.status}`);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Error posting comment: " + err.message);
    }
  };

  return (
    <div className="card-body">
      <h2 className="card-title">Shelter Comments</h2>
      {error}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.text}</p>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
          ))}
          <div className="pagination">
            <button
              onClick={() => fetchComments(prevPage)}
              disabled={!prevPage}
            >
              Previous
            </button>
            <button
              onClick={() => fetchComments(nextPage)}
              disabled={!nextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <div>
          <button type="submit" className="btn btn-primary-cust">
            Post Comment
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ShelterComments;
