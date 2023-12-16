import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getUserInfo,
  isUserLoggedIn,
  logoutUser,
} from "../services/userService";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { PersonCircle, BellSlashFill, BellFill } from "react-bootstrap-icons";

function Header({ onToggleNotifications, notificationsEnabled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isUserLoggedIn();
      setUserLoggedIn(loggedIn);
      if (loggedIn) {
        try {
          const info = await getUserInfo();
          setUserInfo(info);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setUserInfo(null);
      }
    };
    checkLoginStatus();
  }, [userLoggedIn, location]);

  useEffect(() => {
    // console.log("Login status changed:", userLoggedIn);
    // console.log("User location:", location.pathname);
    // Rest of your code
  }, [userLoggedIn, location]);

  const handleLogout = async () => {
    await logoutUser();
    setUserLoggedIn(false);
    setUserInfo(null); // Clear user info on logout
    navigate("/");
  };

  const handleToggleNotifications = () => {
    onToggleNotifications();
  };

  return (
    <Navbar expand="lg" className="shadow-sm" id="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bolder main-light-color">
          PetPal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Only visible on small screens */}
          {userLoggedIn && (
            <span className="d-lg-none fw-bold">Hi, {userInfo?.username}</span>
          )}
          <Nav className="me-auto gap-3">
            <NavDropdown
              title="Adopt"
              id="nav-dropdown-adopt"
              className="fw-bold"
            >
              <NavDropdown.Item as={Link} to="/search/pets/?species=dog">
                Dogs
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/pets/?species=cat">
                Cats
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/pets/?species=other">
                Others
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Search"
              id="nav-dropdown-search"
              className="fw-bold"
            >
              <NavDropdown.Item as={Link} to="/search/pets">
                Pets
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/shelter">
                Shelters
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item
              as={Link}
              to={"/about"}
              className="align-self-lg-center fw-bold"
            >
              About
            </Nav.Item>
          </Nav>
          <Nav className="ms-auto gap-3">
            {userLoggedIn ? (
              <>
                <Nav.Item className="align-self-center me-3">
                  {/* Only visible on large screens */}
                  {userLoggedIn && (
                    <span className="d-none d-lg-block fw-bold">
                      Hi, {userInfo?.username}
                    </span>
                  )}
                </Nav.Item>
                <NavDropdown title={<PersonCircle size={24} />}>
                  <NavDropdown.Item
                    as={Link}
                    to={`/user-profile/${userInfo?.id}`}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/applications`}>
                    Application
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/notifications`}>
                    Notification
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Item className="d-flex align-items-center">
                  <Form.Switch
                    id="custom-switch"
                    label={
                      notificationsEnabled ? (
                        <BellFill size={24} />
                      ) : (
                        <BellSlashFill size={24} />
                      )
                    }
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    className="me-3 form-check-reverse"
                  />
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" className="fw-bold">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="fw-bold">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
