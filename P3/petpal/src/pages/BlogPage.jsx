import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithToken } from "../services/utils";
import BlogComments from "./BlogComment";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {blogPost && (
        <>
          <h1>{blogPost?.title}</h1>
          <p>Author: {blogPost?.author_username}</p>
          <p>Updated at: {blogPost?.updated_at}</p>
          <p>{blogPost?.content}</p>
          <BlogComments blogId={id} />
        </>
      )}
    </div>
  );
};

export default BlogPage;
