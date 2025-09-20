<template>
  <div class="map-container" ref="mapContainer">
    <div class="map-header">
      <h2 class="map-title">{{ $t('map.title') }}</h2>
      <p class="map-subtitle">{{ $t('map.subtitle') }}</p>
    </div>
    
    <div class="map-wrapper" ref="mapWrapper">
      <!-- Three.js Canvas -->
      <canvas ref="threeCanvas" class="three-canvas"></canvas>
      
      <!-- SVG Overlay for precise interactions -->
      <svg 
        ref="mapSvg"
        class="vietnam-map-overlay" 
        viewBox="0 0 400 600" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Accurate Vietnam outline with Phu Quoc -->
        <defs>
          <linearGradient id="vietnamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.9" />
            <stop offset="30%" style="stop-color:#10b981;stop-opacity:0.7" />
            <stop offset="70%" style="stop-color:#f59e0b;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.9" />
          </linearGradient>
          
          <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Vietnam mainland - accurate outline -->
        <path 
          class="country-outline mainland"
          d="M200 40 L210 42 L225 48 L240 58 L250 70 L258 85 L265 100 L270 118 L275 135 L280 152 L285 170 L290 188 L295 205 L300 222 L305 240 L310 258 L315 275 L320 292 L325 310 L330 328 L335 345 L340 362 L345 380 L350 398 L355 415 L360 432 L365 450 L370 467 L375 485 L380 502 L375 520 L370 537 L365 555 L360 572 L350 585 L335 595 L320 600 L300 598 L280 595 L260 590 L240 583 L220 575 L200 565 L180 553 L160 540 L145 525 L130 508 L118 490 L108 470 L100 450 L95 428 L92 405 L90 382 L88 358 L87 335 L86 312 L85 288 L84 265 L83 242 L82 218 L81 195 L80 172 L79 148 L78 125 L77 102 L76 78 L75 55 L80 45 L90 38 L105 35 L125 36 L145 38 L165 40 L185 41 Z"
          fill="url(#vietnamGradient)"
          stroke="#1e40af"
          stroke-width="2"
          filter="url(#mapGlow)"
        />
        
        <!-- Phu Quoc Island -->
        <path 
          class="country-outline island"
          d="M45 520 L55 518 L65 520 L70 525 L72 532 L70 540 L65 545 L55 547 L45 545 L40 540 L38 532 L40 525 Z"
          fill="url(#vietnamGradient)"
          stroke="#1e40af"
          stroke-width="1.5"
          filter="url(#mapGlow)"
        />
        
        <!-- City markers with enhanced styling -->
        <g class="city-markers">
          <!-- Hanoi -->
          <g class="city-marker-group" data-city="hanoi">
            <circle 
              cx="200" 
              cy="120" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="200" 
              cy="120" 
              r="8" 
              class="city-marker" 
              data-city="hanoi"
              @click="showCityPopup('hanoi', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="200" y="105" text-anchor="middle" class="city-label">{{ $t('cities.hanoi.name') }}</text>
          </g>
          
          <!-- Ho Chi Minh City -->
          <g class="city-marker-group" data-city="hochiminh">
            <circle 
              cx="200" 
              cy="480" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="200" 
              cy="480" 
              r="8" 
              class="city-marker" 
              data-city="hochiminh"
              @click="showCityPopup('hochiminh', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="200" y="465" text-anchor="middle" class="city-label">{{ $t('cities.hochiminh.name') }}</text>
          </g>
          
          <!-- Da Nang -->
          <g class="city-marker-group" data-city="danang">
            <circle 
              cx="280" 
              cy="280" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="280" 
              cy="280" 
              r="8" 
              class="city-marker" 
              data-city="danang"
              @click="showCityPopup('danang', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="280" y="265" text-anchor="middle" class="city-label">{{ $t('cities.danang.name') }}</text>
          </g>
          
          <!-- Hue -->
          <g class="city-marker-group" data-city="hue">
            <circle 
              cx="260" 
              cy="240" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="260" 
              cy="240" 
              r="8" 
              class="city-marker" 
              data-city="hue"
              @click="showCityPopup('hue', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="260" y="225" text-anchor="middle" class="city-label">{{ $t('cities.hue.name') }}</text>
          </g>
          
          <!-- Hoi An -->
          <g class="city-marker-group" data-city="hoian">
            <circle 
              cx="290" 
              cy="300" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="290" 
              cy="300" 
              r="8" 
              class="city-marker" 
              data-city="hoian"
              @click="showCityPopup('hoian', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="290" y="285" text-anchor="middle" class="city-label">{{ $t('cities.hoian.name') }}</text>
          </g>
          
          <!-- Nha Trang -->
          <g class="city-marker-group" data-city="nhatrang">
            <circle 
              cx="270" 
              cy="380" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="270" 
              cy="380" 
              r="8" 
              class="city-marker" 
              data-city="nhatrang"
              @click="showCityPopup('nhatrang', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="270" y="365" text-anchor="middle" class="city-label">{{ $t('cities.nhatrang.name') }}</text>
          </g>
          
          <!-- Phu Quoc -->
          <g class="city-marker-group" data-city="phuquoc">
            <circle 
              cx="55" 
              cy="532" 
              r="12" 
              class="city-marker-bg" 
              fill="rgba(239, 68, 68, 0.3)"
              filter="url(#markerGlow)"
            />
            <circle 
              cx="55" 
              cy="532" 
              r="8" 
              class="city-marker" 
              data-city="phuquoc"
              @click="showCityPopup('phuquoc', $event)"
              fill="#ef4444"
              stroke="white"
              stroke-width="3"
              filter="url(#markerGlow)"
            />
            <text x="55" y="517" text-anchor="middle" class="city-label">{{ $t('cities.phuquoc.name') }}</text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Enhanced City Popup -->
    <div 
      v-if="selectedCity" 
      class="city-popup"
      :style="popupStyle"
      ref="popup"
    >
      <div class="popup-content">
        <button class="popup-close" @click="closePopup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="popup-image">
          <img :src="getCityImage(selectedCity)" :alt="$t(`cities.${selectedCity}.name`)" />
          <div class="popup-image-overlay"></div>
        </div>
        
        <div class="popup-info">
          <h3 class="popup-title">{{ $t(`cities.${selectedCity}.name`) }}</h3>
          <p class="popup-description">{{ $t(`cities.${selectedCity}.description`) }}</p>
          
          <div class="popup-actions">
            <button 
              class="popup-button primary"
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import * as THREE from 'three'

export default {
  name: 'VietnamMap',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const mapContainer = ref(null)
    const mapWrapper = ref(null)
    const threeCanvas = ref(null)
    const mapSvg = ref(null)
    const popup = ref(null)
    const selectedCity = ref(null)
    const popupStyle = ref({})

    // Three.js variables
    let scene, camera, renderer, mapMesh, animationId
    let mouseX = 0, mouseY = 0
    let targetRotationX = 0, targetRotationY = 0

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

    const initThreeJS = () => {
      if (!threeCanvas.value) return

      // Scene setup
      scene = new THREE.Scene()
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(75, threeCanvas.value.clientWidth / threeCanvas.value.clientHeight, 0.1, 1000)
      camera.position.z = 5

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        canvas: threeCanvas.value, 
        alpha: true, 
        antialias: true 
      })
      renderer.setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      // Create floating background plane
      const planeGeometry = new THREE.PlaneGeometry(8, 10, 32, 32)
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e40af,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      })
      
      mapMesh = new THREE.Mesh(planeGeometry, planeMaterial)
      mapMesh.position.z = -0.5
      scene.add(mapMesh)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      scene.add(directionalLight)

      // Start animation loop
      animate()
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Smooth mouse following
      targetRotationX += (mouseY - targetRotationX) * 0.02
      targetRotationY += (mouseX - targetRotationY) * 0.02

      if (mapMesh) {
        mapMesh.rotation.x = targetRotationX * 0.1
        mapMesh.rotation.y = targetRotationY * 0.1
        
        // Floating animation
        mapMesh.position.y = Math.sin(Date.now() * 0.001) * 0.1
      }

      renderer.render(scene, camera)
    }

    const handleMouseMove = (event) => {
      if (!mapWrapper.value) return
      
      const rect = mapWrapper.value.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleResize = () => {
      if (!threeCanvas.value || !camera || !renderer) return
      
      const width = threeCanvas.value.clientWidth
      const height = threeCanvas.value.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
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

      // Enhanced popup animation
      gsap.fromTo(popup.value, 
        { 
          scale: 0, 
          opacity: 0, 
          y: 30,
          rotationX: -90
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 0.6, 
          ease: 'back.out(1.7)',
          transformOrigin: 'center bottom'
        }
      )

      // Enhanced marker animation
      gsap.to(event.target, {
        scale: 1.5,
        duration: 0.4,
        ease: 'elastic.out(1, 0.3)'
      })

      // Animate marker background
      const markerGroup = event.target.closest('.city-marker-group')
      if (markerGroup) {
        const bg = markerGroup.querySelector('.city-marker-bg')
        gsap.to(bg, {
          r: 20,
          opacity: 0.6,
          duration: 0.4,
          ease: 'power2.out'
        })
      }
    }

    const closePopup = () => {
      if (popup.value) {
        gsap.to(popup.value, {
          scale: 0,
          opacity: 0,
          y: -20,
          rotationX: -90,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            selectedCity.value = null
          }
        })
      }

      // Reset all city markers
      gsap.to('.city-marker', {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.3)'
      })

      // Reset marker backgrounds
      gsap.to('.city-marker-bg', {
        r: 12,
        opacity: 0.3,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const goToCityDetail = (city) => {
      router.push(`/city/${city}`)
    }

    onMounted(() => {
      // Initialize Three.js
      initThreeJS()

      // Event listeners
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('resize', handleResize)

      // Enhanced map entrance animation
      gsap.timeline()
        .fromTo('.map-title', 
          { opacity: 0, y: -50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
        )
        .fromTo('.map-subtitle', 
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
        )
        .fromTo('.map-wrapper', 
          { 
            opacity: 0, 
            scale: 0.8, 
            y: 100,
            rotationX: 45
          },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotationX: 0,
            duration: 1.2, 
            ease: 'power3.out',
            transformOrigin: 'center center'
          }, '-=0.3'
        )

      // Animate SVG map drawing
      gsap.fromTo('.country-outline', 
        { 
          strokeDasharray: 3000,
          strokeDashoffset: 3000,
          fillOpacity: 0
        },
        { 
          strokeDashoffset: 0,
          fillOpacity: 1,
          duration: 2.5,
          ease: 'power2.out',
          delay: 0.5
        }
      )

      // Enhanced city markers animation
      gsap.fromTo('.city-marker-group', 
        { 
          scale: 0, 
          opacity: 0,
          y: -20
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 0.8, 
          stagger: 0.15,
          delay: 2,
          ease: 'elastic.out(1, 0.5)'
        }
      )

      // Floating animation for the entire map
      gsap.to('.map-wrapper', {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })

    onUnmounted(() => {
      // Cleanup
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      
      if (renderer) {
        renderer.dispose()
      }
    })

    return {
      mapContainer,
      mapWrapper,
      threeCanvas,
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
  padding: 6rem 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  overflow: hidden;
}

.map-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.map-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
}

.map-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.map-subtitle {
  font-size: 1.3rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

.map-wrapper {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  height: 600px;
  perspective: 1000px;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3));
}

.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.vietnam-map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.country-outline {
  transition: all 0.4s ease;
  transform-origin: center;
}

.country-outline:hover {
  filter: url(#mapGlow) brightness(1.1);
}

.city-marker-group {
  pointer-events: all;
  cursor: pointer;
}

.city-marker-bg {
  transition: all 0.3s ease;
}

.city-marker {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4));
}

.city-marker:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 6px 12px rgba(239, 68, 68, 0.6));
}

.city-label {
  font-size: 13px;
  font-weight: 700;
  fill: #f1f5f9;
  pointer-events: none;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.city-popup {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}

.popup-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  width: 320px;
  pointer-events: all;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.popup-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1) rotate(90deg);
}

.popup-image {
  height: 180px;
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

.popup-image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
}

.popup-info {
  padding: 2rem;
}

.popup-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1f2937;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.popup-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.popup-actions {
  display: flex;
  gap: 0.75rem;
}

.popup-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  flex: 1;
  justify-content: center;
}

.popup-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.popup-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 500;
}

@media (max-width: 768px) {
  .map-container {
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
    height: 500px;
    margin: 0 1rem;
  }
  
  .popup-content {
    width: 300px;
  }
  
  .city-label {
    font-size: 11px;
  }
  
  .popup-info {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .popup-content {
    width: 280px;
  }
  
  .popup-title {
    font-size: 1.25rem;
  }
  
  .popup-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }
}
</style>