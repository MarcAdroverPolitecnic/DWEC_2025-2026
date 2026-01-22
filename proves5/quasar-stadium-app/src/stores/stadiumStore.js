import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

// --- PLANTILLAS PREDEFINIDAS (Templates) ---
export const STADIUM_TEMPLATES = {
    stadium: {
        id: 'stadium',
        name: 'Football Stadium',
        description: 'Large outdoor stadium with four main stands surrounding the pitch',
        icon: 'stadium',
        defaultZones: [
            { id: 'north', name: 'North Stand', position: 'top', rows: 20, cols: 40, color: '#D32F2F' },
            { id: 'south', name: 'South Stand', position: 'bottom', rows: 20, cols: 40, color: '#1976D2' },
            { id: 'east', name: 'East Stand', position: 'right', rows: 30, cols: 15, color: '#388E3C' },
            { id: 'west', name: 'West Stand', position: 'left', rows: 30, cols: 15, color: '#FBC02D' }
        ]
    },
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
            { id: 'mezzanine', name: 'Mezzanine', position: 'middle', rows: 8, cols: 30, color: '#FBC02D' },
            { id: 'balcony', name: 'Balcony', position: 'top', rows: 12, cols: 35, color: '#1565C0' }
        ]
    },
    concert: {
        id: 'concert',
        name: 'Concert Hall',
        description: 'Modern concert venue with standing pit and seated tiers',
        icon: 'music_note',
        defaultZones: [
            { id: 'pit', name: 'General Admission (Pit)', position: 'front', rows: 15, cols: 40, color: '#D32F2F' },
            { id: 'lower', name: 'Lower Tier', position: 'middle', rows: 10, cols: 50, color: '#1976D2' },
            { id: 'upper', name: 'Upper Tier', position: 'back', rows: 12, cols: 60, color: '#388E3C' }
        ]
    }
}

// --- HELPER DE VALIDACIÓN DE IDs ---
function isNewEntity(id) {
    if (id === null || id === undefined) return true;
    const strId = String(id).trim();
    if (strId === '' || strId === 'null' || strId === 'undefined') return true;
    if (strId.startsWith('zone-') || strId.startsWith('temp-')) return true;
    const num = parseInt(strId, 10);
    return isNaN(num);
}

export const useStadiumStore = defineStore('stadium', () => {
    // --- ESTADO (State) ---
    const stadiums = ref([])
    const selectedStadiumId = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // --- GETTERS ---
    const selectedStadium = computed(() =>
        stadiums.value.find(s => s.id === selectedStadiumId.value)
    )

    const stadiumCount = computed(() => stadiums.value.length)

    // --- ACCIONES DE API (Actions) ---

    async function fetchStadiums() {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get('/venues')
            stadiums.value = response.data.map(stadium => ({
                ...stadium,
                totalSeats: calculateTotalSeats(stadium.zones)
            }))
        } catch (err) {
            console.error('Error fetching stadiums:', err)
            error.value = 'No se pudieron cargar los estadios.'
        } finally {
            isLoading.value = false
        }
    }

    async function getStadiumById(id) {
        const numericId = Number(id)
        let stadium = stadiums.value.find(s => s.id === numericId)

        if (stadium) {
            selectStadium(numericId)
        }

        isLoading.value = true
        try {
            const response = await api.get(`/venues/${numericId}`)
            stadium = response.data
            stadium.totalSeats = calculateTotalSeats(stadium.zones)

            const index = stadiums.value.findIndex(s => s.id === numericId)
            if (index !== -1) {
                stadiums.value[index] = stadium
            } else {
                stadiums.value.push(stadium)
            }

            selectStadium(numericId)
            return stadium
        } catch (err) {
            console.error(`Error fetching stadium ${id}:`, err)
            error.value = 'Error al cargar el estadio.'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function addStadium(frontendStadiumData) {
        isLoading.value = true
        error.value = null
        try {
            const payload = {
                name: frontendStadiumData.name,
                template: frontendStadiumData.template || 'custom',
                cityId: 1,
                zones: frontendStadiumData.zones.map(zone => ({
                    name: zone.name,
                    rows: zone.rows,
                    cols: zone.cols,
                    position: zone.position || 'center',
                    color: zone.color,
                    seats: (zone.seats || []).map(seat => ({
                        row: seat.row,
                        col: seat.col,
                        label: seat.label,
                        deleted: seat.deleted || false
                    }))
                }))
            }

            const response = await api.post('/venues', payload)
            const newStadium = response.data
            newStadium.totalSeats = calculateTotalSeats(newStadium.zones)

            stadiums.value.push(newStadium)
            return newStadium
        } catch (err) {
            console.error('Error creating stadium:', err)
            error.value = 'Error al crear el estadio.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function updateStadium(id, stadiumData) {
        isLoading.value = true
        error.value = null
        try {
            const numericId = Number(id);
            let currentStadium = stadiums.value.find(s => s.id === numericId)

            if (!currentStadium) {
                try {
                    const res = await api.get(`/venues/${numericId}`)
                    currentStadium = res.data
                } catch (e) {
                    console.warn("No se pudo recuperar el estadio original, usando valores por defecto")
                }
            }

            const cityId = currentStadium?.cityId || currentStadium?.city?.id || 1

            const payload = {
                id: numericId,
                name: stadiumData.name,
                template: stadiumData.template || 'custom',
                cityId: cityId,
                zones: stadiumData.zones.map(zone => {
                    const isNewZone = isNewEntity(zone.id);
                    return {
                        id: isNewZone ? null : parseInt(zone.id, 10),
                        name: zone.name,
                        rows: zone.rows,
                        cols: zone.cols,
                        position: zone.position,
                        color: zone.color,
                        // Nota: El backend en update() podría ignorar esta lista anidada dependiendo de la implementación,
                        // pero la enviamos para mantener consistencia.
                        seats: (zone.seats || []).map(seat => ({
                            id: isNewEntity(seat.id) ? null : parseInt(seat.id, 10),
                            row: seat.row,
                            col: seat.col,
                            label: seat.label,
                            deleted: !!seat.deleted
                        }))
                    }
                })
            }

            const response = await api.put(`/venues/${id}`, payload)
            const updatedStadium = response.data
            updatedStadium.totalSeats = calculateTotalSeats(updatedStadium.zones)

            const index = stadiums.value.findIndex(s => s.id === numericId)
            if (index !== -1) {
                stadiums.value[index] = updatedStadium
            } else {
                stadiums.value.push(updatedStadium)
            }

            return updatedStadium
        } catch (err) {
            console.error('Error updating stadium:', err)
            error.value = err.response?.data?.message || 'Error al actualizar el estadio.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function deleteStadium(id) {
        isLoading.value = true
        try {
            await api.delete(`/venues/${id}`)
            stadiums.value = stadiums.value.filter(s => s.id !== id)
            if (selectedStadiumId.value === id) {
                selectedStadiumId.value = null
            }
        } catch (err) {
            console.error('Error deleting stadium:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // --- ACCIONES GRANULARES PARA ZONAS ---

    async function createZone(venueId, zoneData) {
        isLoading.value = true
        error.value = null
        try {
            const payload = {
                name: zoneData.name,
                rows: zoneData.rows,
                cols: zoneData.cols,
                position: zoneData.position || 'center',
                color: zoneData.color,
                seats: (zoneData.seats || []).map(seat => ({
                    row: seat.row,
                    col: seat.col,
                    label: seat.label,
                    deleted: seat.deleted || false
                }))
            }

            const response = await api.post(`/zones/venue/${venueId}`, payload)
            const newZone = response.data

            const stadium = stadiums.value.find(s => s.id === Number(venueId))
            if (stadium) {
                if (!stadium.zones) stadium.zones = []
                stadium.zones.push(newZone)
                stadium.totalSeats = calculateTotalSeats(stadium.zones)
            }

            return newZone
        } catch (err) {
            console.error('Error creating zone:', err)
            error.value = 'Error al crear la zona.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function updateZone(zoneId, zoneData) {
        isLoading.value = true
        error.value = null
        try {
            const payload = {
                name: zoneData.name,
                rows: zoneData.rows,
                cols: zoneData.cols,
                position: zoneData.position,
                color: zoneData.color,
                // No enviamos seats aquí, eso va por la lógica granular de asientos
                seats: []
            }

            const response = await api.put(`/zones/${zoneId}`, payload)
            const updatedZone = response.data

            // Actualizar estado local
            stadiums.value = stadiums.value.map(s => {
                if (s.zones && s.zones.some(z => z.id === zoneId)) {
                    return {
                        ...s,
                        zones: s.zones.map(z => z.id === zoneId ? { ...z, ...updatedZone, seats: z.seats } : z)
                    }
                }
                return s
            })

            return updatedZone
        } catch (err) {
            console.error('Error updating zone:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function removeZone(venueId, zoneId) {
        isLoading.value = true
        error.value = null
        try {
            await api.delete(`/zones/${zoneId}`)

            const stadium = stadiums.value.find(s => s.id === Number(venueId))
            if (stadium && stadium.zones) {
                stadium.zones = stadium.zones.filter(z => z.id !== zoneId)
                stadium.totalSeats = calculateTotalSeats(stadium.zones)
            }
        } catch (err) {
            console.error('Error deleting zone:', err)
            error.value = 'Error al eliminar la zona.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // --- ACCIONES GRANULARES PARA ASIENTOS (NUEVAS) ---

    async function createSeat(zoneId, seatData) {
        // No activamos isLoading global para no bloquear toda la UI por un asiento,
        // o si prefieres, actívalo.
        // isLoading.value = true
        try {
            const payload = {
                row: seatData.row,
                col: seatData.col,
                label: seatData.label,
                deleted: seatData.deleted || false
            }
            // Llamada al nuevo endpoint de Seats
            await api.post(`/seats/zone/${zoneId}`, payload)
        } catch (err) {
            console.error('Error creating seat:', err)
            throw err
        }
    }

    async function removeSeat(zoneId, seatId) {
        try {
            await api.delete(`/seats/${seatId}`)
        } catch (err) {
            console.error('Error deleting seat:', err)
            throw err
        }
    }

    // --- UI Helpers ---

    function selectStadium(id) {
        selectedStadiumId.value = id
    }

    function deleteSeat(stadiumId, zoneId, seatId) {
        const stadium = stadiums.value.find(s => s.id === stadiumId)
        if (stadium) {
            const zone = stadium.zones.find(z => z.id === zoneId)
            if (zone && zone.seats) {
                const seat = zone.seats.find(s => s.id === seatId)
                if (seat) {
                    seat.deleted = true
                    stadium.totalSeats = calculateTotalSeats(stadium.zones)
                }
            }
        }
    }

    function restoreSeat(stadiumId, zoneId, seatId) {
        const stadium = stadiums.value.find(s => s.id === stadiumId)
        if (stadium) {
            const zone = stadium.zones.find(z => z.id === zoneId)
            if (zone && zone.seats) {
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
        isLoading,
        error,
        fetchStadiums,
        getStadiumById,
        addStadium,
        updateStadium,
        deleteStadium,
        selectStadium,
        deleteSeat,
        restoreSeat,
        createZone,
        updateZone,
        removeZone,
        createSeat, // <--- EXPORTADO
        removeSeat  // <--- EXPORTADO
    }
})

// --- HELPERS GLOBALES ---

function calculateTotalSeats(zones) {
    if (!zones) return 0
    return zones.reduce((total, zone) => {
        const activeSeats = zone.seats ? zone.seats.filter(s => !s.deleted).length : 0
        return total + activeSeats
    }, 0)
}

export function generateSeats(rows, cols) {
    const seats = []
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            seats.push({
                id: `temp-${row}-${col}`,
                row: row + 1,
                col: col + 1,
                label: `${String.fromCharCode(65 + row)}-${col + 1}`,
                deleted: false
            })
        }
    }
    return seats
}