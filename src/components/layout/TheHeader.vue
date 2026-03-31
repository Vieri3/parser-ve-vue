<script setup lang="ts">

    defineProps<{
        link_origin_site: string
        start_btn: boolean
        fn_parsePageArchives: () => Promise<void>
    }>()

</script>

<template>

    <div class="flex flex-col justify-center">
        <h1 class="text-center text-2xl my-2">
            <slot name="titleSite"></slot>
        </h1>
        <a
            class="text-blue-500 underline hover:text-red-500 hover:no-underline text-center text-2xl"
            :href="link_origin_site"
            target="_blank"
        >
            <slot name="txt-name-origin-site"></slot>
        </a>
        <!--Button for first load link Archives-->
        <button
            v-if="start_btn"
            @click="fn_parsePageArchives"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 cursor-pointer rounded mx-auto"
        ><slot name="txt-name-btn-upload"></slot></button>
    </div>

</template>

<style scoped></style>