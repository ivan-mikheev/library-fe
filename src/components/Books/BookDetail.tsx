import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { BookResponse } from '../../types/api';
import { ReservationModal } from '../Reservations/ReservationModal';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.getBook(parseInt(id!));
      setBook(data);
    } catch (err: any) {
      setError(t('books.detail.error'));
      console.error('Error loading book:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSuccess = () => {
    setShowReservationModal(false);
    loadBook(); // Оновлюємо інформацію про книгу
  };

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || t('books.detail.notFound')}</Alert>
        <Button variant="secondary" onClick={() => navigate('/')}>
          {t('books.detail.backToCatalog')}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={() => navigate('/')} className="mb-3">
        {t('books.detail.back')}
      </Button>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title className="h2">{book.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted h5">{book.author}</Card.Subtitle>
              {book.category && (
                <Badge bg="secondary" className="mb-2">
                  {book.category.name}
                </Badge>
              )}
            </div>
            {isAuthenticated && book.available_copies > 0 && (
              <Button variant="success" onClick={() => setShowReservationModal(true)}>
                {t('books.detail.reserve')}
              </Button>
            )}
          </div>

          <hr />

          <div className="mb-3">
            <h5>{t('books.detail.bookInfo')}</h5>
            {book.isbn && (
              <p>
                <strong>{t('books.detail.isbn')}:</strong> {book.isbn}
              </p>
            )}
            {book.description && (
              <div>
                <strong>{t('books.detail.description')}:</strong>
                <p>{book.description}</p>
              </div>
            )}
            <p>
              <strong>{t('books.detail.totalCopies')}:</strong> {book.total_copies}
            </p>
            <p>
              <strong>{t('books.detail.availableCopies')}:</strong>{' '}
              <Badge bg={book.available_copies > 0 ? 'success' : 'danger'}>
                {book.available_copies}
              </Badge>
            </p>
          </div>
        </Card.Body>
      </Card>

      {showReservationModal && (
        <ReservationModal
          bookId={book.id}
          bookTitle={book.title}
          show={showReservationModal}
          onHide={() => setShowReservationModal(false)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </Container>
  );
};

