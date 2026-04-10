<script setup lang="ts">

import TheHeader from '@/components/layout/TheHeader.vue'
import AppTable from '@/components/layout/AppTable.vue'
import AppLoading from '@/components/ui/AppLoading.vue'

</script>

<template>
    <div class="container mx-auto">

        <AppLoading/>

        <TheHeader>
            <template #txt-name-btn-upload>
                GO
            </template>
        </TheHeader>
        
        <AppTable/>

    </div>

</template>

<style scoped></style>
