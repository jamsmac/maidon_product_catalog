import React from 'react';
import { Helmet } from 'react-helmet';
import { generateSEOMetaTags, generateProductStructuredData, generateFAQStructuredData, generateVideoStructuredData } from '../utils/seo';

const SEOHead = ({ 
  product, 
  faqs = [], 
  videoData = null, 
  customTitle = '', 
  customDescription = '', 
  customKeywords = '',
  canonicalUrl = '',
  noIndex = false 
}) => {
  const seoData = product ? generateSEOMetaTags(product) : {};
  const title = customTitle || seoData?.title || 'MYDON - Промышленное оборудование';
  const description = customDescription || seoData?.description || 'Каталог промышленного оборудования MYDON. Погрузчики, складская техника, запчасти и сервис.';
  const keywords = customKeywords || seoData?.keywords || 'промышленное оборудование, погрузчики, складская техника, MYDON';

  // Generate structured data
  const productStructuredData = product ? generateProductStructuredData(product) : null;
  const faqStructuredData = faqs?.length > 0 ? generateFAQStructuredData(faqs) : null;
  const videoStructuredData = videoData ? generateVideoStructuredData(videoData) : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="author" content="MYDON" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ru" />
      <meta name="geo.region" content="UZ" />
      <meta name="geo.placename" content="Узбекистан" />
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {!canonicalUrl && typeof window !== 'undefined' && (
        <link rel="canonical" href={window.location?.href?.split('?')?.[0]} />
      )}
      {/* Open Graph Tags */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={seoData?.ogTitle || title} />
      <meta property="og:description" content={seoData?.ogDescription || description} />
      <meta property="og:image" content={seoData?.ogImage || '/assets/images/default-og-image.jpg'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location?.href : ''} />
      <meta property="og:site_name" content="MYDON" />
      <meta property="og:locale" content="ru_RU" />
      {/* Product specific Open Graph */}
      {product && (
        <>
          <meta property="product:price:amount" content={product?.basePrice} />
          <meta property="product:price:currency" content="UZS" />
          <meta property="product:availability" content={product?.availability?.inStock ? "in stock" : "out of stock"} />
          <meta property="product:brand" content="MYDON" />
          <meta property="product:category" content="Промышленное оборудование" />
          <meta property="product:condition" content="new" />
        </>
      )}
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@MYDON_official" />
      <meta name="twitter:creator" content="@MYDON_official" />
      <meta name="twitter:title" content={seoData?.twitterTitle || title} />
      <meta name="twitter:description" content={seoData?.twitterDescription || description} />
      <meta name="twitter:image" content={seoData?.twitterImage || '/assets/images/default-og-image.jpg'} />
      <meta name="twitter:image:alt" content={product?.name || 'MYDON промышленное оборудование'} />
      {/* Additional Meta Tags for E-commerce */}
      <meta name="price" content={product?.basePrice} />
      <meta name="priceCurrency" content="UZS" />
      <meta name="availability" content={product?.availability?.inStock ? "InStock" : "OutOfStock"} />
      <meta name="category" content="Промышленное оборудование" />
      {/* Structured Data */}
      {productStructuredData && (
        <script type="application/ld+json">
          {productStructuredData}
        </script>
      )}
      {faqStructuredData && (
        <script type="application/ld+json">
          {faqStructuredData}
        </script>
      )}
      {videoStructuredData && (
        <script type="application/ld+json">
          {videoStructuredData}
        </script>
      )}
      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MYDON",
          "url": "https://mydon.uz",
          "logo": "https://mydon.uz/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+998-78-XXX-XX-XX",
            "contactType": "customer service",
            "areaServed": "UZ",
            "availableLanguage": "ru"
          },
          "sameAs": [
            "https://facebook.com/mydon",
            "https://instagram.com/mydon",
            "https://youtube.com/mydon"
          ]
        })}
      </script>
      {/* Website Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MYDON",
          "url": "https://mydon.uz",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://mydon.uz/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      {/* Preload critical resources */}
      <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead;