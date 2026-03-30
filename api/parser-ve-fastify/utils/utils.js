import { PDFParse } from 'pdf-parse'

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

// функции принимает строку и декодирует символы
export function getDecodedOutputStr(str) {
    return str
        .replaceAll("&#039;", "'")
        .replaceAll("&amp;", "&")
        .replaceAll("M&amp;A", "M&A")
        .replaceAll("&quot;", '"')
        .replaceAll("&nbsp;", " ");
};

// функция переводит из числового месяца в словарный 
export function convertingMouthFromNumToStr(num) {
    const month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return month_arr[parseInt(num) - 1]
};

// асинхронная функция для парсинга текста из ПДФ документа по url
export async function parsePdfToTxt(parse_url_pdf, quan_auth) {
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