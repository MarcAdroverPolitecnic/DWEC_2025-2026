<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none text-weight-bold">Stadium Selection</h4>
        <p class="text-grey-7 q-mb-none">Select a stadium to assign to an event or create a new one</p>
      </div>
      <div class="col-auto">
        <q-btn
            color="primary"
            icon="add"
            label="Create Stadium"
            unelevated
            to="/stadiums/create"
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
                placeholder="Search stadiums..."
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
                :options="templateOptions"
                label="Filter by type"
                clearable
                emit-value
                map-options/>
          </div>

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

    <div v-if="stadiumStore.isLoading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-banner v-else-if="stadiumStore.error" class="bg-negative text-white q-mb-md rounded-borders">
      <template v-slot:avatar>
        <q-icon name="warning" />
      </template>
      {{ stadiumStore.error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Retry" @click="loadStadiums" />
      </template>
    </q-banner>

    <div v-else-if="filteredStadiums.length > 0" class="row q-col-gutter-md">
      <div
          v-for="stadium in filteredStadiums"
          :key="stadium.id"
          class="col-12 col-sm-6 col-lg-4">

        <q-card
            :class="[
            'stadium-card cursor-pointer',
            { 'selected-stadium': selectedStadiumId === stadium.id }
          ]"
            @click="handleStadiumClick(stadium)">

          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 text-weight-bold">{{ stadium.name }}</div>
                <div class="text-caption text-grey-6">
                  {{ getTemplateInfo(stadium.template).name }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon
                    :name="getTemplateInfo(stadium.template).icon"
                    size="32px"
                    :color="selectedStadiumId === stadium.id ? 'primary' : 'grey-5'"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="stadium-mini-preview q-mb-sm">
              <StadiumMiniPreview :stadium="stadium" />
            </div>

            <div class="row q-col-gutter-sm text-caption">
              <div class="col-6">
                <q-icon name="event_seat" size="16px" class="q-mr-xs" />
                {{ stadium.totalSeats?.toLocaleString() || 0 }} seats
              </div>
              <div class="col-6">
                <q-icon name="layers" size="16px" class="q-mr-xs" />
                {{ stadium.zones?.length || 0 }} zones
              </div>
              <div class="col-12 text-grey-6">
                <q-icon name="schedule" size="16px" class="q-mr-xs" />
                Created {{ formatDate(stadium.createdAt || new Date()) }}
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
                @click.stop="editStadium(stadium.id)"
            />
            <q-btn
                flat
                dense
                color="negative"
                icon="delete"
                label="Delete"
                @click.stop="confirmDelete(stadium)"
            />
            <q-btn
                :flat="selectedStadiumId !== stadium.id"
                :unelevated="selectedStadiumId === stadium.id"
                dense
                :color="selectedStadiumId === stadium.id ? 'primary' : 'primary'"
                :icon="selectedStadiumId === stadium.id ? 'check_circle' : 'radio_button_unchecked'"
                :label="selectedStadiumId === stadium.id ? 'Selected' : 'Select'"
                @click.stop="selectStadium(stadium.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-card v-else flat bordered class="text-center q-pa-xl">
      <q-icon name="stadium" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No stadiums found</div>
      <div class="text-body2 text-grey-5 q-mb-md">
        {{ searchQuery || templateFilter ? 'Try adjusting your filters' : 'Create your first stadium to get started' }}
      </div>
      <q-btn
          v-if="!searchQuery && !templateFilter"
          color="primary"
          icon="add"
          label="Create Stadium"
          unelevated
          to="/stadiums/create"
      />
    </q-card>

    <q-page-sticky v-if="selectedStadium" position="bottom" :offset="[0, 18]">
      <q-banner class="bg-primary text-white shadow-2 rounded-borders">
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        <strong>{{ selectedStadium.name }}</strong> selected
        <span class="q-ml-sm text-caption">
          ({{ selectedStadium.totalSeats?.toLocaleString() || 0 }} seats)
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
              @click="selectStadium(null)"
          />
        </template>
      </q-banner>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useStadiumStore, STADIUM_TEMPLATES } from '../stores/stadiumStore'
import StadiumMiniPreview from '../components/StadiumMiniPreview.vue'

const $q = useQuasar()
const router = useRouter()
const stadiumStore = useStadiumStore()

// Local state
const searchQuery = ref('')
const templateFilter = ref(null)
const sortBy = ref('name')

// Computed
const selectedStadiumId = computed(() => stadiumStore.selectedStadiumId)
const selectedStadium = computed(() => stadiumStore.selectedStadium)

const templateOptions = computed(() => [
  { label: 'All Types', value: null },
  ...Object.values(STADIUM_TEMPLATES).map(t => ({
    label: t.name,
    value: t.id
  }))
])

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Seats (High to Low)', value: 'seats-desc' },
  { label: 'Seats (Low to High)', value: 'seats' },
  // API might not return createdAt, handling fallback in logic
  { label: 'Newest First', value: 'date-desc' },
  { label: 'Oldest First', value: 'date' }
]

// Fetch on mount (Connection to API logic)
onMounted(() => {
  loadStadiums()
})

async function loadStadiums() {
  await stadiumStore.fetchStadiums()
}

const filteredStadiums = computed(() => {
  let result = [...stadiumStore.stadiums]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
        s.name.toLowerCase().includes(query)
    )
  }

  // Template filter
  if (templateFilter.value) {
    result = result.filter(s => s.template === templateFilter.value)
  }

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
function getTemplateInfo(templateId) {
  return STADIUM_TEMPLATES[templateId] || { name: 'Custom', icon: 'stadium' }
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function selectStadium(id) {
  stadiumStore.selectStadium(id)
  if (id) {
    $q.notify({
      type: 'positive',
      message: 'Stadium selected successfully',
      position: 'top',
      timeout: 2000
    })
  }
}

function handleStadiumClick(stadium) {
  selectStadium(stadium.id)
}

function editStadium(id) {
  router.push(`/stadiums/edit/${id}`)
}

function confirmDelete(stadium) {
  $q.dialog({
    title: 'Delete Stadium',
    message: `Are you sure you want to delete "${stadium.name}"? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    // ASYNC logic restored from App version
    try {
      await stadiumStore.deleteStadium(stadium.id)
      $q.notify({
        type: 'positive',
        message: 'Stadium deleted successfully',
        position: 'top'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error deleting stadium',
        position: 'top'
      })
    }
  })
}
</script>

<style scoped>
.stadium-card {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.stadium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selected-stadium {
  border-color: var(--q-primary);
  background-color: rgba(25, 118, 210, 0.05);
}

.stadium-mini-preview {
  height: 120px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}
</style>