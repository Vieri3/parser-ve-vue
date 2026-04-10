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
    <button
        v-if="ref_hide_header"
        @click="getJournalesAndArticlesUrls"
        class="border-2 border-dashed rounded size-20 mt-10 text-2xl mx-auto block hover:text-amber-500 hover:border-amber-500 cursor-pointer"
    >
        <slot name="txt-name-btn-upload"></slot>
    </button>
</template>

<style scoped>
</style>