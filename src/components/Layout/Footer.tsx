import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-light mt-auto py-4">
      <Container>
        <p className="text-center text-muted mb-0">
          {t('footer.copyright')}
        </p>
      </Container>
    </footer>
  );
};

