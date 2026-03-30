import axios from 'axios'
import * as cheerio from 'cheerio'
// import cors from 'cors'
// import { PDFParse } from 'pdf-parse'

export async function parsePageArchives(){
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
        console.error('Ошибка при парсинге основной страницы:', error);
        return [];
    }
};