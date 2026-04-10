
// export const getSchemaJournales = {
//     schema: {
//         summary: 'Парсим URL Journales',
//         description: 'Посылаем на сервер запрос для выполнение парсинга ссылок',
//         tags: ['URL Processor'],
//         params: {},      // Нет параметров пути
//         querystring: {}, // Нет query параметров
//         headers: {},     // Нет обязательных заголовков
//         response: {
//             201: {
//                 type: 'array',
//                 description: 'Успешный ответ с обработанными URL',
//                 tags: ['URL Processor'],
//                 required: ['title', 'url'],
//                 examples: [
//                     {
//                         title: 'Vol. 9 No. 1 (2026)',
//                         url: 'https://www.virtual-economics.eu/index.php/VE/issue/view/31'
//                     },
//                 ],
//                 properties: {
//                     data: {
//                         type: 'array',
//                         description: 'Массив обработанных данных',
//                         minItems: 1,
//                         items: {
//                             type: 'object',
//                             properties: {
//                                 url: {
//                                     type: 'string',
//                                     description: 'Исходный URL',
//                                     format: 'uri',
//                                     example: ['https://www.virtual-economics.eu/index.php/VE/issue/view/30'],
//                                 },
//                                 title: {
//                                     type: 'string',
//                                     description: 'Заголовок страницы',
//                                     minLength: 1,
//                                     maxLength: 500,
//                                     example: ['Vol. 8 No. 3 (2025)'],
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//             400: {
//                 description: 'Ошибка валидации. Неверный формат запроса.',
//                 type: 'object',
//                 properties: {
//                     message: { type: 'string' },
//                     errors: { type: 'array' }
//                 }
//             },
//             401: {
//                 description: 'Ошибка аутентификации.',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string', example: 'Unauthorized' }
//                 }
//             },
//             // Означает, что сервер не может найти запрашиваемый ресурс.
//             404: {
//                 description: 'Элемент не найден',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string' },
//                     message: { type: 'string' }
//                 }
//             },
//             // сервер не может обработать запрос пользователя
//             500: {
//                 description: 'Внутренняя ошибка сервера',
//                 type: 'object',
//                 properties: {
//                     success: { type: 'boolean', example: false },
//                     error: { type: 'string', example: 'Internal Server Error' }
//                 }
//             }
//         },
//     },
// };

// export const getSchemaArticles = {
//     schema: {
//         summary: 'Парсим URL Articles',
//         description: 'API для обработки массива URL и получения заголовков',
//         tags: ['URL Processor'],
//         params: {},      // Нет параметров пути
//         querystring: {}, // Нет query параметров
//         headers: {},     // Нет обязательных заголовков
//         body: {
//             type: 'array',          // Тип: массив
//             description: 'Массив URL-адресов для обработки',
//             minItems: 1,            // Минимум 1 элемент
//             maxItems: 100,          // Максимум 100 элементов (защита от DoS)
//             uniqueItems: true,      // Все элементы должны быть уникальны
//             items: {
//                 type: 'string',       // Каждый элемент - строка
//                 format: 'uri',        // Проверка на корректный URL формат
//                 minLength: 5,         // Минимальная длина строки
//                 maxLength: 2048,      // Максимальная длина URL
//                 pattern: '^https?://', // Должен начинаться с http:// или https://
//                 examples: [
//                     'https://www.virtual-economics.eu/index.php/VE/issue/view/32'
//                 ]
//             },
//             additionalProperties: false // Запрещаем дополнительные поля
//         },
//         response: {
//             201: {
//                 type: 'array',
//                 description: 'Успешный ответ с обработанными URL',
//                 tags: ['URL Processor'],
//                 required: ['title', 'url'],
//                 examples: [
//                     {
//                         title: 'Derception of Artificial Intelligence: GSR Analysis and Face Detection',
//                         url: 'https://www.virtual-economics.eu/index.php/VE/article/view/349'
//                     },
//                 ],
//                 properties: {
//                     data: {
//                         type: 'array',
//                         description: 'Массив обработанных данных',
//                         minItems: 1,
//                         items: {
//                             type: 'object',
//                             properties: {
//                                 url: {
//                                     type: 'string',
//                                     description: 'Исходный URL',
//                                     format: 'uri',
//                                     example: [
//                                         'https://www.virtual-economics.eu/index.php/VE/article/view/349'
//                                     ]
//                                 },
//                                 title: {
//                                     type: 'string',
//                                     description: 'Заголовок страницы или сгенерированное название',
//                                     minLength: 1,
//                                     maxLength: 500,
//                                     example: [
//                                         'Derception of Artificial Intelligence: GSR Analysis and Face Detection'
//                                     ],
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//             400: {
//                 description: 'Ошибка валидации. Неверный формат запроса.',
//                 type: 'object',
//                 properties: {
//                     message: { type: 'string' },
//                     errors: { type: 'array' }
//                 }
//             },
//             401: {
//                 description: 'Ошибка аутентификации.',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string', example: 'Unauthorized' }
//                 }
//             },
//             // Означает, что сервер не может найти запрашиваемый ресурс.
//             404: {
//                 description: 'Элемент не найден',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string' },
//                     message: { type: 'string' }
//                 }
//             },
//             // сервер не может обработать запрос пользователя
//             500: {
//                 description: 'Внутренняя ошибка сервера',
//                 type: 'object',
//                 properties: {
//                     success: { type: 'boolean', example: false },
//                     error: { type: 'string', example: 'Internal Server Error' }
//                 }
//             }
//         },
//     },
// };

// export const getSchemaArticle = {
//     schema: {
//         summary: 'Парсим URL Article',
//         description: 'API для обработки массива URL и получения заголовков',
//         tags: ['URL Processor'],
//         params: {},      // Нет параметров пути
//         querystring: {}, // Нет query параметров
//         headers: {},     // Нет обязательных заголовков
//         body: {
//             type: 'array',          // Тип: массив
//             description: 'Массив URL-адресов для обработки',
//             minItems: 1,            // Минимум 1 элемент
//             maxItems: 100,          // Максимум 100 элементов (защита от DoS)
//             uniqueItems: true,      // Все элементы должны быть уникальны
//             items: {
//                 type: 'string',       // Каждый элемент - строка
//                 format: 'uri',        // Проверка на корректный URL формат
//                 minLength: 5,         // Минимальная длина строки
//                 maxLength: 2048,      // Максимальная длина URL
//                 pattern: '^https?://', // Должен начинаться с http:// или https://
//                 examples: [
//                     'https://www.virtual-economics.eu/index.php/VE/issue/view/32'
//                 ]
//             },
//             additionalProperties: false // Запрещаем дополнительные поля
//         },
//         response: {
//             201: {
//                 type: 'array',
//                 description: 'Успешный ответ с обработанными URL',
//                 tags: ['URL Processor'],
//                 required: ['title', 'url'],
//                 examples: [
//                     {
//                         title: 'Derception of Artificial Intelligence: GSR Analysis and Face Detection',
//                         url: 'https://www.virtual-economics.eu/index.php/VE/article/view/349'
//                     },
//                 ],
//                 properties: {
//                     data: {
//                         type: 'array',
//                         description: 'Массив обработанных данных',
//                         minItems: 1,
//                         items: {
//                             type: 'object',
//                             properties: {
//                                 url: {
//                                     type: 'string',
//                                     description: 'Исходный URL',
//                                     format: 'uri',
//                                     example: [
//                                         'https://www.virtual-economics.eu/index.php/VE/article/view/349'
//                                     ]
//                                 },
//                                 title: {
//                                     type: 'string',
//                                     description: 'Заголовок страницы или сгенерированное название',
//                                     minLength: 1,
//                                     maxLength: 500,
//                                     example: [
//                                         'Derception of Artificial Intelligence: GSR Analysis and Face Detection'
//                                     ],
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//             400: {
//                 description: 'Ошибка валидации. Неверный формат запроса.',
//                 type: 'object',
//                 properties: {
//                     message: { type: 'string' },
//                     errors: { type: 'array' }
//                 }
//             },
//             401: {
//                 description: 'Ошибка аутентификации.',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string', example: 'Unauthorized' }
//                 }
//             },
//             // Означает, что сервер не может найти запрашиваемый ресурс.
//             404: {
//                 description: 'Элемент не найден',
//                 type: 'object',
//                 properties: {
//                     error: { type: 'string' },
//                     message: { type: 'string' }
//                 }
//             },
//             // сервер не может обработать запрос пользователя
//             500: {
//                 description: 'Внутренняя ошибка сервера',
//                 type: 'object',
//                 properties: {
//                     success: { type: 'boolean', example: false },
//                     error: { type: 'string', example: 'Internal Server Error' }
//                 }
//             }
//         },
//     },
// };