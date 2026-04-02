<script setup lang="ts">

defineProps<{
    link_origin_site: string
    container_start_btn: boolean
    fn_parsePageArchives: () => Promise<void>
    fn_parseLazyPageArchives: () => Promise<void>
}>()

</script>

<template>

    <div class="flex flex-col justify-center" v-if="container_start_btn">
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
        <div class="mx-auto *:mx-1">
            <!--Button for first load links Archives-->
            <button
                @click="fn_parsePageArchives"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 cursor-pointer rounded mx-auto"
            >
                <slot name="txt-name-btn-upload"></slot>
            </button>
            <!--Button for first load-lazy links Archives-->
            <button
                @click="fn_parseLazyPageArchives"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 cursor-pointer rounded mx-auto"
            >
                <slot name="txt-name-btn-lazy-upload"></slot>
            </button>
        </div>
    </div>

</template>

<style scoped></style>