<script setup lang="ts">

import TheHeader from '@/components/layout/TheHeader.vue'
import AppTable from '@/components/layout/AppTable.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import AppModalUpdates from '@/components/ui/AppModalUpdates.vue'

import { mass_updates_site } from '@/constants/constants-updates.ts'
import { getVersionSite } from '@/utils/updates-site.ts'

import{ EDataSite } from '@/constants/constants.ts'

import { useGlobalStores } from '@/composables/global-stores.ts'
import { useGlobalSwitchers } from '@/composables/global-switches.ts'

const { getGlobalMassDataFromSessionStorage } = useGlobalStores()
const { hideHeader, showTable } = useGlobalSwitchers()

const stored = window.sessionStorage.getItem(EDataSite.NAME_SESSIONSTORAGE);

if(stored){
    hideHeader()
    getGlobalMassDataFromSessionStorage(stored)
    showTable()
}

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
