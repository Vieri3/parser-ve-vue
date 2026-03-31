export const mass_updates_site: Array<{number: string, description: string}> = [
    {
        number: "0.0.2",
        description: "Внесены поправки стилей заголовков"
    },
    {
        number: "1.0.0",
        description: "Переход бэкенда c Express на Fastify"
    },
    // {
    //     number: "0.0.3",
    //     description: "ВОТ ТУТ ПИШЕМ"
    // },
];

// функция для показа изменений на сайте 
export function getVersionSite(mass_updates: Array<{number: string, description: string}>): void{
    const lastUpdates = mass_updates[mass_updates.length - 1]

    const CURRENT_VERSION = lastUpdates.number;
    const SAVED_VERSION = localStorage.getItem("siteParserVeVueVersion");
    if(SAVED_VERSION !== CURRENT_VERSION){
        alert(lastUpdates.description)
        localStorage.setItem("siteParserVeVueVersion", CURRENT_VERSION)
    }
}