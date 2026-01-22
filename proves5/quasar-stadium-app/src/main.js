import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar' // <--- 1. AÑADE Loading AQUÍ
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import axiosBoot from './boot/axios'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, {
    plugins: {
        Notify,
        Dialog,
        Loading // <--- 2. AÑADE Loading AQUÍ
    },
    config: {
        brand: {
            primary: '#1976D2',
            secondary: '#26A69A',
            accent: '#9C27B0',
            dark: '#1D1D1D',
            positive: '#21BA45',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037'
        }
    }
})

axiosBoot({ app })

app.use(createPinia())
app.use(router)

app.mount('#app')