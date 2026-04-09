<script setup lang="ts">

import { fetchJournalesAndArticlesUrls } from '@/services/useService.ts'
import { useGlobalStores } from '@/composables/global-stores.ts'
import { useGlobalSwitchers } from '@/composables/global-switches.ts'

const { getGlobalMassData } = useGlobalStores()
const { ref_hide_header, hideHeader, showHideLoading, showTable } = useGlobalSwitchers()

// выводим на экран все  
async function getJournalesAndArticlesUrls() {
    hideHeader();
    showHideLoading();
    try {
        const res = await fetchJournalesAndArticlesUrls()
        if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) };

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
                getGlobalMassData(item);
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        // показываем компонент TABLE 
        showTable();
        // Выключаем визуально компонент загрузка
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
            <button
                @click="getJournalesAndArticlesUrls"
                class="hover:bg-gray-900 border-dashed border-2 py-2 px-4 mt-5 cursor-pointer hover:rounded mx-auto"
            >
                <slot name="txt-name-btn-upload"></slot>
            </button>
        </div>
    </div>
</template>

<style scoped></style>