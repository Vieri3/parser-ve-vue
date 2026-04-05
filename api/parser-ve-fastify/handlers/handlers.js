import * as cheerio from 'cheerio'
import { parsePdfToTxt, convertingMouthFromNumToStr, getDecodedOutputStr } from '../utils/utils.js'
import { START_PARSE_URL_SITE, TIME_PARSE_ARTICLE } from '../constants/constants.js'

export async function parsePageJournales() {
    try {
        // делаем запрос на сервер чтобы открыть страницу
        const res = await fetch(START_PARSE_URL_SITE);
        // Проверяем, прошел ли сетевой запрос успешно
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        // ответ — это HTML или текст
        const htmlString = await res.text();
        // из страницы HTML делаем объект cheerio
        const $ = cheerio.load(htmlString);

        const data_urls = [];
        // Находим все ссылки на странице (можно уточнить селектор)
        $("a.title").each((index, element) => {
            // вытаскиваем ссылку 
            const url = $(element).attr('href');
            // вытаскиваем название
            const title = $(element).text().trim();
            data_urls.push({ title, url });
        });

        return data_urls;

    } catch (error) {
        console.error('Parsing error:', error)
        return []
    };
};

export async function parsePageArticles(data, stream) {
    try {
        for (const article_url of data) {
            // делаем запрос на сервер чтобы открыть страницу
            const res = await fetch(article_url);
            // Проверяем, прошел ли сетевой запрос успешно
            if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
            // ответ — это HTML или текст
            const htmlString = await res.text();
            // из страницы HTML делаем объект cheerio
            const $ = cheerio.load(htmlString);
            // Находим все ссылки на странице (можно уточнить селектор)
            $("h3.title a").each((index, element) => {
                // вытаскиваем ссылку 
                const url = $(element).attr('href');
                // вытаскиваем название
                const title = $(element).text().trim();
                // Отправляем в поток kаждый объект сразу после парсинга
                stream.push(JSON.stringify({ title, url }) + '\n')
            });
        };

        // Завершаем поток
        stream.push(null)

    } catch (error) {
        console.error('Parsing error:', error)
        stream.push(JSON.stringify({ error: error.message }) + '\n')
        stream.push(null)
    }
};

export async function parsePageArticle(url_article) {
    try {
        const res = await fetch(url_article);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const htmlString = await res.text();
        const $ = cheerio.load(htmlString);
        //Важно!!!
        // Парсим сылку PDF из <head> вот такого вот формата https://www.virtual-economics.eu/index.php/VE/article/download/457/199
        const link_pdf = $("meta[name='citation_pdf_url']").attr("content");
        // название типа шаблона
        const template_type = "ReDIF-Article 1.0"
        // определяем количество авторов
        const quantity_authors = $("meta[name='DC.Creator.PersonalName']").length;
        // массив почт авторов для заполнения
        let authors_emails;
        // mails_authorпроверяем на наличе ссылки PDF если ссылка есть то мы парсим по ссылке документ PDF и закидываем в массив Array<mailsAuthor> почты авторов
        if (link_pdf !== undefined) {
            authors_emails = await parsePdfToTxt(link_pdf, quantity_authors);
        }
        // создаем текстовый блок для авторов т.к. авторов бывает разное количество а вставить этот блок нужно в строку
        let block_data_authors = "";
        // проходимся циклом пор всем авторам и достаем данные
        for (let i = 0; i < quantity_authors; ++i) {
            // Имя автора 
            let author_name = $("meta[name='DC.Creator.PersonalName']").eq(i).attr("content") || '';
            // почта автора берется из массива Array<mailsAuthor> по индексу если она есть если нет то добавляется пустая строка
            let author_email = authors_emails ? authors_emails[i] : '';
            let author_workplace_name = $("meta[name='citation_author_institution']").eq(i).attr("content") || '';
            //собираем строку ОПРЕДЕЛЕННОГО ВИДА для добавления в документ
            block_data_authors += 'Author-Name: ' + author_name + "\r\n" + 'Author-Email: ' + author_email + "\r\n" + 'Author-Workplace-Name: ' + author_workplace_name + "\r\n";
        }

        let title = $("meta[name='DC.Title']").attr("content") || '';
        let abstract = $("meta[name='DC.Description']").attr("content").trim() || '';

        // опеделяем количество keywords
        const quantityKeywords = $("meta[name='DC.Subject']").length;

        let keywords_start = "";
        for (let i = 0; i < quantityKeywords; ++i) {
            keywords_start += $("meta[name='DC.Subject']").eq(i).attr("content") + ", ";
        }
        let keywords = keywords_start.slice(0, -2);

        let journal = $("meta[name='citation_journal_title']").attr("content") || '';
        let pages = $("meta[name='DC.Identifier.pageNumber']").attr("content") || '';
        let volume = $("meta[name='DC.Source.Volume']").attr("content") || '';
        let issue = $("meta[name='DC.Source.Issue']").attr("content") || '';
        let year = $("meta[name='DC.Date.created']").attr("content").substring(0, 4) || '';
        let month_number = ($("meta[name='DC.Date.created']").attr("content")).substring(5, 7) || '';
        let month = convertingMouthFromNumToStr(month_number) || '';
        let doi = $("meta[name='DC.Identifier.DOI']").attr("content") || '';
        let file_url = $("meta[name='citation_pdf_url']").attr("content") || '';
        let file_format = $("meta[name='DC.Format']").attr("content") || '';
        let number_article = doi.match(/\(([^)]+)\)/)?.[1] || null;

        // формируем название файла
        const file_name = "VE_" + volume + "_" + issue + "_" + year + "_" + number_article + "_" + pages;
        // тело файла
        const str_data = "Template-Type: " + template_type + "\r\n" + block_data_authors + "Title: " + title + "\r\n" + "Abstract: " + abstract + "\r\n" + "Keywords: " + keywords + "\r\n" + "Journal: " + journal + "\r\n" + "Pages: " + pages + "\r\n" + "Volume: " + volume + "\r\n" + "Issue: " + issue + "\r\n" + "Year: " + year + "\r\n" + "Month: " + month + "\r\n" + "DOI: " + doi + "\r\n" + "File-URL: " + file_url + "\r\n" + "File-Format: " + file_format + "\r\n" + "Handle: RePEc:aid:journl:v:" + volume + ":y:" + year + ":i:" + issue + ":p:" + pages;
        // пропускаем через функцию устраняем некореектные знаки при кодировании
        const str_data_out = getDecodedOutputStr(str_data);

        // Отправляем в поток kаждый объект сразу после парсинга
        return { file_name, str_data_out }


    } catch (error) {
        console.error('Parsing error:', error)
        return []
    };

};