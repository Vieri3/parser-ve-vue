<script setup lang="ts">

import { mass_updates_site, getVersionSite } from '@/utils/updates-site.ts'

import TheHeader from '@/components/layout/TheHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import AppTableJournales from '@/components/layout/AppTableJournales.vue'
import AppTableArticles from '@/components/layout/AppTableArticles.vue'

//функция проверяет версию сайта
getVersionSite(mass_updates_site)

</script>

<template>
    <div class="container mx-auto">

        <!--The header-->
        <TheHeader>
            <template v-slot:titleSite>
                Welcome to the article parsing page
            </template>
            <template #txt-name-origin-site>
                virtual-economics.eu
            </template>
            <template #txt-name-btn-upload>
                download the log table from the archive
            </template>
        </TheHeader>

        <AppLoading />

        <!--Table Journale-->
        <AppTableJournales/>

        <!--Table Articles-->
        <AppTableArticles/>

    </div>

</template>

<style scoped></style>
