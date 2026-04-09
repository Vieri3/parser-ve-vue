import { API_URL, EDataSite } from '@/constants/constants'

export function fetchJournalesAndArticlesUrls(){
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_GET_JOURNALES_AND_ARTICLES_URLS);
}

export function fetchJournaleXml(data: any) {
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_JOURNALE_XML, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};


export function fetchArticleRdf(url_article: string) {
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_ARTICLE_RDF, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(url_article)
    });
};