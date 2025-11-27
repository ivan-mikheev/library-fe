import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          {t('navbar.brand')}
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              {t('navbar.catalog')}
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/reservations">
                  {t('navbar.reservations')}
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Button
              variant="outline-light"
              size="sm"
              onClick={toggleLanguage}
              className="me-2"
            >
              {i18n.language === 'en' ? '🇺🇦' : '🇬🇧'}
            </Button>
            {isAuthenticated ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  {user?.name} {user?.surname}
                </BootstrapNavbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  {t('navbar.logout')}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  {t('navbar.login')}
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  {t('navbar.register')}
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

