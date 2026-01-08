<script setup>
import {RouterView, RouterLink} from 'vue-router'
import router from "@/router/index.js";
import Boto from "@/components/Boto.vue";

function redireccionar(){
  router.push({ name: "about" });
}
</script>

<template>
  <h1>Main layout</h1>
  <div>Header del main</div>
  <nav>
    <ul>
      <li>
        <RouterLink to="/admin/hello">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/about">About</RouterLink>
      </li>
    </ul>
  </nav>
  <Boto nom="BotoVermell"/>

  <button @click="redireccionar">Redirecciona a /about</button>
  <RouterView />
  <div>Footer del main</div>
</template>

<style scoped>

</style>