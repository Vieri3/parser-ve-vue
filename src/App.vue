<script setup lang="ts">

import TheHeader from '@/components/layout/TheHeader.vue'
import AppTable from '@/components/layout/AppTable.vue'
import AppLoading from '@/components/ui/AppLoading.vue'

</script>

<template>
    <div class="container mx-auto">

        <AppLoading/>

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
        
        <AppTable/>

    </div>

</template>

<style scoped></style>
