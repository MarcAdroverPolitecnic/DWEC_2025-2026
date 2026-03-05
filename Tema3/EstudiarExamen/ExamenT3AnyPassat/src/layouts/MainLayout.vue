<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Galeria d'Art
        </q-toolbar-title>

      </q-toolbar>
    </q-header>


    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <q-item-label header>
          Menu
        </q-item-label>

        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          :to="link.link"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>


    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

const linksList = [
  {
    title: 'Inici',
    caption: 'Llista d’obres',
    icon: 'home',
    link: '/inici'
  },
  {
    title: 'Crear',
    caption: 'Afegir nova obra',
    icon: 'add',
    link: '/create'
  }
]

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
