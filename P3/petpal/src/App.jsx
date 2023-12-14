import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import ShelterSearchPage from "./pages/Search/ShelterSearchPage";
import PetSearchPage from "./pages/Search/PetSearchPage";
import HowItWorkPage from "./pages/HowItWorkPage";
import ApplicationsPage from "./pages/Application/ApplicationsPage";
import NotificationsPage from "./pages/Notification/NotificationsPage";
import ApplicationDetails from "./pages/Application/ApplicationDetail";
import NewApplicationPage from "./pages/Application/NewApplicationPage";
import NewBlogPage from "./pages/NewBlogPage";
import BlogPage from "./pages/BlogPage";
import NewPetPage from "./pages/NewPetPage";
import PetProfilePage from "./pages/PetProfilePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/user-profile/:userId?"
              element={<UserProfilePage />}
            />
            <Route path="/blogs/new" element={<NewBlogPage />} />
            <Route path="/blogs/:id" element={<BlogPage />} />
            <Route path="/search/shelter" element={<ShelterSearchPage />} />
            <Route path="/search/pets" element={<PetSearchPage />} />
            <Route path="/newpet" element={<NewPetPage />} />
            <Route path="/pets/:id" elemenet={<PetProfilePage />} />
            <Route path="/how-it-works" element={<HowItWorkPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route
              path="/applications/:appId"
              element={<ApplicationDetails />}
            />
            <Route
              path="/applications/pet/:petId"
              element={<NewApplicationPage />}
            />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
