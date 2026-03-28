<script setup lang="ts">

import { ref } from 'vue'
import ButtonParseArchives from './components/ButtonParseArchives.vue';

const API_URL = import.meta.env.VITE_API_URL

interface IParseUrl {
    title: string,
    url: string
};

interface IParsedData {
    file_name: string,
    str_data_out: string,
    table_data_out: string[]
}

const loading = ref<boolean>(false);
const show_btn_parse_archives = ref<boolean>(true);
const show_table_archives = ref<boolean>(false);
const show_table_views = ref<boolean>(false);
const show_table_parsed_data = ref<boolean>(false);

// данные с сервера будут возвращаться вот сюда
const mass_data_archives = ref<IParseUrl[]>([])
const mass_data_views = ref<IParseUrl[]>([])
const mass_data_after_parsing = ref<IParsedData[]>([])

// массив отмеченных чекбоксов
const mass_data_selected_values_in_table_archives = ref<string[] | []>([]);
const mass_data_selected_values_in_table_views = ref<string[] | []>([]);

// функции вроде как дублируются, но рекомендация VUE не стоит раздувать шаблон
function resetValuesInTableArchives() {
    mass_data_selected_values_in_table_archives.value = []
};

function selectionValuesInTableArchives() {
    mass_data_selected_values_in_table_archives.value = mass_data_archives.value.map(el => el.url)!
};

function resetValuesInTableViews() {
    mass_data_selected_values_in_table_views.value = []
};

function selectionValuesInTableViews() {
    mass_data_selected_values_in_table_views.value = mass_data_views.value.map(el => el.url)!
};

async function parsePageArchives() {
    // показываем загрузку
    loading.value = true
    mass_data_archives.value = [];
    try {
        const res = await fetch(`${API_URL}/api/parser/archives`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        mass_data_archives.value = data;
        console.log(data)
    } catch (err) {
        console.error(err)
    } finally {
        show_btn_parse_archives.value = false;
        loading.value = false;
        show_table_archives.value = true;
    }
};

async function parsePageViews() {
    // прячем таблицу выбора ссылок 
    show_table_archives.value = false;
    // показываем загрузку
    loading.value = true
    // очищаем массив от предыдущего заполнения если таков был
    mass_data_views.value = [];
    try {
        const res = await fetch(`${API_URL}/api/parser/views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mass_data_selected_values_in_table_archives.value)
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        // принимаем значение уже от сервера
        const data = await res.json();
        mass_data_views.value = data;
        console.log(data)
    } catch (err) {
        console.error(err)
    } finally {
        // Показываем что загрузка завершена 
        loading.value = false;
        // открываем следующую таблицу (шапку пока данных нет)
        show_table_views.value = true;
    }
};

async function parseEveryOneView() {
    show_table_views.value = false;
    loading.value = true;
    mass_data_after_parsing.value = [];
    console.log(mass_data_selected_values_in_table_views.value)
    try {
        const res = await fetch(`${API_URL}/api/parser/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mass_data_selected_values_in_table_views.value)
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        // принимаем массив обьектов с даными статей уже от сервера СРАЗУ ПАЧКОЙ а может надо ...
        const data = await res.json();
        mass_data_after_parsing.value = data;
        console.log(data)
    } catch (err) {
        console.error(err)
    } finally {
        // Показываем что загрузка завершена 
        loading.value = false;
        // открываем следующую таблицу (шапку пока данных нет)
        show_table_parsed_data.value = true;
    }
};

async function downloadFile(file_name: string, file_data: string) {
    // тип для обычного текста
    const mime_type = 'text/plain';
    const file_extension = 'rdf';
    const blob = new Blob([file_data], { type: mime_type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file_name + '.' + file_extension
    // эмулируем клик и очищаем память
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
}

</script>

<template>
    <div class="container mx-auto">

        <div class="flex flex-col justify-center">
            <h1 class="text-center text-2xl my-2">Welcome to the article parsing page</h1>
            <a
                class="text-blue-500 underline hover:text-red-500 hover:no-underline text-center text-2xl"
                href="https://www.virtual-economics.eu/index.php/VE/issue/archive"
                target="_blank"
            >virtual-economics.eu</a>
            <!--Button for first load link Archives-->
            <ButtonParseArchives
                v-if="show_btn_parse_archives"
                @click="parsePageArchives"
            />
        </div>

        <div v-if="loading">Загрузка...</div>

        <!--table Archives-->
        <table
            v-if="show_table_archives"
            class="table-auto border-separate border border-gray-400 mx-auto min-w-80 sm:min-w-130"
        >
            <caption class="caption-top py-2">
                <h1 class="underline text-2xl font-bold">Table: Archives</h1>
                <div class="flex flex-col sm:flex-row justify-between">

                    <div class="mt-3 *:font-bold *:px-2 sm:*:px-4 *:mx-1 *:cursor-pointer">
                        <button
                            @click="parsePageViews"
                            v-if="mass_data_selected_values_in_table_archives.length > 0"
                            class=" bg-green-500 hover:bg-green-400 py-2 border-b-4 border-green-700 hover:border-green-500 rounded"
                            id="btn-archives-submit"
                        >execute</button>
                        <button
                            @click="selectionValuesInTableArchives"
                            v-if="mass_data_selected_values_in_table_archives.length !== mass_data_archives.length"
                            class=" bg-amber-500 hover:bg-amber-400 py-2 border-b-4 border-amber-700 hover:border-amber-500 rounded"
                            id="btn-archives-submit"
                        >select all</button>
                        <button
                            @click="resetValuesInTableArchives"
                            v-if="mass_data_selected_values_in_table_archives.length > 0"
                            class=" bg-red-500 hover:bg-red-400 py-2 border-b-4 border-red-700 hover:border-red-500 rounded"
                            id="btn-archives-reset"
                        >reset</button>
                    </div>

                    <div class="*:font-bold content-end mt-2">
                        <span class="text-green-700 text-xl px-2">All: {{ mass_data_archives.length }}</span>
                        <span class="text-amber-500 text-xl px-2">Selected: {{
                            mass_data_selected_values_in_table_archives.length }}</span>
                    </div>

                </div>
            </caption>

            <thead>
                <tr>
                    <th class="border border-gray-300 bg-gray-200">checkbox</th>
                    <th class="border border-gray-300 bg-gray-200">Archives</th>
                </tr>
            </thead>
            <tbody>

                <tr
                    v-for="res, idx in mass_data_archives"
                    :key="idx"
                >
                    <td class="border border-gray-300 text-center py-1">
                        <input
                            class="scale-150 cursor-pointer"
                            type="checkbox"
                            :value="res.url"
                            :id="idx.toString()"
                            v-model="mass_data_selected_values_in_table_archives"
                        >
                    </td>
                    <td class="border border-gray-300 text-center">
                        <a
                            class="text-blue-500 underline hover:text-red-500 hover:no-underline"
                            :href="res.url"
                            target="_blank"
                        >{{ res.title }}</a>
                    </td>
                </tr>

            </tbody>
        </table>

        <!--table Views-->
        <table
            v-if="show_table_views"
            class="table-auto border-separate border border-gray-400 mx-auto min-w-80 sm:min-w-130"
        >
            <caption class="caption-top py-2">
                <h1 class="underline text-2xl font-bold">Table: Views</h1>
                <div class="flex flex-col sm:flex-row justify-between">

                    <div class="mt-3 *:font-bold *:px-2 sm:*:px-4 *:mx-1 *:cursor-pointer">
                        <button
                            @click="parseEveryOneView"
                            v-if="mass_data_selected_values_in_table_views.length > 0"
                            class="bg-green-500 hover:bg-green-400 py-2 border-b-4 border-green-700 hover:border-green-500 rounded"
                            id="btn-archives-submit"
                        >execute</button>
                        <button
                            v-if="mass_data_selected_values_in_table_views.length !== mass_data_views.length"
                            @click="selectionValuesInTableViews"
                            class="bg-amber-500 hover:bg-amber-400 py-2 border-b-4 border-amber-700 hover:border-amber-500 rounded"
                            id="btn-archives-submit"
                        >select all</button>
                        <button
                            v-if="mass_data_selected_values_in_table_views.length > 0"
                            @click="resetValuesInTableViews"
                            class="bg-red-500 hover:bg-red-400 py-2 border-b-4 border-red-700 hover:border-red-500 rounded"
                            id="btn-archives-reset"
                        >reset</button>
                    </div>

                    <div class="*:font-bold content-end mt-2">
                        <span class="text-green-700 text-xl px-2">All: {{ mass_data_views.length }}</span>
                        <span class="text-amber-500 text-xl px-2">Selected: {{
                            mass_data_selected_values_in_table_views.length }}</span>
                    </div>
                </div>

            </caption>
            <thead>
                <tr>
                    <th class="border border-gray-300 bg-gray-200 *:m-2">
                        checkbox
                    </th>
                    <th class="border border-gray-300 bg-gray-200">View</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="res, idx in mass_data_views"
                    :key="idx"
                >
                    <td class="border border-gray-300 text-center py-1">
                        <input
                            class="scale-150 cursor-pointer"
                            type="checkbox"
                            :value="res.url"
                            :id="idx.toString()"
                            v-model="mass_data_selected_values_in_table_views"
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

        <!--table Parsed Data -->
        <div
            v-if="show_table_parsed_data"
            class="mx-auto"
        >
            <h1 class="text-center text-2xl font-bold underline py-2">ARTICLES</h1>
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
                        >{{ res.file_name }}.rdf</button>
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
                <!-- <pre class="pl-10">{{ res.str_data_out }}</pre> -->
            </details>
        </div>

    </div>

</template>

<style scoped></style>
