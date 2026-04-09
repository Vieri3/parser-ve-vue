// функции принимает строку и декодирует символы
export function getDecodedRdf(str) {
    return str
        .replaceAll("&#039;", "'")
        .replaceAll("&amp;", "&")
        .replaceAll("M&amp;A", "M&A")
        .replaceAll("&quot;", '"')
        .replaceAll("&nbsp;", " ");
    // .replaceAll("'", "\'")
    // .replaceAll("'", "\"")
    // .replaceAll("`", "\`")
    // .replaceAll("`", "\\")
};

// функции принимает строку и декодирует символы
export function getDecodedXml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("'", "\\'")
        .replaceAll("`", "\\`")
        .replaceAll("<", "'<'")
        .replaceAll(">", "'>'")
};
// функция получает данные <refrence> без нумерации списка
export function getDataWithoutNum(str) {
    return str.replace(/^[0-9.\s]*/, '');
};

// функция переводит из числового месяца в словарный 
export function getNameOfTheMonth(num) {
    const month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return month_arr[parseInt(num) - 1]
};

/// функция принимает текстовый маил с сайта в виде цифр и СОЛЬ ключи дешифрования
// возвращает текстовый маил
export function getDecryptedEmail(id_email) {
    const cipher_keys = {
        '11': 'a',
        '12': 'b',
        '13': 'c',
        '14': 'd',
        '15': 'e',
        '16': 'f',
        '17': 'g',
        '18': 'h',
        '19': 'i',
        '20': 'j',
        '21': 'k',
        '22': 'l',
        '23': 'm',
        '24': 'n',
        '25': 'o',
        '26': 'p',
        '27': 'q',
        '28': 'r',
        '29': 's',
        '30': 't',
        '31': 'u',
        '32': 'v',
        '33': 'w',
        '34': 'x',
        '35': 'y',
        '36': 'z',
        '37': 'A',
        '38': 'B',
        '39': 'C',
        '40': 'D',
        '41': 'E',
        '42': 'F',
        '43': 'G',
        '44': 'H',
        '45': 'I',
        '46': 'J',
        '47': 'K',
        '48': 'L',
        '49': 'M',
        '50': 'N',
        '51': 'O',
        '52': 'P',
        '53': 'Q',
        '54': 'R',
        '55': 'S',
        '56': 'T',
        '57': 'U',
        '58': 'V',
        '59': 'W',
        '60': 'Y',
        '61': 'Z',
        '62': '!',
        '63': '@',
        '64': '\#',
        '65': '$',
        '66': '%',
        '67': '^',
        '68': '&',
        '69': '*',
        '70': '(',
        '71': ')',
        '72': '-',
        '73': '_',
        '74': '=',
        '75': '+',
        '76': '[',
        '77': ']',
        '78': '{',
        '79': '}',
        '80': '|',
        '81': ';',
        '82': ':',
        '83': '\'',
        '84': '"',
        '85': ',',
        '86': '.',
        '87': '/',
        '88': '?',
        '89': '0',
        '90': '1',
        '91': '2',
        '92': '3',
        '93': '4',
        '94': '5',
        '95': '6',
        '96': '7',
        '97': '8',
        '98': '9',
    };
    let txt_email = '';
    const mass_key_symbol = id_email.match(/.{1,2}/g);
    const mass_key_symbol_len = mass_key_symbol.length;
    for (let i = 0; i < mass_key_symbol_len; i++) {
        txt_email += cipher_keys[mass_key_symbol[i]]
    }
    return txt_email;
}


