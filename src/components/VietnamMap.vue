<template>
  <div class="map-container">
    <div class="map-header">
      <h2 class="map-title">{{ $t('map.title') }}</h2>
      <p class="map-subtitle">{{ $t('map.subtitle') }}</p>
    </div>
    
    <div class="map-wrapper">
      <svg 
        ref="mapSvg"
        class="vietnam-map" 
        viewBox="0 0 400 600" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Vietnam country outline -->
        <path 
          class="country-outline"
          d="M200 50 L220 60 L240 80 L250 100 L260 120 L270 140 L280 160 L290 180 L300 200 L310 220 L320 240 L330 260 L340 280 L350 300 L360 320 L350 340 L340 360 L330 380 L320 400 L310 420 L300 440 L290 460 L280 480 L270 500 L260 520 L250 540 L240 560 L220 570 L200 580 L180 570 L160 560 L140 540 L130 520 L120 500 L110 480 L100 460 L90 440 L80 420 L70 400 L60 380 L50 360 L40 340 L50 320 L60 300 L70 280 L80 260 L90 240 L100 220 L110 200 L120 180 L130 160 L140 140 L150 120 L160 100 L170 80 L180 60 Z"
          fill="url(#vietnamGradient)"
          stroke="#2563eb"
          stroke-width="2"
        />
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="vietnamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:#10b981;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.8" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- City markers -->
        <g class="city-markers">
          <!-- Hanoi -->
          <circle 
            cx="200" 
            cy="120" 
            r="8" 
            class="city-marker" 
            data-city="hanoi"
            @click="showCityPopup('hanoi', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="200" y="110" text-anchor="middle" class="city-label">{{ $t('cities.hanoi.name') }}</text>
          
          <!-- Ho Chi Minh City -->
          <circle 
            cx="200" 
            cy="480" 
            r="8" 
            class="city-marker" 
            data-city="hochiminh"
            @click="showCityPopup('hochiminh', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="200" y="470" text-anchor="middle" class="city-label">{{ $t('cities.hochiminh.name') }}</text>
          
          <!-- Da Nang -->
          <circle 
            cx="280" 
            cy="280" 
            r="8" 
            class="city-marker" 
            data-city="danang"
            @click="showCityPopup('danang', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="280" y="270" text-anchor="middle" class="city-label">{{ $t('cities.danang.name') }}</text>
          
          <!-- Hue -->
          <circle 
            cx="260" 
            cy="240" 
            r="8" 
            class="city-marker" 
            data-city="hue"
            @click="showCityPopup('hue', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="260" y="230" text-anchor="middle" class="city-label">{{ $t('cities.hue.name') }}</text>
          
          <!-- Hoi An -->
          <circle 
            cx="290" 
            cy="300" 
            r="8" 
            class="city-marker" 
            data-city="hoian"
            @click="showCityPopup('hoian', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="290" y="290" text-anchor="middle" class="city-label">{{ $t('cities.hoian.name') }}</text>
          
          <!-- Nha Trang -->
          <circle 
            cx="270" 
            cy="380" 
            r="8" 
            class="city-marker" 
            data-city="nhatrang"
            @click="showCityPopup('nhatrang', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="270" y="370" text-anchor="middle" class="city-label">{{ $t('cities.nhatrang.name') }}</text>
          
          <!-- Phu Quoc -->
          <circle 
            cx="120" 
            cy="520" 
            r="8" 
            class="city-marker" 
            data-city="phuquoc"
            @click="showCityPopup('phuquoc', $event)"
            fill="#ef4444"
            stroke="white"
            stroke-width="2"
          />
          <text x="120" y="510" text-anchor="middle" class="city-label">{{ $t('cities.phuquoc.name') }}</text>
        </g>
      </svg>
    </div>

    <!-- City Popup -->
    <div 
      v-if="selectedCity" 
      class="city-popup"
      :style="popupStyle"
      ref="popup"
    >
      <div class="popup-content">
        <button class="popup-close" @click="closePopup">×</button>
        <div class="popup-image">
          <img :src="getCityImage(selectedCity)" :alt="$t(`cities.${selectedCity}.name`)" />
        </div>
        <div class="popup-info">
          <h3 class="popup-title">{{ $t(`cities.${selectedCity}.name`) }}</h3>
          <p class="popup-description">{{ $t(`cities.${selectedCity}.description`) }}</p>
          <button 
            class="popup-button"
            @click="goToCityDetail(selectedCity)"
          >
            {{ $t('attractions.findMore') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div 
      v-if="selectedCity" 
      class="popup-overlay"
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
    const mapSvg = ref(null)
    const popup = ref(null)
    const selectedCity = ref(null)
    const popupStyle = ref({})

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
      return cityImages[city] || 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=400'
    }

    const showCityPopup = async (city, event) => {
      const rect = event.target.getBoundingClientRect()
      const mapRect = mapSvg.value.getBoundingClientRect()
      
      selectedCity.value = city
      
      await nextTick()
      
      // Position popup
      popupStyle.value = {
        left: `${rect.left - mapRect.left + rect.width / 2}px`,
        top: `${rect.top - mapRect.top - 10}px`,
        transform: 'translate(-50%, -100%)'
      }

      // Animate popup appearance
      gsap.fromTo(popup.value, 
        { scale: 0, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )

      // Animate city marker
      gsap.to(event.target, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const closePopup = () => {
      if (popup.value) {
        gsap.to(popup.value, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            selectedCity.value = null
          }
        })
      }

      // Reset all city markers
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
      // Animate map appearance
      gsap.fromTo('.country-outline', 
        { 
          strokeDasharray: 2000,
          strokeDashoffset: 2000,
          fillOpacity: 0
        },
        { 
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: 2,
          ease: 'power2.out'
        }
      )

      // Animate city markers
      gsap.fromTo('.city-marker', 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 1,
          ease: 'back.out(1.7)'
        }
      )

      // Animate city labels
      gsap.fromTo('.city-label', 
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 1.3,
          ease: 'power2.out'
        }
      )
    })

    return {
      mapSvg,
      popup,
      selectedCity,
      popupStyle,
      showCityPopup,
      closePopup,
      goToCityDetail,
      getCityImage,
      t
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.map-header {
  text-align: center;
  margin-bottom: 3rem;
}

.map-title {
  font-size: 3rem;
  font-weight: 700;
  background: var(--gradient-vietnam);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.map-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.map-wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.vietnam-map {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

.country-outline {
  transition: all 0.3s ease;
}

.country-outline:hover {
  filter: url(#glow);
}

.city-marker {
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.city-marker:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.city-label {
  font-size: 12px;
  font-weight: 600;
  fill: var(--text-primary);
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.city-popup {
  position: absolute;
  z-index: 100;
  pointer-events: none;
}

.popup-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 300px;
  pointer-events: all;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.popup-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.popup-image {
  height: 150px;
  overflow: hidden;
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-info {
  padding: 1.5rem;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.popup-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.popup-button {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.popup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
}

@media (max-width: 768px) {
  .map-title {
    font-size: 2rem;
  }
  
  .map-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .popup-content {
    width: 280px;
  }
  
  .city-label {
    font-size: 10px;
  }
}
</style>