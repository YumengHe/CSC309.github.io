import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../services/utils";
import NewBlogForm from "../components/forms/NewBlogForm";

const NewBlogPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (blogData) => {
    try {
      const response = await fetchWithToken(
        "/blogs/",
        "POST",
        JSON.stringify(blogData),
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Blog submitted successfully:", responseData);
        navigate(`/blogs/${responseData.id}`);
      } else {
        // Handle HTTP error responses
        const errorData = await response.json();
        console.error("Error submitting blog:", errorData);
      }
    } catch (error) {
      console.error("Network or other error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Blog</h2>
      <NewBlogForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default NewBlogPage;
