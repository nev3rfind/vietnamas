<template>
  <div class="wedding-invite">
    <!-- Hero Section -->
    <section 
      class="hero-section min-h-screen flex items-center justify-center px-6 py-12 relative bg-cover bg-center"
      :style="heroBackgroundStyle"
    >
      <!-- Paper texture overlay -->
      <div class="absolute inset-0 bg-paper-texture opacity-30"></div>
      
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <!-- Main Title -->
        <h1 
          ref="mainTitle"
          class="text-5xl sm:text-7xl lg:text-9xl font-script text-spring-poppy text-shadow-sm mb-6"
          role="banner"
        >
          {{ $t('wedding.title') }}
        </h1>

        <!-- Date Subheading -->
        <p 
          ref="dateSubheading"
          class="text-xl sm:text-2xl font-serif text-nimble mb-8 tracking-wide"
        >
          {{ $t('wedding.date') }}
        </p>

        <!-- Animated Greeting -->
        <div 
          ref="greetingContainer"
          class="mb-12"
          role="region"
          aria-live="polite"
          aria-label="Personal greeting"
        >
          <div class="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4">
            <span 
              ref="animatedGreeting"
              class="text-spring-poppy"
            ></span>
            <span 
              ref="guestName"
              class="text-ivory-crepe opacity-0"
              v-if="guest"
            >
              , {{ guest.guest_call }}
            </span>
          </div>
          
          <!-- Invitation Text -->
          <p 
            ref="invitationText"
            class="text-lg sm:text-xl lg:text-2xl font-serif text-english-pear max-w-3xl mx-auto leading-relaxed opacity-0"
          >
            {{ $t('wedding.invitation_text') }}
          </p>
          
          <!-- Location with typing animation -->
          <div 
            ref="locationContainer"
            class="text-2xl sm:text-3xl lg:text-4xl font-script text-spring-poppy mt-6 opacity-0"
          >
            <span ref="animatedLocation"></span>
          </div>
        </div>

        <!-- RSVP Component -->
        <div ref="rsvpContainer" class="mb-12 opacity-0">
          <RsvpPrimary
            ref="rsvpComponent"
            @status-change="handleStatusChange"
            @open-questions="openQuestionsModal"
            @reveal-venue="revealVenue"
          />
        </div>
      </div>

      <!-- Countdown Timer (overlapping bottom of hero) -->
      <div class="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20">
        <CountdownTimer :target-date="weddingDate" />
      </div>
    </section>

    <!-- Thank You Section (shown after questions answered) -->
    <section 
      v-if="showThankYou"
      ref="thankYouSection"
      class="py-16 px-6 bg-ivory-crepe"
    >
      <div class="max-w-3xl mx-auto text-center">
        <p 
          ref="thankYouText"
          class="text-xl sm:text-2xl font-serif text-english-pear leading-relaxed"
          role="status"
          aria-live="polite"
        >
          {{ $t('wedding.thank_you_text') }}
        </p>
        
        <!-- Additional Links -->
        <div class="mt-8 space-y-4">
          <router-link 
            :to="`/home/${guest?.invite_guid}`"
            class="inline-block text-spring-poppy hover:text-nimble font-serif text-lg underline transition-colors duration-300"
          >
            {{ $t('wedding.links.explore_vietnam') }}
          </router-link>
          
          <div v-if="guest?.countries">
            <a 
              href="#"
              @click.prevent="showFlightInfo"
              class="block text-spring-poppy hover:text-nimble font-serif text-lg underline transition-colors duration-300"
            >
              {{ $t('wedding.links.flight_tickets') }}
              <span class="block text-sm text-nimble mt-1">
                {{ $t('wedding.links.flying_from') }} {{ getCountryName(guest.countries) }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Venue Section (revealed after clicking reveal button) -->
    <section 
      v-if="showVenue"
      ref="venueSection"
      class="py-16 px-6 bg-english-pear bg-opacity-20"
    >
      <div class="max-w-2xl mx-auto text-center">
        <h3 class="text-3xl sm:text-4xl font-script text-spring-poppy mb-6">
          {{ $t('wedding.venue.title') }}
        </h3>
        <div class="bg-ivory-crepe rounded-xl-soft shadow-lg p-8">
          <p class="text-lg font-serif text-nimble mb-4">
            {{ $t('wedding.venue.address') }}
          </p>
          <p class="text-base text-nimble">
            {{ $t('wedding.venue.location') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-6 bg-ivory-crepe border-t border-english-pear border-opacity-30">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-sm text-nimble font-serif">
          {{ $t('wedding.footer.dedicated', { name: guest?.guest_full_name || '' }) }}
        </p>
      </div>
    </footer>

    <!-- Questions Modal -->
    <QuestionsModal
      :is-open="showQuestionsModal"
      @close="closeQuestionsModal"
      @submit="handleQuestionsSubmit"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import confetti from 'canvas-confetti'
import RsvpPrimary from '../components/RsvpPrimary.vue'
import QuestionsModal from '../components/QuestionsModal.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import { useDatabase } from '../composables/useDatabase'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

export default {
  name: 'WeddingInvite',
  components: {
    RsvpPrimary,
    QuestionsModal,
    CountdownTimer
  },
  setup() {
    const route = useRoute()
    const { t, locale } = useI18n()
    const { getGuestInvitation, updateGuestStatus, submitGuestResponse, trackActivity } = useDatabase()

    // Refs
    const mainTitle = ref(null)
    const dateSubheading = ref(null)
    const greetingContainer = ref(null)
    const animatedGreeting = ref(null)
    const guestName = ref(null)
    const invitationText = ref(null)
    const locationContainer = ref(null)
    const animatedLocation = ref(null)
    const rsvpContainer = ref(null)
    const rsvpComponent = ref(null)
    const thankYouSection = ref(null)
    const thankYouText = ref(null)
    const venueSection = ref(null)

    // State
    const guest = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const showQuestionsModal = ref(false)
    const showThankYou = ref(false)
    const showVenue = ref(false)
    const weddingDate = ref('2025-04-05T17:00:00Z')

    // Computed
    const heroBackgroundStyle = computed(() => ({
      backgroundImage: `
        linear-gradient(to bottom, rgba(255,255,248,0.95), rgba(176,213,192,0.6)),
        url('/assets/hero-background-watercolor.png')
      `,
      backgroundPosition: window.innerWidth >= 768 ? '40% 30%' : '50% 70%',
      backgroundSize: 'cover'
    }))

    const inviteGuid = route.params.invite_guid

    // Methods
    const loadGuestData = async () => {
      try {
        loading.value = true
        const { data, error: fetchError } = await getGuestInvitation(inviteGuid)
        
        if (fetchError || !data) {
          error.value = 'Guest not found'
          return
        }

        guest.value = data
        locale.value = data.guest_language?.toLowerCase() || 'en'

        // Check if already answered questions
        if (data.guest_responses) {
          showThankYou.value = true
          if (rsvpComponent.value) {
            rsvpComponent.value.markAsAnswered()
          }
        }

        // Track page visit
        await trackActivity(data.id, 'page_visit', 0, {
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })

      } catch (err) {
        console.error('Error loading guest data:', err)
        error.value = 'Failed to load invitation'
      } finally {
        loading.value = false
      }
    }

    const animateEntrance = async () => {
      await nextTick()

      const tl = gsap.timeline()

      // Animate title
      tl.fromTo(mainTitle.value, 
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
      )

      // Animate date
      .fromTo(dateSubheading.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6'
      )

      // Wait then start greeting animation
      .call(() => {
        animateGreeting()
      }, null, '+=0.5')

      // Animate RSVP container
      .fromTo(rsvpContainer.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3'
      )
    }

    const animateGreeting = async () => {
      const greetings = ['Hello', 'Xin Chào']
      
      for (let i = 0; i < greetings.length; i++) {
        // Type greeting
        await gsap.to(animatedGreeting.value, {
          duration: 1,
          text: greetings[i],
          ease: 'none'
        })
        
        // Pause
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Backspace (except for last greeting)
        if (i < greetings.length - 1) {
          await gsap.to(animatedGreeting.value, {
            duration: 0.5,
            text: '',
            ease: 'none'
          })
        }
      }

      // Show guest name
      gsap.to(guestName.value, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Show invitation text
      gsap.to(invitationText.value, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      })

      // Animate location typing
      setTimeout(() => {
        gsap.to(locationContainer.value, {
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(animatedLocation.value, {
              duration: 1.5,
              text: t('wedding.location'),
              ease: 'none'
            })
          }
        })
      }, 1500)
    }

    const handleStatusChange = async (status) => {
      if (!guest.value) return

      try {
        await updateGuestStatus(inviteGuid, status)
        await trackActivity(guest.value.id, 'status_change', 0, {
          status,
          timestamp: new Date().toISOString()
        })

        if (status === 'accepted') {
          // Trigger confetti
          triggerCelebration()
          
          // Update hero text
          gsap.to(invitationText.value, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              invitationText.value.textContent = t('wedding.accepted_text')
              gsap.to(invitationText.value, {
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
              })
            }
          })
        }

      } catch (error) {
        console.error('Error updating status:', error)
      }
    }

    const triggerCelebration = () => {
      const duration = 3000
      const animationEnd = Date.now() + duration

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Left side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#FFFFF8', '#FCB2A9', '#B0D5C0', '#989CA0']
        })

        // Right side
        confetti({
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

      // Heart confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          shapes: ['heart'],
          colors: ['#FCB2A9', '#B0D5C0']
        })
      }, 500)
    }

    const openQuestionsModal = () => {
      showQuestionsModal.value = true
    }

    const closeQuestionsModal = () => {
      showQuestionsModal.value = false
    }

    const handleQuestionsSubmit = async (formData) => {
      if (!guest.value) return

      try {
        await submitGuestResponse(guest.value.id, formData)
        await trackActivity(guest.value.id, 'form_submit', 0, {
          form_data: formData,
          timestamp: new Date().toISOString()
        })

        // Mark as answered
        if (rsvpComponent.value) {
          rsvpComponent.value.markAsAnswered()
        }

        // Show thank you section
        showThankYou.value = true

        // Animate thank you section
        await nextTick()
        if (thankYouSection.value) {
          gsap.fromTo(thankYouSection.value,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          )
        }

      } catch (error) {
        console.error('Error submitting questions:', error)
      }
    }

    const revealVenue = async () => {
      showVenue.value = true
      
      await trackActivity(guest.value.id, 'address_reveal', 0, {
        timestamp: new Date().toISOString()
      })

      await nextTick()
      
      if (venueSection.value) {
        venueSection.value.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })

        gsap.fromTo(venueSection.value,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
      }
    }

    const showFlightInfo = () => {
      alert(t('wedding.flight_info_coming_soon'))
    }

    const getCountryName = (country) => {
      if (!country) return ''
      return locale.value === 'lt' ? country.country_name_lt : country.country_name_en
    }

    // Lifecycle
    onMounted(async () => {
      await loadGuestData()
      if (!error.value) {
        animateEntrance()
      }
    })

    return {
      // Refs
      mainTitle,
      dateSubheading,
      greetingContainer,
      animatedGreeting,
      guestName,
      invitationText,
      locationContainer,
      animatedLocation,
      rsvpContainer,
      rsvpComponent,
      thankYouSection,
      thankYouText,
      venueSection,

      // State
      guest,
      loading,
      error,
      showQuestionsModal,
      showThankYou,
      showVenue,
      weddingDate,

      // Computed
      heroBackgroundStyle,

      // Methods
      handleStatusChange,
      openQuestionsModal,
      closeQuestionsModal,
      handleQuestionsSubmit,
      revealVenue,
      showFlightInfo,
      getCountryName,

      // Composables
      t
    }
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.02"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="53" cy="53" r="1"/%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.3;
  pointer-events: none;
}

@media (max-width: 768px) {
  .hero-section {
    background-position: 50% 70% !important;
  }
}

@media (min-width: 769px) {
  .hero-section {
    background-position: 40% 30% !important;
  }
}

/* Ensure text contrast */
.hero-section .text-ivory-crepe {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-section .text-english-pear {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
</style>