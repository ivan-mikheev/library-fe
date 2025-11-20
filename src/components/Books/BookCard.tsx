import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { BookListResponse } from '../../types/api';

interface BookCardProps {
  book: BookListResponse;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

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
            Доступно экземпляров: <strong>{book.available_copies}</strong>
          </small>
        </Card.Text>
        <Button
          variant="primary"
          onClick={() => navigate(`/books/${book.id}`)}
          className="w-100"
        >
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};

