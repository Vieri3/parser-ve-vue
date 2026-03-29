import axios from 'axios'
import * as cheerio from 'cheerio'
import express from 'express'
import cors from 'cors'
import { PDFParse } from 'pdf-parse'

// Константа port для работы на локальном сервере и удаленном на https://vieri.xapp.one/parser-ve/
// process.env.PORT - PORT это переменная которая создается в панели управления хостингом когда создаем новое приложение нод на удаленном|оригинальном сервере. 
// Для протокола https по умолчанию используеться порт 443. Для локального сервера на рабочем компе используем протокол http c портом 3000
// Если не существует переменной порт в среде нода тогда в константу запишеться порт 3000
const port = process.env.PORT || 3000;

const app = express();

// Middleware

// Разрешаем CORS для Vue
app.use(cors());
// Парсим JSON тело запроса
app.use(express.json());


// utils
// функции принимает строку и декодирует символы
function getDecodedOutputStr(str) {
    return str
        .replaceAll("&#039;", "'")
        .replaceAll("&amp;", "&")
        .replaceAll("M&amp;A", "M&A")
        .replaceAll("&quot;", '"')
        .replaceAll("&nbsp;", " ");
};

function getDecodedIncomingTxtFromPdf(str) {
    return str
        .replaceAll('http', 'https')
        .replaceAll('\nORCID:', '')
        .replaceAll('E-Mail', 'mail')
        .replaceAll('Email', 'mail')
        .replaceAll(' ', '')
        .replaceAll(':', '')
        .replace('*Correspondingauthor', '');
};

function getDecodedIncomingMail(str) {
    return str
        .replaceAll('\n', '')
        .replaceAll('*Correspondingauthor', '')
        .replaceAll('(correspondingauthor)', '')
        .replaceAll(';', '; ')
        .replaceAll(',', '');
};

// функция переводит из числового месяца в словарный 
function convertingMouthFromNumToStr(num) {
    const month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return month_arr[parseInt(num) - 1]
};

// асинхронная функция для парсинга текста из ПДФ документа по url
async function parsePdfToTxt(parse_url_pdf, quan_auth) {
    const parser = new PDFParse({ url: parse_url_pdf })
    const result = await parser.getText({ partial: [1, 2, 3] });

    // result.text - это есть текст который вытащили из ПДФ
    let strNew = getDecodedIncomingTxtFromPdf(result.text)

    let mass_mails = [];
    for (let i = 0; i < quan_auth; ++i) {
        let mail_num = strNew.indexOf("mail") + 4;
        let http_num = strNew.indexOf("https");

        // для случая когда нет слова Email E-Mail mail и все что связано с mail
        // strNew.indexOf("mail") становится равным -1, а mail_num = -1+4 = 3
        // https://www.virtual-economics.eu/index.php/VE/article/view/240/125
        // VE_6_1_2023_4_57-70
        if (mail_num < 5) {
            // (http_num - 3) потому что перед \nhttps: стоит знак "\n" поэтому вычитаем с запасом
            // т.к. поиск п\будет идти по символам назад строки
            for (let i = (http_num - 3); i >= 0; i--) {
                if (strNew[i] === ' ' || strNew[i] === '\n') {
                    mail_num = i;
                    break;
                }
            }
        }

        let mail = strNew.substring(mail_num, http_num);
        mail = getDecodedIncomingMail(mail);

        mass_mails.push(mail);
        strNew = strNew.slice(http_num + 5)
    }
    // нужно для того чтобы при новом парсинге статьи сразу можно увидеть нужны ли новые условия для парсинга
    console.log(mass_mails)
    return mass_mails;
}




async function parsePageArchives() {
    try {
        // делаем запрос на сервер чтобы открыть страницу
        const response = await axios.get("https://www.virtual-economics.eu/index.php/VE/issue/archive");
        // из страницы HTML делаем объект cheerio
        const $ = cheerio.load(response.data);

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
        console.error('Ошибка при парсинге основной страницы:', error.message);
        return [];
    }
};

async function parsePageViews(data) {
    // принимаем данные в формате Array<{title: string, link: string}> (массив оъектов)
    // !!!!!!!!!!! вернуть ошибку на фронтенд
    if (!data) { throw createError({ statusCode: 400, message: 'URL is required' }) };

    try {
        let data_urls = [];

        for (const issue_view_url of data) {
            // делаем запрос на сервер чтобы открыть страницу
            const response = await axios.get(issue_view_url);
            // из страницы HTML делаем объект cheerio
            const $ = cheerio.load(response.data);
            // Находим все ссылки на странице (можно уточнить селектор)
            $("h3.title a").each((index, element) => {
                // вытаскиваем ссылку 
                const url = $(element).attr('href');
                // вытаскиваем название
                const title = $(element).text().trim();
                data_urls.push({ title, url });
            });
            // Небольшая задержка, чтобы не перегружать сервер
            await new Promise(resolve => setTimeout(resolve, 1000));
        };

        return data_urls;

    } catch (error) {
        console.error('Ошибка при парсинге основной страницы:', error.message);
        return [];
    }
};

async function parsePageView(data) {
    // принимаем данные в формате Array<{title: string, link: string}> (массив оъектов)
    // !!!!!!!!!!! вернуть ошибку на фронтенд
    if (!data) { throw createError({ statusCode: 400, message: 'URL is required' }) };

    try {

        let array_of_parsed_articles = [];

        for (const article_view_url of data) {
            // делаем запрос на сервер чтобы открыть страницу
            const response = await axios.get(article_view_url);
            // из страницы HTML делаем объект cheerio
            const $ = cheerio.load(response.data);


            //Важно!!!
            // Парсим сылку PDF из <head> вот такого вот формата https://www.virtual-economics.eu/index.php/VE/article/download/457/199
            const link_pdf = $("meta[name='citation_pdf_url']").attr("content");
            //создаем массив массивов для того чтобы удобно было выводить на экран данные в виде таблицы
            let table_data_out = [
                ["Template-Type:", "ReDIF-Article 1.0"]
            ];
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
                table_data_out.push(
                    ["Author-Name:", author_name],
                    ["Author-Email:", author_email],
                    ["Author-Workplace-Name:", author_workplace_name]
                )
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

            table_data_out.push(
                ["Title:", title],
                ["Abstract:", abstract],
                ["Keywords:", keywords],
                ["Journal:", journal],
                ["Pages:", pages],
                ["Volume:", volume],
                ["Issue:", issue],
                ["Year:", year],
                ["Month:", month],
                ["DOI:", doi],
                ["File-URL:", file_url],
                ["File-Format:", file_format],
                ["Handle:", `RePEc:aid:journl:v:${volume}:y:${year}:i:${issue}:p:${pages}`]
            );

            array_of_parsed_articles.push({ file_name, str_data_out, table_data_out })
            // т.к. парсим не только страницу а и пдф 
            await new Promise(resolve => setTimeout(resolve, 4000));
        }

        return array_of_parsed_articles

    } catch (error) {
        console.error('Ошибка при парсинге основной страницы:', error.message);
        return [];
    }

}

app.post('/api/parser/archives', async (req, res) => {
    const result = await parsePageArchives();
    res.json(result);
})

app.post('/api/parser/views', async (req, res) => {
    const result = await parsePageViews(req.body);
    res.json(result);
})

app.post('/api/parser/view', async (req, res) => {
    const result = await parsePageView(req.body);
    res.json(result);
})

app.listen(port, () => {
    // для удобаства чтобы при разработке запускать из терминала сразу в браузер no ссылке
    if (port == 3000) {
        console.log('Server is running on http://localhost:' + port)
    }
})
