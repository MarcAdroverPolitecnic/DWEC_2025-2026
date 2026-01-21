<template>
  <div class="stadium-mini-preview">
    <!-- Football Stadium Mini -->
    <div v-if="layoutType === 'stadium'" class="mini-stadium football-mini">
      <div class="mini-section north">
        <div v-for="zone in northZones" :key="zone.id" class="mini-zone horizontal" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
      <div class="mini-section middle">
        <div class="mini-side west">
          <div v-for="zone in westZones" :key="zone.id" class="mini-zone vertical" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
        </div>
        <div class="mini-field football">
          <div class="field-center-line"></div>
          <div class="field-center-circle"></div>
        </div>
        <div class="mini-side east">
          <div v-for="zone in eastZones" :key="zone.id" class="mini-zone vertical" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
        </div>
      </div>
      <div class="mini-section south">
        <div v-for="zone in southZones" :key="zone.id" class="mini-zone horizontal" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
      <div v-if="centerZones.length > 0" class="mini-center">
        <div v-for="zone in centerZones" :key="zone.id" class="mini-zone center" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
    </div>

    <!-- Arena Mini -->
    <div v-else-if="layoutType === 'arena'" class="mini-stadium arena-mini">
      <div class="arena-mini-top">
        <div v-for="zone in arenaTopZones" :key="zone.id" class="mini-zone arena-curve-top" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
      <div class="arena-mini-middle">
        <div class="arena-mini-side left">
          <div v-for="zone in arenaLeftZones" :key="zone.id" class="mini-zone arena-vertical" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
        </div>
        <div class="mini-field court">
          <div class="court-center-circle"></div>
        </div>
        <div class="arena-mini-side right">
          <div v-for="zone in arenaRightZones" :key="zone.id" class="mini-zone arena-vertical" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
        </div>
      </div>
      <div class="arena-mini-bottom">
        <div v-for="zone in arenaBottomZones" :key="zone.id" class="mini-zone arena-curve-bottom" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
    </div>

    <!-- Theater Mini -->
    <div v-else-if="layoutType === 'theater'" class="mini-stadium theater-mini">
      <div class="mini-stage theater-stage">
        <span>STAGE</span>
      </div>
      <div class="theater-mini-sections">
        <div v-for="zone in theaterZonesSorted" :key="zone.id" :class="['mini-zone theater-zone', getTheaterZoneClass(zone)]" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
    </div>

    <!-- Concert Mini -->
    <div v-else-if="layoutType === 'concert'" class="mini-stadium concert-mini">
      <div class="mini-stage concert-stage">
        <div class="stage-glow"></div>
        <span>STAGE</span>
      </div>
      <div class="concert-mini-sections">
        <div v-for="zone in concertZonesSorted" :key="zone.id" :class="['mini-zone concert-zone', getConcertZoneClass(zone)]" :style="{ backgroundColor: zone.color }" :title="`${zone.name}: ${getActiveSeats(zone)} seats`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stadium: {
    type: Object,
    required: true
  }
})

const zones = computed(() => props.stadium?.zones || [])
const layoutType = computed(() => props.stadium?.template || 'stadium')

// Football zones
const northZones = computed(() => zones.value.filter(z => z.position === 'top' || z.position === 'top-upper'))
const southZones = computed(() => zones.value.filter(z => z.position === 'bottom' || z.position === 'bottom-upper'))
const westZones = computed(() => zones.value.filter(z => z.position === 'left'))
const eastZones = computed(() => zones.value.filter(z => z.position === 'right'))
const centerZones = computed(() => zones.value.filter(z => z.position === 'center'))

// Arena zones
const arenaTopZones = computed(() => zones.value.filter(z => z.position === 'top' || z.position === 'top-upper'))
const arenaBottomZones = computed(() => zones.value.filter(z => z.position === 'bottom' || z.position === 'bottom-upper'))
const arenaLeftZones = computed(() => zones.value.filter(z => z.position === 'left'))
const arenaRightZones = computed(() => zones.value.filter(z => z.position === 'right'))

// Theater zones
const theaterZonesSorted = computed(() => {
  const order = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  return [...zones.value].sort((a, b) => (order[a.position] || 0) - (order[b.position] || 0))
})

// Concert zones
const concertZonesSorted = computed(() => {
  const order = { bottom: 0, center: 1, top: 2, 'top-upper': 3 }
  return [...zones.value].sort((a, b) => (order[a.position] || 0) - (order[b.position] || 0))
})

function getActiveSeats(zone) {
  if (!zone.seats) return zone.rows * zone.cols
  return zone.seats.filter(s => !s.deleted).length
}

function getTheaterZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('orchestra')) return 'theater-orchestra'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('mezzanine')) return 'theater-mezzanine'
  return 'theater-balcony'
}

function getConcertZoneClass(zone) {
  if (zone.position === 'bottom' || zone.name.toLowerCase().includes('pit')) return 'concert-pit'
  if (zone.position === 'center' || zone.name.toLowerCase().includes('lower')) return 'concert-lower'
  return 'concert-upper'
}
</script>

<style scoped>
.stadium-mini-preview {
  width: 100%;
  height: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  padding: 12px;
}

.mini-stadium {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  max-width: 160px;
  position: relative;
}

.mini-zone {
  border-radius: 2px;
  transition: opacity 0.2s ease;
}

.mini-zone:hover {
  opacity: 0.75;
}

/* ==================== FOOTBALL MINI ==================== */
.football-mini .mini-section {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.football-mini .mini-section.north,
.football-mini .mini-section.south {
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.football-mini .mini-section.middle {
  align-items: stretch;
}

.football-mini .mini-side {
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
}

.football-mini .mini-zone.horizontal {
  height: 10px;
  width: 80%;
  min-width: 60px;
}

.football-mini .mini-zone.vertical {
  width: 10px;
  min-height: 25px;
  flex: 1;
}

.football-mini .mini-zone.center {
  width: 20px;
  height: 8px;
}

.mini-field {
  flex: 1;
  min-width: 70px;
  height: 50px;
  border: 1.5px solid rgba(255,255,255,0.6);
  border-radius: 3px;
  margin: 0 4px;
  position: relative;
}

.mini-field.football {
  background: linear-gradient(180deg, #2d5a27 0%, #1e4d1a 100%);
}

.field-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255,255,255,0.4);
}

.field-center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50%;
}

.mini-center {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
}

/* ==================== ARENA MINI ==================== */
.arena-mini {
  align-items: center;
}

.arena-mini-top,
.arena-mini-bottom {
  display: flex;
  justify-content: center;
  width: 100%;
}

.arena-mini-middle {
  display: flex;
  align-items: stretch;
  gap: 4px;
  width: 100%;
}

.arena-mini-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.mini-zone.arena-curve-top {
  height: 12px;
  width: 70%;
  border-radius: 30px 30px 0 0;
}

.mini-zone.arena-curve-bottom {
  height: 12px;
  width: 70%;
  border-radius: 0 0 30px 30px;
}

.mini-zone.arena-vertical {
  width: 10px;
  min-height: 30px;
  flex: 1;
  border-radius: 2px;
}

.arena-mini-side.left .mini-zone.arena-vertical {
  border-radius: 10px 2px 2px 10px;
}

.arena-mini-side.right .mini-zone.arena-vertical {
  border-radius: 2px 10px 10px 2px;
}

.mini-field.court {
  background: linear-gradient(180deg, #c4893b 0%, #a67030 100%);
  flex: 1;
  min-width: 60px;
  height: 45px;
  border-radius: 4px;
}

.court-center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50%;
}

/* ==================== THEATER MINI ==================== */
.theater-mini {
  gap: 6px;
}

.mini-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  letter-spacing: 1px;
}

.theater-stage {
  width: 80%;
  height: 25px;
  background: linear-gradient(180deg, #3d2817 0%, #2c1810 100%);
  border-radius: 0 0 6px 6px;
  position: relative;
}

.theater-stage::before,
.theater-stage::after {
  content: '';
  position: absolute;
  top: 0;
  width: 12%;
  height: 10px;
  background: linear-gradient(180deg, #8B0000 0%, #5c0000 100%);
}

.theater-stage::before {
  left: 0;
  border-radius: 0 0 4px 0;
}

.theater-stage::after {
  right: 0;
  border-radius: 0 0 0 4px;
}

.theater-mini-sections {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.theater-zone {
  height: 12px;
}

.theater-zone.theater-orchestra {
  width: 90%;
  border-radius: 2px;
}

.theater-zone.theater-mezzanine {
  width: 70%;
  border-radius: 2px;
}

.theater-zone.theater-balcony {
  width: 55%;
  border-radius: 2px;
}

/* ==================== CONCERT MINI ==================== */
.concert-mini {
  gap: 6px;
}

.concert-stage {
  width: 90%;
  height: 30px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 0 0 10px 10px;
  position: relative;
  overflow: hidden;
}

.stage-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, 
    rgba(128, 0, 255, 0.2) 0%, 
    rgba(0, 128, 255, 0.15) 50%, 
    transparent 100%
  );
}

.concert-mini-sections {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.concert-zone {
  height: 12px;
}

.concert-zone.concert-pit {
  width: 95%;
  border-radius: 2px;
}

.concert-zone.concert-lower {
  width: 80%;
  border-radius: 2px;
}

.concert-zone.concert-upper {
  width: 65%;
  border-radius: 2px;
}
</style>
