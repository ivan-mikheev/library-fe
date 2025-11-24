import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      // Log the error for debugging
      console.error('Login error:', err);
      
      // Handle different error response formats
      let errorMessage = 'Помилка входу. Перевірьте дані.';
      
      if (err.response?.data) {
        // Try different possible error formats
        errorMessage = 
          err.response.data.detail || 
          err.response.data.message || 
          (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map((e: any) => e.msg || e.message).join(', ')
            : err.response.data.detail) ||
          errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Вхід в систему</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Введіть email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Вхід...' : 'Увійти'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register">Немає аккаунту? Зареєструватися</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

