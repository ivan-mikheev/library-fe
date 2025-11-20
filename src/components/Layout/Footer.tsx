import React from 'react';
import { Container } from 'react-bootstrap';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-light mt-auto py-4">
      <Container>
        <p className="text-center text-muted mb-0">
          © 2025 Библиотека. Система управления библиотекой.
        </p>
      </Container>
    </footer>
  );
};

