import { reactive } from 'vue'
import type { IDataGlobalMass } from '@/types/global-types'


const GLOBAL_MASS_DATA_URL: IDataGlobalMass[] | [] = reactive([])

export function useGlobalStores() {

    function getGlobalMassData(data: IDataGlobalMass) {
        GLOBAL_MASS_DATA_URL.push(data)
    }

    return {
        GLOBAL_MASS_DATA_URL,
        getGlobalMassData
    }

}