<script setup lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches' 
import { useGlobalStores } from '@/composables/global-stores'
import { fetchJournales } from '@/services/useService'

const { ref_hide_header, hideHeader, showHideLoading, showHideTableJournales } = useGlobalSwitchers();
const { clearMassDataDisplayedInTable, clearMassDataSelectedValuesInTable, fillingMassDataDisplayedInTable } = useGlobalStores();

// выводим на экран все Journale 
async function parsePageJournales() {
    // скрываем header
    hideHeader();
    // Включаем визуально компонент загрузка
    showHideLoading();
    // очищаем основной массив (от предыдущих операций) где берутся данные для отображения 
    clearMassDataDisplayedInTable();
    // очищаем массив ранее выбранных элементов (от предыдущих операций) где брались данные для пересылки
    clearMassDataSelectedValuesInTable();
    try {
        const res = await fetchJournales();
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };
        const data = await res.json();
        // заполняем массив для отображения таблицы
        fillingMassDataDisplayedInTable(data);
    } catch (err) {
        console.error(err)
    } finally {
        // показываем компонент TABLE 
        showHideTableJournales();
        /// Выключаем визуально компонент загрузка
        showHideLoading();
    }
};

</script>

<template>
    <div class="flex flex-col justify-center" v-if="ref_hide_header">
        <h1 class="text-center text-2xl my-2">
            <slot name="titleSite"></slot>
        </h1>
        <a
            class="text-blue-500 underline hover:text-red-500 hover:no-underline text-center text-2xl"
            href="https://www.virtual-economics.eu/index.php/VE/issue/archive"
            target="_blank"
        >
            <slot name="txt-name-origin-site"></slot>
        </a>
        <div class="mx-auto *:mx-1">
            <!--Button for first load links Archives-->
            <button
                @click="parsePageJournales"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 cursor-pointer rounded mx-auto"
            >
                <slot name="txt-name-btn-upload"></slot>
            </button>
        </div>
    </div>
</template>

<style scoped></style>