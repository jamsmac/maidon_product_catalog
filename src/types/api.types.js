/**
 * @typedef {Object} Product
 * @property {number} id - Уникальный идентификатор товара
 * @property {string} name - Название товара
 * @property {string} [description] - Описание товара
 * @property {number} price - Цена товара
 * @property {string} [image] - URL изображения товара
 * @property {string} [category] - Категория товара
 * @property {Object} [specifications] - Технические характеристики
 * @property {boolean} [inStock] - Наличие товара
 * @property {string} [brand] - Бренд товара
 */

/**
 * @typedef {Object} Equipment
 * @property {number} id - Уникальный идентификатор оборудования
 * @property {string} name - Название оборудования
 * @property {string} type - Тип оборудования (excavator, loader, bulldozer и т.д.)
 * @property {string} status - Статус оборудования (active, idle, maintenance, warning, offline)
 * @property {string} location - Местоположение оборудования
 * @property {string} [operatorName] - Имя оператора
 * @property {number} [workingHours] - Часы работы
 * @property {number} [fuelLevel] - Уровень топлива (0-100)
 * @property {number} [utilizationRate] - Коэффициент загрузки (0-100)
 * @property {string[]} [alerts] - Предупреждения
 */

/**
 * @typedef {Object} QuoteData
 * @property {string} equipmentType - Тип запрашиваемого оборудования
 * @property {string} [vin] - VIN номер, если есть
 * @property {string} name - Имя контактного лица
 * @property {string} phone - Телефон для связи
 * @property {string} email - Email для связи
 * @property {string} [company] - Название компании
 * @property {string} [message] - Дополнительная информация
 * @property {File[]} [files] - Прикрепленные файлы
 */

/**
 * @typedef {Object} QuoteResponse
 * @property {number} id - ID созданной заявки
 * @property {string} status - Статус заявки (pending, processing, completed)
 * @property {string} createdAt - Дата создания заявки
 */

/**
 * @typedef {Object} OrderData
 * @property {Array.<CartItem>} items - Массив товаров в заказе
 * @property {CustomerData} customer - Данные заказчика
 * @property {number} total - Общая сумма заказа
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id - ID товара
 * @property {string} name - Название товара
 * @property {number} price - Цена товара
 * @property {number} quantity - Количество
 * @property {Object} [configuration] - Конфигурация товара
 */

/**
 * @typedef {Object} CustomerData
 * @property {string} name - Имя заказчика
 * @property {string} phone - Телефон
 * @property {string} email - Email
 * @property {string} [company] - Компания
 * @property {string} [address] - Адрес доставки
 */

/**
 * @typedef {Object} OrderResponse
 * @property {number} id - ID созданного заказа
 * @property {string} status - Статус заказа
 * @property {string} createdAt - Дата создания заказа
 */

/**
 * @typedef {Object} LoginData
 * @property {string} email - Email пользователя
 * @property {string} password - Пароль
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT токен
 * @property {User} user - Данные пользователя
 */

/**
 * @typedef {Object} User
 * @property {number} id - ID пользователя
 * @property {string} email - Email пользователя
 * @property {string} name - Имя пользователя
 * @property {string} [role] - Роль пользователя (admin, user и т.д.)
 * @property {string} [company] - Компания пользователя
 */

/**
 * @typedef {Object} APIError
 * @property {string} message - Сообщение об ошибке
 * @property {number} status - HTTP статус код
 * @property {Object} [data] - Дополнительные данные ошибки
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Успешность операции
 * @property {*} data - Данные ответа
 * @property {string} [message] - Сообщение
 */

export {};
