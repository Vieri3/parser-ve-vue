export interface IDataGlobalMass {
    title_journale: string,
    url_journale: string,
    array_urls_articles?: Array<{
        title_article: string,
        url_article: string,
    }>
}