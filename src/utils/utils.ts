// функция для показа изменений на сайте 
export default function getVersionSite(mass_updates: Array<{number: string, description: string}>): void{
    const lastUpdates = mass_updates[mass_updates.length - 1]

    const CURRENT_VERSION = lastUpdates.number;
    const SAVED_VERSION = localStorage.getItem("siteParserVeVueVersion");
    if(SAVED_VERSION !== CURRENT_VERSION){
        alert(lastUpdates.description)
        localStorage.setItem("siteParserVeVueVersion", CURRENT_VERSION)
    }
}