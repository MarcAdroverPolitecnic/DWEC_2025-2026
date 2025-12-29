<script setup>

import {ref} from 'vue';
import Header from '@/components/Header.vue';

const x = ref('Hello World');
x.value = 'Pots canviar aquest text';

//Això d'adalt es diu una variable reactiva. Què significa?:

//1) Vue actualitza la variable a tot el component
</script>

<template>
  <Header />
<h1 :class="{vermell: (x==='hola')}">{{ x }}</h1>
  <p v-if="x === 'adeu'">Adeu, ha acabat la classe</p>

  <input v-model="x">

</template>

<style scoped>
.vermell{
  color:red;
}

</style>