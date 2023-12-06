import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getUserInfo,
  isUserLoggedIn,
  logoutUser,
} from "../services/userService";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function Header() {
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
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          PetPal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Adopt" id="nav-dropdown-adopt">
              <NavDropdown.Item as={Link} to="/search/pets/?type=dog">
                Dogs
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/pets/?type=cat">
                Cats
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/pets/?type=other">
                Others
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Search" id="nav-dropdown-search">
              <NavDropdown.Item as={Link} to="/search/pets">
                Pets
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/search/shelter">
                Shelters
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            {userLoggedIn ? (
              <>
                <Nav.Item className="align-self-center me-3">
                  <span className="fw-bold">Hi, {userInfo?.username}</span>
                </Nav.Item>
                <Nav.Link as={Link} to={`/user-profile/${userInfo?.id}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
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
