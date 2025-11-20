import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { apiClient } from '../../api/client';

interface ReservationModalProps {
  bookId: number;
  bookTitle: string;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  bookId,
  bookTitle,
  show,
  onHide,
  onSuccess,
}) => {
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(5);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Устанавливаем минимальную дату на сегодня
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiClient.createReservation({
        book_id: bookId,
        start_date: startDate,
        days,
      });
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.map((e: any) => e.msg).join(', '));
      } else {
        setError(errorMessage || 'Ошибка создания бронирования. Попробуйте снова.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Бронирование книги</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>
            <strong>Книга:</strong> {bookTitle}
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Дата начала бронирования *</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Количество дней (по умолчанию 5)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 5)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Отмена
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Создание...' : 'Забронировать'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

