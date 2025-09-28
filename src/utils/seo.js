// SEO utilities for MYDON product catalog
export const generateProductStructuredData = (product) => {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product?.name || "Товар",
    "model": product?.modelCode,
    "description": `${product?.name} - ${product?.keyFeatures?.map(f => f?.label + ': ' + f?.value)?.join(', ')}`,
    "brand": {
      "@type": "Brand",
      "name": "MYDON"
    },
    "image": [
      product?.image
    ]?.filter(Boolean),
    "sku": product?.id,
    "mpn": product?.modelCode,
    "offers": {
      "@type": "Offer",
      "url": window.location?.href,
      "priceCurrency": "RUB",
      "price": product?.basePrice,
      "priceValidUntil": product?.pricing?.discount?.validUntil || "2025-12-31",
      "availability": product?.availability?.inStock ? "https://schema.org/InStock": "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MYDON"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product?.rating || 4.5,
      "reviewCount": product?.reviewCount || 1
    }
  };

  return JSON.stringify(structuredData);
};

export const generateFAQStructuredData = (faqs) => {
  if (!faqs || faqs?.length === 0) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs?.map(faq => ({
      "@type": "Question",
      "name": faq?.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq?.answer
      }
    }))
  };

  return JSON.stringify(structuredData);
};

export const generateVideoStructuredData = (videoData) => {
  if (!videoData) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": videoData?.alt || "Демонстрация продукта",
    "description": videoData?.description || "Видео демонстрация работы оборудования",
    "thumbnailUrl": videoData?.thumbnail,
    "uploadDate": new Date()?.toISOString(),
    "contentUrl": videoData?.url,
    "embedUrl": videoData?.url
  };

  return JSON.stringify(structuredData);
};

export const generateSEOMetaTags = (product) => {
  const title = `${product?.name} ${product?.modelCode} - Купить по цене ${product?.basePrice?.toLocaleString()} ₽ | MYDON`;
  const description = `${product?.name} ${product?.modelCode}: ${product?.keyFeatures?.slice(0, 3)?.map(f => f?.label + ' ' + f?.value)?.join(', ')}. ✅ В наличии ✅ Гарантия 3 года ✅ Доставка по России. Звоните!`;
  
  return {
    title: title?.length > 70 ? title?.substring(0, 67) + '...' : title,
    description: description?.length > 160 ? description?.substring(0, 157) + '...' : description,
    keywords: `${product?.name}, ${product?.modelCode}, купить, цена, ${product?.keyFeatures?.map(f => f?.label)?.join(', ')}, MYDON`,
    ogTitle: title,
    ogDescription: description,
    ogImage: product?.image,
    ogUrl: window.location?.href,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: product?.image
  };
};