import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  // Set minimum date to today
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
        setError(errorMessage || t('reservations.modal.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('reservations.modal.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>
            <strong>{t('reservations.modal.book')}:</strong> {bookTitle}
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>{t('reservations.modal.startDate')} *</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('reservations.modal.days')}</Form.Label>
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
            {t('reservations.modal.cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? t('reservations.modal.submitting') : t('reservations.modal.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

