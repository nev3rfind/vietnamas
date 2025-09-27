<template>
  <div class="home">
    <!-- Personalized Header for Wedding Guests -->
    <div v-if="isPersonalized" class="personalized-header">
      <p class="personalized-text">Page dedicated to {{ guestName }}</p>
    </div>

    <!-- Hero Section with Glass Design -->
    <section class="hero-section glass-hero">
      <div class="hero-background">
        <div class="floating-elements">
          <div class="floating-element element-1"></div>
          <div class="floating-element element-2"></div>
          <div class="floating-element element-3"></div>
        </div>
      </div>
      
      <div class="hero-content" ref="heroContent">
        <div class="hero-text" ref="heroText">
          <h1 class="hero-title" ref="heroTitle">{{ $t('hero.title') }}</h1>
          <p class="hero-subtitle" ref="heroSubtitle">{{ $t('hero.subtitle') }}</p>
          <p class="hero-description" ref="heroDescription">{{ $t('hero.description') }}</p>
          <div class="hero-actions" ref="heroActions">
            <button class="btn glass-btn primary" @click="scrollToMap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ $t('map.title') }}
            </button>
            <router-link to="/attractions" class="btn glass-btn secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              {{ $t('nav.attractions') }}
            </router-link>
          </div>
        </div>
        
        <div class="hero-visual" ref="heroVisual">
          <div class="hero-image glass-card">
            <img 
              src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Vietnam landscape"
            />
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Scroll Indicator -->
      <div class="scroll-indicator glass-indicator" @click="scrollToMap" ref="scrollIndicator">
        <div class="scroll-text">{{ $t('hero.scrollDown') }}</div>
        <div class="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m7 13 5 5 5-5"/>
            <path d="m7 6 5 5 5-5"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Enhanced Map Section -->
    <section ref="mapSection" class="map-section glass-section">
      <VietnamMap />
    </section>

    <!-- Magic Scroll Gallery Section -->
    <section class="gallery-section glass-gallery" ref="gallerySection">
      <div class="gallery-header" ref="galleryHeader">
        <h2 class="gallery-title">{{ $t('gallery.title') }}</h2>
        <p class="gallery-subtitle">{{ $t('gallery.subtitle') }}</p>
      </div>
      
      <div class="gallery-container" ref="galleryContainer">
        <div 
          v-for="(photo, index) in galleryPhotos" 
          :key="index"
          class="gallery-item glass-gallery-item"
          :class="`gallery-item-${index + 1}`"
          ref="galleryItems"
        >
          <div class="gallery-image">
            <img :src="photo.url" :alt="photo.title" />
            <div class="gallery-overlay">
              <div class="gallery-content">
                <h3 class="gallery-item-title">{{ photo.title }}</h3>
                <p class="gallery-description">{{ photo.description }}</p>
                <div class="gallery-tags">
                  <span v-for="tag in photo.tags" :key="tag" class="gallery-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section glass-features" ref="featuresSection">
      <div class="features-container">
        <div class="features-header" ref="featuresHeader">
          <h2 class="features-title">{{ $t('features.title') }}</h2>
          <p class="features-subtitle">{{ $t('features.subtitle') }}</p>
        </div>
        
        <div class="features-grid" ref="featuresGrid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card glass-feature-card"
          >
            <div class="feature-icon">
              <component :is="'div'" v-html="feature.icon"></component>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VietnamMap from '../components/VietnamMap.vue'
import { useDatabase } from '../composables/useDatabase'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'Home',
  components: {
    VietnamMap
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const { getGuestInvitation, trackActivity } = useDatabase()
    
    // Refs
    const heroContent = ref(null)
    const heroText = ref(null)
    const heroTitle = ref(null)
    const heroSubtitle = ref(null)
    const heroDescription = ref(null)
    const heroActions = ref(null)
    const heroVisual = ref(null)
    const scrollIndicator = ref(null)
    const mapSection = ref(null)
    const gallerySection = ref(null)
    const galleryHeader = ref(null)
    const galleryContainer = ref(null)
    const galleryItems = ref([])
    const featuresSection = ref(null)
    const featuresHeader = ref(null)
    const featuresGrid = ref(null)
    
    // Wedding guest personalization
    const isPersonalized = ref(false)
    const guestName = ref('')

    const galleryPhotos = [
      {
        title: 'Ha Long Bay',
        description: 'UNESCO World Heritage limestone karsts rising from emerald waters',
        url: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['UNESCO', 'Nature', 'Cruise']
      },
      {
        title: 'Sapa Rice Terraces',
        description: 'Ancient terraced fields carved into misty mountain slopes',
        url: 'https://images.pexels.com/photos/5490780/pexels-photo-5490780.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Mountains', 'Culture', 'Trekking']
      },
      {
        title: 'Hoi An Ancient Town',
        description: 'Lantern-lit streets preserving centuries of trading history',
        url: 'https://images.pexels.com/photos/5490781/pexels-photo-5490781.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['UNESCO', 'History', 'Architecture']
      },
      {
        title: 'Mekong Delta',
        description: 'Floating markets and waterways of the Mekong River',
        url: 'https://images.pexels.com/photos/5490782/pexels-photo-5490782.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['Rivers', 'Culture', 'Markets']
      },
      {
        title: 'Phong Nha Caves',
        description: 'Underground rivers and the world\'s largest cave passages',
        url: 'https://images.pexels.com/photos/5490783/pexels-photo-5490783.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['UNESCO', 'Caves', 'Adventure']
      },
      {
        title: 'Imperial Hue',
        description: 'Royal palaces and tombs of Vietnam\'s last dynasty',
        url: 'https://images.pexels.com/photos/5490784/pexels-photo-5490784.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['UNESCO', 'History', 'Royal']
      }
    ]

    const features = [
      {
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        title: 'Interactive Map',
        description: 'Explore Vietnam with our 3D interactive map featuring all major destinations'
      },
      {
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        title: 'Trusted Guides',
        description: 'Curated recommendations from local experts and experienced travelers'
      },
      {
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18l-2 13H5L3 6z"></path><path d="M3 6L2 2H1"></path><circle cx="9" cy="20" r="1"></circle><circle cx="20" cy="20" r="1"></circle></svg>',
        title: 'Easy Planning',
        description: 'Plan your perfect Vietnam adventure with our comprehensive travel tools'
      },
      {
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>',
        title: 'Multi-Language',
        description: 'Available in English and Lithuanian for international travelers'
      }
    ]

    // Check if this is a personalized page for a wedding guest
    const checkPersonalization = async () => {
      const userUuid = route.params.uuid
      if (userUuid) {
        try {
          const { data, error } = await getGuestInvitation(userUuid)
          if (data && !error) {
            isPersonalized.value = true
            guestName.value = data.guest_call
            
            // Track homepage visit
            await trackActivity(data.id, 'homepage_visit', 0, {
              timestamp: new Date().toISOString(),
              referrer: document.referrer
            })
          }
        } catch (err) {
          console.error('Error checking personalization:', err)
        }
      }
    }

    const scrollToMap = () => {
      mapSection.value?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }

    onMounted(() => {
      checkPersonalization()
      
      // Enhanced hero animations
      const heroTl = gsap.timeline()
      
      heroTl.fromTo(heroTitle.value, 
        { opacity: 0, y: 80, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(heroSubtitle.value, 
        { opacity: 0, y: 50, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, '-=0.6'
      )
      .fromTo(heroDescription.value, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4'
      )
      .fromTo(heroActions.value, 
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4'
      )
      .fromTo(heroVisual.value, 
        { opacity: 0, scale: 0.7, rotationY: 15, filter: 'blur(20px)' },
        { opacity: 1, scale: 1, rotationY: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }, '-=1'
      )

      // Floating elements animation
      gsap.to('.floating-element', {
        y: -30,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.5
      })

      // Enhanced scroll indicator animation
      gsap.to(scrollIndicator.value, {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })

      // Magic scroll gallery animations
      ScrollTrigger.batch(galleryItems.value, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              y: 120, 
              scale: 0.8,
              rotationX: 45,
              filter: 'blur(10px)'
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotationX: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              stagger: 0.2,
              ease: 'power3.out'
            }
          )
        },
        start: 'top 85%',
        once: true
      })

      // Gallery header animation
      ScrollTrigger.create({
        trigger: galleryHeader.value,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(galleryHeader.value, 
            { opacity: 0, y: 60, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
          )
        },
        once: true
      })

      // Features section animation
      ScrollTrigger.create({
        trigger: featuresSection.value,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(featuresHeader.value, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          )
          
          gsap.fromTo(featuresGrid.value.children, 
            { opacity: 0, y: 60, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.8, 
              stagger: 0.15,
              delay: 0.3,
              ease: 'power3.out'
            }
          )
        },
        once: true
      })

      // Parallax effects for gallery images
      gsap.utils.toArray('.gallery-image img').forEach((img) => {
        gsap.to(img, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })

      // Background color transitions
      ScrollTrigger.create({
        trigger: mapSection.value,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to('body', { 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', 
            duration: 1.5 
          })
        },
        onLeaveBack: () => {
          gsap.to('body', { 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)', 
            duration: 1.5 
          })
        }
      })
    })

    return {
      heroContent,
      heroText,
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroActions,
      heroVisual,
      scrollIndicator,
      mapSection,
      gallerySection,
      galleryHeader,
      galleryContainer,
      galleryItems,
      featuresSection,
      featuresHeader,
      featuresGrid,
      galleryPhotos,
      features,
      isPersonalized,
      guestName,
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

/* Personalized Header */
.personalized-header {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(252, 178, 169, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 1rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.personalized-text {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* Hero Section with Glass Design */
.glass-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
  backdrop-filter: blur(1px);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.element-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #3b82f6, transparent);
  top: 10%;
  left: 5%;
}

.element-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #10b981, transparent);
  top: 70%;
  right: 10%;
}

.element-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #f59e0b, transparent);
  bottom: 10%;
  left: 70%;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  z-index: 2;
}

.hero-text {
  z-index: 3;
}

.hero-title {
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 30%, #10b981 70%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.75rem;
  font-weight: 300;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.glass-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.glass-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.glass-btn:hover::before {
  left: 100%;
}

.glass-btn.primary {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%);
  color: white;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
}

.glass-btn.primary:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(16, 185, 129, 0.4) 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
}

.glass-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
}

.glass-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2);
}

.hero-visual {
  position: relative;
  z-index: 2;
}

.glass-card {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hero-image img {
  width: 100%;
  height: 600px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.glass-card:hover .hero-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
}

.glass-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  transition: all 0.3s ease;
}

.glass-indicator:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-50%) translateY(-5px);
}

.scroll-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scroll-arrow {
  color: rgba(255, 255, 255, 0.7);
}

/* Map Section */
.glass-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  position: relative;
}

/* Gallery Section */
.glass-gallery {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  padding: 8rem 0;
  position: relative;
}

.gallery-header {
  text-align: center;
  margin-bottom: 6rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
}

.gallery-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.gallery-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
}

.glass-gallery-item {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
}

.glass-gallery-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.3);
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

.glass-gallery-item:hover .gallery-image img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 3rem;
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.glass-gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-content {
  position: relative;
  z-index: 2;
}

.gallery-item-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gallery-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.gallery-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.gallery-tag {
  background: rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Features Section */
.glass-features {
  padding: 8rem 0;
  background: linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%);
}

.features-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-header {
  text-align: center;
  margin-bottom: 6rem;
}

.features-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.glass-feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
  transition: all 0.4s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.glass-feature-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  color: #3b82f6;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.feature-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-image {
    height: 400px;
  }
  
  .hero-image img {
    height: 400px;
  }
  
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .glass-gallery-item {
    height: 400px;
  }
  
  .gallery-title {
    font-size: 2.5rem;
  }
  
  .features-title {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .glass-feature-card {
    padding: 2rem;
  }
}
</style>