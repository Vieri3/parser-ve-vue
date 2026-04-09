<script setup  lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches.ts' 

const { ref_show_hide_loading } = useGlobalSwitchers();

</script>

<template>

<div v-if="ref_show_hide_loading" class="mx-auto text-red-500">Загрузка...</div>

</template>

<style scoped>

</style>