<template>
  <div class="luxury-wedding-invitation" ref="invitationContainer">
    <!-- Animated Background Elements -->
    <div class="background-canvas">
      <!-- Watercolor Floral Accents -->
      <div class="watercolor-elements">
        <div class="watercolor-bloom watercolor-1"></div>
        <div class="watercolor-bloom watercolor-2"></div>
        <div class="watercolor-bloom watercolor-3"></div>
        <div class="watercolor-bloom watercolor-4"></div>
      </div>
      
      <!-- Animated Lotus Flowers -->
      <div class="lotus-garden">
        <div class="lotus-flower lotus-1">
          <div class="lotus-petal petal-1"></div>
          <div class="lotus-petal petal-2"></div>
          <div class="lotus-petal petal-3"></div>
          <div class="lotus-petal petal-4"></div>
          <div class="lotus-petal petal-5"></div>
          <div class="lotus-center"></div>
        </div>
        <div class="lotus-flower lotus-2">
          <div class="lotus-petal petal-1"></div>
          <div class="lotus-petal petal-2"></div>
          <div class="lotus-petal petal-3"></div>
          <div class="lotus-petal petal-4"></div>
          <div class="lotus-petal petal-5"></div>
          <div class="lotus-center"></div>
        </div>
        <div class="lotus-flower lotus-3">
          <div class="lotus-petal petal-1"></div>
          <div class="lotus-petal petal-2"></div>
          <div class="lotus-petal petal-3"></div>
          <div class="lotus-petal petal-4"></div>
          <div class="lotus-petal petal-5"></div>
          <div class="lotus-center"></div>
        </div>
      </div>

      <!-- Animated Rice Paddies -->
      <div class="rice-paddies">
        <div class="rice-terrace terrace-1">
          <div class="rice-plant" v-for="n in 12" :key="n" :style="{ animationDelay: `${n * 0.2}s` }"></div>
        </div>
        <div class="rice-terrace terrace-2">
          <div class="rice-plant" v-for="n in 8" :key="n" :style="{ animationDelay: `${n * 0.3}s` }"></div>
        </div>
        <div class="rice-terrace terrace-3">
          <div class="rice-plant" v-for="n in 10" :key="n" :style="{ animationDelay: `${n * 0.25}s` }"></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="luxury-loading">
      <div class="loading-lotus">
        <div class="loading-petal" v-for="n in 8" :key="n"></div>
      </div>
      <p class="loading-text">{{ $t('wedding.errors.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="luxury-error">
      <div class="error-lotus">🪷</div>
      <h2 class="error-title">{{ $t('wedding.errors.not_found') }}</h2>
      <p class="error-description">The invitation you're looking for has drifted away like petals on water...</p>
    </div>

    <!-- Main Invitation Content -->
    <div v-else-if="guest" class="invitation-content">
      <!-- Glassmorphism Header Card -->
      <div class="glass-header-card" ref="headerCard">
        <div class="luxury-ornament top-ornament">
          <svg viewBox="0 0 100 20" class="ornament-svg">
            <path d="M10,10 Q25,2 40,10 Q50,15 60,10 Q75,2 90,10" stroke="currentColor" fill="none" stroke-width="1"/>
            <circle cx="20" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="50" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="80" cy="8" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        
        <h1 class="luxury-title" ref="luxuryTitle">{{ $t('wedding.title') }}</h1>
        <div class="date-container" ref="dateContainer">
          <p class="luxury-date">{{ $t('wedding.date') }}</p>
          <div class="countdown-timer" ref="countdownTimer">
            <div class="countdown-segment">
              <span class="countdown-number">{{ countdown.days }}</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-segment">
              <span class="countdown-number">{{ countdown.hours }}</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-segment">
              <span class="countdown-number">{{ countdown.minutes }}</span>
              <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-segment">
              <span class="countdown-number">{{ countdown.seconds }}</span>
              <span class="countdown-label">Seconds</span>
            </div>
          </div>
        </div>
        
        <div class="luxury-ornament bottom-ornament">
          <svg viewBox="0 0 100 20" class="ornament-svg">
            <path d="M10,10 Q25,18 40,10 Q50,5 60,10 Q75,18 90,10" stroke="currentColor" fill="none" stroke-width="1"/>
            <circle cx="20" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="50" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="80" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- Main Greeting Glass Card -->
      <div class="glass-greeting-card" ref="greetingCard">
        <div class="greeting-content">
          <!-- Country Flag Display -->
          <div v-if="guest.countries" class="country-display" ref="countryDisplay">
            <div class="flag-container">
              <img 
                :src="getFlagUrl(guest.countries.country_code)" 
                :alt="getCountryName(guest.countries)"
                class="country-flag"
              />
              <span class="country-name">{{ getCountryName(guest.countries) }}</span>
            </div>
          </div>

          <!-- Animated Greeting -->
          <div class="luxury-greeting">
            <div class="hello-container" ref="helloContainer">
              <span class="hello-text" ref="helloText">{{ $t('wedding.hello') }}</span>
              <span class="guest-name" ref="guestName">, {{ guest.guest_call }}</span>
            </div>
            
            <p class="invitation-text" ref="invitationText">
              {{ $t('wedding.invitation_text') }}
            </p>
            
            <div class="location-container" ref="locationContainer">
              <span class="location-text" ref="locationText">{{ $t('wedding.location') }}</span>
            </div>
          </div>

          <!-- Luxury Action Buttons -->
          <div class="luxury-actions" ref="luxuryActions" v-if="!showQuestions && !showThankYou">
            <button 
              class="luxury-btn accept-btn" 
              @click="acceptInvitation"
              :disabled="guest.invitation_status?.status_name === 'accepted'"
            >
              <span class="btn-icon">🌸</span>
              {{ guest.invitation_status?.status_name === 'accepted' ? $t('wedding.buttons.curiosity') : $t('wedding.buttons.accept') }}
              <div class="btn-shimmer"></div>
            </button>
            
            <button 
              class="luxury-btn decline-btn" 
              @click="declineInvitation"
              v-if="guest.invitation_status?.status_name !== 'accepted'"
            >
              <span class="btn-icon">🍃</span>
              {{ $t('wedding.buttons.decline') }}
              <div class="btn-shimmer"></div>
            </button>
          </div>

          <!-- Post-Acceptance Content -->
          <div v-if="showAcceptedText && !showQuestions && !showThankYou" class="accepted-content" ref="acceptedContent">
            <div class="celebration-message">
              <p>{{ $t('wedding.accepted_text') }}</p>
            </div>
            <button class="luxury-btn curiosity-btn" @click="showQuestionsModal">
              <span class="btn-icon">✨</span>
              {{ $t('wedding.buttons.curiosity') }}
              <div class="btn-shimmer"></div>
            </button>
          </div>

          <!-- Thank You Content -->
          <div v-if="showThankYou" class="thank-you-content" ref="thankYouContent">
            <div class="gratitude-message">
              <p>{{ $t('wedding.thank_you_text') }}</p>
            </div>
            <button class="luxury-btn answered-btn" disabled>
              <span class="btn-icon">💝</span>
              {{ $t('wedding.buttons.answered') }}
            </button>
          </div>

          <!-- Additional Luxury Links -->
          <div v-if="showThankYou" class="luxury-links" ref="luxuryLinks">
            <button class="luxury-link-btn" @click="revealAddress">
              <span class="link-icon">📍</span>
              {{ $t('wedding.links.reveal_address') }}
            </button>
            
            <router-link :to="`/home/${guest.invite_guid}`" class="luxury-link-btn">
              <span class="link-icon">🇻🇳</span>
              {{ $t('wedding.links.explore_vietnam') }}
            </router-link>
            
            <button class="luxury-link-btn" @click="showFlightInfo">
              <span class="link-icon">✈️</span>
              {{ $t('wedding.links.flight_tickets') }}
              <span v-if="guest.countries" class="flying-from">
                {{ $t('wedding.links.flying_from') }} {{ getCountryName(guest.countries) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Venue Address Glass Card -->
      <div v-if="showAddress" class="glass-venue-card" ref="venueCard">
        <div class="venue-content">
          <h3 class="venue-title">{{ $t('wedding.venue.address') }}</h3>
          <p class="venue-location">{{ $t('wedding.venue.location') }}</p>
          <div class="venue-map">
            <div class="map-placeholder">
              <span class="map-icon">🗺️</span>
              <p>Interactive map coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Luxury Questions Modal -->
    <div v-if="showQuestions" class="luxury-modal-overlay" @click="closeModal">
      <div class="luxury-questions-modal" @click.stop ref="questionsModal">
        <button class="luxury-modal-close" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="modal-ornament">
            <svg viewBox="0 0 60 10" class="ornament-svg">
              <path d="M5,5 Q15,1 25,5 Q30,8 35,5 Q45,1 55,5" stroke="currentColor" fill="none" stroke-width="1"/>
            </svg>
          </div>
          <h3 class="modal-title">Tell us about your journey</h3>
        </div>
        
        <form @submit.prevent="submitQuestions" class="luxury-form">
          <div class="form-group">
            <label class="luxury-label">{{ $t('wedding.form.days_vietnam') }}</label>
            <div class="luxury-input-container">
              <input 
                type="number" 
                v-model="formData.daysInVietnam" 
                min="1" 
                required
                class="luxury-input"
                placeholder="7"
              />
              <span class="input-accent"></span>
            </div>
            <span v-if="formErrors.daysInVietnam" class="luxury-error">{{ formErrors.daysInVietnam }}</span>
          </div>

          <div class="form-group">
            <label class="luxury-label">{{ $t('wedding.form.flight_date') }}</label>
            <div class="luxury-input-container">
              <input 
                type="date" 
                v-model="formData.flightTicketDate" 
                required
                class="luxury-input"
              />
              <span class="input-accent"></span>
            </div>
            <span v-if="formErrors.flightTicketDate" class="luxury-error">{{ formErrors.flightTicketDate }}</span>
          </div>

          <div class="form-group">
            <label class="luxury-label">{{ $t('wedding.form.days_before') }}</label>
            <div class="luxury-input-container">
              <input 
                type="number" 
                v-model="formData.daysBeforeWedding" 
                min="0" 
                required
                class="luxury-input"
                placeholder="3"
              />
              <span class="input-accent"></span>
            </div>
            <span v-if="formErrors.daysBeforeWedding" class="luxury-error">{{ formErrors.daysBeforeWedding }}</span>
          </div>

          <div class="form-group">
            <label class="luxury-label">{{ $t('wedding.form.coming_with') }}</label>
            <div class="luxury-input-container">
              <textarea 
                v-model="formData.comingWith" 
                rows="3"
                class="luxury-textarea"
                placeholder="Family, friends, partner..."
              ></textarea>
              <span class="input-accent"></span>
            </div>
          </div>

          <button type="submit" class="luxury-btn submit-btn" :disabled="submitting">
            <span class="btn-icon">{{ submitting ? '⏳' : '💌' }}</span>
            {{ submitting ? 'Sending...' : $t('wedding.form.submit') }}
            <div class="btn-shimmer"></div>
          </button>
        </form>
      </div>
    </div>

    <!-- Enhanced Celebration Canvas -->
    <canvas ref="celebrationCanvas" class="celebration-canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import { useDatabase } from '../composables/useDatabase'

export default {
  name: 'WeddingInvitation',
  setup() {
    const route = useRoute()
    const { t, locale } = useI18n()
    const { getGuestInvitation, updateGuestStatus, submitGuestResponse, trackActivity } = useDatabase()

    // Refs
    const invitationContainer = ref(null)
    const headerCard = ref(null)
    const greetingCard = ref(null)
    const luxuryTitle = ref(null)
    const dateContainer = ref(null)
    const countdownTimer = ref(null)
    const helloContainer = ref(null)
    const helloText = ref(null)
    const guestName = ref(null)
    const invitationText = ref(null)
    const locationContainer = ref(null)
    const locationText = ref(null)
    const luxuryActions = ref(null)
    const acceptedContent = ref(null)
    const thankYouContent = ref(null)
    const luxuryLinks = ref(null)
    const venueCard = ref(null)
    const questionsModal = ref(null)
    const countryDisplay = ref(null)
    const celebrationCanvas = ref(null)

    // State
    const loading = ref(true)
    const error = ref(false)
    const guest = ref(null)
    const showQuestions = ref(false)
    const showAcceptedText = ref(false)
    const showThankYou = ref(false)
    const showAddress = ref(false)
    const submitting = ref(false)
    const sessionStartTime = ref(Date.now())

    // Countdown state
    const countdown = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })

    // Form data
    const formData = ref({
      daysInVietnam: null,
      flightTicketDate: '',
      daysBeforeWedding: null,
      comingWith: ''
    })

    const formErrors = ref({})
    const inviteGuid = route.params.guid

    // Wedding date: April 5th, 2026
    const weddingDate = new Date('2026-04-05T00:00:00')

    // Country flag mapping
    const flagUrls = {
      'LT': 'https://flagcdn.com/w40/lt.png',
      'GB': 'https://flagcdn.com/w40/gb.png',
      'US': 'https://flagcdn.com/w40/us.png',
      'DE': 'https://flagcdn.com/w40/de.png',
      'FR': 'https://flagcdn.com/w40/fr.png',
      'IT': 'https://flagcdn.com/w40/it.png',
      'ES': 'https://flagcdn.com/w40/es.png',
      'PL': 'https://flagcdn.com/w40/pl.png',
      'NL': 'https://flagcdn.com/w40/nl.png',
      'SE': 'https://flagcdn.com/w40/se.png'
    }

    // Update countdown timer
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = weddingDate.getTime() - now

      if (distance > 0) {
        countdown.value = {
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        }
      } else {
        countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
    }

    // Get flag URL
    const getFlagUrl = (countryCode) => {
      return flagUrls[countryCode] || flagUrls['GB']
    }

    // Get country name based on language
    const getCountryName = (country) => {
      if (!country) return ''
      return locale.value === 'lt' ? country.country_name_lt : country.country_name_en
    }

    // Enhanced typing animation
    const typeText = (element, text, speed = 100) => {
      return new Promise((resolve) => {
        let i = 0
        element.textContent = ''
        
        const timer = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i)
            i++
          } else {
            clearInterval(timer)
            resolve()
          }
        }, speed)
      })
    }

    // Enhanced celebration animation
    const triggerCelebration = () => {
      const canvas = celebrationCanvas.value
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      })

      // Multiple celebration bursts
      const duration = 3000
      const animationEnd = Date.now() + duration

      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Balloons and confetti
        myConfetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#FFFFF8', '#FCB2A9', '#B0D5C0', '#989CA0']
        })

        myConfetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#FFFFF8', '#FCB2A9', '#B0D5C0', '#989CA0']
        })
      }, 250)

      // Heart-shaped confetti
      setTimeout(() => {
        myConfetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          shapes: ['heart'],
          colors: ['#FCB2A9', '#B0D5C0']
        })
      }, 500)
    }

    // Load guest invitation
    const loadGuestInvitation = async () => {
      try {
        loading.value = true
        const { data, error: fetchError } = await getGuestInvitation(inviteGuid)
        
        if (fetchError || !data) {
          error.value = true
          return
        }

        guest.value = data
        locale.value = data.guest_language.toLowerCase()
        
        if (data.guest_responses) {
          showThankYou.value = true
        } else if (data.invitation_status?.status_name === 'accepted') {
          showAcceptedText.value = true
        }

        await trackActivity(data.id, 'page_visit', 0, { 
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })

        await nextTick()
        animateEntrance()
        
      } catch (err) {
        console.error('Error loading invitation:', err)
        error.value = true
      } finally {
        loading.value = false
      }
    }

    // Luxury entrance animations
    const animateEntrance = async () => {
      const tl = gsap.timeline()
      
      // Header card entrance
      tl.fromTo(headerCard.value, 
        { opacity: 0, y: -100, scale: 0.8, rotationX: -15 },
        { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1.5, ease: 'power3.out' }
      )

      // Countdown timer
      .fromTo(countdownTimer.value, 
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }, '-=0.5'
      )

      // Country display
      if (countryDisplay.value) {
        tl.fromTo(countryDisplay.value, 
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3'
        )
      }

      // Greeting card
      tl.fromTo(greetingCard.value, 
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.8'
      )

      // Wait then start typing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Type hello text
      await typeText(helloText.value, t('wedding.hello'), 150)
      
      // Show guest name
      gsap.fromTo(guestName.value, 
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      )

      // Show invitation text
      gsap.fromTo(invitationText.value, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
      )

      // Type location
      await new Promise(resolve => setTimeout(resolve, 1500))
      await typeText(locationText.value, t('wedding.location'), 100)

      // Show action buttons
      gsap.fromTo(luxuryActions.value, 
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.3, ease: 'back.out(1.7)' }
      )
    }

    // Accept invitation
    const acceptInvitation = async () => {
      if (guest.value.invitation_status?.status_name === 'accepted') {
        showQuestionsModal()
        return
      }

      try {
        triggerCelebration()

        await updateGuestStatus(inviteGuid, 'accepted')
        await trackActivity(guest.value.id, 'status_change', 0, { 
          status: 'accepted',
          timestamp: new Date().toISOString()
        })

        guest.value.invitation_status = { status_name: 'accepted' }
        showAcceptedText.value = true

        gsap.to(luxuryActions.value, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.in',
          onComplete: () => {
            gsap.fromTo(acceptedContent.value, 
              { opacity: 0, y: 20, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
            )
          }
        })

      } catch (err) {
        console.error('Error accepting invitation:', err)
      }
    }

    // Decline invitation
    const declineInvitation = async () => {
      try {
        await updateGuestStatus(inviteGuid, 'rejected')
        await trackActivity(guest.value.id, 'status_change', 0, { 
          status: 'rejected',
          timestamp: new Date().toISOString()
        })

        guest.value.invitation_status = { status_name: 'rejected' }

        gsap.to(luxuryActions.value, {
          opacity: 0.6,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out'
        })

      } catch (err) {
        console.error('Error declining invitation:', err)
      }
    }

    // Show questions modal
    const showQuestionsModal = () => {
      showQuestions.value = true
      
      nextTick(() => {
        gsap.fromTo(questionsModal.value, 
          { scale: 0, opacity: 0, rotationY: 180, y: 50 },
          { scale: 1, opacity: 1, rotationY: 0, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
        )
      })
    }

    // Close modal
    const closeModal = () => {
      gsap.to(questionsModal.value, {
        scale: 0,
        opacity: 0,
        rotationY: -180,
        y: -50,
        duration: 0.6,
        ease: 'power3.in',
        onComplete: () => {
          showQuestions.value = false
        }
      })
    }

    // Validate form
    const validateForm = () => {
      formErrors.value = {}
      
      if (!formData.value.daysInVietnam || formData.value.daysInVietnam < 1) {
        formErrors.value.daysInVietnam = t('wedding.errors.min_days')
      }
      
      if (!formData.value.flightTicketDate) {
        formErrors.value.flightTicketDate = t('wedding.errors.required')
      }
      
      if (formData.value.daysBeforeWedding === null || formData.value.daysBeforeWedding < 0) {
        formErrors.value.daysBeforeWedding = t('wedding.errors.required')
      }

      return Object.keys(formErrors.value).length === 0
    }

    // Submit questions
    const submitQuestions = async () => {
      if (!validateForm()) return

      try {
        submitting.value = true
        
        await submitGuestResponse(guest.value.id, formData.value)
        await trackActivity(guest.value.id, 'form_submit', 0, { 
          form_data: formData.value,
          timestamp: new Date().toISOString()
        })

        showQuestions.value = false
        showAcceptedText.value = false
        showThankYou.value = true

        await nextTick()
        
        gsap.fromTo(thankYouContent.value, 
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
        )

        gsap.fromTo(luxuryLinks.value, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
        )

      } catch (err) {
        console.error('Error submitting questions:', err)
      } finally {
        submitting.value = false
      }
    }

    // Reveal address
    const revealAddress = async () => {
      showAddress.value = true
      
      await trackActivity(guest.value.id, 'address_reveal', 0, { 
        timestamp: new Date().toISOString()
      })

      await nextTick()
      
      venueCard.value.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })

      gsap.fromTo(venueCard.value, 
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
      )
    }

    // Show flight info
    const showFlightInfo = () => {
      alert('Flight information feature coming soon!')
    }

    // Track session duration
    const trackSessionDuration = async () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.value) / 1000)
      if (guest.value) {
        await trackActivity(guest.value.id, 'page_visit', sessionDuration, { 
          session_end: new Date().toISOString()
        })
      }
    }

    let countdownInterval

    onMounted(() => {
      loadGuestInvitation()
      updateCountdown()
      countdownInterval = setInterval(updateCountdown, 1000)
      window.addEventListener('beforeunload', trackSessionDuration)
    })

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      window.removeEventListener('beforeunload', trackSessionDuration)
      trackSessionDuration()
    })

    return {
      // Refs
      invitationContainer,
      headerCard,
      greetingCard,
      luxuryTitle,
      dateContainer,
      countdownTimer,
      helloContainer,
      helloText,
      guestName,
      invitationText,
      locationContainer,
      locationText,
      luxuryActions,
      acceptedContent,
      thankYouContent,
      luxuryLinks,
      venueCard,
      questionsModal,
      countryDisplay,
      celebrationCanvas,
      
      // State
      loading,
      error,
      guest,
      showQuestions,
      showAcceptedText,
      showThankYou,
      showAddress,
      submitting,
      countdown,
      formData,
      formErrors,
      
      // Methods
      acceptInvitation,
      declineInvitation,
      showQuestionsModal,
      closeModal,
      submitQuestions,
      revealAddress,
      showFlightInfo,
      getFlagUrl,
      getCountryName,
      
      // Composables
      t
    }
  }
}
</script>

<style scoped>
/* Import Luxury Wedding Fonts */
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');

/* Wedding Color Palette */
:root {
  --ivory-crepe: #FFFFF8;
  --spring-poppy: #FCB2A9;
  --english-peal: #B0D5C0;
  --nimble: #989CA0;
  --gold-accent: #D4AF37;
  --rose-gold: #E8B4B8;
}

.luxury-wedding-invitation {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--ivory-crepe) 0%, 
    rgba(255, 255, 248, 0.95) 25%,
    rgba(176, 213, 192, 0.1) 50%,
    rgba(252, 178, 169, 0.1) 75%,
    var(--ivory-crepe) 100%
  );
  position: relative;
  overflow-x: hidden;
  font-family: 'Playfair Display', serif;
}

/* Animated Background Canvas */
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* Watercolor Floral Accents */
.watercolor-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.watercolor-bloom {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(40px);
  animation: watercolorFloat 12s ease-in-out infinite;
}

.watercolor-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--spring-poppy), transparent 70%);
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.watercolor-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--english-peal), transparent 70%);
  top: 60%;
  right: -5%;
  animation-delay: -4s;
}

.watercolor-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--rose-gold), transparent 70%);
  bottom: 20%;
  left: 10%;
  animation-delay: -8s;
}

.watercolor-4 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, var(--gold-accent), transparent 70%);
  top: 30%;
  right: 20%;
  animation-delay: -2s;
}

@keyframes watercolorFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-20px) rotate(5deg) scale(1.1); }
  50% { transform: translateY(-10px) rotate(-3deg) scale(0.9); }
  75% { transform: translateY(-25px) rotate(7deg) scale(1.05); }
}

/* Animated Lotus Flowers */
.lotus-garden {
  position: absolute;
  width: 100%;
  height: 100%;
}

.lotus-flower {
  position: absolute;
  width: 60px;
  height: 60px;
  animation: lotusBloom 8s ease-in-out infinite;
}

.lotus-1 {
  top: 15%;
  right: 10%;
  animation-delay: 0s;
}

.lotus-2 {
  bottom: 25%;
  left: 15%;
  animation-delay: -3s;
}

.lotus-3 {
  top: 45%;
  left: 5%;
  animation-delay: -6s;
}

.lotus-petal {
  position: absolute;
  width: 20px;
  height: 30px;
  background: linear-gradient(135deg, var(--spring-poppy), var(--rose-gold));
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0.6;
  transform-origin: 50% 100%;
}

.lotus-petal.petal-1 { transform: rotate(0deg) translateY(-15px); }
.lotus-petal.petal-2 { transform: rotate(72deg) translateY(-15px); }
.lotus-petal.petal-3 { transform: rotate(144deg) translateY(-15px); }
.lotus-petal.petal-4 { transform: rotate(216deg) translateY(-15px); }
.lotus-petal.petal-5 { transform: rotate(288deg) translateY(-15px); }

.lotus-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: var(--gold-accent);
  border-radius: 50%;
  opacity: 0.8;
}

@keyframes lotusBloom {
  0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

/* Animated Rice Paddies */
.rice-paddies {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  opacity: 0.3;
}

.rice-terrace {
  position: absolute;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.terrace-1 { bottom: 0; }
.terrace-2 { bottom: 40px; }
.terrace-3 { bottom: 80px; }

.rice-plant {
  width: 3px;
  height: 25px;
  background: linear-gradient(to top, var(--english-peal), #7fb069);
  border-radius: 2px;
  animation: riceWave 3s ease-in-out infinite;
  transform-origin: bottom;
}

@keyframes riceWave {
  0%, 100% { transform: rotate(0deg) scaleY(1); }
  25% { transform: rotate(2deg) scaleY(1.1); }
  50% { transform: rotate(-1deg) scaleY(0.9); }
  75% { transform: rotate(3deg) scaleY(1.05); }
}

/* Luxury Loading State */
.luxury-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  z-index: 10;
  position: relative;
}

.loading-lotus {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
}

.loading-petal {
  position: absolute;
  width: 20px;
  height: 30px;
  background: linear-gradient(135deg, var(--spring-poppy), var(--rose-gold));
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform-origin: 50% 100%;
  animation: petalSpin 2s linear infinite;
}

.loading-petal:nth-child(1) { transform: rotate(0deg) translateY(-25px); animation-delay: 0s; }
.loading-petal:nth-child(2) { transform: rotate(45deg) translateY(-25px); animation-delay: 0.25s; }
.loading-petal:nth-child(3) { transform: rotate(90deg) translateY(-25px); animation-delay: 0.5s; }
.loading-petal:nth-child(4) { transform: rotate(135deg) translateY(-25px); animation-delay: 0.75s; }
.loading-petal:nth-child(5) { transform: rotate(180deg) translateY(-25px); animation-delay: 1s; }
.loading-petal:nth-child(6) { transform: rotate(225deg) translateY(-25px); animation-delay: 1.25s; }
.loading-petal:nth-child(7) { transform: rotate(270deg) translateY(-25px); animation-delay: 1.5s; }
.loading-petal:nth-child(8) { transform: rotate(315deg) translateY(-25px); animation-delay: 1.75s; }

@keyframes petalSpin {
  0% { opacity: 1; transform: rotate(var(--rotation)) translateY(-25px) scale(1); }
  50% { opacity: 0.3; transform: rotate(var(--rotation)) translateY(-25px) scale(1.2); }
  100% { opacity: 1; transform: rotate(var(--rotation)) translateY(-25px) scale(1); }
}

.loading-text {
  color: var(--nimble);
  font-size: 1.2rem;
  font-weight: 300;
  font-family: 'Cormorant Garamond', serif;
}

/* Luxury Error State */
.luxury-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  z-index: 10;
  position: relative;
  padding: 2rem;
}

.error-lotus {
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.error-title {
  font-family: 'Great Vibes', cursive;
  font-size: 3.5rem;
  color: var(--spring-poppy);
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-description {
  color: var(--nimble);
  font-size: 1.2rem;
  max-width: 500px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
}

/* Main Invitation Content */
.invitation-content {
  position: relative;
  z-index: 5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 3rem;
}

/* Glassmorphism Header Card */
.glass-header-card {
  background: rgba(255, 255, 248, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.glass-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.luxury-ornament {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.ornament-svg {
  width: 120px;
  height: 20px;
  color: var(--gold-accent);
  opacity: 0.7;
}

.luxury-title {
  font-family: 'Great Vibes', cursive;
  font-size: 4.5rem;
  color: var(--spring-poppy);
  margin: 1rem 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.date-container {
  margin-top: 2rem;
}

.luxury-date {
  font-family: 'Dancing Script', cursive;
  font-size: 1.8rem;
  color: var(--nimble);
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 2rem;
}

/* Live Countdown Timer */
.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.countdown-segment {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(252, 178, 169, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 178, 169, 0.3);
  border-radius: 15px;
  padding: 1rem 0.75rem;
  min-width: 70px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.countdown-number {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--spring-poppy);
  line-height: 1;
}

.countdown-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  color: var(--nimble);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
}

.countdown-separator {
  font-size: 1.5rem;
  color: var(--gold-accent);
  font-weight: bold;
}

/* Glassmorphism Greeting Card */
.glass-greeting-card {
  background: rgba(255, 255, 248, 0.2);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  padding: 3rem;
  max-width: 700px;
  width: 100%;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

.greeting-content {
  text-align: center;
}

/* Country Flag Display */
.country-display {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.flag-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.country-flag {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.country-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--nimble);
  letter-spacing: 0.5px;
}

/* Luxury Greeting */
.luxury-greeting {
  margin-bottom: 3rem;
}

.hello-container {
  margin-bottom: 2rem;
  font-size: 3rem;
  font-family: 'Dancing Script', cursive;
  font-weight: 700;
  line-height: 1.2;
}

.hello-text {
  color: var(--spring-poppy);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.guest-name {
  color: var(--nimble);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.invitation-text {
  font-size: 1.4rem;
  color: var(--english-peal);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-weight: 400;
  font-family: 'Cormorant Garamond', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.location-container {
  font-size: 2.2rem;
  font-family: 'Dancing Script', cursive;
  font-weight: 700;
  color: var(--spring-poppy);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Luxury Action Buttons */
.luxury-actions {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.luxury-btn {
  position: relative;
  padding: 1.25rem 3rem;
  border: none;
  border-radius: 50px;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(15px);
  border: 2px solid transparent;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.luxury-btn:hover .btn-shimmer {
  left: 100%;
}

.accept-btn {
  background: linear-gradient(135deg, var(--spring-poppy) 0%, var(--rose-gold) 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.accept-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(252, 178, 169, 0.4);
  background: linear-gradient(135deg, #ff9a8b 0%, #ffa8a8 100%);
}

.decline-btn {
  background: linear-gradient(135deg, var(--nimble) 0%, #7a7e82 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.decline-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(152, 156, 160, 0.4);
}

.curiosity-btn {
  background: linear-gradient(135deg, var(--english-peal) 0%, #9bc5a8 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  margin-top: 2rem;
}

.curiosity-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(176, 213, 192, 0.4);
}

.answered-btn {
  background: linear-gradient(135deg, var(--gold-accent) 0%, #e6c547 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  margin-top: 2rem;
  cursor: not-allowed;
  opacity: 0.8;
}

.submit-btn {
  background: linear-gradient(135deg, var(--spring-poppy) 0%, var(--rose-gold) 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  width: 100%;
  margin-top: 2rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(252, 178, 169, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Post-Acceptance Content */
.accepted-content,
.thank-you-content {
  text-align: center;
  margin-top: 2rem;
}

.celebration-message,
.gratitude-message {
  margin-bottom: 2rem;
}

.celebration-message p,
.gratitude-message p {
  font-size: 1.3rem;
  color: var(--english-peal);
  line-height: 1.7;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
}

/* Luxury Links */
.luxury-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
  align-items: center;
}

.luxury-link-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(176, 213, 192, 0.4);
  border-radius: 50px;
  padding: 1rem 2rem;
  color: var(--nimble);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.4s ease;
  cursor: pointer;
  font-family: 'Playfair Display', serif;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.luxury-link-btn:hover {
  background: var(--english-peal);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(176, 213, 192, 0.3);
  border-color: var(--english-peal);
}

.link-icon {
  font-size: 1.1rem;
}

.flying-from {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
  font-style: italic;
}

/* Glassmorphism Venue Card */
.glass-venue-card {
  background: rgba(255, 255, 248, 0.2);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.venue-title {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5rem;
  color: var(--spring-poppy);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.venue-location {
  font-size: 1.2rem;
  color: var(--nimble);
  margin-bottom: 2rem;
  font-family: 'Cormorant Garamond', serif;
}

.venue-map {
  background: rgba(176, 213, 192, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(176, 213, 192, 0.3);
  border-radius: 20px;
  padding: 2rem;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.map-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.map-placeholder p {
  color: var(--nimble);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
}

/* Luxury Questions Modal */
.luxury-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.luxury-questions-modal {
  background: rgba(255, 255, 248, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 3rem;
  max-width: 550px;
  width: 100%;
  position: relative;
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  max-height: 90vh;
  overflow-y: auto;
}

.luxury-modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(252, 178, 169, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 178, 169, 0.3);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--spring-poppy);
}

.luxury-modal-close:hover {
  background: var(--spring-poppy);
  color: white;
  transform: scale(1.1);
}

.modal-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.modal-ornament {
  margin-bottom: 1rem;
}

.modal-title {
  font-family: 'Dancing Script', cursive;
  font-size: 2.2rem;
  color: var(--spring-poppy);
  font-weight: 700;
  margin: 0;
}

/* Luxury Form */
.luxury-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.luxury-label {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: var(--nimble);
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.luxury-input-container {
  position: relative;
}

.luxury-input,
.luxury-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(176, 213, 192, 0.3);
  border-radius: 15px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: var(--nimble);
}

.luxury-input:focus,
.luxury-textarea:focus {
  outline: none;
  border-color: var(--spring-poppy);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 4px rgba(252, 178, 169, 0.1);
}

.luxury-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: 'Cormorant Garamond', serif;
}

.input-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--spring-poppy);
  transition: width 0.3s ease;
}

.luxury-input:focus + .input-accent,
.luxury-textarea:focus + .input-accent {
  width: 100%;
}

.luxury-error {
  color: var(--spring-poppy);
  font-size: 0.9rem;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
}

/* Celebration Canvas */
.celebration-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .luxury-wedding-invitation {
    padding: 1rem;
  }

  .luxury-title {
    font-size: 3rem;
  }

  .luxury-date {
    font-size: 1.4rem;
  }

  .countdown-timer {
    gap: 0.5rem;
  }

  .countdown-segment {
    padding: 0.75rem 0.5rem;
    min-width: 60px;
  }

  .countdown-number {
    font-size: 1.5rem;
  }

  .countdown-label {
    font-size: 0.8rem;
  }

  .hello-container {
    font-size: 2.2rem;
  }

  .invitation-text {
    font-size: 1.2rem;
  }

  .location-container {
    font-size: 1.8rem;
  }

  .luxury-actions {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .luxury-btn {
    width: 100%;
    max-width: 300px;
    padding: 1rem 2rem;
  }

  .glass-header-card,
  .glass-greeting-card,
  .glass-venue-card {
    padding: 2rem 1.5rem;
  }

  .luxury-questions-modal {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .modal-title {
    font-size: 1.8rem;
  }

  .luxury-links {
    width: 100%;
  }

  .luxury-link-btn {
    width: 100%;
    max-width: 350px;
    text-align: center;
    justify-content: center;
  }

  .watercolor-bloom {
    filter: blur(30px);
  }

  .lotus-flower {
    width: 40px;
    height: 40px;
  }

  .rice-paddies {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .luxury-title {
    font-size: 2.5rem;
  }

  .hello-container {
    font-size: 1.8rem;
  }

  .invitation-text {
    font-size: 1.1rem;
  }

  .location-container {
    font-size: 1.5rem;
  }

  .countdown-timer {
    flex-wrap: wrap;
    justify-content: center;
  }

  .countdown-segment {
    flex: 1;
    min-width: 50px;
  }

  .glass-header-card,
  .glass-greeting-card,
  .glass-venue-card {
    padding: 1.5rem 1rem;
  }

  .luxury-questions-modal {
    padding: 1.5rem 1rem;
  }

  .venue-title {
    font-size: 2rem;
  }

  .country-flag {
    width: 28px;
    height: 21px;
  }

  .country-name {
    font-size: 1rem;
  }
}

/* Print Styles */
@media print {
  .luxury-wedding-invitation {
    background: white;
  }
  
  .background-canvas,
  .celebration-canvas {
    display: none;
  }
  
  .glass-header-card,
  .glass-greeting-card,
  .glass-venue-card {
    background: white;
    border: 2px solid var(--spring-poppy);
    box-shadow: none;
  }
}
</style>