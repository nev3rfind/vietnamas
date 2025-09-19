<template>
  <div class="places-to-eat">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ $t('restaurants.title') }}</h1>
        <p class="page-subtitle">{{ $t('restaurants.subtitle') }}</p>
        
        <!-- City Filter -->
        <div class="filter-section">
          <button 
            v-for="city in cities" 
            :key="city"
            @click="filterByCity(city)"
            class="filter-btn"
            :class="{ 'active': selectedCity === city }"
          >
            {{ city === 'all' ? $t('restaurants.filterAll') : city }}
          </button>
        </div>
      </div>
    </div>

    <div class="restaurants-content">
      <div class="container">
        <div class="restaurants-grid">
          <div 
            v-for="restaurant in filteredRestaurants" 
            :key="restaurant.id"
            class="restaurant-card"
          >
            <div class="card-image">
              <img :src="restaurant.image" :alt="restaurant.name" />
              <div class="card-badge">
                <span class="cuisine-type">{{ restaurant.cuisine }}</span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ restaurant.name }}</h3>
              <p class="card-location">{{ restaurant.city }}, {{ restaurant.address }}</p>
              <p class="card-description">{{ restaurant.description }}</p>
              <div class="card-details">
                <div class="rating">
                  <span class="stars">
                    <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= restaurant.rating }">★</span>
                  </span>
                  <span class="rating-text">{{ restaurant.rating }}/5</span>
                </div>
                <div class="price-range">{{ restaurant.priceRange }}</div>
              </div>
              <button 
                class="btn btn-primary"
                @click="viewRestaurant(restaurant.id)"
              >
                {{ $t('restaurants.viewDetails') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'PlacesToEat',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const selectedCity = ref('all')

    const restaurants = ref([
      {
        id: 'pho-gia-truyen',
        name: 'Pho Gia Truyen',
        city: 'Hanoi',
        address: 'Old Quarter',
        cuisine: 'Vietnamese',
        description: 'Authentic pho bo served in a traditional setting with recipes passed down through generations.',
        image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.8,
        priceRange: '$'
      },
      {
        id: 'secret-garden',
        name: 'Secret Garden Restaurant',
        city: 'Ho Chi Minh City',
        address: 'District 1',
        cuisine: 'Vietnamese',
        description: 'Hidden rooftop restaurant serving modern Vietnamese cuisine with a view of the bustling city.',
        image: 'https://images.pexels.com/photos/5490785/pexels-photo-5490785.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.6,
        priceRange: '$$'
      },
      {
        id: 'thuan-tinh-island',
        name: 'Thuan Tinh Island Tour',
        city: 'Hoi An',
        address: 'Thu Bon River',
        cuisine: 'Seafood',
        description: 'Unique dining experience on a floating restaurant with fresh seafood and traditional cooking.',
        image: 'https://images.pexels.com/photos/5490786/pexels-photo-5490786.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.9,
        priceRange: '$$'
      },
      {
        id: 'madam-khanh',
        name: 'Madam Khanh - The Banh Mi Queen',
        city: 'Hoi An',
        address: 'Ancient Town',
        cuisine: 'Street Food',
        description: 'Famous banh mi stall known for the best Vietnamese sandwiches with unique local ingredients.',
        image: 'https://images.pexels.com/photos/5490787/pexels-photo-5490787.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.7,
        priceRange: '$'
      },
      {
        id: 'sailing-club',
        name: 'Sailing Club Nha Trang',
        city: 'Nha Trang',
        address: 'Beachfront',
        cuisine: 'International',
        description: 'Beachfront restaurant and bar with international cuisine and stunning ocean views.',
        image: 'https://images.pexels.com/photos/5490788/pexels-photo-5490788.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.5,
        priceRange: '$$$'
      },
      {
        id: 'ancient-hue',
        name: 'Ancient Hue Garden Houses',
        city: 'Hue',
        address: 'Imperial City',
        cuisine: 'Royal Vietnamese',
        description: 'Traditional royal cuisine served in historic garden houses with imperial recipes.',
        image: 'https://images.pexels.com/photos/5490789/pexels-photo-5490789.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.8,
        priceRange: '$$'
      }
    ])

    const cities = computed(() => {
      const uniqueCities = [...new Set(restaurants.value.map(r => r.city))]
      return ['all', ...uniqueCities]
    })

    const filteredRestaurants = computed(() => {
      if (selectedCity.value === 'all') {
        return restaurants.value
      }
      return restaurants.value.filter(r => r.city === selectedCity.value)
    })

    const filterByCity = (city) => {
      selectedCity.value = city
      
      // Animate filter change
      gsap.fromTo('.restaurant-card', 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out'
        }
      )
    }

    const viewRestaurant = (id) => {
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

      gsap.fromTo('.filter-section', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      )

      // Cards animation
      ScrollTrigger.batch('.restaurant-card', {
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
      restaurants,
      cities,
      selectedCity,
      filteredRestaurants,
      filterByCity,
      viewRestaurant,
      t
    }
  }
}
</script>

<style scoped>
.places-to-eat {
  padding-top: 80px;
  min-height: 100vh;
}

.page-header {
  background: var(--gradient-secondary);
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
  margin: 0 auto 3rem;
}

.filter-section {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: white;
  color: var(--primary-color);
  border-color: white;
  transform: translateY(-2px);
}

.restaurants-content {
  padding: 6rem 0;
  background: var(--bg-secondary);
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.restaurant-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all 0.4s ease;
}

.restaurant-card:hover {
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

.restaurant-card:hover .card-image img {
  transform: scale(1.1);
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.cuisine-type {
  background: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
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

.card-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #fbbf24;
}

.star {
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.rating-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.price-range {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .filter-section {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>