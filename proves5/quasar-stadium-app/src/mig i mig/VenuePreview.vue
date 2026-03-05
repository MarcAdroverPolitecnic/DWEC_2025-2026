<template>
  <div class="venue-preview-realistic">
    <!-- Football Venue Preview -->
    <div v-if="layoutType === 'stadium'" class="preview-container football-preview">
      <!-- North -->
      <div class="preview-section north">
        <div
          v-for="zone in northZones"
          :key="zone.id"
          class="preview-zone"
        >
          <div class="zone-seats north-curve">
            <div
              v-for="row in zone.rows"
              :key="row"
              class="mini-row"
              :style="getNorthCurveStyle(zone.rows, row)"
            >
              <span
                v-for="col in zone.cols"
                :key="col"
                class="mini-seat"
                :style="{ backgroundColor: zone.color }"
              />
            </div>
          </div>
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
        </div>
      </div>

      <!-- Middle -->
      <div class="preview-section middle">
        <div class="preview-side west">
          <div v-for="zone in westZones" :key="zone.id" class="preview-zone vertical">
            <div class="zone-info side-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
            <div class="zone-seats west-curve">
              <div
                v-for="col in zone.cols"
                :key="col"
                class="mini-col"
                :style="getWestCurveStyle(zone.cols, col)"
              >
                <span v-for="row in zone.rows" :key="row" class="mini-seat" :style="{ backgroundColor: zone.color }" />
              </div>
            </div>
          </div>
        </div>

        <div class="preview-field football-field-preview">
          <div class="field-line center-line-v"></div>
          <div class="field-circle"></div>
        </div>

        <div class="preview-side east">
          <div v-for="zone in eastZones" :key="zone.id" class="preview-zone vertical">
            <div class="zone-seats east-curve">
              <div
                v-for="col in zone.cols"
                :key="col"
                class="mini-col"
                :style="getEastCurveStyle(zone.cols, col)"
              >
                <span v-for="row in zone.rows" :key="row" class="mini-seat" :style="{ backgroundColor: zone.color }" />
              </div>
            </div>
            <div class="zone-info side-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          </div>
        </div>
      </div>

      <!-- South -->
      <div class="preview-section south">
        <div v-for="zone in southZones" :key="zone.id" class="preview-zone">
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          <div class="zone-seats south-curve">
            <div
              v-for="row in zone.rows"
              :key="row"
              class="mini-row"
              :style="getSouthCurveStyle(zone.rows, row)"
            >
              <span v-for="col in zone.cols" :key="col" class="mini-seat" :style="{ backgroundColor: zone.color }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Center zones -->
      <div v-if="centerZones.length > 0" class="center-overlay">
        <div v-for="zone in centerZones" :key="zone.id" class="preview-zone center">
          <div class="zone-info small" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
        </div>
      </div>
    </div>

    <!-- Arena Preview -->
    <div v-else-if="layoutType === 'arena'" class="preview-container arena-preview">
      <!-- Top curved -->
      <div class="arena-section-preview arena-top-preview">
        <div v-for="zone in arenaTopZones" :key="zone.id" class="preview-zone">
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          <div class="zone-seats arena-curve-top">
            <div
              v-for="row in Math.min(zone.rows, 6)"
              :key="row"
              class="mini-row"
              :style="getArenaCurvePreviewStyle('top', zone.rows, row)"
            >
              <span v-for="col in zone.cols" :key="col" class="mini-seat" :style="{ backgroundColor: zone.color }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Middle -->
      <div class="arena-section-preview arena-middle-preview">
        <div class="arena-side-preview">
          <div v-for="zone in arenaLeftZones" :key="zone.id" class="preview-zone vertical">
            <div class="zone-info side-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
            <div class="zone-seats arena-curve-left">
              <div v-for="col in Math.min(zone.cols, 4)" :key="col" class="mini-col">
                <span v-for="row in zone.rows" :key="row" class="mini-seat" :style="{ backgroundColor: zone.color }" />
              </div>
            </div>
          </div>
        </div>

        <div class="preview-court">
          <div class="court-circle"></div>
          <div class="court-line"></div>
        </div>

        <div class="arena-side-preview">
          <div v-for="zone in arenaRightZones" :key="zone.id" class="preview-zone vertical">
            <div class="zone-seats arena-curve-right">
              <div v-for="col in Math.min(zone.cols, 4)" :key="col" class="mini-col">
                <span v-for="row in zone.rows" :key="row" class="mini-seat" :style="{ backgroundColor: zone.color }" />
              </div>
            </div>
            <div class="zone-info side-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          </div>
        </div>
      </div>

      <!-- Bottom curved -->
      <div class="arena-section-preview arena-bottom-preview">
        <div v-for="zone in arenaBottomZones" :key="zone.id" class="preview-zone">
          <div class="zone-seats arena-curve-bottom">
            <div
              v-for="row in Math.min(zone.rows, 6)"
              :key="row"
              class="mini-row"
              :style="getArenaCurvePreviewStyle('bottom', zone.rows, row)"
            >
              <span v-for="col in zone.cols" :key="col" class="mini-seat" :style="{ backgroundColor: zone.color }" />
            </div>
          </div>
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
        </div>
      </div>
    </div>

    <!-- Theater Preview -->
    <div v-else-if="layoutType === 'theater'" class="preview-container theater-preview">
      <div class="theater-stage-preview">
        <div class="stage-curtain-preview left"></div>
        <span>STAGE</span>
        <div class="stage-curtain-preview right"></div>
      </div>

      <div class="theater-sections-preview">
        <div
          v-for="zone in theaterZonesSorted"
          :key="zone.id"
          :class="['preview-zone theater-zone-preview', getTheaterZoneClass(zone)]"
        >
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          <div class="zone-seats theater-seats-preview">
            <div
              v-for="row in Math.min(zone.rows, 8)"
              :key="row"
              class="mini-row"
              :style="getTheaterCurvePreviewStyle(zone.rows, row)"
            >
              <span v-for="col in zone.cols" :key="col" class="mini-seat" :style="{ backgroundColor: zone.color }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Concert Preview -->
    <div v-else-if="layoutType === 'concert'" class="preview-container concert-preview">
      <div class="concert-stage-preview">
        <div class="stage-lights-preview">
          <div class="light-preview"></div>
          <div class="light-preview"></div>
          <div class="light-preview"></div>
        </div>
        <span>STAGE</span>
      </div>

      <div class="concert-sections-preview">
        <div
          v-for="zone in concertZonesSorted"
          :key="zone.id"
          :class="['preview-zone concert-zone-preview', getConcertZoneClass(zone)]"
        >
          <div class="zone-info" :style="{ backgroundColor: zone.color }">{{ zone.name }}</div>
          <div class="zone-seats concert-seats-preview">
            <div
              v-for="row in Math.min(zone.rows, 10)"
              :key="row"
              class="mini-row"
              :style="getConcertCurvePreviewStyle(zone, row)"
            >
              <span v-for="col in zone.cols" :key="col" class="mini-seat" :style="{ backgroundColor: zone.color }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="preview-stats">
      <div class="stat">
        <span class="stat-value">{{ totalSeats.toLocaleString() }}</span>
        <span class="stat-label">Total Seats</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ zones.length }}</span>
        <span class="stat-label">Zones</span>
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
  template: {
    type: String,
    default: 'stadium'
  }
})

const layoutType = computed(() => props.template || 'stadium')

// Football zones
const northZones = computed(() => props.zones.filter(z => z.position === 'top' || z.position === 'top-upper'))
const southZones = computed(() => props.zones.filter(z => z.position === 'bottom' || z.position === 'bottom-upper'))
const westZones = computed(() => props.zones.filter(z => z.position === 'left'))
const eastZones = computed(() => props.zones.filter(z => z.position === 'right'))
const centerZones = computed(() => props.zones.filter(z => z.position === 'center'))

// Arena zones
const arenaTopZones = computed(() => props.zones.filter(z => z.position === 'top' || z.position === 'top-upper'))
const arenaBottomZones = computed(() => props.zones.filter(z => z.position === 'bottom' || z.position === 'bottom-upper'))
const arenaLeftZones = computed(() => props.zones.filter(z => z.position === 'left'))
const arenaRightZones = computed(() => props.zones.filter(z => z.position === 'right'))

// Theater zones
const theaterZonesSorted = computed(() => {
  const order = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  return [...props.zones].sort((a, b) => (order[a.position] || 0) - (order[b.position] || 0))
})

// Concert zones
const concertZonesSorted = computed(() => {
  const order = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  return [...props.zones].sort((a, b) => (order[a.position] || 0) - (order[b.position] || 0))
})

const totalSeats = computed(() => {
  return props.zones.reduce((total, zone) => {
    if (zone.seats) return total + zone.seats.filter(s => !s.deleted).length
    return total + (zone.rows * zone.cols)
  }, 0)
})

// Football curves
function getNorthCurveStyle(totalRows, currentRow) {
  const curve = (totalRows - currentRow) * 0.5
  return { paddingLeft: `${curve}px`, paddingRight: `${curve}px` }
}

function getSouthCurveStyle(totalRows, currentRow) {
  const curve = (currentRow - 1) * 0.5
  return { paddingLeft: `${curve}px`, paddingRight: `${curve}px` }
}

function getWestCurveStyle(totalCols, currentCol) {
  const curve = (totalCols - currentCol) * 0.4
  return { paddingTop: `${curve}px`, paddingBottom: `${curve}px` }
}

function getEastCurveStyle(totalCols, currentCol) {
  const curve = (currentCol - 1) * 0.4
  return { paddingTop: `${curve}px`, paddingBottom: `${curve}px` }
}

// Arena curves
function getArenaCurvePreviewStyle(position, totalRows, currentRow) {
  const curve = position === 'top'
    ? (totalRows - currentRow) * 1.2
    : (currentRow - 1) * 1.2
  return { paddingLeft: `${curve}px`, paddingRight: `${curve}px` }
}

// Theater styling
function getTheaterZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('orchestra')) return 'theater-orchestra-preview'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('mezzanine')) return 'theater-mezzanine-preview'
  return 'theater-balcony-preview'
}

function getTheaterCurvePreviewStyle(totalRows, currentRow) {
  const curve = (currentRow - 1) * 0.6
  return { paddingLeft: `${curve}px`, paddingRight: `${curve}px` }
}

// Concert styling
function getConcertZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('pit')) return 'concert-pit-preview'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('lower')) return 'concert-lower-preview'
  return 'concert-upper-preview'
}

function getConcertCurvePreviewStyle(zone, currentRow) {
  const isPit = zone.position === 'bottom' || zone.name.toLowerCase().includes('pit')
  if (isPit) return {}
  const curve = (currentRow - 1) * 0.5
  return { paddingLeft: `${curve}px`, paddingRight: `${curve}px` }
}
</script>

<style scoped>
.venue-preview-realistic {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  padding: 16px;
}

.preview-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

/* Common styles */
.preview-section,
.arena-section-preview {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.preview-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.preview-zone.vertical {
  flex-direction: row;
}

.zone-info {
  color: white;
  font-size: 8px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 2px;
  white-space: nowrap;
}

.zone-info.side-info {
  writing-mode: vertical-lr;
  padding: 6px 2px;
}

.zone-info.small {
  font-size: 7px;
  padding: 2px 4px;
}

.zone-seats {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mini-row {
  display: flex;
  justify-content: center;
  gap: 1px;
}

.mini-col {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mini-seat {
  width: 3px;
  height: 3px;
  border-radius: 1px;
  opacity: 0.85;
}

/* Football Preview */
.football-preview .middle {
  align-items: stretch;
}

.preview-side {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.west-curve,
.east-curve {
  flex-direction: row;
}

.preview-field,
.preview-court {
  width: 120px;
  height: 80px;
  border: 2px solid rgba(255,255,255,0.8);
  border-radius: 4px;
  margin: 0 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.football-field-preview {
  background: linear-gradient(180deg, #2d5a27 0%, #1e4d1a 100%);
}

.field-line,
.court-line {
  position: absolute;
  background: rgba(255,255,255,0.5);
}

.center-line-v {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
}

.field-circle,
.court-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 50%;
}

.center-overlay {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.preview-zone.center {
  background: rgba(0,0,0,0.3);
  border-radius: 2px;
  padding: 2px;
}

/* Arena Preview */
.arena-preview {
  gap: 4px;
}

.arena-top-preview,
.arena-bottom-preview {
  width: 100%;
  max-width: 200px;
}

.arena-middle-preview {
  display: flex;
  align-items: stretch;
  gap: 4px;
}

.arena-side-preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.arena-curve-top {
  border-radius: 50px 50px 0 0;
  overflow: hidden;
}

.arena-curve-bottom {
  border-radius: 0 0 50px 50px;
  overflow: hidden;
}

.arena-curve-left,
.arena-curve-right {
  flex-direction: row;
}

.preview-court {
  background: linear-gradient(180deg, #c4893b 0%, #a67030 100%);
  width: 100px;
  height: 60px;
}

.court-line {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
}

/* Theater Preview */
.theater-preview {
  gap: 8px;
}

.theater-stage-preview {
  width: 80%;
  max-width: 180px;
  height: 40px;
  background: linear-gradient(180deg, #3d2817 0%, #2c1810 100%);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  position: relative;
}

.stage-curtain-preview {
  position: absolute;
  top: 0;
  width: 15%;
  height: 15px;
  background: linear-gradient(180deg, #8B0000 0%, #5c0000 100%);
}

.stage-curtain-preview.left {
  left: 0;
  border-radius: 0 0 8px 0;
}

.stage-curtain-preview.right {
  right: 0;
  border-radius: 0 0 0 8px;
}

.theater-sections-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.theater-zone-preview {
  width: 100%;
}

.theater-seats-preview {
  border-radius: 4px;
  padding: 4px;
  background: rgba(255,255,255,0.05);
}

.theater-orchestra-preview .theater-seats-preview {
  max-width: 200px;
}

.theater-mezzanine-preview .theater-seats-preview {
  max-width: 160px;
}

.theater-balcony-preview .theater-seats-preview {
  max-width: 120px;
}

/* Concert Preview */
.concert-preview {
  gap: 8px;
}

.concert-stage-preview {
  width: 90%;
  max-width: 200px;
  height: 45px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.8);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  position: relative;
}

.stage-lights-preview {
  position: absolute;
  top: 5px;
  display: flex;
  gap: 20px;
}

.light-preview {
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fff 0%, #ffeb3b 60%, transparent 100%);
  border-radius: 50%;
}

.concert-sections-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.concert-zone-preview {
  width: 100%;
}

.concert-seats-preview {
  border-radius: 4px;
  padding: 4px;
  background: rgba(255,255,255,0.05);
}

.concert-pit-preview .mini-seat {
  width: 2px;
  height: 2px;
}

.concert-pit-preview .concert-seats-preview {
  max-width: 220px;
}

.concert-lower-preview .concert-seats-preview {
  max-width: 180px;
}

.concert-upper-preview .concert-seats-preview {
  max-width: 140px;
}

/* Stats */
.preview-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
