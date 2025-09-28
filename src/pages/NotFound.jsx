import Button from '@components/ui/Button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          </div>
        </div>

        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">Страница не найдена</h2>
        <p className="text-muted-foreground mb-8">
          Запрашиваемая страница не найдена. Вернёмся на главный экран.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => window.history?.back()}
          >
            Назад
          </Button>

          <Button
            variant="outline"
            iconName="Home"
            iconPosition="left"
            onClick={handleGoHome}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
