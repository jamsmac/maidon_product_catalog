/**
 * @typedef {Object} ButtonProps
 * @property {string} [variant] - Вариант кнопки (default, destructive, outline, secondary, ghost, link, success, warning, danger)
 * @property {string} [size] - Размер кнопки (default, sm, lg, icon, xs, xl)
 * @property {boolean} [loading] - Состояние загрузки
 * @property {boolean} [disabled] - Отключена ли кнопка
 * @property {boolean} [fullWidth] - Полная ширина
 * @property {string} [iconName] - Название иконки из Lucide React
 * @property {string} [iconPosition] - Позиция иконки (left, right)
 * @property {Function} [onClick] - Обработчик клика
 * @property {React.ReactNode} [children] - Содержимое кнопки
 * @property {string} [className] - Дополнительные CSS классы
 * @property {Object} [props] - Остальные HTML атрибуты
 */

/**
 * @typedef {Object} InputProps
 * @property {string} [type] - Тип input поля
 * @property {string} [placeholder] - Плейсхолдер
 * @property {string} [value] - Значение поля
 * @property {boolean} [disabled] - Отключено ли поле
 * @property {boolean} [required] - Обязательно ли поле
 * @property {string} [className] - Дополнительные CSS классы
 * @property {Function} [onChange] - Обработчик изменения
 * @property {Function} [onBlur] - Обработчик потери фокуса
 * @property {string} [error] - Сообщение об ошибке
 */

/**
 * @typedef {Object} SelectProps
 * @property {string} [value] - Выбранное значение
 * @property {Array.<SelectOption>} options - Массив опций
 * @property {string} [placeholder] - Плейсхолдер
 * @property {boolean} [disabled] - Отключено ли поле
 * @property {boolean} [required] - Обязательно ли поле
 * @property {string} [className] - Дополнительные CSS классы
 * @property {Function} [onChange] - Обработчик изменения
 * @property {string} [error] - Сообщение об ошибке
 */

/**
 * @typedef {Object} SelectOption
 * @property {string} value - Значение опции
 * @property {string} label - Текст опции
 * @property {boolean} [disabled] - Отключена ли опция
 */

/**
 * @typedef {Object} CheckboxProps
 * @property {boolean} [checked] - Отмечено ли поле
 * @property {boolean} [disabled] - Отключено ли поле
 * @property {string} [className] - Дополнительные CSS классы
 * @property {Function} [onChange] - Обработчик изменения
 * @property {React.ReactNode} [children] - Содержимое (обычно текст)
 * @property {string} [error] - Сообщение об ошибке
 */

/**
 * @typedef {Object} ProductCardProps
 * @property {import('./api.types').Product} product - Данные товара
 * @property {boolean} [inCart] - Находится ли товар в корзине
 * @property {boolean} [inWishlist] - Находится ли товар в избранном
 * @property {Function} [onAddToCart] - Обработчик добавления в корзину
 * @property {Function} [onAddToWishlist] - Обработчик добавления в избранное
 * @property {Function} [onCompare] - Обработчик добавления к сравнению
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} ToastProps
 * @property {string} message - Сообщение уведомления
 * @property {string} type - Тип уведомления (success, error, warning, info)
 * @property {number} [duration] - Длительность показа в мс (0 - без авто-закрытия)
 * @property {Function} [onRemove] - Обработчик закрытия
 */

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Открыто ли модальное окно
 * @property {Function} [onClose] - Обработчик закрытия
 * @property {string} [title] - Заголовок модального окна
 * @property {React.ReactNode} [children] - Содержимое модального окна
 * @property {React.ReactNode} [footer] - Футер модального окна
 * @property {string} [size] - Размер модального окна (sm, md, lg, xl)
 * @property {boolean} [closeOnOverlayClick] - Закрывать ли при клике на оверлей
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} FormFieldProps
 * @property {string} name - Имя поля в форме
 * @property {string} [label] - Метка поля
 * @property {boolean} [required] - Обязательно ли поле
 * @property {string} [error] - Сообщение об ошибке
 * @property {string} [help] - Помощный текст
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} LoadingSpinnerProps
 * @property {string} [size] - Размер спиннера (sm, md, lg)
 * @property {string} [color] - Цвет спиннера
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} SkeletonProps
 * @property {string} [variant] - Вариант скелетона (text, rectangular, circular)
 * @property {number} [width] - Ширина в пикселях
 * @property {number} [height] - Высота в пикселях
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children - Дочерние компоненты
 * @property {React.Component} [FallbackComponent] - Компонент для отображения ошибки
 * @property {Function} [onError] - Обработчик ошибки
 */

/**
 * @typedef {Object} PageHeaderProps
 * @property {string} title - Заголовок страницы
 * @property {string} [subtitle] - Подзаголовок
 * @property {React.ReactNode} [actions] - Кнопки действий
 * @property {React.ReactNode} [breadcrumb] - Навигационные крошки
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} SearchBarProps
 * @property {string} [placeholder] - Плейсхолдер для поиска
 * @property {string} [value] - Значение поиска
 * @property {Function} [onChange] - Обработчик изменения
 * @property {Function} [onSubmit] - Обработчик отправки
 * @property {boolean} [loading] - Состояние загрузки
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} FilterPanelProps
 * @property {Object} filters - Текущие фильтры
 * @property {Function} [onFilterChange] - Обработчик изменения фильтров
 * @property {Array.<FilterOption>} [filterOptions] - Опции фильтров
 * @property {string} [className] - Дополнительные CSS классы
 */

/**
 * @typedef {Object} FilterOption
 * @property {string} key - Ключ фильтра
 * @property {string} label - Метка фильтра
 * @property {string} type - Тип фильтра (select, checkbox, range, text)
 * @property {Array} [options] - Опции для select фильтра
 * @property {Object} [range] - Диапазон для range фильтра
 * @property {string} [placeholder] - Плейсхолдер для text фильтра
 */

export {};
