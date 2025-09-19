<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">{{ $t('hero.title') }}</h1>
          <p class="hero-subtitle">{{ $t('hero.subtitle') }}</p>
          <p class="hero-description">{{ $t('hero.description') }}</p>
          <div class="hero-actions">
            <button class="btn btn-primary" @click="scrollToMap">
              {{ $t('map.title') }}
            </button>
            <router-link to="/attractions" class="btn btn-secondary">
              {{ $t('nav.attractions') }}
            </router-link>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-image">
            <img 
              src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Vietnam landscape"
            />
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="scroll-indicator" @click="scrollToMap">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Map Section -->
    <section ref="mapSection" class="map-section">
      <VietnamMap />
    </section>

    <!-- Photo Gallery Section -->
    <section class="gallery-section">
      <div class="gallery-container">
        <div 
          v-for="(photo, index) in galleryPhotos" 
          :key="index"
          class="gallery-item"
          :class="`gallery-item-${index + 1}`"
        >
          <div class="gallery-image">
            <img :src="photo.url" :alt="photo.title" />
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ photo.title }}</h3>
              <p class="gallery-description">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VietnamMap from '../components/VietnamMap.vue'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'Home',
  components: {
    VietnamMap
  },
  setup() {
    const { t } = useI18n()
    const mapSection = ref(null)

    const galleryPhotos = [
      {
        title: 'Ha Long Bay',
        description: 'UNESCO World Heritage limestone karsts',
        url: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        title: 'Sapa Rice Terraces',
        description: 'Stunning mountain landscapes',
        url: 'https://images.pexels.com/photos/5490780/pexels-photo-5490780.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        title: 'Hoi An Ancient Town',
        description: 'Lantern-lit historic streets',
        url: 'https://images.pexels.com/photos/5490781/pexels-photo-5490781.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        title: 'Mekong Delta',
        description: 'Floating markets and waterways',
        url: 'https://images.pexels.com/photos/5490782/pexels-photo-5490782.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]

    const scrollToMap = () => {
      mapSection.value?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }

    onMounted(() => {
      // Hero animations
      const tl = gsap.timeline()
      
      tl.fromTo('.hero-title', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.hero-subtitle', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
      )
      .fromTo('.hero-description', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3'
      )
      .fromTo('.hero-actions', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3'
      )
      .fromTo('.hero-image', 
        { opacity: 0, scale: 0.8, rotation: 5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8'
      )

      // Scroll indicator animation
      gsap.to('.scroll-arrow', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })

      // Gallery scroll animations
      ScrollTrigger.batch('.gallery-item', {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 100, scale: 0.8 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 1,
              stagger: 0.2,
              ease: 'power3.out'
            }
          )
        },
        start: 'top 80%'
      })

      // Parallax effect for gallery images
      gsap.utils.toArray('.gallery-image img').forEach((img) => {
        gsap.to(img, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // Background color transitions
      ScrollTrigger.create({
        trigger: '.map-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to('body', { backgroundColor: '#f8fafc', duration: 1 })
        },
        onLeaveBack: () => {
          gsap.to('body', { backgroundColor: '#ffffff', duration: 1 })
        }
      })

      ScrollTrigger.create({
        trigger: '.gallery-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to('body', { backgroundColor: '#1f2937', duration: 1 })
        },
        onLeaveBack: () => {
          gsap.to('body', { backgroundColor: '#f8fafc', duration: 1 })
        }
      })
    })

    return {
      mapSection,
      galleryPhotos,
      scrollToMap,
      t
    }
  }
}
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
}

.hero-image {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.hero-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 10;
}

.scroll-arrow {
  width: 2px;
  height: 30px;
  background: white;
  position: relative;
  opacity: 0.7;
}

.scroll-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -4px;
  width: 10px;
  height: 10px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
}

.map-section {
  background: #f8fafc;
}

.gallery-section {
  min-height: 100vh;
  background: #1f2937;
  padding: 6rem 0;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  height: 400px;
}

.gallery-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-image img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.gallery-description {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-image {
    height: 300px;
  }
  
  .hero-image img {
    height: 300px;
  }
  
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-item {
    height: 300px;
  }
}
</style>