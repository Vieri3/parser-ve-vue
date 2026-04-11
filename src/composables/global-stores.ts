import { ref, reactive } from 'vue'
import type { IDataGlobalMass } from '@/types/global-types.ts'
import{ EDataSite } from '@/constants/constants.ts'

const GLOBAL_MASS_DATA_URL = reactive([] as IDataGlobalMass[])
const GLOBAL_MODAL_UPDATES = ref<string>('')

export function useGlobalStores() {

    function getGlobalMassData(data: IDataGlobalMass): void {
        // @ts-ignore
        GLOBAL_MASS_DATA_URL.push(...data)
        // при первой загрузке мы сохраняем копию в seesionStorage
        window.sessionStorage.setItem(EDataSite.NAME_SESSIONSTORAGE, JSON.stringify(GLOBAL_MASS_DATA_URL))
    }

    function getTxtUpdates(txt: string): void {
        GLOBAL_MODAL_UPDATES.value = txt
    }
    // в случае перезагрузки страницы чтобы занво не парсить данные с сайта 
    function getGlobalMassDataFromSessionStorage(data_session_storage: string){
        // из строки в массив
        const mass_store = JSON.parse(data_session_storage as string)
        // Добавляем новые элементы
        GLOBAL_MASS_DATA_URL.push(...mass_store);
    }

    return {
        GLOBAL_MODAL_UPDATES,
        GLOBAL_MASS_DATA_URL,
        getGlobalMassData,
        getTxtUpdates,
        getGlobalMassDataFromSessionStorage
    }

}