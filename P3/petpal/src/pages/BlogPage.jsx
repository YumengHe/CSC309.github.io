import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithToken } from "../services/utils";
import BlogComments from "../components/BlogComment";

const BlogPage = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetchWithToken(`/blogs/${id}`, "GET", null);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlogPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) return <div className="text-center my-3">Loading...</div>;
  if (error)
    return <div className="alert alert-danger my-3">Error: {error}</div>;

  return (
    <div className="container my-4">
      {blogPost && (
        <div>
          <h1 className="display-4">{blogPost.title}</h1>
          <p className="text-muted">Author: {blogPost.author_username}</p>
          <p className="text-muted">
            Updated at: {new Date(blogPost.updated_at).toLocaleString()}
          </p>
          <div className="my-3 mb-4">{blogPost.content}</div>
          <div className="card mb-4">
            <BlogComments blogId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
