<template>
  <div class="vietnam-map-container" ref="mapContainer">
    <!-- Clean Background inspired by Opal Camera -->
    <div class="clean-background">
      <div class="gradient-overlay"></div>
    </div>

    <!-- Map Header with Opal-inspired Typography -->
    <div class="map-header" ref="mapHeader">
      <h2 class="map-title">{{ $t('map.title') }}</h2>
      <p class="map-subtitle">{{ $t('map.subtitle') }}</p>
    </div>

    <!-- Main Map Container -->
    <div class="map-wrapper" ref="mapWrapper">
      <!-- Vietnam SVG Map Container -->
      <div class="svg-map-container" ref="svgContainer">
        <div class="vietnam-svg-wrapper">
          <!-- Load the vietnam_map.svg file -->
          <div class="svg-map-holder">
            <img 
              :src="`${baseUrl}vietnam_map.svg`"
              alt="Vietnam Map" 
              class="vietnam-svg-map"
              @load="onMapLoad"
              @error="onMapError"
            />
          </div>
          
          <!-- City Markers Overlay -->
          <div class="city-markers-overlay">
            <!-- Hanoi -->
            <div class="city-marker-group" 
                 :style="{ left: '48%', top: '18%' }"
                 data-city="hanoi"
                 @click="showCityPopup('hanoi', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.hanoi.name') }}</div>
            </div>
            
            <!-- Hue -->
            <div class="city-marker-group" 
                 :style="{ left: '52%', top: '38%' }"
                 data-city="hue"
                 @click="showCityPopup('hue', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.hue.name') }}</div>
            </div>
            
            <!-- Da Nang -->
            <div class="city-marker-group" 
                 :style="{ left: '55%', top: '42%' }"
                 data-city="danang"
                 @click="showCityPopup('danang', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.danang.name') }}</div>
            </div>
            
            <!-- Hoi An -->
            <div class="city-marker-group" 
                 :style="{ left: '58%', top: '46%' }"
                 data-city="hoian"
                 @click="showCityPopup('hoian', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.hoian.name') }}</div>
            </div>
            
            <!-- Nha Trang -->
            <div class="city-marker-group" 
                 :style="{ left: '54%', top: '62%' }"
                 data-city="nhatrang"
                 @click="showCityPopup('nhatrang', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.nhatrang.name') }}</div>
            </div>
            
            <!-- Ho Chi Minh City -->
            <div class="city-marker-group" 
                 :style="{ left: '50%', top: '82%' }"
                 data-city="hochiminh"
                 @click="showCityPopup('hochiminh', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.hochiminh.name') }}</div>
            </div>
            
            <!-- Phu Quoc -->
            <div class="city-marker-group" 
                 :style="{ left: '18%', top: '88%' }"
                 data-city="phuquoc"
                 @click="showCityPopup('phuquoc', $event)">
              <div class="marker-pulse"></div>
              <div class="city-marker"></div>
              <div class="marker-center"></div>
              <div class="city-label">{{ $t('cities.phuquoc.name') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Popup inspired by Opal Camera -->
    <div 
      v-if="selectedCity" 
      class="city-popup modern-popup"
      :style="popupStyle"
      ref="popup"
    >
      <div class="popup-content">
        <!-- Close Button -->
        <button class="popup-close modern-button" @click="closePopup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <!-- City Image -->
        <div class="popup-image">
          <img :src="getCityImage(selectedCity)" :alt="$t(`cities.${selectedCity}.name`)" />
          <div class="image-overlay"></div>
        </div>
        
        <!-- City Info -->
        <div class="popup-info">
          <h3 class="popup-title">{{ $t(`cities.${selectedCity}.name`) }}</h3>
          <p class="popup-description">{{ $t(`cities.${selectedCity}.description`) }}</p>
          
          <!-- Action Button -->
          <button 
            class="popup-button modern-button primary"
            @click="goToCityDetail(selectedCity)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            {{ $t('attractions.findMore') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Overlay -->
    <div 
      v-if="selectedCity" 
      class="popup-overlay modern-overlay"
      @click="closePopup"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'VietnamMap',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Base URL for assets
    const baseUrl = import.meta.env.BASE_URL
    
    // Refs
    const mapContainer = ref(null)
    const mapHeader = ref(null)
    const mapWrapper = ref(null)
    const svgContainer = ref(null)
    const popup = ref(null)
    
    // State
    const selectedCity = ref(null)
    const popupStyle = ref({})
    const mapLoaded = ref(false)

    // City images
    const cityImages = {
      hanoi: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=400',
      hochiminh: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=400',
      danang: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=400',
      hue: 'https://images.pexels.com/photos/5490780/pexels-photo-5490780.jpeg?auto=compress&cs=tinysrgb&w=400',
      hoian: 'https://images.pexels.com/photos/5490781/pexels-photo-5490781.jpeg?auto=compress&cs=tinysrgb&w=400',
      nhatrang: 'https://images.pexels.com/photos/5490782/pexels-photo-5490782.jpeg?auto=compress&cs=tinysrgb&w=400',
      phuquoc: 'https://images.pexels.com/photos/5490783/pexels-photo-5490783.jpeg?auto=compress&cs=tinysrgb&w=400'
    }

    const getCityImage = (city) => {
      return cityImages[city] || cityImages.hanoi
    }

    const onMapLoad = () => {
      mapLoaded.value = true
      console.log('Vietnam map loaded successfully')
    }

    const onMapError = () => {
      console.error('Failed to load Vietnam map SVG')
    }

    // Popup functionality
    const showCityPopup = async (city, event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const mapRect = mapWrapper.value.getBoundingClientRect()
      
      selectedCity.value = city
      
      await nextTick()
      
      // Position popup
      popupStyle.value = {
        left: `${rect.left - mapRect.left + rect.width / 2}px`,
        top: `${rect.top - mapRect.top - 10}px`,
        transform: 'translate(-50%, -100%)'
      }

      // Modern popup animation
      gsap.fromTo(popup.value, 
        { 
          scale: 0, 
          opacity: 0, 
          y: 20
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 0.4, 
          ease: 'back.out(1.7)'
        }
      )

      // Marker animation
      const marker = event.currentTarget.querySelector('.city-marker')
      gsap.to(marker, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const closePopup = () => {
      if (popup.value) {
        gsap.to(popup.value, {
          scale: 0,
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            selectedCity.value = null
          }
        })
      }

      // Reset all markers
      gsap.to('.city-marker', {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const goToCityDetail = (city) => {
      router.push(`/city/${city}`)
    }

    onMounted(() => {
      // Clean entrance animations inspired by Opal Camera
      const tl = gsap.timeline()
      
      // Header animation
      tl.fromTo(mapHeader.value, 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      
      // Map container animation
      .fromTo(mapWrapper.value, 
        { 
          opacity: 0, 
          scale: 0.95, 
          y: 30
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 1, 
          ease: 'power3.out'
        }, '-=0.4'
      )

      // City markers entrance
      gsap.fromTo('.city-marker-group', 
        { 
          scale: 0, 
          opacity: 0
        },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 1.2,
          ease: 'back.out(1.7)'
        }
      )

      // Continuous pulse animation for markers
      gsap.to('.marker-pulse', {
        scale: 1.3,
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.2
      })
    })

    return {
      mapContainer,
      mapHeader,
      mapWrapper,
      svgContainer,
      popup,
      selectedCity,
      popupStyle,
      mapLoaded,
      showCityPopup,
      closePopup,
      goToCityDetail,
      getCityImage,
      onMapLoad,
      onMapError,
      t,
      baseUrl
    }
  }
}
</script>

<style scoped>
/* Opal Camera inspired clean design */
.vietnam-map-container {
  position: relative;
  min-height: 100vh;
  padding: 4rem 0;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.clean-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
}

.map-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 10;
}

.map-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.map-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 400;
}

.map-wrapper {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  height: 600px;
  z-index: 5;
  padding: 0 2rem;
}

.svg-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.vietnam-svg-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.svg-map-holder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vietnam-svg-map {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1));
}

.city-markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.city-marker-group {
  position: absolute;
  cursor: pointer;
  pointer-events: all;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  opacity: 0.6;
}

.city-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.city-marker:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.marker-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
  pointer-events: none;
}

.city-label {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  pointer-events: none;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Modern Popup inspired by Opal Camera */
.city-popup {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}

.modern-popup .popup-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  overflow: hidden;
  width: 320px;
  pointer-events: all;
  position: relative;
  border: 1px solid #e2e8f0;
}

.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  transition: all 0.2s ease;
}

.modern-button {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.modern-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.popup-close:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.popup-image {
  height: 160px;
  overflow: hidden;
  position: relative;
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
}

.popup-info {
  padding: 1.5rem;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.popup-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.875rem;
}

.popup-button.primary {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  width: 100%;
  justify-content: center;
  border-radius: 0.5rem;
}

.popup-button.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
}

.modern-overlay {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .vietnam-map-container {
    padding: 2rem 0;
  }
  
  .map-title {
    font-size: 2rem;
  }
  
  .map-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .map-wrapper {
    height: 500px;
    padding: 0 1rem;
  }
  
  .modern-popup .popup-content {
    width: 280px;
  }
  
  .city-label {
    font-size: 12px;
    padding: 0.125rem 0.5rem;
  }
  
  .popup-info {
    padding: 1rem;
  }
}
</style>