import { getControllerArchives } from '../controllers/controllers.js'

export const getOptionsArchive = {
    schema: {
        response: {
            201: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        url: { type: 'string' }
                    },
                },
            },
        },
    },
    handler: getControllerArchives
};


