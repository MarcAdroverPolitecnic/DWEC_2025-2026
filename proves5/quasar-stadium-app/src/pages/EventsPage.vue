<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none text-weight-bold">Event Management</h4>
        <p class="text-grey-7 q-mb-none">Create and manage events with assigned stadiums</p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Create Event"
          unelevated
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Selected Stadium Banner -->
    <q-banner v-if="selectedStadium" class="bg-primary text-white q-mb-lg rounded-borders">
      <template v-slot:avatar>
        <q-icon name="stadium" />
      </template>
      <strong>Selected Stadium:</strong> {{ selectedStadium.name }}
      <span class="q-ml-sm text-caption">
        ({{ selectedStadium.totalSeats.toLocaleString() }} seats available)
      </span>
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Change Stadium"
          icon="swap_horiz"
          to="/stadiums"
        />
      </template>
    </q-banner>

    <!-- No Stadium Selected Warning -->
    <q-banner v-else class="bg-warning text-dark q-mb-lg rounded-borders">
      <template v-slot:avatar>
        <q-icon name="warning" color="dark" />
      </template>
      No stadium selected. Please select a stadium before creating an event.
      <template v-slot:action>
        <q-btn
          flat
          color="dark"
          label="Select Stadium"
          icon="stadium"
          to="/stadiums"
        />
      </template>
    </q-banner>

    <!-- Events List -->
    <div v-if="events.length > 0" class="row q-col-gutter-md">
      <div
        v-for="event in events"
        :key="event.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{ event.name }}</div>
                <div class="text-caption text-grey-6">
                  {{ formatDate(event.date) }}
                </div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getStatusColor(event.status)"
                  text-color="white"
                  dense
                >
                  {{ event.status }}
                </q-chip>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pt-sm">
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="stadium" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ event.stadium?.name || 'No stadium' }}</q-item-label>
                  <q-item-label caption>Venue</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="event_seat" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ event.stadium?.totalSeats?.toLocaleString() || 0 }} seats</q-item-label>
                  <q-item-label caption>Capacity</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat dense color="grey-7" icon="edit" label="Edit" />
            <q-btn
              flat
              dense
              color="negative"
              icon="delete"
              label="Delete"
              @click="deleteEvent(event.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <q-card v-else flat bordered class="text-center q-pa-xl">
      <q-icon name="event" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No events yet</div>
      <div class="text-body2 text-grey-5 q-mb-md">
        Create your first event to get started
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Create Event"
        unelevated
        :disable="!selectedStadium"
        @click="showCreateDialog = true"
      />
    </q-card>

    <!-- Create Event Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Create New Event</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input
            v-model="newEvent.name"
            outlined
            label="Event Name *"
            placeholder="Enter event name"
            class="q-mb-md"
          />

          <q-input
            v-model="newEvent.date"
            outlined
            label="Event Date *"
            type="date"
            class="q-mb-md"
          />

          <q-input
            v-model="newEvent.description"
            outlined
            label="Description"
            type="textarea"
            rows="3"
            class="q-mb-md"
          />

          <q-select
            v-model="newEvent.status"
            outlined
            :options="statusOptions"
            label="Status"
          />

          <q-banner v-if="selectedStadium" class="bg-blue-1 q-mt-md rounded-borders">
            <template v-slot:avatar>
              <q-icon name="stadium" color="primary" />
            </template>
            <strong>Stadium:</strong> {{ selectedStadium.name }}
            <br />
            <span class="text-caption">{{ selectedStadium.totalSeats.toLocaleString() }} seats</span>
          </q-banner>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Create Event"
            unelevated
            :disable="!newEvent.name || !newEvent.date || !selectedStadium"
            @click="createEvent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useStadiumStore } from '../stores/stadiumStore'

const $q = useQuasar()
const stadiumStore = useStadiumStore()

// State
const showCreateDialog = ref(false)
const events = ref([])
const newEvent = ref({
  name: '',
  date: '',
  description: '',
  status: 'Draft'
})

const statusOptions = ['Draft', 'Published', 'On Sale', 'Sold Out', 'Completed', 'Cancelled']

// Computed
const selectedStadium = computed(() => stadiumStore.selectedStadium)

// Methods
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getStatusColor(status) {
  const colors = {
    'Draft': 'grey',
    'Published': 'blue',
    'On Sale': 'positive',
    'Sold Out': 'orange',
    'Completed': 'purple',
    'Cancelled': 'negative'
  }
  return colors[status] || 'grey'
}

function createEvent() {
  if (!newEvent.value.name || !newEvent.value.date || !selectedStadium.value) return

  const event = {
    id: Date.now().toString(),
    name: newEvent.value.name,
    date: newEvent.value.date,
    description: newEvent.value.description,
    status: newEvent.value.status,
    stadium: { ...selectedStadium.value }
  }

  events.value.push(event)
  showCreateDialog.value = false

  // Reset form
  newEvent.value = {
    name: '',
    date: '',
    description: '',
    status: 'Draft'
  }

  $q.notify({
    type: 'positive',
    message: 'Event created successfully!',
    position: 'top'
  })
}

function deleteEvent(id) {
  $q.dialog({
    title: 'Delete Event',
    message: 'Are you sure you want to delete this event?',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
      $q.notify({
        type: 'positive',
        message: 'Event deleted successfully',
        position: 'top'
      })
    }
  })
}
</script>
