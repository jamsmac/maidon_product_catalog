// Analytics utilities for MYDON product catalog
class AnalyticsTracker {
  constructor() {
    this.isInitialized = false;
    this.scrollThresholds = [25, 50, 75, 100];
    this.scrollTriggered = new Set();
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      this.setupScrollTracking();
      this.isInitialized = true;
    }
  }

  // Check if analytics is available
  isAvailable() {
    return typeof window !== 'undefined' && 
           typeof window.gtag !== 'undefined' && 
           import.meta.env?.MODE === 'production';
  }

  // Track product view
  trackProductView(product) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'view_product', {
      event_category: 'ecommerce',
      event_label: product?.name,
      product_id: product?.id,
      product_name: product?.name,
      product_category: 'equipment',
      product_brand: 'MYDON',
      product_price: product?.basePrice,
      custom_map: {
        custom_parameter_1: 'product_model',
        custom_parameter_2: 'availability_status'
      },
      product_model: product?.modelCode,
      availability_status: product?.availability?.inStock ? 'in_stock' : 'out_of_stock'
    });

    // Enhanced ecommerce event
    window.gtag('event', 'view_item', {
      currency: 'UZS',
      value: product?.basePrice,
      items: [{
        item_id: product?.id,
        item_name: product?.name,
        item_category: 'equipment',
        item_brand: 'MYDON',
        price: product?.basePrice,
        quantity: 1
      }]
    });
  }

  // Track media interactions
  trackMediaView(mediaType, mediaUrl, productId) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'view_media', {
      event_category: 'engagement',
      event_label: mediaType,
      media_type: mediaType,
      media_url: mediaUrl,
      product_id: productId,
      engagement_time_msec: Date.now()
    });
  }

  // Track specifications tab opening
  trackSpecsTab(productId, tabName) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'open_tab_specs', {
      event_category: 'engagement',
      event_label: tabName,
      product_id: productId,
      tab_name: tabName,
      interaction_type: 'tab_open'
    });
  }

  // Track configurator start
  trackConfiguratorStart(productId) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'start_config', {
      event_category: 'ecommerce',
      event_label: 'product_configurator',
      product_id: productId,
      funnel_step: 'configuration_start'
    });
  }

  // Track quote request
  trackQuoteRequest(product, configuredPrice) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'add_to_quote', {
      event_category: 'ecommerce',
      event_label: 'quote_request',
      product_id: product?.id,
      product_name: product?.name,
      quote_value: configuredPrice || product?.basePrice,
      currency: 'UZS',
      funnel_step: 'quote_request'
    });

    // Enhanced ecommerce event
    window.gtag('event', 'generate_lead', {
      currency: 'UZS',
      value: configuredPrice || product?.basePrice,
      lead_type: 'quote_request',
      product_interest: product?.name
    });
  }

  // Track leasing calculator
  trackLeasingCalculator(productId, leasingTerms) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'start_leasing_calc', {
      event_category: 'engagement',
      event_label: 'leasing_calculator',
      product_id: productId,
      leasing_term: leasingTerms?.term,
      monthly_payment: leasingTerms?.monthlyPayment,
      total_amount: leasingTerms?.totalAmount
    });
  }

  // Track parts kit addition
  trackPartsKit(productId, kitType, kitValue) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'add_parts_kit', {
      event_category: 'ecommerce',
      event_label: kitType,
      product_id: productId,
      kit_type: kitType,
      kit_value: kitValue,
      currency: 'UZS'
    });
  }

  // Track form submissions (conversions)
  trackFormSubmission(formType, productId, formValue) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'submit_lead', {
      event_category: 'conversion',
      event_label: formType,
      form_type: formType,
      product_id: productId,
      form_value: formValue,
      conversion_id: `${formType}_${Date.now()}`
    });

    // Track as conversion
    window.gtag('event', 'conversion', {
      send_to: import.meta.env?.VITE_GA_CONVERSION_ID,
      value: formValue || 0,
      currency: 'UZS',
      transaction_id: `${formType}_${Date.now()}`
    });
  }

  // Track buy now button
  trackBuyNow(product, selectedOptions) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'buy_now', {
      event_category: 'conversion',
      event_label: 'purchase_intent',
      product_id: product?.id,
      product_name: product?.name,
      purchase_value: product?.basePrice,
      currency: 'UZS',
      purchase_method: 'buy_now'
    });

    // Enhanced ecommerce
    window.gtag('event', 'purchase_intent', {
      currency: 'UZS',
      value: product?.basePrice,
      items: [{
        item_id: product?.id,
        item_name: product?.name,
        item_category: 'equipment',
        price: product?.basePrice,
        quantity: 1
      }]
    });
  }

  // Track demo booking
  trackDemoBooking(productId, demoType) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'book_demo', {
      event_category: 'conversion',
      event_label: demoType,
      product_id: productId,
      demo_type: demoType,
      lead_quality: 'high'
    });
  }

  // Track service request
  trackServiceRequest(serviceType, productId) {
    if (!this.isAvailable()) return;

    window.gtag('event', 'service_request', {
      event_category: 'conversion',
      event_label: serviceType,
      service_type: serviceType,
      product_id: productId,
      request_type: 'service_inquiry'
    });
  }

  // Setup scroll depth tracking
  setupScrollTracking() {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const checkScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement?.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement?.scrollTop;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      this.scrollThresholds?.forEach(threshold => {
        if (scrollPercentage >= threshold && !this.scrollTriggered?.has(threshold)) {
          this.scrollTriggered?.add(threshold);
          
          if (this.isAvailable()) {
            window.gtag('event', 'scroll_depth', {
              event_category: 'engagement',
              event_label: `${threshold}%`,
              scroll_depth: threshold,
              page_location: window.location?.pathname
            });
          }
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkScrollDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reset scroll tracking for new page
  resetScrollTracking() {
    this.scrollTriggered?.clear();
  }
}

// Create singleton instance
export const analytics = new AnalyticsTracker();

// Export individual tracking functions for convenience
export const {
  trackProductView,
  trackMediaView,
  trackSpecsTab,
  trackConfiguratorStart,
  trackQuoteRequest,
  trackLeasingCalculator,
  trackPartsKit,
  trackFormSubmission,
  trackBuyNow,
  trackDemoBooking,
  trackServiceRequest,
  resetScrollTracking
} = analytics;