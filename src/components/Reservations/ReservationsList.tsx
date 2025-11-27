import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/client';
import type { ReservationResponse } from '../../types/api';

export const ReservationsList: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

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
      setError(t('reservations.list.error'));
      console.error('Error loading reservations:', err);
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
    const statusKey = status as 'active' | 'completed' | 'cancelled';
    const statusText = t(`reservations.list.${statusKey}`, status);
    return <Badge bg={variants[status] || 'primary'}>{statusText}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">{t('reservations.list.title')}</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>{t('reservations.list.statusFilter')}</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">{t('reservations.list.active')}</option>
              <option value="completed">{t('reservations.list.completed')}</option>
              <option value="cancelled">{t('reservations.list.cancelled')}</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">{t('reservations.list.loading')}</span>
          </Spinner>
        </div>
      ) : reservations.length === 0 ? (
        <Alert variant="info">{t('reservations.list.notFound')}</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>{t('reservations.list.table.book')}</th>
                  <th>{t('reservations.list.table.author')}</th>
                  <th>{t('reservations.list.table.startDate')}</th>
                  <th>{t('reservations.list.table.endDate')}</th>
                  <th>{t('reservations.list.table.status')}</th>
                  <th>{t('reservations.list.table.createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.book?.title || t('reservations.list.unknown')}</td>
                    <td>{reservation.book?.author || t('reservations.list.unknown')}</td>
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

