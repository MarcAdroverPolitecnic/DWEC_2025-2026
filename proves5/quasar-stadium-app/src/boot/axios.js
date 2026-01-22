import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Creamos la instancia de axios con la URL base de tu backend Spring Boot
const api = axios.create({ baseURL: 'http://localhost:8080' })

export default boot(({ app }) => {
    // Esto permite usar this.$axios y this.$api en componentes de Vue (Options API)
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$api = api
})

// Exportamos 'api' para poder importarla directamente en los archivos .js (como tu stadiumStore)
export { api }