<script setup lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches.ts'
import { useGlobalStores } from '@/composables/global-stores'
import { fetchArticle } from '@/services/useService'
import { downloadFile } from '@/utils/utils'

const { ref_show_hide_table_articles, showHideLoading } = useGlobalSwitchers();
const { mass_data_displayed_in_table } = useGlobalStores();

// получение данных Article (STREAM потоком) из выбранных Articles
async function parseEveryOneArticle(url_article: string) {
    // показываем визуально компонент загрузки
    showHideLoading();
    try {
        const res = await fetchArticle(url_article);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const data = await res.json();
        downloadFile(data.file_name, data.str_data_out)
    } catch (err) {
        console.error(err)
    } finally {
        showHideLoading();
    }
};

</script>

<template>
    <table
        v-if="ref_show_hide_table_articles"
        class="table-auto border-separate border border-gray-400 mx-auto min-w-80 sm:min-w-130"
    >
        <thead class="sticky top-0 bg-gray-200 z-1">
            <tr>
                <th colspan="4">
                    <h1 class="underline text-2xl font-bold">Table: Articles</h1>
                </th>
            </tr>
            <tr class="*:px-2">
                <th class="border border-gray-300">#</th>
                <th class="border border-gray-300">link to Article on site </th>
                <th class="border border-gray-300">link to download Article [.rdf]</th>
            </tr>
        </thead>

        <tbody>
            <tr
                class="*:px-2"
                v-for="res, idx in mass_data_displayed_in_table"
                :key="idx"
            >
                <td class="border border-gray-300">
                    {{ idx + 1 }}
                </td>
                <td class="border border-gray-300">
                    <a
                        class="text-blue-500 underline hover:text-red-500 hover:no-underline"
                        :href="res.url"
                        target="_blank"
                    >{{ res.title }}</a>
                </td>
                <td class="border border-gray-300">
                    <button
                        @click="parseEveryOneArticle(res.url)"
                        class="text-amber-700 underline hover:text-amber-500 hover:no-underline text-sm cursor-pointer"
                    >file.rdf</button>
                </td>
            </tr>
        </tbody>
    </table>


</template>

<style scoped></style>