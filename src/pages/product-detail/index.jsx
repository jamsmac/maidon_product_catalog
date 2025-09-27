import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SEOHead from '../../components/SEOHead';
import Header from '../../components/ui/Header';
import { useGoogleAnalytics, useEngagementTracking } from '../../hooks/useGoogleAnalytics';
import { analytics } from '../../utils/analytics';

import MediaGallery from './components/MediaGallery';
import PricingSection from './components/PricingSection';
import ProductConfigurator from './components/ProductConfigurator';
import ProductHero from './components/ProductHero';
import SpecificationsTable from './components/SpecificationsTable';
import StickyCTAPanel from './components/StickyCTAPanel';


const ProductDetail = () => {
  const navigate = useNavigate();
  const [configuration, setConfiguration] = useState(null);
  const [configuredPrice, setConfiguredPrice] = useState(null);

  // Initialize analytics
  useGoogleAnalytics();
  useEngagementTracking();

  // Mock product data
  const productData = {
    id: "forklift-ep25",
    name: "Электропогрузчик EP25",
    modelCode: "EP25-48V-LI",
    rating: 4.7,
    reviewCount: 143,
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop",
    badges: [
      { type: 'new', label: 'Новинка' },
      { type: 'top-seller', label: 'Хит продаж' }
    ],
    keyFeatures: [
      { icon: 'Weight', label: 'Грузоподъемность', value: '2.5 т' },
      { icon: 'ArrowUp', label: 'Высота подъема', value: '3.0 м' },
      { icon: 'Battery', label: 'Тип батареи', value: 'Li-Ion' },
      { icon: 'Shield', label: 'Гарантия', value: '3 года' }
    ],
    availability: {
      inStock: true,
      status: 'В наличии на складе',
      deliveryTime: '3-5 рабочих дней'
    },
    basePrice: 2850000,
    pricing: {
      retail: 2850000,
      wholesale: 2565000,
      wholesaleMinQty: 3,
      discount: {
        type: 'amount',
        amount: 285000,
        description: 'Специальная цена до конца месяца',
        validUntil: '2025-10-31'
      },
      paymentOptions: [
        {
          name: 'Наличный расчет',
          description: 'Оплата при получении',
          icon: 'Banknote'
        },
        {
          name: 'Банковский перевод',
          description: 'Безналичная оплата',
          icon: 'CreditCard'
        },
        {
          name: 'Лизинг',
          description: 'Финансовая аренда',
          icon: 'Calculator',
          monthlyPayment: 95000,
          term: 36
        },
        {
          name: 'Рассрочка',
          description: 'Без переплат',
          icon: 'Calendar',
          monthlyPayment: 142500,
          term: 24
        }
      ],
      additionalCosts: [
        { name: 'Доставка по Узбекистану', price: 15000 },
        { name: 'Монтаж и настройка', price: 25000 },
        { name: 'Обучение персонала', note: 'Бесплатно' },
        { name: 'Техосмотр (первый год)', note: 'Включено' }
      ]
    }
  };

  const mediaData = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1200&h=800&fit=crop',
      alt: 'Электропогрузчик EP25 - основной вид',
      description: 'Общий вид электропогрузчика'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
      alt: 'Электропогрузчик EP25 - вид сбоку',
      description: 'Боковой вид с поднятой мачтой'
    },
    {
      type: 'video',
      url: 'https://example.com/video.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop',
      alt: 'Видео работы электропогрузчика',
      description: 'Демонстрация работы в складских условиях'
    },
    {
      type: '360',
      url: 'https://example.com/360-view',
      thumbnail: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1200&h=800&fit=crop',
      alt: '360° обзор электропогрузчика',
      description: 'Интерактивный 360° обзор'
    },
    {
      type: '3d',
      url: 'https://example.com/3d-model.glb',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
      alt: '3D модель электропогрузчика',
      description: '3D модель для детального изучения'
    }
  ];

  const specificationsData = [
    {
      category: 'general',
      name: 'Общие характеристики',
      icon: 'Info',
      specs: [
        { name: 'Модель', value: 'EP25-48V-LI', type: 'text' },
        { name: 'Тип', value: 'Электропогрузчик', type: 'text' },
        { name: 'Грузоподъемность', value: '2500', unit: 'кг', type: 'number', important: true },
        { name: 'Центр тяжести груза', value: '500', unit: 'мм', type: 'number' },
        { name: 'Высота подъема', value: '3000', unit: 'мм', type: 'number', important: true },
        { name: 'Свободный ход', value: '150', unit: 'мм', type: 'number' }
      ]
    },
    {
      category: 'performance',
      name: 'Рабочие характеристики',
      icon: 'Zap',
      specs: [
        { name: 'Скорость передвижения с грузом', value: '12', unit: 'км/ч', type: 'number' },
        { name: 'Скорость передвижения без груза', value: '14', unit: 'км/ч', type: 'number' },
        { name: 'Скорость подъема с грузом', value: '0.45', unit: 'м/с', type: 'number' },
        { name: 'Скорость опускания с грузом', value: '0.55', unit: 'м/с', type: 'number' },
        { name: 'Преодолеваемый уклон с грузом', value: '15', unit: '%', type: 'number' },
        { name: 'Время работы', value: '8-10', unit: 'часов', type: 'range', min: 8, max: 10, optimal: 9 }
      ]
    },
    {
      category: 'dimensions',
      name: 'Габаритные размеры',
      icon: 'Maximize',
      specs: [
        { name: 'Длина до передней поверхности вил', value: '2540', unit: 'мм', type: 'number' },
        { name: 'Ширина', value: '1150', unit: 'мм', type: 'number' },
        { name: 'Высота по защитному козырьку', value: '2100', unit: 'мм', type: 'number' },
        { name: 'Колесная база', value: '1420', unit: 'мм', type: 'number' },
        { name: 'Дорожный просвет', value: '110', unit: 'мм', type: 'number' },
        { name: 'Радиус поворота', value: '2100', unit: 'мм', type: 'number' }
      ]
    },
    {
      category: 'power',
      name: 'Энергосистема',
      icon: 'Battery',
      specs: [
        { name: 'Тип батареи', value: 'Литий-ионная', type: 'text', important: true },
        { name: 'Напряжение', value: '48', unit: 'В', type: 'number' },
        { name: 'Емкость', value: '420', unit: 'Ач', type: 'number' },
        { name: 'Время зарядки', value: '2-3', unit: 'часа', type: 'range', min: 2, max: 3 },
        { name: 'Мощность двигателя привода', value: '8.5', unit: 'кВт', type: 'number' },
        { name: 'Мощность гидромотора', value: '11', unit: 'кВт', type: 'number' }
      ]
    },
    {
      category: 'safety',
      name: 'Системы безопасности',
      icon: 'Shield',
      specs: [
        { name: 'Защитный козырек', value: true, type: 'boolean' },
        { name: 'Система контроля устойчивости', value: true, type: 'boolean', important: true },
        { name: 'Автоматическое торможение', value: true, type: 'boolean' },
        { name: 'Звуковой сигнал заднего хода', value: true, type: 'boolean' },
        { name: 'LED освещение', value: true, type: 'boolean' },
        { name: 'Аварийное отключение', value: true, type: 'boolean' },
        { name: 'Сертификаты', type: 'list', values: ['CE', 'EAC', 'ISO 9001', 'ГОСТ Р'] }
      ]
    },
    {
      category: 'comfort',
      name: 'Комфорт оператора',
      icon: 'User',
      specs: [
        { name: 'Эргономичное сиденье', value: true, type: 'boolean' },
        { name: 'Регулировка сиденья', value: true, type: 'boolean' },
        { name: 'Многофункциональный дисплей', value: true, type: 'boolean', important: true },
        { name: 'Джойстик управления', value: true, type: 'boolean' },
        { name: 'Подлокотники', value: true, type: 'boolean' },
        { name: 'Амортизация сиденья', value: true, type: 'boolean' },
        { name: 'Уровень шума', value: '68', unit: 'дБ', type: 'number', note: 'При работе' }
      ]
    }
  ];

  // FAQ data for structured data
  const faqData = [
    {
      question: "Какая гарантия на электропогрузчик EP25?",
      answer: "На электропогрузчик EP25 предоставляется гарантия 3 года с возможностью расширения. Гарантия включает бесплатное техническое обслуживание и замену запчастей."
    },
    {
      question: "Какое время зарядки батареи?",
      answer: "Литий-ионная батарея заряжается за 2-3 часа до 100%. Поддерживается быстрая зарядка и возможность подзарядки во время коротких перерывов."
    },
    {
      question: "Доступна ли доставка и установка?",
      answer: "Да, мы предоставляем услуги доставки по всему Узбекистану, монтажа, пуско-наладки и обучения персонала. Доставка бесплатная при заказе от 30 млн UZS."
    }
  ];

  // Get video data for structured data
  const videoData = mediaData?.find(item => item?.type === 'video');

  const handleWishlistToggle = (isWishlisted) => {
    console.log('Wishlist toggled:', isWishlisted);
  };

  const handleCompareToggle = (isCompared) => {
    console.log('Compare toggled:', isCompared);
  };

  const handleQuoteRequest = () => {
    // Track analytics
    analytics?.trackQuoteRequest(productData, configuredPrice);
    
    navigate('/quote-request', { 
      state: { 
        product: productData,
        configuration: configuration,
        configuredPrice: configuredPrice
      }
    });
  };

  const handleCTAAction = (action) => {
    switch (action) {
      case 'buy': 
        analytics?.trackBuyNow(productData, configuration);
        console.log('Buy action triggered');
        break;
      case 'lease': 
        analytics?.trackLeasingCalculator(productData?.id, productData?.pricing?.paymentOptions?.find(p => p?.name === 'Лизинг'));
        console.log('Lease action triggered');
        break;
      case 'quote':
        handleQuoteRequest();
        break;
      case 'demo': analytics?.trackDemoBooking(productData?.id,'product_demo');
        navigate('/service-scheduling', { state: { serviceType: 'demo', product: productData } });
        break;
      case 'contact': analytics?.trackFormSubmission('contact_form', productData?.id, 0);
        console.log('Contact action triggered');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfigurationChange = (newConfiguration, newPrice) => {
    setConfiguration(newConfiguration);
    setConfiguredPrice(newPrice);
  };

  const handleMediaInteraction = (mediaType, mediaUrl) => {
    analytics?.trackMediaView(mediaType, mediaUrl, productData?.id);
  };

  const handleSpecificationTabOpen = (tabName) => {
    analytics?.trackSpecsTab(productData?.id, tabName);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track product view
    analytics?.trackProductView(productData);
    
    // Reset scroll tracking for new page
    analytics?.resetScrollTracking();
  }, []);

  return (
    <>
      {/* SEO Head with complete metadata */}
      <SEOHead 
        product={productData}
        faqs={faqData}
        videoData={videoData}
        canonicalUrl={typeof window !== 'undefined' ? window.location?.href?.split('?')?.[0] : ''}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          {/* Schema.org structured data for breadcrumb */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Главная",
                  "item": "https://mydon.ru"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Каталог",
                  "item": "https://mydon.ru/catalog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Погрузчики",
                  "item": "https://mydon.ru/catalog/forklifts"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": productData?.name,
                  "item": typeof window !== 'undefined' ? window.location?.href : ''
                }
              ]
            })}
          </script>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Product Hero Section with semantic HTML */}
            <article itemScope itemType="https://schema.org/Product">
              <header>
                <ProductHero
                  product={productData}
                  onWishlistToggle={handleWishlistToggle}
                  onCompareToggle={handleCompareToggle}
                />
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <section className="lg:col-span-2 space-y-8">
                  {/* Media Gallery */}
                  <MediaGallery 
                    media={mediaData} 
                    onMediaInteraction={handleMediaInteraction}
                  />

                  {/* Product Configurator */}
                  <ProductConfigurator
                    baseProduct={productData}
                    onConfigurationChange={handleConfigurationChange}
                    onConfigurationStart={() => analytics?.trackConfiguratorStart(productData?.id)}
                  />

                  {/* Specifications Table */}
                  <SpecificationsTable 
                    specifications={specificationsData}
                    onTabOpen={handleSpecificationTabOpen}
                  />

                  {/* FAQ Section for SEO */}
                  <section className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                      Часто задаваемые вопросы
                    </h2>
                    <div className="space-y-4">
                      {faqData?.map((faq, index) => (
                        <details key={index} className="group">
                          <summary className="flex justify-between items-center cursor-pointer p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                            <h3 className="font-medium text-foreground">{faq?.question}</h3>
                            <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                          </summary>
                          <div className="mt-2 p-3 text-muted-foreground">
                            <p>{faq?.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                </section>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  {/* Pricing Section */}
                  <PricingSection
                    pricing={productData?.pricing}
                    onQuoteRequest={handleQuoteRequest}
                  />

                  {/* Additional Information Cards */}
                  <div className="space-y-6">
                    {/* Delivery Information */}
                    <div className="bg-card rounded-lg border border-border p-4">
                      <h3 className="font-heading font-semibold text-foreground mb-3">
                        Информация о доставке
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-muted-foreground">Бесплатная доставка от 30 млн UZS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-muted-foreground">Доставка по всему Узбекистану</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-muted-foreground">Монтаж и пуско-наладка</span>
                        </div>
                      </div>
                    </div>

                    {/* Warranty Information */}
                    <div className="bg-card rounded-lg border border-border p-4">
                      <h3 className="font-heading font-semibold text-foreground mb-3">
                        Гарантия и сервис
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">Гарантия 3 года</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">Сервисная поддержка 24/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">Оригинальные запчасти</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </main>
        {/* Sticky CTA Panel */}
        <StickyCTAPanel
          product={productData}
          onAction={handleCTAAction}
        />
      </div>
    </>
  );
};

export default ProductDetail;
