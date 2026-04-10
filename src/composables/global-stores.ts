import { reactive } from 'vue'
import type { IDataGlobalMass } from '@/types/global-types.ts'


const GLOBAL_MASS_DATA_URL= reactive([] as IDataGlobalMass[])

export function useGlobalStores() {

    function getGlobalMassData(data: IDataGlobalMass) {
        GLOBAL_MASS_DATA_URL.push(data)
    }

    return {
        GLOBAL_MASS_DATA_URL,
        getGlobalMassData
    }

}