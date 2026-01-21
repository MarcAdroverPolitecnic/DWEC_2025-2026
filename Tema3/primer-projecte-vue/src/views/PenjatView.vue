<script setup>

import Paraula from "../components/penjat/Paraula.vue";
import Imagte from "../components/penjat/Imagte.vue";
import Lletra from "../components/penjat/Lletra.vue";
import { LletraService } from "../../service/penjat/lletraService.js";
import {onMounted, ref} from "vue";

const lletraService = new LletraService();
const abecedari = ref([]);

onMounted(() => {
  abecedari.value = lletraService.initAbecedari();
})
</script>

<template>
<Lletra v-for="lletra in abecedari" :lletra="lletra"></Lletra>
<Paraula></Paraula>
<Imagte></Imagte>
</template>

<style scoped>

</style>