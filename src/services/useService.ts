import { API_URL, EDataSite } from '@/constants/constants'

export function fetchJournales() {
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_GET_JOURNALES);
};

export function fetchArticles(data: any) {
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_ARTICLES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};


export function fetchArticle(url_article: string) {
    return fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_ARTICLE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(url_article)
    });
};