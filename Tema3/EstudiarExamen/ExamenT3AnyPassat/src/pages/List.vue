<script setup>
import { onMounted, ref, computed, watch } from "vue"
import { GaleriaService } from "src/services/GaleriaService"
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const idiomaSeleccionat = ref(locale.value)
const opcionsIdioma = [
  { label: 'Català', value: 'ca' },
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' }
]

watch(idiomaSeleccionat, (val) => {
  locale.value = val
})

const obres = ref([])
const categories = ref([])
const categoriaSeleccionada = ref("Totes")

const carregarDades = async () => {
  try {
    const [resObres, resCategories] = await Promise.all([
      GaleriaService.getObres(),
      GaleriaService.getCategories()
    ])
    obres.value = resObres
    console.log(resObres)
    categories.value = resCategories
  } catch (error) {
    console.error("Error en la càrrega:", error)
  }
}

const obresFiltrades = computed(() => {
  if (categoriaSeleccionada.value === "Totes") {
    return obres.value
  }
  return obres.value.filter(
    obra => obra.categoria === categoriaSeleccionada.value
  )
})

const filtrar = (categoria) => {
  categoriaSeleccionada.value = categoria
}

onMounted(() => {
  carregarDades()
})
</script>

<template>
  <div class="q-pa-md">

    <div class="row justify-end q-mb-md">
      <q-select
        v-model="idiomaSeleccionat"
        :options="opcionsIdioma"
        :label="t('idioma')"
        map-options
        emit-value
        outlined
        dense
        style="min-width: 150px"
      />
    </div>

    <div class="q-mb-md">
      <q-btn
        :label="t('totes')"
        :color="categoriaSeleccionada === 'Totes' ? 'primary' : 'grey-7'"
        class="q-mr-sm"
        @click="filtrar('Totes')"
      />

      <q-btn
        v-for="cat in categories"
        :key="cat.name"
        :label="cat.name"
        @click="filtrar(cat.name)"
      />
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="obra in obresFiltrades"
        :key="obra.iditem"
        class="col-12 col-sm-6 col-md-3">

        <q-card flat bordered>
          <q-img
            :src="obra.url"
            height="150px"
          />
          <q-card-section class="text-center">
            <div class="text-subtitle1">
              {{ obra.titol }}
            </div>
            <div class="text-caption text-grey">
              Data Publicacio: {{ obra.data }}
            </div>
          </q-card-section>
        </q-card>

      </div>
    </div>
  </div>
</template>
