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
      setError('Ошибка загрузки бронирований. Попробуйте обновить страницу.');
      console.error('Ошибка загрузки бронирований:', err);
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
      <h1 className="mb-4">Мои бронирования</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Фильтр по статусу</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Активные</option>
              <option value="completed">Завершенные</option>
              <option value="cancelled">Отмененные</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      ) : reservations.length === 0 ? (
        <Alert variant="info">Бронирования не найдены</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Книга</th>
                  <th>Автор</th>
                  <th>Дата начала</th>
                  <th>Дата окончания</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.book?.title || 'Неизвестно'}</td>
                    <td>{reservation.book?.author || 'Неизвестно'}</td>
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

