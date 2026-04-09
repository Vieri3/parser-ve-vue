<script setup lang="ts">

import { fetchArticleRdf, fetchJournaleXml } from '@/services/useService'
import { downloadFile } from '@/utils/utils'

import { useGlobalStores } from '@/composables/global-stores.ts'
import { useGlobalSwitchers } from '@/composables/global-switches.ts'

const { GLOBAL_MASS_DATA_URL } = useGlobalStores()
const { ref_show_hide_table, showHideLoading } = useGlobalSwitchers()

// получение данных Article (STREAM потоком) RDF
async function getArticleRdf(url_article: string) {
    // показываем визуально компонент загрузки
    showHideLoading();
    try {
        const res = await fetchArticleRdf(url_article);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const data = await res.json();
        downloadFile(data.file_name, data.str_data_out, 'rdf')
    } catch (err) {
        console.error(err)
    } finally {
        showHideLoading();
    }
};

// получение данных Journale (STREAM потоком)
async function getJournaleXml(obj_journale: any) {
    showHideLoading();
    try {
        const res = await fetchJournaleXml(obj_journale);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const data = await res.json();
        downloadFile(data.FILE_NAME, data.STR_DATA_XML, 'xml')
    } catch (err) {
        console.error(err)
    } finally {
        showHideLoading();
    }
};

</script>

<template>
        <table class=" mx-auto" v-if="ref_show_hide_table">

            <thead class="sticky top-0 z-1 text-blue-500 bg-black border-b-2 border-white ">
                <tr class="*:px-2">
                    <th class="border-r border-dashed border-white border-b-2">Articles</th>
                    <th>Journales</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    class="*:px-2 border-t border-white border-dashed"
                    v-for="journale, idx in GLOBAL_MASS_DATA_URL"
                    :key="'journale_' + idx"
                >
                    <td class="border-r border-dashed border-white text-center py-1">
                        <div>
                            <a
                                class="text-green-500 underline hover:text-red-500 hover:no-underline"
                                :href="journale.url_journale"
                                target="_blank"
                            >{{ journale.title_journale }}</a>
                        </div>
                        <div>
                            <button
                                @click="getJournaleXml(journale)"
                                class="text-amber-500 hover:text-red-500 cursor-pointer"
                            >journale.xml</button>
                        </div>
                    </td>

                    <td>
                        <div class=" my-2 p-1" v-for="article, idx in journale.array_urls_articles" :key="'article_' + idx">
                            <a
                                class="text-green-500 underline hover:text-red-500 hover:no-underline"
                                :href="article.url_article"
                                target="_blank"
                            >{{ article.title_article }}</a>
                            <button
                                @click="getArticleRdf(article.url_article)"
                                class="text-amber-500 hover:text-red-500 cursor-pointer pl-2 inline"
                            >article.rdf</button>
                        </div>

                    </td>

                </tr>

            </tbody>
        </table>

</template>

<style scoped></style>