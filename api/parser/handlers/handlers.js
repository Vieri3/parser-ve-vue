import * as cheerio from 'cheerio'
import { getDecodedRdf, getDecodedXml, getDecryptedEmail, getDataWithoutNum, getNameOfTheMonth } from '../utils/utils.js'
import { START_PARSE_URL_SITE } from '../constants/constants.js'

export async function getJournalesAndArticlesUrls() {
    try {
        const DATA_URLS = [];
        const res = await fetch(START_PARSE_URL_SITE);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const html_string_journales = await res.text();
        const $ = cheerio.load(html_string_journales, { scriptingEnabled: false });
        // Находим все ссылки на странице (можно уточнить селектор)
        $('a.title').each((index, element) => {
            // вытаскиваем ссылку 
            const url_journale = $(element).attr('href');
            // вытаскиваем название
            const title_journale = $(element).text().trim();
            DATA_URLS.push({ title_journale, url_journale, array_urls_articles: [] });
        });
        for (let i = 0; i < DATA_URLS.length; i++) {
            // делаем запрос на сервер чтобы открыть страницу
            const res = await fetch(DATA_URLS[i].url_journale);
            // Проверяем, прошел ли сетевой запрос успешно
            if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
            // ответ — это HTML или текст
            const html_string_article = await res.text();
            // из страницы HTML делаем объект cheerio
            // { scriptingEnabled: false } отключает обработку содержимого тегов <script>
            const $ = cheerio.load(html_string_article, { scriptingEnabled: false });
            // начинаем вытаскивать данные
            $('h3.title a').each((index, element) => {
                // вытаскиваем ссылку 
                const url_article = $(element).attr('href');
                // вытаскиваем название
                const title_article = $(element).text().trim();
                DATA_URLS[i].array_urls_articles.push({ title_article, url_article });
            });
        }
        return DATA_URLS
    } catch (error) {
        console.error('Parsing error:', error)
        return []
    };
};

export async function getArticleRdf(url_article) {
    try {
        const res = await fetch(url_article);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const html_string_article = await res.text();
        const $ = cheerio.load(html_string_article, { scriptingEnabled: false });
        // название типа шаблона
        const template_type = 'ReDIF-Article 1.0'
        // определяем количество авторов
        const quantity_authors = $('meta[name="DC.Creator.PersonalName"]').length;
        // создаем текстовый блок для авторов т.к. авторов бывает разное количество а вставить этот блок нужно в строку
        let block_data_authors = "";
        // проходимся циклом пор всем авторам и достаем данные
        for (let i = 0; i < quantity_authors; ++i) {
            // Имя автора
            let author_name = $('meta[name="DC.Creator.PersonalName"]').eq(i).attr('content') || '';
            // почта автора 
            let author_email = getDecryptedEmail($('.name').eq(i).data('emid')) || '';
            //author_workplace_name
            let author_workplace_name = $('meta[name="citation_author_institution"]').eq(i).attr('content') || '';
            //собираем строку ОПРЕДЕЛЕННОГО ВИДА для добавления в документ
            block_data_authors += 'Author-Name: ' + author_name + '\r\n' + 'Author-Email: ' + author_email + '\r\n' + 'Author-Workplace-Name: ' + author_workplace_name + '\r\n';
        }
        let title = $('meta[name="DC.Title"]').attr('content') || '';
        let abstract = $('meta[name="DC.Description"]').attr('content').trim() || '';
        // опеделяем количество keywords
        const quantityKeywords = $('meta[name="DC.Subject"]').length;
        let keywords_start = "";
        for (let i = 0; i < quantityKeywords; ++i) {
            keywords_start += $('meta[name="DC.Subject"]').eq(i).attr('content') + ", ";
        }
        let keywords = keywords_start.slice(0, -2);
        let journal = $('meta[name="citation_journal_title"]').attr('content') || '';
        let pages = $('meta[name="DC.Identifier.pageNumber"]').attr('content') || '';
        let volume = $('meta[name="DC.Source.Volume"]').attr('content') || '';
        let issue = $('meta[name="DC.Source.Issue"]').attr('content') || '';
        let year = $('meta[name="DC.Date.created"]').attr('content').substring(0, 4) || '';
        let month_number = ($('meta[name="DC.Date.created"]').attr('content')).substring(5, 7) || '';
        let month = getNameOfTheMonth(month_number) || '';
        let doi = $('meta[name="DC.Identifier.DOI"]').attr('content') || '';
        let file_url = $('meta[name="citation_pdf_url"]').attr('content') || '';
        let file_format = $('meta[name="DC.Format"]').attr('content') || '';
        let number_article = doi.match(/\(([^)]+)\)/)?.[1] || null;
        // формируем название файла
        const file_name = 'VE_' + volume + '_' + issue + '_' + year + '_' + number_article + '_' + pages;
        // тело файла
        const str_data = 'Template-Type: ' + template_type + '\r\n' + block_data_authors + 'Title: ' + title + '\r\n' + 'Abstract: ' + abstract + '\r\n' + 'Keywords: ' + keywords + '\r\n' + "Journal: " + journal + '\r\n' + "Pages: " + pages + '\r\n' + "Volume: " + volume + '\r\n' + "Issue: " + issue + '\r\n' + "Year: " + year + '\r\n' + "Month: " + month + '\r\n' + "DOI: " + doi + '\r\n' + "File-URL: " + file_url + '\r\n' + "File-Format: " + file_format + '\r\n' + "Handle: RePEc:aid:journl:v:" + volume + ":y:" + year + ":i:" + issue + ":p:" + pages;
        // пропускаем через функцию устраняем некореектные знаки при кодировании
        const str_data_out = getDecodedRdf(str_data);
        // Отправляем в поток kаждый объект сразу после парсинга
        return { file_name, str_data_out }
    } catch (error) {
        console.error('Parsing error:', error)
        return {}
    };
}; 

export async function getJournaleXml(obj_jourlale) {
    try {
        // орпеделяем количество статей в журнале
        const quantity_articles_in_journale = obj_jourlale.array_urls_articles.length;
        let journal_issn_flag = false;
        let issue_flag = false;
        // дата для всего журнала одна, чтобы каждый раз не вытягивать данные из каждой статьи вытаскиваем из первой глобальной
        let global_publication_date, year, issue_volume, issue_number;

        // open tag <ici-import>
        let STR_DATA_XML = '<?xml version="1.0" encoding="UTF-8"?><ici-import xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://journals.indexcopernicus.com/ic-import.xsd">';

        // пропускаем через цикл все ссылки Article
        for (let i = 0; i < quantity_articles_in_journale; i++) {
            // присваиваем переменной одну из ссылок article находящихся в journale
            const url_article = obj_jourlale.array_urls_articles[i].url_article;
            const res = await fetch(url_article);
            if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
            const html_string_article = await res.text();
            const $ = cheerio.load(html_string_article, { scriptingEnabled: false });

            // начитаем добавлять данные
            // добавляем самозакрывающийся тег <journal/> 
            if (!journal_issn_flag) {
                const journal_issn = getDecodedXml($('meta[name="DC.Source.ISSN"]').attr('content') || '');
                STR_DATA_XML += '<journal issn="' + journal_issn + '"/>';
                journal_issn_flag = true;
            };

            if (!issue_flag) {
                issue_number = getDecodedXml($('meta[name="DC.Source.Issue"]').attr('content') || '');
                issue_volume = getDecodedXml($('meta[name="DC.Source.Volume"]').attr('content') || '');
                global_publication_date = getDecodedXml($('meta[name="DC.Date.created"]').attr('content') || '');
                year = global_publication_date.substring(0, 4);
                const number_of_articles = quantity_articles_in_journale;
                // open tag <issue>
                STR_DATA_XML += '<issue number="' + issue_number + '" volume="' + issue_volume + '" year="' + year + '" publicationDate="' + global_publication_date + '" numberOfArticles="' + number_of_articles + '">';
                issue_flag = true;
            };


            // создаем и набираем контент в article (их может быть несколько и они следуют один за одним) это статьи в журнале 
            // также АRTICLE состоит из 3-х элементов <language_version>, <authors>, <references>
            // начинать каждый сбор article нужно с пустой строки
            let ARTICLE = '';
            // open tag <article> ---------------------------------------------------------------------------- article
            ARTICLE += '<article><type>ORIGINAL_ARTICLE</type>';

            // начинаем парсить для language_version
            // open tag <languageVersion> ---------------------------------------------------------------------------- language_version
            let language_version = '<languageVersion language="en">';
            const title = getDecodedXml($('meta[name="DC.Title"]').attr('content') || '');
            const abstract = getDecodedXml($('meta[name="DC.Description"]').attr('content') || '');
            const page_from = getDecodedXml($('meta[name="citation_firstpage"]').attr('content') || '');
            const page_to = getDecodedXml($('meta[name="citation_lastpage"]').attr('content') || '');
            const doi = getDecodedXml($('meta[name="citation_doi"]').attr('content') || '');
            language_version += '<title>' + title + '</title>' + '<abstract>' + abstract + '</abstract>' + '<publicationDate>' + global_publication_date + '</publicationDate>' + '<pageFrom>' + page_from + '</pageFrom>' + '<pageTo>' + page_to + '</pageTo>' + '<doi>' + doi + '</doi>';
            // open tag <keywords> ---------------------------------------------------------------------------- keywords
            // собираем keywords
            let keywords = '<keywords>'
            $('meta[name="citation_keywords"]').each((idx, el) => {
                const keyword = getDecodedXml($(el).attr('content') || '');
                // для таких ситуаций как в https://www.virtual-economics.eu/index.php/VE/article/view/341
                const keyword_mini_mass = keyword.split(';').forEach(kwd => {
                    keywords += '<keyword>' + kwd.trim() + '</keyword>'
                });
            });
            // close tag <keywords>
            keywords += '</keywords>'
            language_version += keywords;
            // close tag <languageVersion>
            language_version += '</languageVersion>'


            // начинаем парсить для authors
            // open tag <authors> ------------------------------------------------------------------------------------ authors
            let authors = '<authors>';
            // определяем количество авторов
            const quantity_authors = $('meta[name="DC.Creator.PersonalName"]').length;
            // собираем authors
            for (let i = 0; i < quantity_authors; ++i) {
                const name = getDecodedXml(($('.name').eq(i).data('names')).split(',')[0] || '');
                const surname = getDecodedXml(($('.name').eq(i).data('names')).split(',')[1] || '');
                const email = getDecodedXml(getDecryptedEmail($('.name').eq(i).data('emid')) || '');
                const order = i + 1;
                const institute_affiliation = getDecodedXml($('meta[name="citation_author_institution"]').eq(i).attr('content') || '');
                const role = 'AUTHOR';
                const ORCID = getDecodedXml($('.orcid a').eq(i).attr('href') || '');
                const author = '<author>' + '<name>' + name + '</name>' + '<surname>' + surname + '</surname>' + '<email>' + email + '</email>' + '<order>' + order + '</order>' + '<instituteAffiliation>' + institute_affiliation + '</instituteAffiliation>' + '<role>' + role + '</role>' + '<ORCID>' + ORCID + '</ORCID>' + '</author>';
                authors += author;
            }
            // close tag <authors>
            authors += '</authors>';


            // начинаем парсить для references
            // open tag <references> ----------------------------------------------------------------------------------- references
            let references = '<references>'
            // определяем количество Рекомендаций
            const quantity_references = $('meta[name="citation_reference"]').length;
            for (let i = 0; i < quantity_references; ++i) {
                const unparsed_content = getDecodedXml(getDataWithoutNum($('meta[name="citation_reference"]').eq(i).attr('content')) || '');
                const order = i + 1;
                const reference = '<reference><unparsedContent>' + unparsed_content + '</unparsedContent><order>' + order + '</order><doi/></reference>';
                references += reference;
            }
            // close tag <references>
            references += '</references>';

            // собюираем Article
            ARTICLE += language_version + authors + references;

            // close tag <article>
            ARTICLE += '</article>';

            // добавляем в документ XML по одной статье (article)
            STR_DATA_XML += ARTICLE;

            // обнуляем чтобы собрать новый
            ARTICLE = '';
        };

        // close tag </issue>
        STR_DATA_XML += '</issue>';
        // close tag </ici-import>
        STR_DATA_XML += '</ici-import>';
        // формируем название файла
        const FILE_NAME = 'copernicus-issue-VE-' + year + '-' + issue_volume + '-' + issue_number;

        return { FILE_NAME, STR_DATA_XML};

    } catch (error) {
        console.error('Parsing error:', error)
        return {}
    };
};
