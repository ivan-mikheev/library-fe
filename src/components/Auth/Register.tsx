import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
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
        setError(errorMessage || 'Помилка реєстрації. Спробуйте знов.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Реєстрація</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Введіть email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Введіть пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ім'я *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Введіть ім'я"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Прізвище *</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                placeholder="Введіть прізвище"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Телефон</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Введіть телефон (необов'язково)"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login">Є аккаунт? Увійти</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

