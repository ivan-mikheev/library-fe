import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          📚 Бібліотека
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Каталог книг
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/reservations">
                  Мої бронювання
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  {user?.name} {user?.surname}
                </BootstrapNavbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Вхід
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Реєстрація
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

