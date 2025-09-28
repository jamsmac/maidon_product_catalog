/**
 * Sentry error monitoring integration for MYDON Product Catalog
 */

import { APIError, ErrorTypes } from './apiErrorHandler';

// Configuration
const SENTRY_CONFIG = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  sampleRate: import.meta.env.MODE === 'production' ? 1.0 : 0.1,
  enableTracing: false,
  debug: import.meta.env.MODE === 'development',
};

/**
 * Initialize Sentry error monitoring
 * Call this in main application entry point
 */
export const initSentry = async () => {
  // Only initialize in production or if explicitly enabled
  if (!SENTRY_CONFIG.dsn || import.meta.env.MODE === 'development') {
    console.log('Sentry: Skipped initialization (dev mode or no DSN)');
    return null;
  }

  try {
    // Dynamic import to avoid bundle bloat in development
    const Sentry = await import('@sentry/react');

    Sentry.init({
      dsn: SENTRY_CONFIG.dsn,
      environment: SENTRY_CONFIG.environment,
      release: SENTRY_CONFIG.release,

      // Sampling configuration
      sampleRate: SENTRY_CONFIG.sampleRate,
      enableTracing: SENTRY_CONFIG.enableTracing,
      tracesSampleRate: 0.1,

      // Error boundary integration
      attachErrorBoundaryError: true,

      // Additional context
      beforeSend: (event, hint) => {
        // Add custom context for API errors
        const error = hint.originalException;
        if (error instanceof APIError) {
          event.tags = {
            ...event.tags,
            error_type: 'api_error',
            http_status: error.status,
          };

          event.extra = {
            ...event.extra,
            api_endpoint: error.endpoint,
            request_data: error.requestData,
            response_data: error.data,
          };
        }

        return event;
      },

      // Integrations
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: [
            /^https:\/\/api\.mydon\.uz/,
            /^http:\/\/localhost:3001/
          ],
        }),

        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Ignore certain errors
      ignoreErrors: [
        'ChunkLoadError',
        'Loading chunk',
        'Network Error',
        'Failed to fetch',
        'Promise',
      ],

      // Custom error filtering
      beforeBreadcrumb: (breadcrumb, hint) => {
        // Filter out excessive console logs in production
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null;
        }

        return breadcrumb;
      },
    });

    console.log(`✅ Sentry initialized in ${SENTRY_CONFIG.environment} mode`);
    return Sentry;

  } catch (error) {
    console.warn('Failed to initialize Sentry:', error);
    return null;
  }
};

/**
 * Capture a custom error with additional context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context data
 */
export const captureError = (error, context = {}) => {
  if (window.Sentry && typeof window.Sentry.captureException === 'function') {
    window.Sentry.withScope((scope) => {
      // Add context tags
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'string') {
          scope.setTag(key, value);
        } else {
          scope.setContext(key, value);
        }
      });

      window.Sentry.captureException(error);
    });
  } else {
    // Fallback to console in development
    console.error('Error captured:', error, context);
  }
};

/**
 * Capture a custom message
 * @param {string} message - Message to capture
 * @param {string} level - Severity level (error, warning, info)
 * @param {Object} context - Additional context
 */
export const captureMessage = (message, level = 'info', context = {}) => {
  if (window.Sentry && typeof window.Sentry.captureMessage === 'function') {
    window.Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'string') {
          scope.setTag(key, value);
        } else {
          scope.setContext(key, value);
        }
      });

      window.Sentry.captureMessage(message, level);
    });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
  }
};

/**
 * Set user context for error tracking
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (window.Sentry && typeof window.Sentry.setUser === 'function') {
    window.Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
      role: user.role,
      company: user.company,
    });
  }
};

/**
 * Clear user context
 */
export const clearUser = () => {
  if (window.Sentry && typeof window.Sentry.setUser === 'function') {
    window.Sentry.setUser(null);
  }
};

/**
 * Add breadcrumb for debugging
 * @param {string} category - Breadcrumb category
 * @param {string} message - Breadcrumb message
 * @param {Object} data - Additional data
 */
export const addBreadcrumb = (category, message, data = {}) => {
  if (window.Sentry && typeof window.Sentry.addBreadcrumb === 'function') {
    window.Sentry.addBreadcrumb({
      category,
      message,
      data,
      level: 'info',
    });
  }
};

/**
 * Performance monitoring helper
 * @param {string} operation - Operation name
 * @param {Function} fn - Function to monitor
 * @returns {*} Function result
 */
export const withPerformanceMonitoring = async (operation, fn) => {
  const start = performance.now();

  try {
    addBreadcrumb('performance', `Starting ${operation}`);
    const result = await fn();
    addBreadcrumb('performance', `Completed ${operation}`, {
      duration: performance.now() - start,
    });
    return result;
  } catch (error) {
    captureError(error, {
      operation,
      duration: performance.now() - start,
    });
    throw error;
  }
};

/**
 * API error handler with Sentry integration
 * @param {APIError} apiError - API error object
 * @param {Object} requestContext - Request context
 */
export const handleApiError = (apiError, requestContext = {}) => {
  captureError(apiError, {
    ...requestContext,
    error_type: ErrorTypes[
      apiError.status === 400 ? 'VALIDATION' :
      apiError.status === 401 ? 'UNAUTHORIZED' :
      apiError.status === 403 ? 'FORBIDDEN' :
      apiError.status === 404 ? 'NOT_FOUND' :
      apiError.status >= 500 ? 'SERVER' :
      'UNKNOWN'
    ],
  });
};

/**
 * Sentry React Error Boundary component
 */
export const SentryErrorBoundary = ({ children, fallback }) => {
  // Only use Sentry boundary if Sentry is available
  if (window.Sentry && typeof window.Sentry.ErrorBoundary === 'function') {
    return (
      <window.Sentry.ErrorBoundary
        fallback={fallback || <ErrorFallback />}
        showDialog={false}
      >
        {children}
      </window.Sentry.ErrorBoundary>
    );
  }

  return children;
};

/**
 * Default error fallback component
 */
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 max-w-md">
      <div className="text-red-500 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Что-то пошло не так
      </h1>
      <p className="text-gray-600 mb-6">
        Произошла неожиданная ошибка. Наши разработчики уже уведомлены.
      </p>
      <div className="space-y-3">
        <button
          onClick={resetError}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
      {import.meta.env.DEV && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">Детали ошибки</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

/**
 * Check if Sentry is available
 */
export const isSentryAvailable = () => {
  return !!(window.Sentry && typeof window.Sentry.captureException === 'function');
};

export default {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  withPerformanceMonitoring,
  handleApiError,
  SentryErrorBoundary,
  isSentryAvailable,
};
