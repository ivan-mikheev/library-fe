import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { BookResponse } from '../../types/api';
import { ReservationModal } from '../Reservations/ReservationModal';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
      setError('Ошибка загрузки книги. Попробуйте обновить страницу.');
      console.error('Ошибка загрузки книги:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSuccess = () => {
    setShowReservationModal(false);
    loadBook(); // Обновляем информацию о книге
  };

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || 'Книга не найдена'}</Alert>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Вернуться к каталогу
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={() => navigate('/')} className="mb-3">
        ← Назад к каталогу
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
                Забронировать
              </Button>
            )}
          </div>

          <hr />

          <div className="mb-3">
            <h5>Информация о книге</h5>
            {book.isbn && (
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
            )}
            {book.description && (
              <div>
                <strong>Описание:</strong>
                <p>{book.description}</p>
              </div>
            )}
            <p>
              <strong>Всего экземпляров:</strong> {book.total_copies}
            </p>
            <p>
              <strong>Доступно экземпляров:</strong>{' '}
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

