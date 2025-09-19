<template>
  <div class="attractions">
    <div class="attractions-header">
      <div class="container">
        <h1 class="page-title">{{ $t('attractions.title') }}</h1>
        <p class="page-subtitle">{{ $t('attractions.subtitle') }}</p>
      </div>
    </div>

    <div class="attractions-content">
      <div class="container">
        <div class="attractions-grid">
          <div 
            v-for="attraction in attractions" 
            :key="attraction.id"
            class="attraction-card"
          >
            <div class="card-image">
              <img :src="attraction.image" :alt="attraction.name" />
              <div class="card-overlay">
                <button 
                  class="btn btn-primary"
                  @click="goToAttraction(attraction.id)"
                >
                  {{ $t('attractions.findMore') }}
                </button>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ attraction.name }}</h3>
              <p class="card-location">{{ attraction.location }}</p>
              <p class="card-description">{{ attraction.description }}</p>
              <div class="card-tags">
                <span 
                  v-for="tag in attraction.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'Attractions',
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    const attractions = ref([
      {
        id: 'halong-bay',
        name: 'Ha Long Bay',
        location: 'Quang Ninh Province',
        description: 'UNESCO World Heritage site featuring thousands of limestone karsts and isles in various shapes and sizes.',
        image: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['UNESCO', 'Nature', 'Cruise']
      },
      {
        id: 'sapa-terraces',
        name: 'Sapa Rice Terraces',
        location: 'Lao Cai Province',
        description: 'Breathtaking terraced rice fields carved into mountainsides by ethnic minorities.',
        image: 'https://images.pexels.com/photos/5490780/pexels-photo-5490780.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['Mountains', 'Culture', 'Trekking']
      },
      {
        id: 'hoi-an-ancient',
        name: 'Hoi An Ancient Town',
        location: 'Quang Nam Province',
        description: 'Well-preserved ancient trading port with unique architecture and lantern-lit streets.',
        image: 'https://images.pexels.com/photos/5490781/pexels-photo-5490781.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['UNESCO', 'History', 'Architecture']
      },
      {
        id: 'mekong-delta',
        name: 'Mekong Delta',
        location: 'Southern Vietnam',
        description: 'Vast network of rivers, swamps and islands with floating markets and traditional villages.',
        image: 'https://images.pexels.com/photos/5490782/pexels-photo-5490782.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['Rivers', 'Culture', 'Markets']
      },
      {
        id: 'phong-nha-caves',
        name: 'Phong Nha-Ke Bang',
        location: 'Quang Binh Province',
        description: 'National park home to the world\'s largest cave passages and underground rivers.',
        image: 'https://images.pexels.com/photos/5490783/pexels-photo-5490783.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['UNESCO', 'Caves', 'Adventure']
      },
      {
        id: 'imperial-city-hue',
        name: 'Imperial City of Hue',
        location: 'Thua Thien-Hue Province',
        description: 'Former imperial capital with magnificent palaces, temples, and royal tombs.',
        image: 'https://images.pexels.com/photos/5490784/pexels-photo-5490784.jpeg?auto=compress&cs=tinysrgb&w=600',
        tags: ['UNESCO', 'History', 'Royal']
      }
    ])

    const goToAttraction = (id) => {
      router.push(`/city/${id}`)
    }

    onMounted(() => {
      // Header animation
      gsap.fromTo('.page-title', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      
      gsap.fromTo('.page-subtitle', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      )

      // Cards animation
      ScrollTrigger.batch('.attraction-card', {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 60, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out'
            }
          )
        },
        start: 'top 85%'
      })
    })

    return {
      attractions,
      goToAttraction,
      t
    }
  }
}
</script>

<style scoped>
.attractions {
  padding-top: 80px;
  min-height: 100vh;
}

.attractions-header {
  background: var(--gradient-primary);
  color: white;
  padding: 6rem 0 4rem;
  text-align: center;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.attractions-content {
  padding: 6rem 0;
  background: var(--bg-secondary);
}

.attractions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.attraction-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all 0.4s ease;
}

.attraction-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.attraction-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.attraction-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.card-location {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .attractions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
}
</style>