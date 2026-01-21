import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Predefined stadium templates
export const STADIUM_TEMPLATES = {
  arena: {
    id: 'arena',
    name: 'Arena',
    description: 'Classic arena layout with 4 main zones surrounding a central stage',
    icon: 'sports_basketball',
    defaultZones: [
      { id: 'north', name: 'North Stand', position: 'top', rows: 10, cols: 20, color: '#1976D2' },
      { id: 'south', name: 'South Stand', position: 'bottom', rows: 10, cols: 20, color: '#388E3C' },
      { id: 'east', name: 'East Stand', position: 'right', rows: 15, cols: 8, color: '#F57C00' },
      { id: 'west', name: 'West Stand', position: 'left', rows: 15, cols: 8, color: '#7B1FA2' }
    ]
  },
  theater: {
    id: 'theater',
    name: 'Theater',
    description: 'Traditional theater layout with orchestra, mezzanine, and balcony',
    icon: 'theater_comedy',
    defaultZones: [
      { id: 'orchestra', name: 'Orchestra', position: 'bottom', rows: 15, cols: 25, color: '#C62828' },
      { id: 'mezzanine', name: 'Mezzanine', position: 'center', rows: 8, cols: 20, color: '#1565C0' },
      { id: 'balcony', name: 'Balcony', position: 'top', rows: 6, cols: 18, color: '#6A1B9A' }
    ]
  },
  concert: {
    id: 'concert',
    name: 'Concert Hall',
    description: 'Large concert venue with general admission pit and tiered seating',
    icon: 'music_note',
    defaultZones: [
      { id: 'pit', name: 'General Admission Pit', position: 'bottom', rows: 20, cols: 30, color: '#D32F2F' },
      { id: 'lower', name: 'Lower Bowl', position: 'center', rows: 12, cols: 35, color: '#1976D2' },
      { id: 'upper', name: 'Upper Bowl', position: 'top', rows: 10, cols: 40, color: '#388E3C' }
    ]
  },
  stadium: {
    id: 'stadium',
    name: 'Football Stadium',
    description: 'Large stadium with multiple tiers and VIP sections',
    icon: 'sports_soccer',
    defaultZones: [
      { id: 'north_lower', name: 'North Lower', position: 'top', rows: 12, cols: 30, color: '#1976D2' },
      { id: 'north_upper', name: 'North Upper', position: 'top-upper', rows: 8, cols: 28, color: '#42A5F5' },
      { id: 'south_lower', name: 'South Lower', position: 'bottom', rows: 12, cols: 30, color: '#388E3C' },
      { id: 'south_upper', name: 'South Upper', position: 'bottom-upper', rows: 8, cols: 28, color: '#66BB6A' },
      { id: 'east_stand', name: 'East Stand', position: 'right', rows: 20, cols: 10, color: '#F57C00' },
      { id: 'west_stand', name: 'West Stand', position: 'left', rows: 20, cols: 10, color: '#7B1FA2' },
      { id: 'vip', name: 'VIP Box', position: 'center', rows: 4, cols: 20, color: '#FFC107' }
    ]
  }
}

export const useStadiumStore = defineStore('stadium', () => {
  // State
  const stadiums = ref([
    {
      id: '1',
      name: 'Madison Square Garden',
      template: 'arena',
      totalSeats: 720,
      createdAt: new Date('2024-01-15'),
      zones: STADIUM_TEMPLATES.arena.defaultZones.map(zone => ({
        ...zone,
        seats: generateSeats(zone.rows, zone.cols)
      }))
    },
    {
      id: '2',
      name: 'Broadway Theater',
      template: 'theater',
      totalSeats: 686,
      createdAt: new Date('2024-02-20'),
      zones: STADIUM_TEMPLATES.theater.defaultZones.map(zone => ({
        ...zone,
        seats: generateSeats(zone.rows, zone.cols)
      }))
    }
  ])

  const selectedStadiumId = ref(null)

  // Getters
  const selectedStadium = computed(() => {
    return stadiums.value.find(s => s.id === selectedStadiumId.value) || null
  })

  const stadiumCount = computed(() => stadiums.value.length)

  // Actions
  function selectStadium(id) {
    selectedStadiumId.value = id
  }

  function getStadiumById(id) {
    return stadiums.value.find(s => s.id === id) || null
  }

  function addStadium(stadium) {
    const newStadium = {
      ...stadium,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalSeats: calculateTotalSeats(stadium.zones)
    }
    stadiums.value.push(newStadium)
    return newStadium
  }

  function updateStadium(id, updates) {
    const index = stadiums.value.findIndex(s => s.id === id)
    if (index !== -1) {
      stadiums.value[index] = {
        ...stadiums.value[index],
        ...updates,
        totalSeats: calculateTotalSeats(updates.zones || stadiums.value[index].zones)
      }
    }
  }

  function deleteStadium(id) {
    const index = stadiums.value.findIndex(s => s.id === id)
    if (index !== -1) {
      stadiums.value.splice(index, 1)
      if (selectedStadiumId.value === id) {
        selectedStadiumId.value = null
      }
    }
  }

  function deleteSeat(stadiumId, zoneId, seatId) {
    const stadium = stadiums.value.find(s => s.id === stadiumId)
    if (stadium) {
      const zone = stadium.zones.find(z => z.id === zoneId)
      if (zone) {
        const seatIndex = zone.seats.findIndex(s => s.id === seatId)
        if (seatIndex !== -1) {
          zone.seats[seatIndex].deleted = true
          stadium.totalSeats = calculateTotalSeats(stadium.zones)
        }
      }
    }
  }

  function restoreSeat(stadiumId, zoneId, seatId) {
    const stadium = stadiums.value.find(s => s.id === stadiumId)
    if (stadium) {
      const zone = stadium.zones.find(z => z.id === zoneId)
      if (zone) {
        const seat = zone.seats.find(s => s.id === seatId)
        if (seat) {
          seat.deleted = false
          stadium.totalSeats = calculateTotalSeats(stadium.zones)
        }
      }
    }
  }

  return {
    stadiums,
    selectedStadiumId,
    selectedStadium,
    stadiumCount,
    selectStadium,
    getStadiumById,
    addStadium,
    updateStadium,
    deleteStadium,
    deleteSeat,
    restoreSeat
  }
})

// Helper functions
export function generateSeats(rows, cols) {
  const seats = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      seats.push({
        id: `${row}-${col}`,
        row: row + 1,
        col: col + 1,
        label: `${String.fromCharCode(65 + row)}${col + 1}`,
        deleted: false
      })
    }
  }
  return seats
}

export function calculateTotalSeats(zones) {
  return zones.reduce((total, zone) => {
    const activeSeats = zone.seats.filter(s => !s.deleted).length
    return total + activeSeats
  }, 0)
}
