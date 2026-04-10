import { EDataSite } from '@/constants/constants.ts'
import { useGlobalSwitchers } from '@/composables/global-switches.ts'
import { useGlobalStores } from '@/composables/global-stores.ts'

const { showHideModalUpdates } = useGlobalSwitchers();
const { getTxtUpdates } = useGlobalStores()


// функция для показа изменений на сайте 
export function getVersionSite(mass_updates: Array<{ number: string, description: string }>): void {
    const lastUpdates = mass_updates[mass_updates.length - 1]
    const CURRENT_VERSION = lastUpdates.number;
    const SAVED_VERSION = localStorage.getItem(EDataSite.NAME_LOCALSTORAGE);
    if (SAVED_VERSION !== CURRENT_VERSION) {
        // открываем модальное окно
        showHideModalUpdates()
       // добавляем в него текст обновления
        getTxtUpdates(lastUpdates.description)
        localStorage.setItem(EDataSite.NAME_LOCALSTORAGE, CURRENT_VERSION)
    }
};

