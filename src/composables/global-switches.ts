import { ref } from 'vue'

// кнопка для начала программы
const ref_hide_header = ref<boolean>(true);
// показывает Загрузка...
const ref_show_hide_loading = ref<boolean>(false);
// скрывает/показывает БЛОК с Table Journales
const ref_show_hide_table_journales = ref<boolean>(false);
// скрывает/показывает БЛОК с Table Articles
const ref_show_hide_table_articles = ref<boolean>(false);

export function useGlobalSwitchers() {

    function hideHeader() {
        ref_hide_header.value = !ref_hide_header.value
    };
    function showHideLoading() {
        ref_show_hide_loading.value = !ref_show_hide_loading.value
    };
    function showHideTableJournales() {
        ref_show_hide_table_journales.value = !ref_show_hide_table_journales.value
    };
    function showHideTableArticles() {
        ref_show_hide_table_articles.value = !ref_show_hide_table_articles.value
    }

    // function showHideLoadingArticle()

    return {
        hideHeader,
        showHideLoading,
        showHideTableJournales,
        showHideTableArticles,
        ref_hide_header,
        ref_show_hide_loading,
        ref_show_hide_table_journales,
        ref_show_hide_table_articles
    }

}