import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="mt-4 shadow-sm d-flex justify-content-center align-items-center">
      <Container>
        <div className="text-center main-light-color py-2">
          &copy; 2023 PetPal, Inc.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
