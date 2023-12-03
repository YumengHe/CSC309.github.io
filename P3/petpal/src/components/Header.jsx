import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn, logoutUser } from "../services/userService";
import { Container, Nav, Navbar } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLoggedIn();
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
    console.log("Login status changed:", userLoggedIn);
    console.log("User location:", location.pathname);
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
        <Navbar.Brand href="/">PetPal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {" "}
            {userLoggedIn ? (
              <>
                <Nav.Item className="align-self-center me-3">
                  <span className="fw-bold">Hi, {userInfo?.username}</span>
                </Nav.Item>
                <Nav.Link href={`/user-profile/${userInfo?.id}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
