export const getSchemaArchives = {
    schema: {
        description: 'API для обработки массива URL и получения заголовков',
        tags: ['URL Processor'],
        summary: 'Парсим массив URL',
        body: {},
        response: {
            201: {
                type: 'array',
                description: 'Успешный ответ с обработанными URL',
                properties: {
                    data: {
                        type: 'array',
                        description: 'Массив обработанных данных',
                        minItems: 0,
                        items: {
                            type: 'object',
                            required: ['url', 'title'],
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'Исходный URL',
                                    format: 'uri',
                                    example: [
                                        'https://www.virtual-economics.eu/index.php/VE/issue/view/30',
                                        'https://www.virtual-economics.eu/index.php/VE/issue/view/30'
                                    ]
                                },
                                title: {
                                    type: 'string',
                                    description: 'Заголовок страницы',
                                    minLength: 1,
                                    maxLength: 500,
                                    example: [
                                        'Vol. 8 No. 3 (2025)',
                                        'Vol. 6 No. 2 (2023)'
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const getSchemaViews = {
    schema: {
        description: 'API для обработки массива URL и получения заголовков',
        tags: ['URL Processor'],
        summary: 'Обработка массива URL',
        body: {
            type: 'array',          // Тип: массив
            description: 'Массив URL-адресов для обработки',
            minItems: 1,            // Минимум 1 элемент
            maxItems: 100,          // Максимум 100 элементов (защита от DoS)
            uniqueItems: true,      // Все элементы должны быть уникальны
            items: {
                type: 'string',       // Каждый элемент - строка
                format: 'uri',        // Проверка на корректный URL формат
                minLength: 5,         // Минимальная длина строки
                maxLength: 2048,      // Максимальная длина URL
                pattern: '^https?://', // Должен начинаться с http:// или https://
                examples: [
                    'https://www.virtual-economics.eu/index.php/VE/issue/view/12',
                    'https://www.virtual-economics.eu/index.php/VE/issue/view/31',
                    'https://www.virtual-economics.eu/index.php/VE/issue/view/6'
                ]
            },
            additionalProperties: false // Запрещаем дополнительные поля
        },
        response: {
            201: {
                type: 'array',
                description: 'Успешный ответ с обработанными URL',
                properties: {
                    data: {
                        type: 'array',
                        description: 'Массив обработанных данных',
                        minItems: 0,
                        items: {
                            type: 'object',
                            required: ['url', 'title'],
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'Исходный URL',
                                    format: 'uri',
                                    example: [
                                        'https://www.virtual-economics.eu/index.php/VE/article/view/349',
                                        'https://www.virtual-economics.eu/index.php/VE/article/view/353'
                                    ]
                                },
                                title: {
                                    type: 'string',
                                    description: 'Заголовок страницы или сгенерированное название',
                                    minLength: 1,
                                    maxLength: 500,
                                    example: [
                                        'Derception of Artificial Intelligence: GSR Analysis and Face Detection',
                                        'M&A Matchmaking Platform Model in the Process of Mergers and Acquisitions'
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};