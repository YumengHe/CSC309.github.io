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
            <Route path="/search/shelter" element={<ShelterSearchPage />} />
            <Route path="/search/pets" element={<PetSearchPage />} />
            <Route path="/how-it-works" element={<HowItWorkPage />} />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
