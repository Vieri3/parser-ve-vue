<script setup lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches.ts'
import { useGlobalStores } from '@/composables/global-stores.ts'

const { ref_show_hide_modal_updates, showHideModalUpdates } = useGlobalSwitchers();
const { GLOBAL_MODAL_UPDATES } = useGlobalStores()

</script>

<template>
    <div
        v-if="ref_show_hide_modal_updates"
        @click="showHideModalUpdates"
        class="modal-window"
    >
        <div
            class="bg-gray-800 text-amber-500 border-2 rounded border-blue-500 p-4 mx-3 flex items-center justify-center">
            {{ GLOBAL_MODAL_UPDATES }}
        </div>
    </div>
</template>

<style scoped></style>
