/**
 * Универсальный обработчик ошибок API
 */
import { useToastErrorHandler } from '../hooks/useToast';

/**
 * Базовый класс ошибки API
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Типы ошибок API
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Сообщения об ошибках для пользователя
 */
export const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Проблемы с подключением к интернету. Проверьте соединение.',
  [ErrorTypes.TIMEOUT]: 'Сервер не отвечает. Попробуйте позже.',
  [ErrorTypes.UNAUTHORIZED]: 'Необходимо авторизоваться для выполнения этого действия.',
  [ErrorTypes.FORBIDDEN]: 'У вас нет прав для выполнения этого действия.',
  [ErrorTypes.NOT_FOUND]: 'Запрашиваемый ресурс не найден.',
  [ErrorTypes.VALIDATION]: 'Проверьте правильность введенных данных.',
  [ErrorTypes.SERVER]: 'Временные технические проблемы. Попробуйте позже.',
  [ErrorTypes.UNKNOWN]: 'Произошла неизвестная ошибка. Свяжитесь с поддержкой.'
};

/**
 * Определяет тип ошибки по HTTP статусу
 * @param {number} status - HTTP статус код
 * @returns {string} тип ошибки
 */
export const getErrorType = (status) => {
  if (status === 400) return ErrorTypes.VALIDATION;
  if (status === 401) return ErrorTypes.UNAUTHORIZED;
  if (status === 403) return ErrorTypes.FORBIDDEN;
  if (status === 404) return ErrorTypes.NOT_FOUND;
  if (status >= 500) return ErrorTypes.SERVER;
  return ErrorTypes.UNKNOWN;
};

/**
 * Обработчик ответа API
 * @param {Response} response - ответ fetch
 * @returns {Promise<any>} обработанные данные или ошибка
 */
export const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  // Для успешных ответов сразу возвращаем данные
  if (response.ok) {
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // Для ошибок парсим данные об ошибке
  let errorData = null;
  try {
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    }
  } catch (e) {
    // Игнорируем ошибки парсинга
  }

  const errorType = getErrorType(response.status);
  const message = errorData?.message || ErrorMessages[errorType];

  throw new APIError(message, response.status, errorData);
};

/**
 * Обертка для API вызовов с обработкой ошибок
 * @param {Function} apiCall - функция API вызова
 * @param {Object} options - опции обработки ошибок
 * @returns {Promise<any>} результат API вызова или ошибка
 */
export const withErrorHandling = async (apiCall, options = {}) => {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 10000,
    onRetry = null,
    onError = null
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Создаем AbortController для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await apiCall(controller.signal);
      clearTimeout(timeoutId);

      // Обрабатываем успешный ответ
      return await handleApiResponse(response);

    } catch (error) {
      lastError = error;

      // Определяем, стоит ли повторять попытку
      const shouldRetry = attempt < retries && (
        error.name === 'AbortError' || // Таймаут
        error.status >= 500 || // Серверные ошибки
        !error.status // Сетевые ошибки
      );

      if (shouldRetry) {
        if (onRetry) {
          onRetry(attempt + 1, error);
        }

        // Ждем перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      break;
    }
  }

  // Если все попытки исчерпаны, обрабатываем финальную ошибку
  if (lastError instanceof APIError) {
    if (onError) {
      onError(lastError);
    }
    throw lastError;
  }

  // Для сетевых ошибок или других исключений
  const networkError = new APIError(
    ErrorMessages[ErrorTypes.NETWORK],
    0,
    { originalError: lastError.message }
  );

  if (onError) {
    onError(networkError);
  }

  throw networkError;
};

/**
 * Хук для обработки ошибок в компонентах
 * @param {Object} options - опции обработки
 * @returns {Object} объект с методами обработки ошибок
 */
export const useApiErrorHandler = (options = {}) => {
  const { showApiError } = useToastErrorHandler();
  const {
    showToast = true,
    logError = true,
    onError = null
  } = options;

  const handleError = (error) => {
    // Логируем ошибку
    if (logError) {
      console.error('API Error:', {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
    }

    // Показываем уведомление пользователю через Toast
    if (showToast) {
      showApiError(error);
    }

    // Вызываем пользовательский обработчик
    if (onError) {
      onError(error);
    }

    return error;
  };

  const wrapApiCall = (apiCall, callOptions = {}) => {
    return withErrorHandling(apiCall, {
      ...options,
      ...callOptions,
      onError: (error) => {
        handleError(error);
        if (callOptions.onError) {
          callOptions.onError(error);
        }
      }
    });
  };

  return {
    handleError,
    wrapApiCall,
    withErrorHandling: (call, opts) => wrapApiCall(call, opts)
  };
};

/**
 * Маппер ошибок формы для react-hook-form
 * @param {APIError} error - ошибка API
 * @returns {Object} объект ошибок формы
 */
export const mapApiErrorToForm = (error) => {
  if (!error.data?.errors) return {};

  const formErrors = {};

  // Предполагаем, что ошибки валидации приходят в формате
  // { field: ['error message'] } или { field: 'error message' }
  Object.entries(error.data.errors).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;
    formErrors[field] = { message };
  });

  return formErrors;
};
