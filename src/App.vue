<script setup lang="ts">

import { ref } from 'vue'

import { mass_updates_site, getVersionSite } from '@/utils/updates-site.ts'

import { downloadFile } from '@/utils/utils.ts'

import type { IParsedData, IParseUrl } from '@/types/global-types.ts';

import { API_URL, EDataSite } from '@/constants/constants.ts';

import TheHeader from '@/components/layout/TheHeader.vue';

//функция проверяет версию сайта
getVersionSite(mass_updates_site)
// кнопка для начала программы
const show_btn_start = ref<boolean>(true);
// показывает Загрузка...
const loading = ref<boolean>(false);
// скрывает/показывает БЛОК с Table
const show_table = ref<boolean>(false);
// archives or articles реактивно выводим название таблиц
const title_table = ref<string>('');
// скрывает/показывает БЛОК с Articles
const show_list_parsed_data = ref<boolean>(false);
// данные с сервера будут возвращаться вот сюда (ссылки на статьи)
const mass_data_displayed_in_table = ref<IParseUrl[]>([])
// массив отмеченных чекбоксов (эти данные будут отслаться на сервер)
const mass_data_selected_values_in_table = ref<string[] | []>([]);
// данные с сервера. (готовые данные статьи)
const mass_data_after_parsing = ref<IParsedData[]>([])

// функция сброса checkboxes
function resetValuesInTableArchives() {
    mass_data_selected_values_in_table.value = []
};
// функция выбора статей
function selectionValuesInTableArchives() {
    mass_data_selected_values_in_table.value = mass_data_displayed_in_table.value.map(el => el.url)!
};
// функиця которая запускает оредлеленную функцию в зависимости от данных в таблице
function getParseFn() {
    if (title_table.value === EDataSite.NAME_TABLE_ARCHIVES) {
        parsePageArticles()
    }
    if (title_table.value === EDataSite.NAME_TABLE_ARTICLES) {
        parseEveryOneArticle()
    }
}

// получение данных полным пакетом все Archives
async function parsePageArchives() {
    // скрываем кнопку стартовой загрузки всех Archives
    show_btn_start.value = false;
    // Включаем визуально компонент загрузка
    loading.value = true;
    // очищаем основной массив (от предыдущих операций) где берутся данные для отображения 
    mass_data_displayed_in_table.value = [];
    try {
        const res = await fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_GET_ARCHIVES);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const data = await res.json();
        // заполняем массив для отображения таблицы
        mass_data_displayed_in_table.value = data;
    } catch (err) {
        console.error(err)
    } finally {
        // выводим в шаблоне название таблицы
        title_table.value = EDataSite.NAME_TABLE_ARCHIVES;
        // показываем компонент TABLE 
        show_table.value = true;
        /// Выключаем визуально компонент загрузка
        loading.value = false;
    }
};
// получение данных Articles (STREAM потоком) из выбранных Archives
async function parsePageArticles() {
    loading.value = true;
    mass_data_displayed_in_table.value = [];;
    try {
        const res = await fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_ARTICLES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mass_data_selected_values_in_table.value)
        });
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        // очищаем массив предыдущих выбранных элементов
        mass_data_selected_values_in_table.value = [];

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                const item = JSON.parse(line)
                console.log('Получен объект:', item)
                // Обрабатываем каждый объект по мере поступления
                mass_data_displayed_in_table.value.push(item);
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        title_table.value = EDataSite.NAME_TABLE_ARTICLES;
        loading.value = false;
    }
};
// получение данных Article (STREAM потоком) из выбранных Articles
async function parseEveryOneArticle() {
    // прячем таблицу ранее выбираеммых элементов
    show_table.value = false;
    // показываем визуально компонент загрузки
    loading.value = true;
    // очищаем основной массив (от предыдущих операций) где берутся данные для отображения 
    mass_data_displayed_in_table.value = [];
    // показываем блок где будут появляться Articles
    show_list_parsed_data.value = true;
    try {
        const res = await fetch(API_URL + EDataSite.SUBDIRECTORY_SITE_API_NAME + EDataSite.RES_POST_ARTICLE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mass_data_selected_values_in_table.value)
        });
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        // очищаем массив предыдущих выбранных элементов
        mass_data_selected_values_in_table.value = [];

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                const item = JSON.parse(line)
                console.log('Получен объект:', item)
                // Обрабатываем каждый объект по мере поступления
                mass_data_after_parsing.value.push(item);
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    <div class="container mx-auto">

        <TheHeader
            link_origin_site="https://www.virtual-economics.eu/index.php/VE/issue/archive"
            :container_start_btn="show_btn_start"
            :fn_parsePageArchives="parsePageArchives"
        >
            <template v-slot:titleSite>
                Welcome to the article parsing page
            </template>
            <template #txt-name-origin-site>
                virtual-economics.eu
            </template>
            <template #txt-name-btn-upload>
                Upload a table Archives
            </template>
        </TheHeader>

        <div v-if="loading">Загрузка...</div>

        <!--table-->
        <table
            v-if="show_table"
            class="table-auto border-separate border border-gray-400 mx-auto min-w-80 sm:min-w-130"
        >
            <caption class="caption-top py-2">
                <h1 class="underline text-2xl font-bold">Table: {{ title_table }}</h1>
                <div class="flex flex-col sm:flex-row justify-between">

                    <div class="mt-3 *:font-bold *:px-2 sm:*:px-4 *:mx-1 *:cursor-pointer">
                        <button
                            @click="getParseFn"
                            v-if="mass_data_selected_values_in_table.length > 0"
                            class=" bg-green-500 hover:bg-green-400 py-2 border-b-4 border-green-700 hover:border-green-500 rounded"
                            id="btn-archives-submit"
                        >execute</button>
                        <button
                            @click="selectionValuesInTableArchives"
                            v-if="mass_data_selected_values_in_table.length !== mass_data_displayed_in_table.length"
                            class=" bg-amber-500 hover:bg-amber-400 py-2 border-b-4 border-amber-700 hover:border-amber-500 rounded"
                            id="btn-archives-submit"
                        >select all</button>
                        <button
                            @click="resetValuesInTableArchives"
                            v-if="mass_data_selected_values_in_table.length > 0"
                            class=" bg-red-500 hover:bg-red-400 py-2 border-b-4 border-red-700 hover:border-red-500 rounded"
                            id="btn-archives-reset"
                        >reset</button>
                    </div>

                    <div class="*:font-bold content-end mt-2">
                        <span class="text-green-700 text-xl px-2">All: {{ mass_data_displayed_in_table.length }}</span>
                        <span class="text-amber-500 text-xl px-2">Selected: {{
                            mass_data_selected_values_in_table.length }}</span>
                    </div>

                </div>
            </caption>

            <thead>
                <tr>
                    <th class="border border-gray-300 bg-gray-200">checkbox</th>
                    <th class="border border-gray-300 bg-gray-200">{{ title_table }}</th>
                </tr>
            </thead>
            <tbody>

                <tr
                    class="scroll-line"
                    v-for="res, idx in mass_data_displayed_in_table"
                    :key="idx"
                >
                    <td class="border border-gray-300 text-center py-1">
                        <input
                            class="scale-150 cursor-pointer"
                            type="checkbox"
                            :value="res.url"
                            :id="idx.toString()"
                            v-model="mass_data_selected_values_in_table"
                        >
                    </td>
                    <td class="border border-gray-300">
                        <a
                            class="text-blue-500 underline hover:text-red-500 hover:no-underline"
                            :href="res.url"
                            target="_blank"
                        >{{ res.title }}</a>
                    </td>
                </tr>

            </tbody>
        </table>

        <!--list Parsed Data -->
        <div
            v-if="show_list_parsed_data"
            class="mx-auto"
        >
            <h1 class="text-center text-2xl font-bold underline py-2">List: {{ title_table }}</h1>
            <details
                class="py-2 my-1 bg-amber-400"
                v-for="res, idx in mass_data_after_parsing"
                :key="idx"
            >
                <summary class="pl-5 text-xl">
                    <h1 class="font-bold text-xl inline">{{ res.file_name }}</h1>
                    <div class="pl-5 text-xl"><small class="pr-3">download:</small>
                        <button
                            @click="downloadFile(res.file_name, res.str_data_out)"
                            class="text-blue-500 underline font-bold hover:text-green-900 hover:no-underline text-sm cursor-pointer"
                        >{{
                            res.file_name }}.rdf</button>
                    </div>
                </summary>
                <table class="table-auto border-separate border border-black mx-3">
                    <tbody>
                        <tr v-for="pos in res.table_data_out">
                            <td class="border border-black font-bold w-50">{{ pos[0] }}</td>
                            <td class="border border-black">{{ pos[1] }}</td>
                        </tr>
                    </tbody>
                </table>
            </details>
        </div>

    </div>

</template>

<style scoped></style>
