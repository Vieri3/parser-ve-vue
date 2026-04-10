import { ref, reactive } from 'vue'
import type { IDataGlobalMass } from '@/types/global-types.ts'

const GLOBAL_MASS_DATA_URL = reactive([] as IDataGlobalMass[])
const GLOBAL_MODAL_UPDATES = ref<string>('')

export function useGlobalStores() {

    function getGlobalMassData(data: IDataGlobalMass): void {
        GLOBAL_MASS_DATA_URL.push(data)
    }

    function getTxtUpdates(txt: string): void {
        GLOBAL_MODAL_UPDATES.value = txt
    }

    return {
        GLOBAL_MODAL_UPDATES,
        GLOBAL_MASS_DATA_URL,
        getGlobalMassData,
        getTxtUpdates
    }

}