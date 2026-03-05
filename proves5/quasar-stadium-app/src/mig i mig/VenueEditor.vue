<template>
  <div class="realistic-venue-editor">








    <!-- Football Venue Layout -->
    <div v-if="layoutType === 'stadium'" class="venue-container football-layout">
      <!-- North Stands -->
      <div class="venue-section north-section">
        <div
            v-for="zone in northZones"
            :key="zone.id"
            :class="['zone-wrapper', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]">

                <div class="zone-label-top" :style="{ backgroundColor: zone.color }">
                  {{ zone.name }} ({{ getActiveSeatsCount(zone) }}/{{ zone.seats?.length || 0 }})
                </div>
                <div class="seats-container north-seats" :style="getSeatsContainerStyle(zone)">
                  <div
                    v-for="(row, rowIndex) in getRowsReversed(zone)"
                    :key="rowIndex"
                    class="seat-row"
                    :style="getCurvedRowStyle('north', zone, rowIndex)"
                  >
                    <div
                      v-for="seat in row"
                      :key="seat.id"
                      :class="getSeatClasses(seat)"
                      :style="getSeatStyle(zone, seat)"
                      :title="getSeatTitle(zone, seat)"
                      @click="handleSeatClick(zone.id, seat.id)"
                    >
                      <span class="seat-label">{{ seat.label }}</span>
                    </div>
                  </div>
                </div>
        </div>
      </div>

      <!-- Middle Section: West - Field - East -->
      <div class="venue-section middle-section">
        <!-- West Stands -->
        <div class="side-zones west-zones">
          <div
            v-for="zone in westZones"
            :key="zone.id"
            :class="['zone-wrapper vertical-zone', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]">

                  <div class="zone-label-side left-label" :style="{ backgroundColor: zone.color }">
                    <span>{{ zone.name }}</span>
                    <span class="zone-count">{{ getActiveSeatsCount(zone) }}</span>
                  </div>
                  <div class="seats-container west-seats" :style="getVerticalSeatsContainerStyle(zone)">
                    <div
                      v-for="(col, colIndex) in getColumnsForWest(zone)"
                      :key="colIndex"
                      class="seat-column"
                      :style="getCurvedColumnStyle('west', zone, colIndex)"
                    >
                      <div
                        v-for="seat in col"
                        :key="seat.id"
                        :class="getSeatClasses(seat)"
                        :style="getSeatStyle(zone, seat)"
                        :title="getSeatTitle(zone, seat)"
                        @click="handleSeatClick(zone.id, seat.id)"
                      >
                        <span class="seat-label">{{ seat.label }}</span>
                      </div>
                    </div>
                  </div>
          </div>
        </div>

        <!-- Football Field -->
        <div class="field-container">
          <div class="field football-field">
            <div class="field-markings">
              <div class="center-circle"></div>
              <div class="center-line"></div>
              <div class="penalty-area top-penalty"></div>
              <div class="penalty-area bottom-penalty"></div>
              <div class="goal-area top-goal"></div>
              <div class="goal-area bottom-goal"></div>
            </div>
            <div class="field-text">
              <q-icon name="sports_soccer" size="32px" color="white" />
              <span>PLAYING FIELD</span>
            </div>
          </div>

          <!-- Center/VIP Zones -->
          <div v-if="centerZones.length > 0" class="center-zones-overlay">
            <div
              v-for="zone in centerZones"
              :key="zone.id"
              :class="['zone-wrapper center-zone', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
            >
              <div class="zone-label-center" :style="{ backgroundColor: zone.color }">
                {{ zone.name }} ({{ getActiveSeatsCount(zone) }})
              </div>
              <div class="seats-container center-seats" :style="getSeatsContainerStyle(zone)">
                <div v-for="(row, rowIndex) in getRows(zone)" :key="rowIndex" class="seat-row">
                  <div
                    v-for="seat in row"
                    :key="seat.id"
                    :class="getSeatClasses(seat)"
                    :style="getSeatStyle(zone, seat)"
                    :title="getSeatTitle(zone, seat)"
                    @click="handleSeatClick(zone.id, seat.id)"
                  >
                    <span class="seat-label">{{ seat.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- East Stands -->
        <div class="side-zones east-zones">
          <div
            v-for="zone in eastZones"
            :key="zone.id"
            :class="['zone-wrapper vertical-zone', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
          >
            <div class="seats-container east-seats" :style="getVerticalSeatsContainerStyle(zone)">
              <div
                v-for="(col, colIndex) in getColumnsForEast(zone)"
                :key="colIndex"
                class="seat-column"
                :style="getCurvedColumnStyle('east', zone, colIndex)"
              >
                <div
                  v-for="seat in col"
                  :key="seat.id"
                  :class="getSeatClasses(seat)"
                  :style="getSeatStyle(zone, seat)"
                  :title="getSeatTitle(zone, seat)"
                  @click="handleSeatClick(zone.id, seat.id)"
                >
                  <span class="seat-label">{{ seat.label }}</span>
                </div>
              </div>
            </div>
            <div class="zone-label-side right-label" :style="{ backgroundColor: zone.color }">
              <span>{{ zone.name }}</span>
              <span class="zone-count">{{ getActiveSeatsCount(zone) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- South Stands -->
      <div class="venue-section south-section">
        <div
          v-for="zone in southZones"
          :key="zone.id"
          :class="['zone-wrapper', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
        >
          <div class="seats-container south-seats" :style="getSeatsContainerStyle(zone)">
            <div
              v-for="(row, rowIndex) in getRows(zone)"
              :key="rowIndex"
              class="seat-row"
              :style="getCurvedRowStyle('south', zone, rowIndex)"
            >
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="getSeatClasses(seat)"
                :style="getSeatStyle(zone, seat)"
                :title="getSeatTitle(zone, seat)"
                @click="handleSeatClick(zone.id, seat.id)"
              >
                <span class="seat-label">{{ seat.label }}</span>
              </div>
            </div>
          </div>
          <div class="zone-label-bottom" :style="{ backgroundColor: zone.color }">
            {{ zone.name }} ({{ getActiveSeatsCount(zone) }}/{{ zone.seats?.length || 0 }})
          </div>
        </div>
      </div>
    </div>











    <!-- Arena Layout (Circular/Oval) -->
    <div v-else-if="layoutType === 'arena'" class="venue-container arena-layout">
      <!-- Top Curved Section -->
      <div class="arena-section arena-top">
        <div
          v-for="zone in arenaTopZones"
          :key="zone.id"
          :class="['zone-wrapper arena-zone-top', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
        >
          <div class="zone-label-top" :style="{ backgroundColor: zone.color }">
            {{ zone.name }} ({{ getActiveSeatsCount(zone) }})
          </div>
          <div class="seats-container arena-seats-top">
            <div
              v-for="(row, rowIndex) in getRowsReversed(zone)"
              :key="rowIndex"
              class="seat-row arena-row"
              :style="getArenaCurveStyle('top', zone.rows, rowIndex)"
            >
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="getSeatClasses(seat)"
                :style="getSeatStyle(zone, seat)"
                :title="getSeatTitle(zone, seat)"
                @click="handleSeatClick(zone.id, seat.id)"
              >
                <span class="seat-label">{{ seat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section -->
      <div class="arena-section arena-middle">
        <!-- Left Curved Section -->
        <div class="arena-side arena-left">
          <div
            v-for="zone in arenaLeftZones"
            :key="zone.id"
            :class="['zone-wrapper arena-zone-side', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
          >
            <div class="zone-label-side left-label" :style="{ backgroundColor: zone.color }">
              <span>{{ zone.name }} </span>
            </div>
            <div class="seats-container arena-seats-side">
              <div
                v-for="(col, colIndex) in getColumnsForWest(zone)"
                :key="colIndex"
                class="seat-column"
                :style="getArenaSideCurveStyle('left', zone.cols, colIndex)"
              >
                <div
                  v-for="seat in col"
                  :key="seat.id"
                  :class="getSeatClasses(seat)"
                  :style="getSeatStyle(zone, seat)"
                  :title="getSeatTitle(zone, seat)"
                  @click="handleSeatClick(zone.id, seat.id)"
                >
                  <span class="seat-label">{{ seat.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Arena Court/Stage -->
        <div class="arena-court-container">
          <div class="arena-court">
            <div class="court-markings">
              <div class="court-center-circle"></div>
              <div class="court-center-line"></div>
              <div class="court-three-point top-arc"></div>
              <div class="court-three-point bottom-arc"></div>
              <div class="court-key top-key"></div>
              <div class="court-key bottom-key"></div>
            </div>
          </div>
        </div>

        <!-- Right Curved Section -->
        <div class="arena-side arena-right">
          <div
            v-for="zone in arenaRightZones"
            :key="zone.id"
            :class="['zone-wrapper arena-zone-side', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
          >
            <div class="seats-container arena-seats-side">
              <div
                v-for="(col, colIndex) in getColumnsForEast(zone)"
                :key="colIndex"
                class="seat-column"
                :style="getArenaSideCurveStyle('right', zone.cols, colIndex)"
              >
                <div
                  v-for="seat in col"
                  :key="seat.id"
                  :class="getSeatClasses(seat)"
                  :style="getSeatStyle(zone, seat)"
                  :title="getSeatTitle(zone, seat)"
                  @click="handleSeatClick(zone.id, seat.id)"
                >
                  <span class="seat-label">{{ seat.label }}</span>
                </div>
              </div>
            </div>
            <div class="zone-label-side right-label" :style="{ backgroundColor: zone.color }">
              <span>{{ zone.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Curved Section -->
      <div class="arena-section arena-bottom">
        <div
          v-for="zone in arenaBottomZones"
          :key="zone.id"
          :class="['zone-wrapper arena-zone-bottom', { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
        >
          <div class="seats-container arena-seats-bottom">
            <div
              v-for="(row, rowIndex) in getRows(zone)"
              :key="rowIndex"
              class="seat-row arena-row"
              :style="getArenaCurveStyle('bottom', zone.rows, rowIndex)"
            >
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="getSeatClasses(seat)"
                :style="getSeatStyle(zone, seat)"
                :title="getSeatTitle(zone, seat)"
                @click="handleSeatClick(zone.id, seat.id)"
              >
                <span class="seat-label">{{ seat.label }}</span>
              </div>
            </div>
          </div>
          <div class="zone-label-bottom" :style="{ backgroundColor: zone.color }">
            {{ zone.name }} ({{ getActiveSeatsCount(zone) }})
          </div>
        </div>
      </div>
    </div>









    <!-- Theater Layout -->
    <div v-else-if="layoutType === 'theater'" class="venue-container theater-layout">
      <!-- Stage at the top -->
      <div class="theater-stage-container">
        <div class="theater-stage">
          <div class="stage-curtains">
            <div class="curtain-left"></div>
            <div class="curtain-right"></div>
          </div>
          <div class="stage-floor">
            <div class="stage-text">
              <q-icon name="theater_comedy" size="32px" color="white" />
              <span>STAGE</span>
            </div>
          </div>
          <div class="stage-lights">
            <div class="light"></div>
            <div class="light"></div>
            <div class="light"></div>
          </div>
        </div>
      </div>

      <!-- Seating Sections (all facing stage) -->
      <div class="theater-seating">
        <div
          v-for="zone in theaterZonesSorted"
          :key="zone.id"
          :class="['zone-wrapper theater-zone', getTheaterZoneClass(zone), { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
        >
          <div class="zone-label-theater" :style="{ backgroundColor: zone.color }">
            {{ zone.name }} ({{ getActiveSeatsCount(zone) }}/{{ zone.seats?.length || 0 }})
          </div>
          <div class="seats-container theater-seats" :style="getTheaterSeatsStyle(zone)">
            <div
              v-for="(row, rowIndex) in getRows(zone)"
              :key="rowIndex"
              class="seat-row theater-row"
              :style="getTheaterRowStyle(zone, rowIndex)"
            >
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="getSeatClasses(seat)"
                :style="getSeatStyle(zone, seat)"
                :title="getSeatTitle(zone, seat)"
                @click="handleSeatClick(zone.id, seat.id)"
              >
                <span class="seat-label">{{ seat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orchestra Pit (optional) -->
      <div v-if="hasOrchestra" class="orchestra-pit">
        <span>Orchestra Pit</span>
      </div>
    </div>










    <!-- Concert Hall Layout -->
    <div v-else-if="layoutType === 'concert'" class="venue-container concert-layout">
      <!-- Stage at the top -->
      <div class="concert-stage-container">
        <div class="concert-stage">
          <div class="stage-backdrop"></div>
          <div class="stage-platform">
            <div class="stage-text">
              <q-icon name="music_note" size="36px" color="white" />
              <span>STAGE</span>
            </div>
          </div>
          <div class="stage-monitors">
            <div class="monitor"></div>
            <div class="monitor"></div>
            <div class="monitor"></div>
          </div>
        </div>
      </div>

      <!-- Concert Seating -->
      <div class="concert-seating">
        <div
          v-for="zone in concertZonesSorted"
          :key="zone.id"
          :class="['zone-wrapper concert-zone', getConcertZoneClass(zone), { 'zone-selected': selectedZoneId === zone.id || !selectedZoneId }]"
        >
          <div class="zone-label-concert" :style="{ backgroundColor: zone.color }">
            {{ zone.name }} ({{ getActiveSeatsCount(zone) }}/{{ zone.seats?.length || 0 }})
          </div>
          <div class="seats-container concert-seats" :style="getConcertSeatsStyle(zone)">
            <div
              v-for="(row, rowIndex) in getRows(zone)"
              :key="rowIndex"
              class="seat-row concert-row"
              :style="getConcertRowStyle(zone, rowIndex)"
            >
              <div
                v-for="seat in row"
                :key="seat.id"
                :class="getSeatClasses(seat)"
                :style="getSeatStyle(zone, seat)"
                :title="getSeatTitle(zone, seat)"
                @click="handleSeatClick(zone.id, seat.id)"
              >
                <span class="seat-label">{{ seat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="editor-legend">
      <div class="legend-item">
        <div class="legend-seat available"></div>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat deleted"></div>
        <span>Deleted</span>
      </div>
      <div class="legend-item hint">
        <q-icon name="touch_app" size="18px" />
        <span>Click seat to toggle</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  zones: {
    type: Array,
    required: true
  },
  selectedZoneId: {
    type: String,
    default: null
  },
  template: {
    type: String,
    default: 'stadium'
  }
})

const emit = defineEmits(['toggle-seat'])

// Determine layout type based on template
const layoutType = computed(() => props.template || 'stadium')

// ==================== FOOTBALL VENUE ZONES ====================
const northZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'top' || z.position === 'top-upper')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)

  const order = { top: 0, 'top-upper': 1 }
  return zones.sort((a, b) => order[a.position] - order[b.position])
})

const southZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'bottom' || z.position === 'bottom-upper')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)

  const order = { bottom: 0, 'bottom-upper': 1 }
  return zones.sort((a, b) => order[a.position] - order[b.position])
})

const westZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'left')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

const eastZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'right')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

const centerZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'center')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

// ==================== ARENA ZONES ====================
const arenaTopZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'top' || z.position === 'top-upper')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

const arenaBottomZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'bottom' || z.position === 'bottom-upper')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

const arenaLeftZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'left')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

const arenaRightZones = computed(() => {
  let zones = props.zones.filter(z => z.position === 'right')
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones
})

// ==================== THEATER ZONES ====================
const theaterZonesSorted = computed(() => {
  const positionOrder = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  let zones = [...props.zones]
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones.sort((a, b) => (positionOrder[a.position] || 0) - (positionOrder[b.position] || 0))
})

const hasOrchestra = computed(() => props.zones.some(z => z.name.toLowerCase().includes('orchestra')))

// ==================== CONCERT ZONES ====================
const concertZonesSorted = computed(() => {
  const positionOrder = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  let zones = [...props.zones]
  if (props.selectedZoneId) zones = zones.filter(z => z.id === props.selectedZoneId)
  return zones.sort((a, b) => (positionOrder[a.position] || 0) - (positionOrder[b.position] || 0))
})

// ==================== HELPER FUNCTIONS ====================
function getRows(zone) {
  if (!zone.seats) return []
  const rows = []
  for (let r = 0; r < zone.rows; r++) {
    rows.push(zone.seats.filter(s => s.row === r + 1))
  }
  return rows
}

function getRowsReversed(zone) {
  return getRows(zone).reverse()
}

function getColumnsForWest(zone) {
  if (!zone.seats) return []
  const columns = []
  for (let c = zone.cols - 1; c >= 0; c--) {
    columns.push(zone.seats.filter(s => s.col === c + 1))
  }
  return columns
}

function getColumnsForEast(zone) {
  if (!zone.seats) return []
  const columns = []
  for (let c = 0; c < zone.cols; c++) {
    columns.push(zone.seats.filter(s => s.col === c + 1))
  }
  return columns
}

function getActiveSeatsCount(zone) {
  if (!zone.seats) return 0
  return zone.seats.filter(s => !s.deleted).length
}

function getSeatTitle(zone, seat) {
  return `${zone.name} - Row ${seat.row}, Seat ${seat.col}${seat.deleted ? ' (Deleted)' : ''}`
}

function getSeatClasses(seat) {
  return ['seat', { 'seat-deleted': seat.deleted }, { 'seat-active': !seat.deleted }]
}

function getSeatStyle(zone, seat) {
  return {
    backgroundColor: seat.deleted ? '#555' : zone.color,
    borderColor: seat.deleted ? '#333' : adjustColor(zone.color, -20)
  }
}

function getSeatsContainerStyle(zone) {
  return { '--zone-cols': zone.cols, '--zone-rows': zone.rows }
}

function getVerticalSeatsContainerStyle(zone) {
  return { '--zone-cols': zone.cols, '--zone-rows': zone.rows }
}

// Football venue curves
function getCurvedRowStyle(position, zone, rowIndex) {
  const totalRows = zone.rows
  const curveIntensity = 0.15
  let paddingPercent
  if (position === 'north') {
    paddingPercent = (totalRows - rowIndex - 1) * curveIntensity
  } else {
    paddingPercent = rowIndex * curveIntensity
  }
  return { paddingLeft: `${paddingPercent}%`, paddingRight: `${paddingPercent}%` }
}

function getCurvedColumnStyle(position, zone, colIndex) {
  const totalCols = zone.cols
  const curveIntensity = 0.12
  let paddingPercent
  if (position === 'west') {
    paddingPercent = (totalCols - colIndex - 1) * curveIntensity
  } else {
    paddingPercent = colIndex * curveIntensity
  }
  return { paddingTop: `${paddingPercent}%`, paddingBottom: `${paddingPercent}%` }
}

// Arena curves (more pronounced oval shape)
function getArenaCurveStyle(position, totalRows, rowIndex) {
  const curveIntensity = 2.5
  let paddingPercent
  if (position === 'top') {
    paddingPercent = (totalRows - rowIndex - 1) * curveIntensity
  } else {
    paddingPercent = rowIndex * curveIntensity
  }
  return {
    paddingLeft: `${paddingPercent}px`,
    paddingRight: `${paddingPercent}px`,
    borderRadius: position === 'top' ? '50% 50% 0 0' : '0 0 50% 50%'
  }
}

function getArenaSideCurveStyle(position, totalCols, colIndex) {
  const curveIntensity = 1.8
  let paddingPercent
  if (position === 'left') {
    paddingPercent = (totalCols - colIndex - 1) * curveIntensity
  } else {
    paddingPercent = colIndex * curveIntensity
  }
  return { paddingTop: `${paddingPercent}px`, paddingBottom: `${paddingPercent}px` }
}

// Theater styling
function getTheaterZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('orchestra')) return 'theater-orchestra'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('mezzanine')) return 'theater-mezzanine'
  return 'theater-balcony'
}

function getTheaterSeatsStyle(zone) {
  return { '--zone-cols': zone.cols }
}

function getTheaterRowStyle(zone, rowIndex) {
  const curveIntensity = 0.8
  const paddingPercent = rowIndex * curveIntensity
  return { paddingLeft: `${paddingPercent}%`, paddingRight: `${paddingPercent}%` }
}

// Concert styling
function getConcertZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('pit')) return 'concert-pit'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('lower')) return 'concert-lower'
  return 'concert-upper'
}

function getConcertSeatsStyle(zone) {
  return { '--zone-cols': zone.cols }
}

function getConcertRowStyle(zone, rowIndex) {
  const isPit = zone.position === 'bottom' || zone.name.toLowerCase().includes('pit')
  if (isPit) {
    return {}
  }
  const curveIntensity = 0.6
  const paddingPercent = rowIndex * curveIntensity
  return { paddingLeft: `${paddingPercent}%`, paddingRight: `${paddingPercent}%` }
}

function adjustColor(color, amount) {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function handleSeatClick(zoneId, seatId) {
  emit('toggle-seat', zoneId, seatId)
}
</script>

<style scoped>
.realistic-venue-editor {
  width: 100%;
  padding: 16px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
}

.venue-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 1000px;
  margin: 0 auto;
}

/* ==================== COMMON STYLES ==================== */
.zone-wrapper {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.zone-wrapper.zone-selected {
  opacity: 1;
}

.zone-label-top,
.zone-label-bottom,
.zone-label-side,
.zone-label-center,
.zone-label-theater,
.zone-label-concert {
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.zone-label-side {
  writing-mode: vertical-lr;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 6px;
}

.zone-label-side.left-label {
  border-radius: 4px 0 0 4px;
  transform: rotate(180deg);
}

.zone-label-side.right-label {
  border-radius: 0 4px 4px 0;
}

.seats-container {
  background: rgba(255, 255, 255, 0.05);
  padding: 6px;
  border-radius: 4px;
}

.seat-row {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-bottom: 2px;
}

.seat-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-right: 2px;
}

.seat {
  width: 14px;
  height: 14px;
  border-radius: 3px 3px 1px 1px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  position: relative;
}

.seat-active:hover {
  transform: scale(1.4);
  z-index: 10;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.seat-deleted {
  opacity: 0.4;
}

.seat-deleted:hover {
  opacity: 0.7;
  transform: scale(1.4);
  z-index: 10;
}

.seat-label {
  font-size: 6px;
  color: white;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.seat:hover .seat-label {
  opacity: 1;
}

.field-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 3px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  z-index: 1;
}

/* ==================== FOOTBALL VENUE LAYOUT ==================== */
.football-layout .venue-section {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.football-layout .north-section,
.football-layout .south-section {
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.football-layout .middle-section {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
  min-height: 300px;
}

.football-layout .side-zones {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.football-layout .vertical-zone {
  display: flex;
  align-items: stretch;
}

.football-layout .west-seats,
.football-layout .east-seats {
  display: flex;
  flex-direction: row;
}

.football-layout .field-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  position: relative;
}

.football-field {
  width: 100%;
  aspect-ratio: 1.5;
  background: linear-gradient(180deg, #2d5a27 0%, #1e4d1a 50%, #2d5a27 100%);
  border-radius: 8px;
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.3);
}

.field-markings {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255,255,255,0.6);
  border-radius: 50%;
}

.center-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: rgba(255,255,255,0.6);
}

.penalty-area {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 18%;
  border: 2px solid rgba(255,255,255,0.6);
}

.top-penalty { top: 0; border-top: none; }
.bottom-penalty { bottom: 0; border-bottom: none; }

.goal-area {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 25%;
  height: 8%;
  border: 2px solid rgba(255,255,255,0.6);
}

.top-goal { top: 0; border-top: none; }
.bottom-goal { bottom: 0; border-bottom: none; }

.center-zones-overlay {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.center-zone {
  background: rgba(0,0,0,0.4);
  border-radius: 4px;
  padding: 4px;
}

/* ==================== ARENA LAYOUT ==================== */
.arena-layout {
  align-items: center;
}

.arena-section {
  display: flex;
  justify-content: center;
}

.arena-top,
.arena-bottom {
  width: 100%;
  max-width: 500px;
}

.arena-middle {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
  min-height: 250px;
  width: 100%;
}

.arena-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.arena-zone-side {
  display: flex;
  align-items: stretch;
}

.arena-seats-side {
  display: flex;
  flex-direction: row;
}

.arena-row {
  transition: padding 0.2s ease;
}

.arena-seats-top {
  border-radius: 100px 100px 0 0;
  overflow: hidden;
}

.arena-seats-bottom {
  border-radius: 0 0 100px 100px;
  overflow: hidden;
}

.arena-court-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 350px;
}

.arena-court {
  width: 100%;
  aspect-ratio: 1.8;
  background: linear-gradient(180deg, #c4893b 0%, #a67030 100%);
  border-radius: 8px;
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
}

.court-markings {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.court-center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255,255,255,0.7);
  border-radius: 50%;
}

.court-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.7);
}

.court-key {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  height: 20%;
  border: 2px solid rgba(255,255,255,0.6);
}

.top-key { top: 0; border-top: none; border-radius: 0 0 4px 4px; }
.bottom-key { bottom: 0; border-bottom: none; border-radius: 4px 4px 0 0; }

.court-three-point {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 25%;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 0 0 100px 100px;
}

.top-arc {
  top: 0;
  border-top: none;
  border-radius: 0 0 100px 100px;
}

.bottom-arc {
  bottom: 0;
  border-bottom: none;
  border-radius: 100px 100px 0 0;
}

/* ==================== THEATER LAYOUT ==================== */
.theater-layout {
  gap: 16px;
}

.theater-stage-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.theater-stage {
  width: 80%;
  max-width: 600px;
  height: 120px;
  background: linear-gradient(180deg, #2c1810 0%, #1a0f0a 100%);
  border-radius: 0 0 12px 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.stage-curtains {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  justify-content: space-between;
}

.curtain-left,
.curtain-right {
  width: 15%;
  height: 100%;
  background: linear-gradient(180deg, #8B0000 0%, #5c0000 100%);
}

.curtain-left {
  border-radius: 0 0 20px 0;
}

.curtain-right {
  border-radius: 0 0 0 20px;
}

.stage-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(180deg, #3d2817 0%, #2c1810 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,0.7);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 4px;
}

.stage-lights {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
}

.light {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #fff 0%, #ffeb3b 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 20px #ffeb3b;
}

.theater-seating {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.theater-zone {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.zone-label-theater {
  border-radius: 4px;
}

.theater-seats {
  width: 100%;
  max-width: 700px;
  border-radius: 8px;
}

.theater-row {
  transition: padding 0.2s ease;
}

.theater-orchestra .theater-seats {
  background: rgba(198, 40, 40, 0.1);
}

.theater-mezzanine {
  margin-top: 10px;
}

.theater-mezzanine .theater-seats {
  background: rgba(21, 101, 192, 0.1);
  max-width: 600px;
}

.theater-balcony {
  margin-top: 10px;
}

.theater-balcony .theater-seats {
  background: rgba(106, 27, 154, 0.1);
  max-width: 500px;
}

.orchestra-pit {
  width: 60%;
  max-width: 400px;
  height: 30px;
  background: rgba(0,0,0,0.4);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: -8px;
}

/* ==================== CONCERT LAYOUT ==================== */
.concert-layout {
  gap: 16px;
}

.concert-stage-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.concert-stage {
  width: 90%;
  max-width: 700px;
  height: 140px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
  border-radius: 0 0 20px 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
}

.stage-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg,
    rgba(128, 0, 255, 0.3) 0%,
    rgba(0, 128, 255, 0.2) 50%,
    rgba(255, 0, 128, 0.2) 100%
  );
}

.stage-platform {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 3px solid rgba(255,255,255,0.2);
}

.concert-stage .stage-text {
  color: rgba(255,255,255,0.8);
  font-size: 16px;
}

.stage-monitors {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
}

.monitor {
  width: 30px;
  height: 20px;
  background: linear-gradient(180deg, #333 0%, #1a1a1a 100%);
  border-radius: 4px 4px 0 0;
  border: 1px solid rgba(255,255,255,0.2);
}

.concert-seating {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
}

.concert-zone {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.zone-label-concert {
  border-radius: 4px;
}

.concert-seats {
  width: 100%;
  border-radius: 8px;
}

.concert-row {
  transition: padding 0.2s ease;
}

.concert-pit .concert-seats {
  background: rgba(211, 47, 47, 0.15);
  max-width: 800px;
}

.concert-pit .seat {
  width: 10px;
  height: 10px;
}

.concert-lower {
  margin-top: 10px;
}

.concert-lower .concert-seats {
  background: rgba(25, 118, 210, 0.1);
  max-width: 750px;
}

.concert-upper {
  margin-top: 10px;
}

.concert-upper .concert-seats {
  background: rgba(56, 142, 60, 0.1);
  max-width: 700px;
}

/* ==================== LEGEND ==================== */
.editor-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
}

.legend-item.hint {
  color: rgba(255,255,255,0.5);
}

.legend-seat {
  width: 16px;
  height: 16px;
  border-radius: 3px 3px 1px 1px;
}

.legend-seat.available {
  background: #1976D2;
}

.legend-seat.deleted {
  background: #555;
  opacity: 0.5;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .seat {
    width: 10px;
    height: 10px;
  }

  .football-layout .middle-section,
  .arena-middle {
    min-height: 200px;
  }

  .theater-stage,
  .concert-stage {
    height: 80px;
  }
}
</style>
