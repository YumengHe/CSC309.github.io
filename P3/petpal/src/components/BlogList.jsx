import { useEffect, useState } from "react";
import { fetchWithToken } from "../services/utils";
import { useNavigate } from "react-router-dom";

const BlogList = ({ userId }) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetchWithToken(`/blogs/?author=${userId}`);
        if (response.ok) {
          const blogsData = await response.json();
          setBlogs(blogsData.results); // Set blogs to blogsData.results
        } else {
          throw new Error("Error fetching blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchBlogs();
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  const goToBlog = (blogId) => {
    navigate(`/blogs/${blogId}`); // Navigate to the blog detail page
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  const handleCreateBlog = () => {
    navigate("/blogs/new");
  };

  return (
    <div className="card-body">
      <h3>User Blogs</h3>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              {blog.title}
              <button
                onClick={() => goToBlog(blog.id)}
                className="btn btn-secondary"
              >
                Read
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCreateBlog} className="btn btn-primary mt-3">
        Create New Blog
      </button>
    </div>
  );
};

export default BlogList;
