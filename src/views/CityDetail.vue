<template>
  <div class="city-detail">
    <div class="hero-section" :style="{ backgroundImage: `url(${cityData.heroImage})` }">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <button class="back-btn" @click="goBack">
              ← {{ $t('common.backToMap') }}
            </button>
            <h1 class="hero-title">{{ cityData.name }}</h1>
            <p class="hero-subtitle">{{ cityData.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <div class="description-section">
              <h2>{{ $t('cities.' + id + '.name') }}</h2>
              <p class="description">{{ $t('cities.' + id + '.details') }}</p>
            </div>

            <div class="gallery-section">
              <h3>Gallery</h3>
              <div class="image-gallery">
                <div 
                  v-for="(image, index) in cityData.gallery" 
                  :key="index"
                  class="gallery-item"
                  @click="openLightbox(index)"
                >
                  <img :src="image" :alt="`${cityData.name} ${index + 1}`" />
                </div>
              </div>
            </div>

            <div class="highlights-section">
              <h3>Highlights</h3>
              <div class="highlights-grid">
                <div 
                  v-for="highlight in cityData.highlights" 
                  :key="highlight.title"
                  class="highlight-card"
                >
                  <div class="highlight-icon">{{ highlight.icon }}</div>
                  <h4>{{ highlight.title }}</h4>
                  <p>{{ highlight.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="info-card">
              <h3>Quick Info</h3>
              <div class="info-item">
                <strong>Best Time to Visit:</strong>
                <span>{{ cityData.bestTime }}</span>
              </div>
              <div class="info-item">
                <strong>Duration:</strong>
                <span>{{ cityData.duration }}</span>
              </div>
              <div class="info-item">
                <strong>Activities:</strong>
                <div class="activities">
                  <span 
                    v-for="activity in cityData.activities" 
                    :key="activity"
                    class="activity-tag"
                  >
                    {{ activity }}
                  </span>
                </div>
              </div>
            </div>

            <div class="map-card">
              <h3>Location</h3>
              <div class="map-placeholder">
                <p>Interactive map coming soon...</p>
                <button class="btn btn-primary">View on Google Maps</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">×</button>
        <img :src="cityData.gallery[currentImageIndex]" :alt="cityData.name" />
        <div class="lightbox-nav">
          <button @click="prevImage" class="nav-btn">‹</button>
          <button @click="nextImage" class="nav-btn">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'CityDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const lightboxOpen = ref(false)
    const currentImageIndex = ref(0)

    const id = computed(() => route.params.id)

    const cityDatabase = {
      hanoi: {
        name: 'Hanoi',
        subtitle: 'Vietnam\'s Cultural Heart',
        heroImage: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1200',
        bestTime: 'October - April',
        duration: '3-4 days',
        activities: ['Culture', 'Food', 'History', 'Shopping'],
        gallery: [
          'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490780/pexels-photo-5490780.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490781/pexels-photo-5490781.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        highlights: [
          {
            icon: '🏛️',
            title: 'Old Quarter',
            description: 'Historic streets with traditional architecture and bustling markets.'
          },
          {
            icon: '🍜',
            title: 'Street Food',
            description: 'Authentic pho, bun cha, and other Vietnamese delicacies.'
          },
          {
            icon: '🏮',
            title: 'Temple of Literature',
            description: 'Vietnam\'s first university and Confucian temple.'
          }
        ]
      },
      hochiminh: {
        name: 'Ho Chi Minh City',
        subtitle: 'The Economic Powerhouse',
        heroImage: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1200',
        bestTime: 'December - April',
        duration: '2-3 days',
        activities: ['Business', 'Nightlife', 'Shopping', 'History'],
        gallery: [
          'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490782/pexels-photo-5490782.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490783/pexels-photo-5490783.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/5490784/pexels-photo-5490784.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        highlights: [
          {
            icon: '🏢',
            title: 'Skyscrapers',
            description: 'Modern skyline with impressive high-rise buildings.'
          },
          {
            icon: '🛍️',
            title: 'Shopping',
            description: 'From luxury malls to traditional markets.'
          },
          {
            icon: '🌃',
            title: 'Nightlife',
            description: 'Vibrant bars, clubs, and rooftop venues.'
          }
        ]
      }
      // Add more cities as needed
    }

    const cityData = computed(() => {
      return cityDatabase[id.value] || cityDatabase.hanoi
    })

    const goBack = () => {
      router.go(-1)
    }

    const openLightbox = (index) => {
      currentImageIndex.value = index
      lightboxOpen.value = true
    }

    const closeLightbox = () => {
      lightboxOpen.value = false
    }

    const nextImage = () => {
      currentImageIndex.value = (currentImageIndex.value + 1) % cityData.value.gallery.length
    }

    const prevImage = () => {
      currentImageIndex.value = currentImageIndex.value === 0 
        ? cityData.value.gallery.length - 1 
        : currentImageIndex.value - 1
    }

    onMounted(() => {
      // Hero animation
      gsap.fromTo('.hero-content', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Content animations
      gsap.fromTo('.description-section', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      )

      gsap.fromTo('.gallery-item', 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 0.5,
          ease: 'power3.out'
        }
      )

      gsap.fromTo('.highlight-card', 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 0.7,
          ease: 'power3.out'
        }
      )

      gsap.fromTo('.sidebar > *', 
        { opacity: 0, x: 30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.2,
          delay: 0.4,
          ease: 'power3.out'
        }
      )
    })

    return {
      id,
      cityData,
      lightboxOpen,
      currentImageIndex,
      goBack,
      openLightbox,
      closeLightbox,
      nextImage,
      prevImage,
      t
    }
  }
}
</script>

<style scoped>
.city-detail {
  padding-top: 80px;
}

.hero-section {
  height: 60vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
}

.hero-content {
  color: white;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

.content-section {
  padding: 6rem 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.description-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.gallery-section h3,
.highlights-section h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.highlight-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.highlight-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.highlight-card h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card,
.map-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
}

.info-card h3,
.map-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.info-item strong {
  color: var(--text-primary);
}

.activities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.activity-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.map-placeholder {
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>