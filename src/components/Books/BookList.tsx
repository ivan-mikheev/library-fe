import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { apiClient } from '../../api/client';
import type { BookListResponse, CategoryResponse } from '../../types/api';
import { BookCard } from './BookCard';

export const BookList: React.FC = () => {
  const [books, setBooks] = useState<BookListResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.getBooks({
        category_id: selectedCategory || undefined,
        limit: 100,
      });
      setBooks(data);
    } catch (err: any) {
      setError('Ошибка загрузки книг. Попробуйте обновить страницу.');
      console.error('Ошибка загрузки книг:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Каталог книг</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Фильтр по категории</Form.Label>
            <Form.Select
              value={selectedCategory || ''}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)
              }
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      ) : books.length === 0 ? (
        <Alert variant="info">Книги не найдены</Alert>
      ) : (
        <Row>
          {books.map((book) => (
            <Col key={book.id} md={6} lg={4} className="mb-4">
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

