
export interface IParseUrl {
    title: string,
    url: string
};

export interface IParsedData {
    file_name: string,
    str_data_out: string,
    table_data_out: string[]
};

export interface IDataGlobalMass{
    title_journale: string,
    url_journale: string,
    array_urls_articles: [
        {
            title_article: string,
            url_article: string,
        }
    ]
}