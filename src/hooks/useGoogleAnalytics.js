import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Skip initialization in non-production environments
    if (import.meta.env?.MODE !== 'production' && 
        import.meta.env?.VITE_GA_DEBUG !== 'true') return;

    // Initialize gtag.js if not already done
    if (!window.dataLayer) {
      // Load gtag.js script dynamically
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env?.VITE_GOOGLE_ANALYTICS_ID}`;
      script.async = true;
      document.head?.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer?.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      
      // Configuration with enhanced features
      gtag('config', import.meta.env?.VITE_GOOGLE_ANALYTICS_ID, {
        // Enable enhanced measurement
        enhanced_measurement_scroll: true,
        enhanced_measurement_outbound_clicks: true,
        enhanced_measurement_site_search: true,
        enhanced_measurement_video_engagement: true,
        enhanced_measurement_file_downloads: true,
        
        // Debug mode for development
        debug_mode: import.meta.env?.VITE_GA_DEBUG === 'true',
        
        // Cookie settings
        anonymize_ip: true,
        cookie_expires: 63072000, // 2 years
        
        // Custom parameters
        custom_map: {
          'custom_parameter_1': 'user_engagement_level',
          'custom_parameter_2': 'product_interest_score'
        }
      });

      // Set up global site tag properties
      gtag('set', {
        'cookie_flags': 'SameSite=None;Secure',
        'currency': 'UZS',
        'country': 'RU',
        'language': 'ru'
      });
    }

    // Send page_view event on route changes
    if (window.gtag) {
      // Enhanced page view tracking
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location?.href,
        page_path: location?.pathname + location?.search,
        content_group1: 'Product Catalog', // Site section
        content_group2: getPageCategory(location?.pathname), // Page category
        custom_parameter_1: 'page_view',
        send_to: import.meta.env?.VITE_GOOGLE_ANALYTICS_ID
      });

      // Track page timing
      window.gtag('event', 'timing_complete', {
        name: 'page_load',
        value: Math.round(performance.now())
      });
    }
  }, [location]);

  // Helper function to determine page category
  const getPageCategory = (pathname) => {
    if (pathname?.includes('/product-detail')) return 'Product Detail';
    if (pathname?.includes('/product-comparison')) return 'Product Comparison';
    if (pathname?.includes('/financing-calculator')) return 'Financing';
    if (pathname?.includes('/parts-catalog')) return 'Parts Catalog';
    if (pathname?.includes('/service-scheduling')) return 'Service';
    if (pathname?.includes('/equipment-dashboard')) return 'Dashboard';
    if (pathname?.includes('/quote-request')) return 'Quote Request';
    if (pathname?.includes('/product-configurator')) return 'Product Configurator';
    return 'General';
  };
}

// Hook for tracking user engagement
export function useEngagementTracking() {
  useEffect(() => {
    let engagementStartTime = Date.now();
    let isEngaged = true;

    // Track time on page
    const trackTimeOnPage = () => {
      if (isEngaged && window.gtag && import.meta.env?.MODE === 'production') {
        const timeSpent = Math.round((Date.now() - engagementStartTime) / 1000);
        
        window.gtag('event', 'user_engagement', {
          engagement_time_msec: timeSpent * 1000,
          page_location: window.location?.href
        });
      }
    };

    // Track when user becomes inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isEngaged = false;
        trackTimeOnPage();
      } else {
        isEngaged = true;
        engagementStartTime = Date.now();
      }
    };

    // Track on page unload
    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      trackTimeOnPage();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}