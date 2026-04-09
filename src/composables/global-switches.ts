import { ref } from 'vue'

// начальная шапка
const ref_hide_header = ref<boolean>(true);
// скрывает/показывает Загрузка...
const ref_show_hide_loading = ref<boolean>(false);
// скрывает/показывает БЛОК с Table 
const ref_show_hide_table = ref<boolean>(false);

export function useGlobalSwitchers() {

    function hideHeader() {
        ref_hide_header.value = !ref_hide_header.value
    };
    function showHideLoading() {
        ref_show_hide_loading.value = !ref_show_hide_loading.value
    };
    function showTable() {
        ref_show_hide_table.value = !ref_show_hide_table.value
    };

    return {
        hideHeader,
        showHideLoading,
        showTable,
        ref_hide_header,
        ref_show_hide_loading,
        ref_show_hide_table
    }

}