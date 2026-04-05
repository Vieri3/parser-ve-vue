<script setup lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches.ts'
import { useGlobalStores } from '@/composables/global-stores'
import { fetchArticles } from '@/services/useService'

const { ref_show_hide_table_journales, showHideTableJournales, showHideLoading, showHideTableArticles } = useGlobalSwitchers();
const { mass_data_displayed_in_table, mass_data_selected_values_in_table, clearMassDataDisplayedInTable, selectionAllValuesInTable, pushMassDataDisplayedInTable, clearMassDataSelectedValuesInTable } = useGlobalStores();

const showAlert = () => alert('Sorry!!! This functionality is under development.')

// получение данных Articles (STREAM потоком) из выбранных Journale
async function parsePageArticles() {
    showHideTableJournales();
    showHideLoading();
    clearMassDataDisplayedInTable();
    try {
        const res = await fetchArticles(mass_data_selected_values_in_table.value);
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        // очищаем массив предыдущих выбранных элементов
        clearMassDataSelectedValuesInTable();
        // поазываем таблицу Articles
        showHideTableArticles();

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                const item = JSON.parse(line)
                // console.log('Получен объект:', item)
                // Обрабатываем каждый объект по мере поступления
                pushMassDataDisplayedInTable(item);
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        showHideLoading();
    }
};

</script>

<template>
    <table
        v-if="ref_show_hide_table_journales"
        class="table-auto border-separate border border-gray-400 mx-auto min-w-80 sm:min-w-130"
    >
        <thead class="sticky top-0 bg-gray-200 z-1">
            <tr>
                <th colspan="4">
                    <h1 class="underline text-2xl font-bold">Table: Journales</h1>
                </th>
            </tr>
            <tr>
                <th colspan="4">
                    <div class="mt-3 *:font-bold *:p-2 sm:*:px-4 *:mx-1 *:rounded *:border-b-4 *:cursor-pointer">
                        <!--execute btn-->
                        <button
                            @click="parsePageArticles"
                            :class="mass_data_selected_values_in_table.length > 0 ? 'bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500' : 'opacity-25 pointer-events-none bg-gray-500 border-gray-700'"
                        >execute</button>
                        <!--selection btn-->
                        <button
                            @click="selectionAllValuesInTable"
                            :class="mass_data_selected_values_in_table.length !== mass_data_displayed_in_table.length ? 'bg-amber-500 hover:bg-amber-400 border-amber-700 hover:border-amber-500' : 'opacity-25 pointer-events-none bg-gray-500 border-gray-700'"
                        >select all</button>
                        <!--reset btn-->
                        <button
                            @click="clearMassDataSelectedValuesInTable"
                            :class="mass_data_selected_values_in_table.length > 0 ? 'bg-red-500 hover:bg-red-400 border-red-700 hover:border-red-500' : 'opacity-25 pointer-events-none bg-gray-500 border-gray-700'"
                        >reset</button>
                    </div>
                    <div class="*:font-bold content-end mt-2">
                        <span class="text-green-700 text-xl px-2">All: {{ mass_data_displayed_in_table.length }}</span>
                        <span class="text-amber-500 text-xl px-2">Selected:{{
                            mass_data_selected_values_in_table.length }}</span>
                    </div>
                </th>
            </tr>
            <tr class="*:px-2">
                <th class="border border-gray-300">checkbox</th>
                <th class="border border-gray-300">link to Journale on site </th>
                <th class="border border-gray-300">link to download Journale [.xml]</th>
            </tr>
        </thead>

        <tbody>
            <tr
                class="*:px-2"
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
                <td class="border border-gray-300">
                    <button
                        @click="showAlert"
                        class="text-green-700 underline hover:text-green-500 hover:no-underline text-sm cursor-pointer"
                    >{{
                        res.title }}.xml</button>
                </td>
            </tr>
        </tbody>
    </table>


</template>

<style scoped></style>