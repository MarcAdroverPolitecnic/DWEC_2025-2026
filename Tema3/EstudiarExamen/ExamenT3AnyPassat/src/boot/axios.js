import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { Dialog } from 'quasar'

const api = axios.create({ baseURL: 'http://theteacher.codiblau.com/public/exercicis/galeria' })

api.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data === "OK" || (typeof data === 'string' && data.includes("desat correctament"))) {

      Dialog.create({
        title: 'Èxit',
        message: 'Obra d’art desada correctament',
        color: 'primary',
        ok: true
      })

      console.log("Obra d’art desada correctament")
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
