<script setup>
import router from "@/router/index.js";

defineProps({
  nom: String
})

function redireccionar(){
  router.push({ name: "about" });
}
</script>

<template>
<button @click="redireccionar">{{ nom }}</button>
</template>

<style scoped>
button{
  background-color: red;
}
</style>