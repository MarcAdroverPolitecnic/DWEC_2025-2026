<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none text-weight-bold">Venue Selection</h4>
        <p class="text-grey-7 q-mb-none">Select a Venue to assign to an representation or create a new one</p>
      </div>
      <div class="col-auto">
        <q-btn
            color="primary"
            icon="add"
            label="Create Venue"
            unelevated
            to="/venues/create"
        />
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
                v-model="searchQuery"
                outlined
                dense
                placeholder="Search venues..."
                clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
                v-model="templateFilter"
                outlined
                dense
                :options="a"
                label="Filter by type"
                clearable
                emit-value
                map-options/>
          </div>
          <!-- templateOptions -->

          <div class="col-12 col-md-3">
            <q-select
                v-model="sortBy"
                outlined
                dense
                :options="sortOptions"
                label="Sort by"
                emit-value
                map-options/>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-banner v-if="venueService.error" class="bg-negative text-white q-mb-md rounded-borders">
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      {{ venueService.error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Retry" @click="loadVenues" />
      </template>
    </q-banner>

    <div v-else-if="filteredVenues.length > 0" class="row q-col-gutter-md">
      <div
          v-for="venue in filteredVenues"
          :key="venue.id"
          class="col-12 col-sm-6 col-lg-4">

        <q-card
            :class="[
            'venue-card cursor-pointer',
            { 'selected-venue': selectedVenueId === venue.id }
          ]"
        >

          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-weight-bold">{{ venue.name }}</div>
                <div class="text-caption text-grey-6">
                  <!--  {{ getTemplateInfo(venue.template).name }} -->
                </div>
              </div>
              <div class="col-auto"> <!-- :name="getTemplateInfo(venue.template).icon" -->
                <q-icon
                    :name="prova"
                    size="32px"
                    :color="selectedVenueId === venue.id ? 'primary' : 'grey-5'"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section>

            <div class="row q-col-gutter-sm text-caption">
              <div class="col-6">
                <q-icon name="event_seat" size="16px" class="q-mr-xs" />
                {{ venue.totalSeats?.toLocaleString() || 0 }} seats
              </div>
              <div class="col-6">
                <q-icon name="layers" size="16px" class="q-mr-xs" />
                {{ venue.zones?.length || 0 }} zones
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
                flat
                dense
                color="grey-7"
                icon="edit"
                label="Edit"
                @click.stop="editVenue(venue.id)"
            />
            <q-btn
                flat
                dense
                color="negative"
                icon="delete"
                label="Delete"
                @click.stop="confirmDelete(venue)"
            />
            <q-btn
                :flat="selectedVenueId !== venue.id"
                :unelevated="selectedVenueId === venue.id"
                dense
                :color="selectedVenueId === venue.id ? 'primary' : 'primary'"
                :icon="selectedVenueId === venue.id ? 'check_circle' : 'radio_button_unchecked'"
                :label="selectedVenueId === venue.id ? 'Selected' : 'Select'"
                @click.stop="selectVenue(venue.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-card v-else flat bordered class="text-center q-pa-xl">
      <q-icon name="venue" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No venues found</div>
      <div class="text-body2 text-grey-5 q-mb-md">
        {{ searchQuery ? 'Try adjusting your filters' : 'Create your first venue to get started' }}
      </div>
      <!-- || templateFilter -->

      <!-- && !templateFilter -->
      <q-btn
          v-if="!searchQuery"
          color="primary"
          icon="add"
          label="Create venue"
          unelevated
          to="/venues/create"
      />
    </q-card>

    <q-page-sticky v-if="selectedVenue" position="bottom" :offset="[0, 18]">
      <q-banner class="bg-primary text-white shadow-2 rounded-borders">
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        <strong>{{ selectedVenue.name }}</strong> selected
        <span class="q-ml-sm text-caption">
          ({{ selectedVenue.totalSeats?.toLocaleString() || 0 }} seats)
        </span>
        <template v-slot:action>
          <q-btn
              flat
              color="white"
              label="Assign to Event"
              icon="event"
              to="/events"
          />
          <q-btn
              flat
              color="white"
              label="Clear"
              @click="selectVenue(null)"
          />
        </template>
      </q-banner>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
//import { useRouter } from 'vue-router'
//import { useQuasar } from 'quasar'
//import { useVenueStore, VENUE_TEMPLATES } from '../stores/venueStore'
import { venueStore } from '../service/venueService.js'

//const $q = useQuasar()
//const router = useRouter()
const venueService = venueStore()

const searchQuery = ref('')
//const templateFilter = ref(null)
const sortBy = ref('name')

const selectedVenueId = computed(() => venueService.selectedVenueId)
const selectedVenue = computed(() => venueService.selectedVenue)

//const templateOptions = computed(() => [
//  { label: 'All Types', value: null },
//  //...Object.values(VENUE_TEMPLATES).map(t => ({
//  //  label: t.name,
//  //  value: t.id
//  //}))
//])

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Seats (High to Low)', value: 'seats-desc' },
  { label: 'Seats (Low to High)', value: 'seats' },
]

onMounted(() => {
  loadVenues()
})

async function loadVenues() {
  await venueService.fetchVenues()
}

const filteredVenues = computed(() => {
  let result = [...venueService.venuesList]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
        s.name.toLowerCase().includes(query)
    )
  }

  // Template filter
  //if (templateFilter.value) {
  //  result = result.filter(s => s.template === templateFilter.value)
  //}

  // Sorting Logic (Restored from Original)
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'seats':
      result.sort((a, b) => (a.totalSeats || 0) - (b.totalSeats || 0))
      break
    case 'seats-desc':
      result.sort((a, b) => (b.totalSeats || 0) - (a.totalSeats || 0))
      break
    case 'date':
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      break
    case 'date-desc':
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
  }

  return result
})

// Methods
//function getTemplateInfo(templateId) {
//  return VENUE_TEMPLATES[templateId] || { name: 'Custom', icon: 'venue' }
//}

//function selectVenue(id) {
//  venueStore.selectVenue(id)
//  if (id) {
//    $q.notify({
//      type: 'positive',
//      message: 'venue selected successfully',
//      position: 'top',
//      timeout: 2000
//    })
//  }
//}

//function handleVenueClick(venue) {
//  selectVenue(venue.id)
//}

//function editVenue(id) {
//  router.push(`/venues/edit/${id}`)
//}

//function confirmDelete(venue) {
//  $q.dialog({
//    title: 'Delete venue',
//    message: `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`,
//    cancel: true,
//    persistent: true,
//    color: 'negative'
//  }).onOk(async () => {
//    // ASYNC logic restored from App version
//    try {
//      await venueStore.deleteVenue(venue.id)
//      $q.notify({
//        type: 'positive',
//        message: 'venue deleted successfully',
//        position: 'top'
//      })
//    } catch (error) {
//      console.error('Error deleting venue:', error)
//
//      $q.notify({
//        type: 'negative',
//        message: 'Error deleting venue',
//        position: 'top'
//      })
//    }
//  })
//}
</script>

<style scoped>
</style>
