<script setup lang="ts">

import { useGlobalSwitchers } from '@/composables/global-switches.ts'

const { ref_show_hide_loading } = useGlobalSwitchers();

</script>

<template>
    <Transition
        name="fade"
        mode="out-in"
    >
        <div
            v-if="ref_show_hide_loading"
            class="bg"
        >Loading...</div>
    </Transition>
</template>

<style scoped>
.bg {
    position: fixed;
    z-index: 10;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    font-size: 5vh;
    cursor: wait;
}

/* переход основан на классах перехода 'fade' */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>