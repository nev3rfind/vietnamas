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
import WeddingInvite from './views/WeddingInvite.vue'

// Import layouts
import InviteLayout from './layouts/InviteLayout.vue'

// Detect user language based on geolocation (simplified)
const detectLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage
  const savedLang = localStorage.getItem('language')
  
  if (savedLang) return savedLang
  
  // Check if user is from Lithuania
  if (userLang.startsWith('lt')) return 'lt'
  
  return 'en' // Default to English
}

// Create i18n instance with legacy: false to fix the error
const i18n = createI18n({
  legacy: false, // This fixes the "Not available in legacy mode" error
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
    { path: '/home/:uuid', name: 'PersonalizedHome', component: Home, props: true },
    { path: '/attractions', name: 'Attractions', component: Attractions },
    { path: '/places-to-eat', name: 'PlacesToEat', component: PlacesToEat },
    { path: '/city/:id', name: 'CityDetail', component: CityDetail, props: true },
    { 
      path: '/invite/:invite_guid', 
      name: 'WeddingInvite', 
      component: WeddingInvite, 
      props: true,
      meta: { layout: 'invite' }
    }
  ]
})

const app = createApp(App)

// Register layouts globally
app.component('InviteLayout', InviteLayout)

app.use(router)
app.use(i18n)
app.mount('#app')