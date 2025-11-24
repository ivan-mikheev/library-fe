import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { apiClient } from '../../api/client';
import type { ReservationResponse } from '../../types/api';

export const ReservationsList: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, [statusFilter]);

  const loadReservations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.getMyReservations(statusFilter);
      setReservations(data);
    } catch (err: any) {
      setError('Помилка завантаження бронювань. Спробуйте оновити сторінку.');
      console.error('Помилка завантаження бронювань:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      active: 'success',
      completed: 'secondary',
      cancelled: 'danger',
    };
    return <Badge bg={variants[status] || 'primary'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Мої бронювання</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Фільтр за статусом</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Активні</option>
              <option value="completed">Завершені</option>
              <option value="cancelled">Скасовані</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </Spinner>
        </div>
      ) : reservations.length === 0 ? (
        <Alert variant="info">Бронювання не знайдені</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Книга</th>
                  <th>Автор</th>
                  <th>Дата початку</th>
                  <th>Дата завершення</th>
                  <th>Статус</th>
                  <th>Дата створення</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.book?.title || 'Невідомо'}</td>
                    <td>{reservation.book?.author || 'Невідомо'}</td>
                    <td>{formatDate(reservation.start_date)}</td>
                    <td>{formatDate(reservation.end_date)}</td>
                    <td>{getStatusBadge(reservation.status)}</td>
                    <td>{formatDate(reservation.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

