import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Icon from '../AppIcon';

import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Продукция',
      labelEn: 'Products',
      path: '/product-detail',
      icon: 'Package',
      tooltip: 'Каталог промышленного оборудования'
    },
    {
      label: 'Конфигуратор',
      labelEn: 'Configurator',
      path: '/product-configurator',
      icon: 'Settings',
      tooltip: 'Настройка параметров оборудования'
    },
    {
      label: 'Запрос цены',
      labelEn: 'Quote Request',
      path: '/quote-request',
      icon: 'FileText',
      tooltip: 'Запрос коммерческого предложения'
    },
    {
      label: 'Сервис',
      labelEn: 'Service',
      path: '/service-scheduling',
      icon: 'Wrench',
      tooltip: 'Планирование технического обслуживания'
    },
    {
      label: 'Запчасти',
      labelEn: 'Parts',
      path: '/parts-catalog',
      icon: 'Cog',
      tooltip: 'Каталог запасных частей'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-foreground leading-tight">
                MYDON
              </span>
              <span className="font-caption text-xs text-muted-foreground leading-tight">
                Industrial Equipment
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-body font-medium
                  transition-all duration-200 ease-out-custom
                  ${isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-sm'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  strokeWidth={2}
                  className={isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            <Icon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              strokeWidth={2}
            />
          </Button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40">
            <nav className="flex flex-col p-6 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-body font-medium
                    transition-all duration-200 ease-out-custom
                    ${isActiveRoute(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-elevation-sm'
                      : 'text-foreground hover:bg-muted active:bg-muted/80'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    strokeWidth={2}
                    className={isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground'}
                  />
                  <div className="flex flex-col">
                    <span>{item?.label}</span>
                    <span className="text-xs opacity-70 font-caption">
                      {item?.tooltip}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;