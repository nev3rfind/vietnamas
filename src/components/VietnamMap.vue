<template>
  <div class="vietnam-map-container" ref="mapContainer">
    <!-- Glass Background with Floating Effect -->
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

    <!-- Three.js Canvas for 3D Effects -->
    <canvas ref="threeCanvas" class="three-canvas"></canvas>

    <!-- Main Map Container -->
    <div class="map-wrapper" ref="mapWrapper">
      <!-- Vietnam SVG Map -->
      <div class="svg-map-container" ref="svgContainer">
        <svg 
          ref="vietnamSvg"
          class="vietnam-svg-map" 
          viewBox="0 0 400 600" 
          xmlns="http://www.w3.org/2000/svg"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <defs>
            <!-- Enhanced Gradients -->
            <linearGradient id="vietnamGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.7" />
              <stop offset="25%" style="stop-color:#06b6d4;stop-opacity:0.6" />
              <stop offset="50%" style="stop-color:#10b981;stop-opacity:0.7" />
              <stop offset="75%" style="stop-color:#f59e0b;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.7" />
            </linearGradient>
            
            <linearGradient id="vietnamBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#0891b2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>

            <!-- Glass Effect Filters -->
            <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feOffset in="blur" dx="2" dy="2" result="offset"/>
              <feMerge>
                <feMergeNode in="offset"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feOffset in="coloredBlur" dx="0" dy="4" result="offsetBlur"/>
              <feMerge> 
                <feMergeNode in="offsetBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <!-- Marker Gradients -->
            <radialGradient id="markerGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
              <stop offset="30%" style="stop-color:#3b82f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
            </radialGradient>

            <radialGradient id="markerPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
            </radialGradient>
          </defs>
          
          <!-- Vietnam Mainland with Glass Effect -->
          <path 
            class="vietnam-mainland glass-map"
            d="M200 40 L210 42 L225 48 L240 58 L250 70 L258 85 L265 100 L270 118 L275 135 L280 152 L285 170 L290 188 L295 205 L300 222 L305 240 L310 258 L315 275 L320 292 L325 310 L330 328 L335 345 L340 362 L345 380 L350 398 L355 415 L360 432 L365 450 L370 467 L375 485 L380 502 L375 520 L370 537 L365 555 L360 572 L350 585 L335 595 L320 600 L300 598 L280 595 L260 590 L240 583 L220 575 L200 565 L180 553 L160 540 L145 525 L130 508 L118 490 L108 470 L100 450 L95 428 L92 405 L90 382 L88 358 L87 335 L86 312 L85 288 L84 265 L83 242 L82 218 L81 195 L80 172 L79 148 L78 125 L77 102 L76 78 L75 55 L80 45 L90 38 L105 35 L125 36 L145 38 L165 40 L185 41 Z"
            fill="url(#vietnamGlassGradient)"
            stroke="url(#vietnamBorderGradient)"
            stroke-width="3"
            filter="url(#mapGlow)"
          />
          
          <!-- Phu Quoc Island with Glass Effect -->
          <path 
            class="phu-quoc-island glass-map"
            d="M45 520 L55 518 L65 520 L70 525 L72 532 L70 540 L65 545 L55 547 L45 545 L40 540 L38 532 L40 525 Z"
            fill="url(#vietnamGlassGradient)"
            stroke="url(#vietnamBorderGradient)"
            stroke-width="2"
            filter="url(#mapGlow)"
          />
          
          <!-- City Markers -->
          <g class="city-markers">
            <!-- Hanoi -->
            <g class="city-marker-group" data-city="hanoi">
              <circle 
                cx="200" cy="120" r="20" 
                class="marker-pulse" 
                fill="url(#markerPulse)"
              />
              <circle 
                cx="200" cy="120" r="12" 
                class="city-marker" 
                data-city="hanoi"
                @click="showCityPopup('hanoi', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle 
                cx="200" cy="120" r="4" 
                class="marker-center" 
                fill="#ffffff"
              />
              <text x="200" y="100" text-anchor="middle" class="city-label">
                {{ $t('cities.hanoi.name') }}
              </text>
            </g>
            
            <!-- Ho Chi Minh City -->
            <g class="city-marker-group" data-city="hochiminh">
              <circle cx="200" cy="480" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="200" cy="480" r="12" 
                class="city-marker" 
                data-city="hochiminh"
                @click="showCityPopup('hochiminh', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="200" cy="480" r="4" class="marker-center" fill="#ffffff"/>
              <text x="200" y="460" text-anchor="middle" class="city-label">
                {{ $t('cities.hochiminh.name') }}
              </text>
            </g>
            
            <!-- Da Nang -->
            <g class="city-marker-group" data-city="danang">
              <circle cx="280" cy="280" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="280" cy="280" r="12" 
                class="city-marker" 
                data-city="danang"
                @click="showCityPopup('danang', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="280" cy="280" r="4" class="marker-center" fill="#ffffff"/>
              <text x="280" y="260" text-anchor="middle" class="city-label">
                {{ $t('cities.danang.name') }}
              </text>
            </g>
            
            <!-- Hue -->
            <g class="city-marker-group" data-city="hue">
              <circle cx="260" cy="240" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="260" cy="240" r="12" 
                class="city-marker" 
                data-city="hue"
                @click="showCityPopup('hue', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="260" cy="240" r="4" class="marker-center" fill="#ffffff"/>
              <text x="260" y="220" text-anchor="middle" class="city-label">
                {{ $t('cities.hue.name') }}
              </text>
            </g>
            
            <!-- Hoi An -->
            <g class="city-marker-group" data-city="hoian">
              <circle cx="290" cy="300" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="290" cy="300" r="12" 
                class="city-marker" 
                data-city="hoian"
                @click="showCityPopup('hoian', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="290" cy="300" r="4" class="marker-center" fill="#ffffff"/>
              <text x="290" y="280" text-anchor="middle" class="city-label">
                {{ $t('cities.hoian.name') }}
              </text>
            </g>
            
            <!-- Nha Trang -->
            <g class="city-marker-group" data-city="nhatrang">
              <circle cx="270" cy="380" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="270" cy="380" r="12" 
                class="city-marker" 
                data-city="nhatrang"
                @click="showCityPopup('nhatrang', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="270" cy="380" r="4" class="marker-center" fill="#ffffff"/>
              <text x="270" y="360" text-anchor="middle" class="city-label">
                {{ $t('cities.nhatrang.name') }}
              </text>
            </g>
            
            <!-- Phu Quoc -->
            <g class="city-marker-group" data-city="phuquoc">
              <circle cx="55" cy="532" r="20" class="marker-pulse" fill="url(#markerPulse)"/>
              <circle 
                cx="55" cy="532" r="12" 
                class="city-marker" 
                data-city="phuquoc"
                @click="showCityPopup('phuquoc', $event)"
                fill="url(#markerGradient)"
                stroke="#ffffff"
                stroke-width="3"
                filter="url(#markerGlow)"
              />
              <circle cx="55" cy="532" r="4" class="marker-center" fill="#ffffff"/>
              <text x="55" y="512" text-anchor="middle" class="city-label">
                {{ $t('cities.phuquoc.name') }}
              </text>
            </g>
          </g>
        </svg>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

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
    const threeCanvas = ref(null)
    const mapWrapper = ref(null)
    const svgContainer = ref(null)
    const vietnamSvg = ref(null)
    const popup = ref(null)
    
    // State
    const selectedCity = ref(null)
    const popupStyle = ref({})
    
    // Three.js variables
    let scene, camera, renderer, mapMesh, animationId
    let mouseX = 0, mouseY = 0
    let targetRotationX = 0, targetRotationY = 0

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

    // Three.js initialization
    const initThreeJS = () => {
      if (!threeCanvas.value) return

      scene = new THREE.Scene()
      
      camera = new THREE.PerspectiveCamera(75, threeCanvas.value.clientWidth / threeCanvas.value.clientHeight, 0.1, 1000)
      camera.position.z = 5

      renderer = new THREE.WebGLRenderer({ 
        canvas: threeCanvas.value, 
        alpha: true, 
        antialias: true 
      })
      renderer.setSize(threeCanvas.value.clientWidth, threeCanvas.value.clientHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      // Create floating background geometry
      const geometry = new THREE.PlaneGeometry(8, 10, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      })
      
      mapMesh = new THREE.Mesh(geometry, material)
      mapMesh.position.z = -1
      scene.add(mapMesh)

      // Enhanced lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0x3b82f6, 0.6)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      const pointLight = new THREE.PointLight(0x10b981, 0.4, 100)
      pointLight.position.set(-10, -10, 5)
      scene.add(pointLight)

      animate()
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Smooth parallax effect
      targetRotationX += (mouseY - targetRotationX) * 0.02
      targetRotationY += (mouseX - targetRotationY) * 0.02

      if (mapMesh) {
        mapMesh.rotation.x = targetRotationX * 0.1
        mapMesh.rotation.y = targetRotationY * 0.1
        
        // Floating animation
        mapMesh.position.y = Math.sin(Date.now() * 0.001) * 0.2
        mapMesh.position.x = Math.cos(Date.now() * 0.0008) * 0.1
      }

      renderer.render(scene, camera)
    }

    // Mouse interaction
    const handleMouseMove = (event) => {
      if (!mapWrapper.value) return
      
      const rect = mapWrapper.value.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Apply subtle transform to SVG
      const transform = `perspective(1000px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * 5}deg)`
      if (svgContainer.value) {
        svgContainer.value.style.transform = transform
      }
    }

    const handleMouseLeave = () => {
      mouseX = 0
      mouseY = 0
      
      if (svgContainer.value) {
        svgContainer.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
      }
    }

    // Popup functionality
    const showCityPopup = async (city, event) => {
      const rect = event.target.getBoundingClientRect()
      const mapRect = vietnamSvg.value.getBoundingClientRect()
      
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
      gsap.to(event.target, {
        scale: 1.3,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })

      // Animate marker pulse
      const markerGroup = event.target.closest('.city-marker-group')
      if (markerGroup) {
        const pulse = markerGroup.querySelector('.marker-pulse')
        gsap.to(pulse, {
          r: 30,
          opacity: 0.3,
          duration: 0.6,
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
        r: 20,
        opacity: 0.8,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const goToCityDetail = (city) => {
      router.push(`/city/${city}`)
    }

    // Resize handler
    const handleResize = () => {
      if (!threeCanvas.value || !camera || !renderer) return
      
      const width = threeCanvas.value.clientWidth
      const height = threeCanvas.value.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    onMounted(() => {
      // Initialize Three.js
      initThreeJS()

      // Event listeners
      window.addEventListener('resize', handleResize)

      // Enhanced entrance animations
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
      
      // Map container animation
      .fromTo(mapWrapper.value, 
        { 
          opacity: 0, 
          scale: 0.7, 
          y: 100,
          rotationX: 45,
          filter: 'blur(20px)'
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: 1.5, 
          ease: 'power3.out'
        }, '-=0.8'
      )

      // SVG path drawing animation
      gsap.fromTo('.glass-map', 
        { 
          strokeDasharray: 4000,
          strokeDashoffset: 4000,
          fillOpacity: 0
        },
        { 
          strokeDashoffset: 0,
          fillOpacity: 0.7,
          duration: 3,
          ease: 'power2.out',
          delay: 0.5
        }
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
          delay: 2.5,
          ease: 'elastic.out(1, 0.5)'
        }
      )

      // Continuous pulse animation for markers
      gsap.to('.marker-pulse', {
        r: 25,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      })

      // Floating orbs animation
      gsap.to('.orb-1', {
        x: 100,
        y: -50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      gsap.to('.orb-2', {
        x: -80,
        y: 60,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      gsap.to('.orb-3', {
        x: 60,
        y: 80,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })

      // Subtle floating animation for entire map
      gsap.to(mapWrapper.value, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })

    onUnmounted(() => {
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
      glassBackground,
      mapHeader,
      threeCanvas,
      mapWrapper,
      svgContainer,
      vietnamSvg,
      popup,
      selectedCity,
      popupStyle,
      handleMouseMove,
      handleMouseLeave,
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
  left: 60%;
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

.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.map-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  height: 700px;
  perspective: 1000px;
  z-index: 5;
}

.svg-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4));
}

.vietnam-svg-map {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(59, 130, 246, 0.2));
}

.glass-map {
  transition: all 0.4s ease;
  backdrop-filter: blur(2px);
}

.glass-map:hover {
  filter: url(#mapGlow) brightness(1.1);
  stroke-width: 4;
}

.city-marker-group {
  cursor: pointer;
  transition: all 0.3s ease;
}

.marker-pulse {
  opacity: 0.6;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.6; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 0.3; 
  }
}

.city-marker {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
}

.city-marker:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 8px 20px rgba(59, 130, 246, 0.6));
}

.marker-center {
  pointer-events: none;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.city-label {
  font-size: 14px;
  font-weight: 700;
  fill: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  font-family: 'Inter', sans-serif;
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