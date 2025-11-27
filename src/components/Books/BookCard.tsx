import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BookListResponse } from '../../types/api';

interface BookCardProps {
  book: BookListResponse;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
        {book.category && (
          <Badge bg="secondary" className="mb-2">
            {book.category.name}
          </Badge>
        )}
        <Card.Text className="mt-2">
          <small className="text-muted">
            {t('books.card.availableCopies')}: <strong>{book.available_copies}</strong>
          </small>
        </Card.Text>
        <Button
          variant="primary"
          onClick={() => navigate(`/books/${book.id}`)}
          className="w-100"
        >
          {t('books.card.moreInfo')}
        </Button>
      </Card.Body>
    </Card>
  );
};

