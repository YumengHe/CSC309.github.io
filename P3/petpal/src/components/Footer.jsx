import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-4 bg-light shadow-sm">
      <Container>
        <div className="text-center py-1">
          <p>
            <Link to="/about" style={{ color: "inherit" }}>
              About
            </Link>{" "}
          </p>
          <p>© 2023 PetPal, Inc.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
