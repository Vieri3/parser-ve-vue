<script setup lang="ts">

import TheHeader from '@/components/layout/TheHeader.vue'
import AppTable from '@/components/layout/AppTable.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import AppModalUpdates from '@/components/ui/AppModalUpdates.vue'

import { mass_updates_site } from '@/constants/constants-updates.ts'
import { getVersionSite } from '@/utils/updates-site.ts'

getVersionSite(mass_updates_site)

</script>

<template>
    <div class="container mx-auto">

        <AppLoading/>

        <AppModalUpdates/>

        <TheHeader>
            <template #txt-name-btn-upload>
                GO
            </template>
        </TheHeader>
        
        <AppTable/>

    </div>

</template>

<style scoped></style>
