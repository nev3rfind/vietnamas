<template>
  <div class="vietnam-map-container" ref="mapContainer">
    <!-- Glass Background -->
    <div class="glass-background" ref="glassBackground">
      <div class="floating-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- Map Header -->
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
          <div class="svg-map-holder" v-html="vietnamSvgContent"></div>
          
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

    <!-- Enhanced Glass Popup -->
    <div 
      v-if="selectedCity" 
      class="city-popup glass-popup"
      :style="popupStyle"
      ref="popup"
    >
      <div class="popup-content">
        <!-- Close Button -->
        <button class="popup-close glass-button" @click="closePopup">
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
            class="popup-button glass-button primary"
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
      class="popup-overlay glass-overlay"
      @click="closePopup"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'VietnamMap',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Refs
    const mapContainer = ref(null)
    const glassBackground = ref(null)
    const mapHeader = ref(null)
    const mapWrapper = ref(null)
    const svgContainer = ref(null)
    const popup = ref(null)
    
    // State
    const selectedCity = ref(null)
    const popupStyle = ref({})
    const vietnamSvgContent = ref('')

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

    // Load Vietnam SVG
    const loadVietnamSvg = async () => {
      try {
        const response = await fetch('/vietnam_map.svg')
        let svgContent = await response.text()
        
        // Apply modern styling to the SVG
        svgContent = svgContent.replace(
          '<svg',
          `<svg class="vietnam-svg-map" style="
            filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4));
            transition: all 0.4s ease;
          "`
        )
        
        // Add modern gradients and styling to paths
        svgContent = svgContent.replace(
          /<path/g,
          `<path style="
            fill: url(#vietnamModernGradient);
            stroke: url(#vietnamBorderGradient);
            stroke-width: 2;
            filter: url(#mapGlow);
            transition: all 0.4s ease;
          "`
        )
        
        // Add gradients and filters
        const defsContent = `
          <defs>
            <linearGradient id="vietnamModernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e40af;stop-opacity:0.8" />
              <stop offset="25%" style="stop-color:#3b82f6;stop-opacity:0.7" />
              <stop offset="50%" style="stop-color:#06b6d4;stop-opacity:0.8" />
              <stop offset="75%" style="stop-color:#10b981;stop-opacity:0.7" />
              <stop offset="100%" style="stop-color:#059669;stop-opacity:0.8" />
            </linearGradient>
            
            <linearGradient id="vietnamBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#0891b2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>

            <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feOffset in="coloredBlur" dx="0" dy="2" result="offsetBlur"/>
              <feMerge> 
                <feMergeNode in="offsetBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        `
        
        svgContent = svgContent.replace('<svg', `<svg>${defsContent}`)
        vietnamSvgContent.value = svgContent
      } catch (error) {
        console.error('Error loading Vietnam SVG:', error)
        // Fallback message
        vietnamSvgContent.value = '<div class="svg-error">Vietnam map loading...</div>'
      }
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

      // Enhanced popup animation
      gsap.fromTo(popup.value, 
        { 
          scale: 0, 
          opacity: 0, 
          y: 30,
          rotationX: -90,
          filter: 'blur(10px)'
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: 0.8, 
          ease: 'elastic.out(1, 0.5)',
          transformOrigin: 'center bottom'
        }
      )

      // Enhanced marker animation
      const marker = event.currentTarget.querySelector('.city-marker')
      gsap.to(marker, {
        scale: 1.3,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })

      // Animate marker pulse
      const pulse = event.currentTarget.querySelector('.marker-pulse')
      gsap.to(pulse, {
        scale: 1.5,
        opacity: 0.3,
        duration: 0.6,
        ease: 'power2.out'
      })
    }

    const closePopup = () => {
      if (popup.value) {
        gsap.to(popup.value, {
          scale: 0,
          opacity: 0,
          y: -20,
          rotationX: -90,
          filter: 'blur(10px)',
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            selectedCity.value = null
          }
        })
      }

      // Reset all markers
      gsap.to('.city-marker', {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })

      gsap.to('.marker-pulse', {
        scale: 1,
        opacity: 0.6,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const goToCityDetail = (city) => {
      router.push(`/city/${city}`)
    }

    onMounted(async () => {
      // Load Vietnam SVG first
      await loadVietnamSvg()

      // Enhanced entrance animations (no floating effects)
      const tl = gsap.timeline()
      
      // Header animation
      tl.fromTo(mapHeader.value, 
        { opacity: 0, y: -50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      )
      
      // Glass background animation
      .fromTo(glassBackground.value, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.5'
      )
      
      // Map container animation (static, no floating)
      .fromTo(mapWrapper.value, 
        { 
          opacity: 0, 
          scale: 0.9, 
          y: 50,
          filter: 'blur(20px)'
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          filter: 'blur(0px)',
          duration: 1.5, 
          ease: 'power3.out'
        }, '-=0.8'
      )

      // City markers entrance
      gsap.fromTo('.city-marker-group', 
        { 
          scale: 0, 
          opacity: 0,
          y: -30
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 1, 
          stagger: 0.2,
          delay: 2,
          ease: 'elastic.out(1, 0.5)'
        }
      )

      // Continuous pulse animation for markers
      gsap.to('.marker-pulse', {
        scale: 1.2,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      })

      // Static orbs animation (no floating)
      gsap.to('.orb-1', {
        opacity: 0.4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      gsap.to('.orb-2', {
        opacity: 0.3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      gsap.to('.orb-3', {
        opacity: 0.2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })

    return {
      mapContainer,
      glassBackground,
      mapHeader,
      mapWrapper,
      svgContainer,
      popup,
      selectedCity,
      popupStyle,
      vietnamSvgContent,
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
.vietnam-map-container {
  position: relative;
  min-height: 100vh;
  padding: 6rem 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
  overflow: hidden;
}

.glass-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.08) 0%, transparent 50%);
  backdrop-filter: blur(1px);
  pointer-events: none;
}

.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #3b82f6, transparent);
  top: 20%;
  left: 10%;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #10b981, transparent);
  top: 60%;
  right: 15%;
}

.orb-3 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #f59e0b, transparent);
  bottom: 20%;
  left: 70%;
}

.map-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
}

.map-title {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 25%, #10b981 50%, #f59e0b 75%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  letter-spacing: -0.02em;
}

.map-subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.map-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  height: 700px;
  z-index: 5;
}

.svg-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4));
}

.vietnam-svg-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.svg-map-holder {
  width: 100%;
  height: 100%;
}

.vietnam-svg-map {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(59, 130, 246, 0.2));
}

.svg-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 70%);
  opacity: 0.6;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1); 
    opacity: 0.6; 
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2); 
    opacity: 0.3; 
  }
}

.city-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #3b82f6 30%, #1e40af 100%);
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
}

.city-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  filter: drop-shadow(0 8px 20px rgba(59, 130, 246, 0.6));
}

.marker-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  pointer-events: none;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.city-label {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}

/* Glass Popup Styles */
.city-popup {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}

.glass-popup .popup-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  width: 350px;
  pointer-events: all;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.popup-close:hover {
  transform: scale(1.1) rotate(90deg);
  background: rgba(239, 68, 68, 0.2);
}

.popup-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.popup-content:hover .popup-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.4));
}

.popup-info {
  padding: 2rem;
  color: white;
}

.popup-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.popup-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
}

.popup-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 1rem 2rem;
  font-weight: 600;
  width: 100%;
  justify-content: center;
}

.popup-button.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
}

.glass-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .vietnam-map-container {
    padding: 4rem 0;
  }
  
  .map-title {
    font-size: 2.5rem;
  }
  
  .map-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  
  .map-wrapper {
    height: 600px;
    margin: 0 1rem;
  }
  
  .glass-popup .popup-content {
    width: 320px;
  }
  
  .city-label {
    font-size: 12px;
  }
  
  .popup-info {
    padding: 1.5rem;
  }
  
  .popup-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .glass-popup .popup-content {
    width: 300px;
  }
  
  .popup-title {
    font-size: 1.25rem;
  }
  
  .popup-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>