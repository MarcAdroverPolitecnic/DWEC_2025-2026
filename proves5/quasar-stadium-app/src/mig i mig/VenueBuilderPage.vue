<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <q-btn
          flat
          round
          icon="arrow_back"
          color="grey-7"
          to="/venues"
          class="q-mr-md"
      />
      <div class="col">
        <h4 class="q-ma-none text-weight-bold">
          {{ isEditMode ? 'Edit Venue' : 'Create Venue' }}
        </h4>
        <p class="text-grey-7 q-mb-none">
          {{ isEditMode ? 'Modify venue configuration and seats' : 'Build a new venue from a template' }}
        </p>
      </div>
      <div class="col-auto">
        <q-btn
            color="primary"
            icon="save"
            :label="isEditMode ? 'Save Changes' : 'Create Venue'"
            unelevated
            :disable="!isValid"
            :loading="isSubmitting"
            @click="saveVenue"
        />
      </div>
    </div>

    <q-stepper
        v-model="currentStep"
        ref="stepper"
        color="primary"
        animated
        flat
        bordered
    >
      <q-step
          :name="1"
          title="Basic Information"
          icon="info"
          :done="currentStep > 1">

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-input
                v-model="venueName"
                outlined
                label="Venue Name *"
                placeholder="Enter venue name"
                :rules="[val => !!val || 'Venue name is required']"
            />
          </div>
        </div>

        <div class="q-mt-lg">
          <div class="text-subtitle1 text-weight-medium q-mb-md">Select Template *</div>
          <div class="row q-col-gutter-md">
            <div
                v-for="template in templates"
                :key="template.id"
                class="col-12 col-sm-6 col-md-3">
              <q-card
                  :class="[
                      'template-card cursor-pointer',
                      { 'template-selected': selectedTemplate === template.id }
                    ]"
                  @click="selectTemplate(template.id)">
                <q-card-section class="text-center">
                  <q-icon
                      :name="template.icon"
                      size="48px"
                      :color="selectedTemplate === template.id ? 'primary' : 'grey-5'"
                  />
                  <div class="text-subtitle1 text-weight-medium q-mt-sm">
                    {{ template.name }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ template.description }}
                  </div>
                  <q-badge
                      :color="selectedTemplate === template.id ? 'primary' : 'grey'"
                      class="q-mt-sm"
                  >
                    {{ template.defaultZones.length }} zones
                  </q-badge>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
              color="primary"
              label="Continue"
              icon-right="arrow_forward"
              @click="goToStep(2)"
              :disable="!venueName || !selectedTemplate"
          />
        </q-stepper-navigation>
      </q-step>

   <!--
      <q-step
          :name="2"
          title="Configure Zones"
          icon="grid_view"
          :done="currentStep > 2">

        <div class="text-subtitle1 text-weight-medium q-mb-md">
          Customize Zones
          <q-btn
              flat
              dense
              color="primary"
              icon="add"
              label="Add Zone"
              class="q-ml-md"
              @click="addZone"
          />
        </div>

        <div class="row q-col-gutter-md">
          <div
              v-for="(zone, index) in zones"
              :key="zone.id"
              class="col-12 col-md-6"
          >
            <q-card flat bordered>

              <q-card-section>
                <div class="row items-center q-mb-md">
                  <q-input
                      v-model="zone.name"
                      outlined
                      dense
                      label="Zone Name"
                      class="col"
                  />
                  <q-btn
                      flat
                      round
                      dense
                      icon="delete"
                      color="negative"
                      class="q-ml-sm"
                      @click="removeZone(index)"
                      :disable="zones.length <= 1"
                  />
                </div>

                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-input
                        v-model.number="zone.rows"
                        outlined
                        dense
                        type="number"
                        label="Rows"
                        :min="1"
                        :max="50"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                        v-model.number="zone.cols"
                        outlined
                        dense
                        type="number"
                        label="Columns"
                        :min="1"
                        :max="50"
                    />
                  </div>
                  <div class="col-6">
                    <q-select
                        v-model="zone.position"
                        outlined
                        dense
                        :options="positionOptions"
                        label="Position"
                        emit-value
                        map-options
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                        v-model="zone.color"
                        outlined
                        dense
                        label="Color"
                    >
                      <template v-slot:append>
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="zone.color" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-slot:prepend>
                        <div
                            class="color-preview"
                            :style="{ backgroundColor: zone.color }"
                        />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="text-caption text-grey-6 q-mt-sm">
                  {{ zone.rows * zone.cols }} seats in this zone
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
              flat
              color="grey-7"
              label="Back"
              icon="arrow_back"
              @click="goToStep(1)"
              class="q-mr-sm"
          />
          <q-btn
              color="primary"
              label="Generate Venue"
              icon-right="auto_fix_high"
              @click="generateVenue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
          :name="3"
          title="Edit Seats"
          icon="event_seat"
          :done="currentStep > 3"
      >
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-8">
            <q-banner dense class="bg-blue-1 text-blue-9">
              <template v-slot:avatar>
                <q-icon name="info" color="primary" />
              </template>
              Click on individual seats to delete them. Click again to restore.
              <strong>{{ deletedSeatsCount }}</strong> seats deleted.
            </q-banner>
          </div>
          <div class="col-12 col-md-4">
            <q-select
                v-model="selectedZoneForEdit"
                outlined
                dense
                :options="zoneOptionsForEdit"
                label="Select Zone to Edit"
                emit-value
                map-options
            />
          </div>
        </div>

        <div class="venue-editor-container">
          <VenueEditor
              :zones="zones"
              :selected-zone-id="selectedZoneForEdit"
              :template="selectedTemplate"
              @toggle-seat="toggleSeat"
          />
        </div>

        <q-stepper-navigation>
          <q-btn
              flat
              color="grey-7"
              label="Back"
              icon="arrow_back"
              @click="goToStep(2)"
              class="q-mr-sm"
          />
          <q-btn
              color="primary"
              label="Review & Save"
              icon-right="arrow_forward"
              @click="goToStep(4)"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
          :name="4"
          title="Review"
          icon="check_circle"
      >
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium q-mb-md">Venue Summary</div>
                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="venue" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ venueName }}</q-item-label>
                      <q-item-label caption>Venue Name</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon :name="selectedTemplateInfo?.icon" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ selectedTemplateInfo?.name }}</q-item-label>
                      <q-item-label caption>Template</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="layers" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ zones.length }} zones</q-item-label>
                      <q-item-label caption>Total Zones</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="event_seat" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ totalActiveSeats.toLocaleString() }} seats</q-item-label>
                      <q-item-label caption>Total Available Seats</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="deletedSeatsCount > 0">
                    <q-item-section avatar>
                      <q-icon name="remove_circle" color="negative" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-negative">{{ deletedSeatsCount }} seats</q-item-label>
                      <q-item-label caption>Removed Seats</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mt-md">
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium q-mb-md">Zone Breakdown</div>
                <q-list separator>
                  <q-item v-for="zone in zones" :key="zone.id">
                    <q-item-section avatar>
                      <div
                          class="zone-color-indicator"
                          :style="{ backgroundColor: zone.color }"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ zone.name }}</q-item-label>
                      <q-item-label caption>
                        {{ zone.rows }} rows x {{ zone.cols }} columns
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        {{ getZoneActiveSeats(zone) }} seats
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle1 text-weight-medium q-mb-md">Venue Preview</div>
            <div class="venue-preview-container">
              <VenuePreview :zones="zones" :template="selectedTemplate" />
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
              flat
              color="grey-7"
              label="Back"
              icon="arrow_back"
              @click="goToStep(3)"
              class="q-mr-sm"
          />
          <q-btn
              color="primary"
              :label="isEditMode ? 'Save Changes' : 'Create Venue'"
              icon="save"
              unelevated
              :loading="isSubmitting"
              @click="saveVenue"
          />
        </q-stepper-navigation>
      </q-step> -->
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' //watch
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
//import { useStadiumStore, VENUE_TEMPLATES, generateSeats } from '../stores/stadiumStore'
import { venueStore , VENUE_TEMPLATES} from '../service/venueService.js'  //generateSeats
//import VenueEditor from '../components/VenueEditor.vue'
//import VenuePreview from '../components/VenuePreview.vue'

const props = defineProps({
  id: String
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const venueService = venueStore();

// State
const currentStep = ref(1)
const venueName = ref('')
const selectedTemplate = ref(null)
const zones = ref([])
//const selectedZoneForEdit = ref(null)
const isSubmitting = ref(false)

// Computed
const isEditMode = computed(() => !!props.id || !!route.params.id)
const venueId = computed(() => props.id || route.params.id)

const templates = computed(() => Object.values(VENUE_TEMPLATES))

//const deletedZoneIds = ref([])
//const deletedSeatIds = ref([])

//const selectedTemplateInfo = computed(() => {
//  return selectedTemplate.value ? VENUE_TEMPLATES[selectedTemplate.value] : null
//})

//const positionOptions = [
//  { label: 'Top / North', value: 'top' },
//  { label: 'Top Upper', value: 'top-upper' },
//  { label: 'Bottom / South', value: 'bottom' },
//  { label: 'Bottom Upper', value: 'bottom-upper' },
//  { label: 'Left / West', value: 'left' },
//  { label: 'Right / East', value: 'right' },
//]

//const zoneOptionsForEdit = computed(() => [
//  { label: 'All Zones', value: null },
//  ...zones.value.map(z => ({
//    label: z.name,
//    value: z.id
//  }))
//])

//const totalActiveSeats = computed(() => {
//  return zones.value.reduce((total, zone) => {
//    if (!zone.seats) return total
//    return total + zone.seats.filter(s => !s.deleted).length
//  }, 0)
//})

//const deletedSeatsCount = computed(() => {
//  return zones.value.reduce((total, zone) => {
//    if (!zone.seats) return total
//    return total + zone.seats.filter(s => s.deleted).length
//  }, 0)
//})
//
//const isValid = computed(() => {
//  return venueName.value && selectedTemplate.value && zones.value.length > 0
//})

// Methods
function selectTemplate(templateId) {
  selectedTemplate.value = templateId
  const template = VENUE_TEMPLATES[templateId]
  if (template) {
    zones.value = template.defaultZones.map(zone => ({
      ...zone,
      id: zone.id || `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      seats: null // Will be generated later
    }))
  }
}

//function addZone() {
//  const newZone = {
//    id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//    name: `Zone ${zones.value.length + 1}`,
//    position: 'center',
//    rows: 10,
//    cols: 10,
//    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
//    seats: null
//  }
//  zones.value.push(newZone)
//}
//
//function removeZone(index) {
//  const zoneToDelete = zones.value[index]
//
//  // Si la zona tiene un ID numérico, significa que existe en la BD.
//  // La guardamos para eliminarla vía API al guardar.
//  if (zoneToDelete.id && !String(zoneToDelete.id).startsWith('zone-') && !String(zoneToDelete.id).startsWith('temp-')) {
//    deletedZoneIds.value.push(zoneToDelete.id)
//  }
//
//  zones.value.splice(index, 1)
//}

//function generateVenue() {
//  zones.value = zones.value.map(zone => {
//    // 1. Calculamos capacidad esperada
//    const expectedCapacity = zone.rows * zone.cols
//
//    // 2. Vemos cuántos tiene ahora
//    const currentSeatsCount = zone.seats ? zone.seats.length : 0
//
//    // 3. Si hay discrepancia, regeneramos
//    if (!zone.seats || currentSeatsCount !== expectedCapacity) {
//
//      // --- CORRECCIÓN: Detectar asientos viejos a borrar ---
//      if (zone.seats && zone.seats.length > 0) {
//        zone.seats.forEach(seat => {
//          // Si el asiento tiene un ID real (no empieza por 'temp-'), hay que borrarlo de la BD
//          if (seat.id && !String(seat.id).startsWith('temp-')) {
//            deletedSeatIds.value.push(seat.id)
//          }
//        })
//      }
//      // -----------------------------------------------------
//
//      return {
//        ...zone,
//        seats: generateSeats(zone.rows, zone.cols)
//      }
//    }
//    return zone
//  })
//
//  // Avanzamos al editor
//  currentStep.value = 3
//
//  $q.notify({
//    type: 'positive',
//    message: 'Distribución generada. Asientos actualizados.',
//    position: 'top'
//  })
//}

//function toggleSeat(zoneId, seatId) {
//  const zone = zones.value.find(z => z.id === zoneId)
//  if (zone && zone.seats) {
//    const seat = zone.seats.find(s => s.id === seatId)
//    if (seat) {
//      seat.deleted = !seat.deleted
//    }
//  }
//}

//function getZoneActiveSeats(zone) {
//  if (!zone.seats) return zone.rows * zone.cols
//  return zone.seats.filter(s => !s.deleted).length
//}

function goToStep(step) {
  currentStep.value = step
}

// Load existing venue if editing (API Logic)
onMounted(async () => {
  if (isEditMode.value && venueId.value) {
    $q.loading.show({ message: 'Loading venue data...' })
    try {
      const existing = await venueService.getVenueById(venueId.value)
      if (existing) {
        venueName.value = existing.name
        selectedTemplate.value = existing.template
        // Deep clone to avoid mutating store state directly during edit
        zones.value = JSON.parse(JSON.stringify(existing.zones))
      } else {
        $q.notify({ type: 'negative', message: 'Venue not found' })
        router.push('/venues')
      }
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'Error loading venue' })
    } finally {
      $q.loading.hide()
    }
  }
})

// Save to Backend (API Logic)
// Save to Backend (API Logic)
//async function saveVenue() {
//  if (!isValid.value) return
//  isSubmitting.value = true
//
//  // Asegurar generación de asientos
//  const currentZonesState = zones.value.map(zone => ({
//    ...zone,
//    seats: zone.seats || generateSeats(zone.rows, zone.cols)
//  }))
//
//  try {
//    if (isEditMode.value) {
//      const numericVenueId = Number(venueId.value)
//
//      // A. ELIMINAR ZONAS BORRADAS
//      if (deletedZoneIds.value.length > 0) {
//        for (const zId of deletedZoneIds.value) {
//          await venueService.removeZone(numericVenueId, zId)
//        }
//        deletedZoneIds.value = []
//      }
//
//      // B. ELIMINAR ASIENTOS HUÉRFANOS (Por redimensionado) <--- NUEVO BLOQUE
//      if (deletedSeatIds.value.length > 0) {
//        // Ejecutamos las eliminaciones en paralelo para ir más rápido
//        const deletePromises = deletedSeatIds.value.map(seatId =>
//          venueService.removeSeat(null, seatId) // zoneId no es necesario para el delete por ID
//        )
//        await Promise.all(deletePromises)
//        deletedSeatIds.value = [] // Limpiar lista
//      }
//
//      // C. PROCESAR ZONAS ACTUALES
//      for (const zone of currentZonesState) {
//        // ... (el resto de tu lógica de crear/actualizar zonas sigue igual)
//        const zoneIsNew = String(zone.id).startsWith('zone-') || String(zone.id).startsWith('temp-');
//
//        if (zoneIsNew) {
//          await venueService.createZone(numericVenueId, zone)
//        } else {
//          await venueService.updateZone(zone.id, zone);
//
//          if (zone.seats && zone.seats.length > 0) {
//            const seatPromises = []
//            for (const seat of zone.seats) {
//              const seatIsNew = String(seat.id).startsWith('temp-');
//              const seatIsDeleted = seat.deleted === true;
//
//              // Gestión granular manual (clicks individuales)
//              if (!seatIsNew && seatIsDeleted) {
//                seatPromises.push(venueService.removeSeat(zone.id, seat.id));
//              }
//              if (seatIsNew && !seatIsDeleted) {
//                seatPromises.push(venueService.createSeat(zone.id, seat));
//              }
//            }
//            if (seatPromises.length > 0) await Promise.all(seatPromises);
//          }
//        }
//      }
//
//      // D. ACTUALIZAR INFO GENERAL
//      const venueData = {
//        name: venueName.value,
//        template: selectedTemplate.value,
//        zones: currentZonesState.filter(z => !String(z.id).startsWith('zone-'))
//      }
//
//      await venueService.updateVenue(numericVenueId, venueData)
//      $q.notify({
//        type: 'positive',
//        message: 'Cambios guardados correctamente (zonas y asientos actualizados)',
//        position: 'top'
//      })
//
//    } else {
//      // === MODO CREACIÓN (Nuevo Estadio) ===
//      // En creación enviamos todo el objeto junto, ya que no existen IDs previos
//      const venueData = {
//        name: venueName.value,
//        template: selectedTemplate.value,
//        zones: currentZonesState
//      }
//
//      const newVenue = await venueService.addVenue(venueData)
//
//      $q.notify({
//        type: 'positive',
//        message: 'Estadio creado correctamente!',
//        position: 'top'
//      })
//      // Seleccionamos el nuevo estadio en el store
//      if(newVenue && newVenue.id) venueService.selectVenue(newVenue.id)
//    }
//
//    // Volver a la lista
//    router.push('/venues')
//
//  } catch (error) {
//    console.error('Error saving:', error)
//    $q.notify({
//      type: 'negative',
//      message: error.message || 'Error saving the venue configuration'
//    })
//  } finally {
//    isSubmitting.value = false
//  }
//}
</script>

<style scoped>
.template-card {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-selected {
  border-color: var(--q-primary);
  background-color: rgba(25, 118, 210, 0.05);
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.zone-color-indicator {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.venue-editor-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  min-height: 400px;
  overflow: auto;
}

.venue-preview-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  min-height: 300px;
}
</style>

