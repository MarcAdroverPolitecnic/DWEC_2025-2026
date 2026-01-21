<script setup>
const props = defineProps({
  lletra: {
    type: Object,
    required: true
  }
})
</script>

<template>
<p>Lletra {{lletra.lletra}}</p>
</template>

<style scoped>

</style>