/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,vue,html}',  // Сканируем все Vue и JS/TS файлы в папке src
  ],
  plugins: [],
}

//Теперь при сборке останутся только используемые вами классы, что резко сократит итоговый размер CSS.