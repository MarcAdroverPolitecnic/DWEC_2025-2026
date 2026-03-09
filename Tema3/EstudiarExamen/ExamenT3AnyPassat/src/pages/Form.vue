<script setup>
import { onMounted, ref } from "vue"
import { Obra } from "src/models/Obra"
import { GaleriaService } from "src/services/GaleriaService"

const elFormulari = ref(null)
const categories = ref([])

const novaObra = ref(new Obra())

const getCategories = async () => {
  try {
    categories.value = await GaleriaService.getCategories()
  } catch (error) {
    console.error("Error carregant categories:", error)
  }
}

const enviarFormulari = async () => {
  const esValid = await elFormulari.value.validate()

  if (esValid) {
    try {
      await GaleriaService.saveObra(novaObra.value.toPayload())

      novaObra.value = new Obra()
      elFormulari.value.resetValidation()
    } catch (error) {
      console.error("Error en la petició:", error)
    }
  }
}

onMounted(() => {
  getCategories()
})
</script>

<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-form ref="elFormulari" @submit="enviarFormulari" class="q-gutter-md">

      <q-input
        v-model="novaObra.titol"
        label="Títol *"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Camp obligatori']"
      />

      <q-input
        v-model="novaObra.url"
        label="URL *"
        lazy-rules
        :rules="[
          val => val && val.length > 0 || 'Camp obligatori',
          val => /\.(jpg|jpeg|png)$/i.test(val) || 'Format invàlid (.jpg, .png, .jpeg)'
        ]"
      />

      <q-input
        v-model="novaObra.data"
        type="date"
        label="Data *"
        stack-label
        lazy-rules
        :rules="[val => !!val || 'Camp obligatori']"
      />

      <q-select
        v-model="novaObra.categoria"
        :options="categories"
        label="Categoria *"
        option-label="name"
        option-value="name"
        emit-value
        map-options
        lazy-rules
        option-label="name"
        option-value="name"
        :rules="[val => !!val || 'Selecciona una categoria']"
      />

      <div>
        <q-btn label="Desar Obra" type="submit" color="primary" />
      </div>

    </q-form>
  </div>
</template>
