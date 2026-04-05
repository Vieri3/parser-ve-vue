import { ref } from 'vue'
import type { IParseUrl } from '@/types/global-types'

// данные с сервера будут возвращаться вот сюда (ссылки на статьи)
const mass_data_displayed_in_table = ref<IParseUrl[]>([])
// массив отмеченных чекбоксов (эти данные будут отслаться на сервер)
const mass_data_selected_values_in_table = ref<string[] | []>([]);

export function useGlobalStores() {

    function clearMassDataDisplayedInTable() {
        mass_data_displayed_in_table.value = []
    };

    function clearMassDataSelectedValuesInTable(){
        mass_data_selected_values_in_table.value = []
    };

    function fillingMassDataDisplayedInTable(data: any){
        mass_data_displayed_in_table.value = data
    };

    function pushMassDataDisplayedInTable(data: any){
        mass_data_displayed_in_table.value.push(data)
    };

    // функция выбора Journale
    function selectionAllValuesInTable() {
        mass_data_selected_values_in_table.value = mass_data_displayed_in_table.value.map(el => el.url)!
    };


    return {
        mass_data_displayed_in_table,
        mass_data_selected_values_in_table,
        clearMassDataDisplayedInTable,
        clearMassDataSelectedValuesInTable,
        fillingMassDataDisplayedInTable,
        pushMassDataDisplayedInTable,
        selectionAllValuesInTable
    }

}