<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-icon name="stadium" class="q-mr-sm" />
          Stadium Manager
        </q-toolbar-title>
        <q-space />
        <q-btn flat round icon="settings" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8 text-weight-bold">
          Administration
        </q-item-label>

        <q-item clickable v-ripple to="/stadiums" exact>
          <q-item-section avatar>
            <q-icon name="stadium" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Stadium Selection</q-item-label>
            <q-item-label caption>Select stadium for events</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/stadiums/create" exact>
          <q-item-section avatar>
            <q-icon name="add_circle" color="positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Create Stadium</q-item-label>
            <q-item-label caption>Build a new stadium</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item-label header class="text-grey-8 text-weight-bold">
          Events
        </q-item-label>

        <q-item clickable v-ripple to="/events" exact>
          <q-item-section avatar>
            <q-icon name="event" color="accent" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Events</q-item-label>
            <q-item-label caption>Create and edit events</q-item-label>
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

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
