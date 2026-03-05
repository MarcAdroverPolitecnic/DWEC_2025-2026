import { defineStore } from 'pinia'
import { ref } from 'vue'
import {api} from "../boot/axios.js";


export const venueStore = defineStore('venue', () => {

  const venuesList = ref([])
  //const selectedStadiumId = ref(null)
  const error = ref(null)

  async function fetchVenues() {
    error.value = null
    try {
      const response = await api.get('/venues')
      venuesList.value = response.data.map(stadium => ({
        ...stadium,
        totalSeats: calculateTotalSeats(stadium.zones)
      }))
    } catch (err) {
      console.error('Error fetching venues:', err)
      error.value = 'Venues could not be charged.'
    }
  }

  function calculateTotalSeats(zones) {
    if (!zones) return 0
    return zones.reduce((total, zone) => {
      const activeSeats = zone.seats ? zone.seats.filter(s => !s.deleted).length : 0
      return total + activeSeats
    }, 0)
  }

  return {
    fetchVenues,
    venuesList,
  }


});

