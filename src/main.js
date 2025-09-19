import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'

// Import language files
import en from './locales/en.json'
import lt from './locales/lt.json'

// Import views
import Home from './views/Home.vue'
import Attractions from './views/Attractions.vue'
import PlacesToEat from './views/PlacesToEat.vue'
import CityDetail from './views/CityDetail.vue'

// Detect user language based on geolocation (simplified)
const detectLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage
  const savedLang = localStorage.getItem('language')
  
  if (savedLang) return savedLang
  
  // Check if user is from Lithuania
  if (userLang.startsWith('lt')) return 'lt'
  
  return 'en' // Default to English
}

// Create i18n instance
const i18n = createI18n({
  locale: detectLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    lt
  }
})

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/attractions', name: 'Attractions', component: Attractions },
    { path: '/places-to-eat', name: 'PlacesToEat', component: PlacesToEat },
    { path: '/city/:id', name: 'CityDetail', component: CityDetail, props: true }
  ]
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')