
export const API_URL = import.meta.env.VITE_API_URL

export const enum EDataSite {
    // ЭТО НАЗВАНИЕ Папки в которой юудет хранитьтся сайт
    // это может быть http://my-name-site.com/parser-ve-vue/ index.html или  http://my-name-site.com/my-name-folder/
    // пишем здесь но не применяем константу просто напоминание (после проверить чтобы в vite.config.ts в позиции base:'/parser-ve-vue/' )
    // vite.config.ts не может считать с енама :))))
    SUBDIRECTORY_SITE_NAME = '/parser-ve-vue/',

   // это есть поддиректория в которой на сервере лежит наш бэкенд /api/parser/server.js или /api/parser/index.js или app.js или main.js 
    SUBDIRECTORY_SITE_API_NAME = '/api/parser',

    //response 
    // для удобства здесь описываем RES- отправка POST - тип отправки ARCHIVES - имя 
    RES_GET_JOURNALES_AND_ARTICLES_URLS = '/urls-journales-and-articles',
    RES_POST_ARTICLE_RDF = '/document-article-rdf',
    RES_POST_JOURNALE_XML = '/document-journale-xml',

    // имя для сохранения в localstorage (обновление программы)
    NAME_LOCALSTORAGE = 'siteParserVeVueVersion',
    NAME_SESSIONSTORAGE = 'siteParserVeVueStore'
}