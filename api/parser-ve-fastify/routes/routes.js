import { getControllerJournales, getControllerArticles, getControllerArticle } from '../controllers/controllers.js'
import { getSchemaJournales } from '../schemas/schemas.js';
import { RES_GET_JOURNALES, RES_POST_ARTICLE, RES_POST_ARTICLES } from '../constants/constants.js'

export function useRoutes(fastify, options, done) {
    // с фронтенда приходит запрос к fastify с адресом "RES_GET_JOURNALES" (данные записаны в constants.js)
    // после он сопоставляет их с схемой (валидация, сериализвация) getSchemaArchives (данные записаны в schemas.js)
    // после переходит выполнять getControllerArchives (который находится в controller.js)
    // в controller мы передаем то что посылали либо тело запроса либо строка в req 
    // после выполняется асинхронно функция parsePageJournales(); парсинга которая находится в handles.js
    // функция parsePageJournales(); принимает параметр который мы передали и делает запрос на сайт по ссылке которую мы передали в теле
    // парсит и возвращает обьект данных
    fastify.get(RES_GET_JOURNALES, getSchemaJournales, getControllerJournales);

    fastify.post(RES_POST_ARTICLES, getControllerArticles);

    fastify.post(RES_POST_ARTICLE, getControllerArticle);
    
    done();

};