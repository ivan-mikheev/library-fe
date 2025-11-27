import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        ...formData,
        phone: formData.phone || undefined,
      });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.map((e: any) => e.msg).join(', '));
      } else {
        setError(errorMessage || t('auth.register.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">{t('auth.register.title')}</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.register.email')} *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t('auth.register.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.register.password')} *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.register.name')} *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={t('auth.register.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.register.surname')} *</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                placeholder={t('auth.register.surnamePlaceholder')}
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.register.phone')}</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder={t('auth.register.phonePlaceholder')}
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login">{t('auth.register.hasAccount')}</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

