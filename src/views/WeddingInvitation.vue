<template>
  <div class="wedding-invitation" ref="invitationContainer">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ $t('wedding.errors.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">💔</div>
      <h2 class="error-title">{{ $t('wedding.errors.not_found') }}</h2>
      <p class="error-description">The invitation link you're looking for doesn't exist or has expired.</p>
    </div>

    <!-- Main Invitation -->
    <div v-else-if="guest" class="invitation-content">
      <!-- Background Elements -->
      <div class="background-elements">
        <div class="floral-element floral-1"></div>
        <div class="floral-element floral-2"></div>
        <div class="floral-element floral-3"></div>
        <div class="floral-element floral-4"></div>
      </div>

      <!-- Header Section -->
      <header class="wedding-header" ref="headerSection">
        <h1 class="wedding-title">{{ $t('wedding.title') }}</h1>
        <p class="wedding-date">{{ $t('wedding.date') }}</p>
      </header>

      <!-- Main Greeting Section -->
      <main class="greeting-section" ref="greetingSection">
        <div class="greeting-text">
          <div class="hello-container">
            <span class="hello-text" ref="helloText">{{ $t('wedding.hello') }}</span>
            <span class="guest-name">, {{ guest.guest_call }}</span>
          </div>
          
          <p class="invitation-text" ref="invitationText">
            {{ $t('wedding.invitation_text') }}
          </p>
          
          <div class="location-container">
            <span class="location-text" ref="locationText">{{ $t('wedding.location') }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" ref="actionButtons" v-if="!showQuestions && !showThankYou">
          <button 
            class="wedding-btn accept-btn" 
            @click="acceptInvitation"
            :disabled="guest.invitation_status?.status_name === 'accepted'"
          >
            {{ guest.invitation_status?.status_name === 'accepted' ? $t('wedding.buttons.curiosity') : $t('wedding.buttons.accept') }}
          </button>
          
          <button 
            class="wedding-btn decline-btn" 
            @click="declineInvitation"
            v-if="guest.invitation_status?.status_name !== 'accepted'"
          >
            {{ $t('wedding.buttons.decline') }}
          </button>
        </div>

        <!-- Post-Acceptance Text -->
        <div v-if="showAcceptedText && !showQuestions && !showThankYou" class="accepted-text" ref="acceptedText">
          <p>{{ $t('wedding.accepted_text') }}</p>
          <button class="wedding-btn curiosity-btn" @click="showQuestionsModal">
            {{ $t('wedding.buttons.curiosity') }}
          </button>
        </div>

        <!-- Thank You Text -->
        <div v-if="showThankYou" class="thank-you-text" ref="thankYouText">
          <p>{{ $t('wedding.thank_you_text') }}</p>
          <button class="wedding-btn answered-btn" disabled>
            {{ $t('wedding.buttons.answered') }}
          </button>
        </div>

        <!-- Additional Links -->
        <div v-if="showThankYou" class="additional-links" ref="additionalLinks">
          <button class="link-btn" @click="revealAddress">
            {{ $t('wedding.links.reveal_address') }}
          </button>
          
          <router-link :to="`/home/${guest.invite_guid}`" class="link-btn">
            {{ $t('wedding.links.explore_vietnam') }}
          </router-link>
          
          <a href="#" class="link-btn" @click.prevent="showFlightInfo">
            {{ $t('wedding.links.flight_tickets') }}
            <span v-if="guest.countries" class="flying-from">
              {{ $t('wedding.links.flying_from') }} {{ getCountryName(guest.countries) }}
            </span>
          </a>
        </div>
      </main>

      <!-- Venue Address Section -->
      <section v-if="showAddress" class="venue-address" ref="venueAddress">
        <h3>{{ $t('wedding.venue.address') }}</h3>
        <p>{{ $t('wedding.venue.location') }}</p>
        <div class="map-placeholder">
          <p>🗺️ Interactive map coming soon...</p>
        </div>
      </section>
    </div>

    <!-- Questions Modal -->
    <div v-if="showQuestions" class="modal-overlay" @click="closeModal">
      <div class="questions-modal" @click.stop ref="questionsModal">
        <button class="modal-close" @click="closeModal">×</button>
        
        <h3 class="modal-title">Tell us about your plans!</h3>
        
        <form @submit.prevent="submitQuestions" class="questions-form">
          <div class="form-group">
            <label>{{ $t('wedding.form.days_vietnam') }}</label>
            <input 
              type="number" 
              v-model="formData.daysInVietnam" 
              min="1" 
              required
              class="form-input"
            />
            <span v-if="formErrors.daysInVietnam" class="error-message">{{ formErrors.daysInVietnam }}</span>
          </div>

          <div class="form-group">
            <label>{{ $t('wedding.form.flight_date') }}</label>
            <input 
              type="date" 
              v-model="formData.flightTicketDate" 
              required
              class="form-input"
            />
            <span v-if="formErrors.flightTicketDate" class="error-message">{{ formErrors.flightTicketDate }}</span>
          </div>

          <div class="form-group">
            <label>{{ $t('wedding.form.days_before') }}</label>
            <input 
              type="number" 
              v-model="formData.daysBeforeWedding" 
              min="0" 
              required
              class="form-input"
            />
            <span v-if="formErrors.daysBeforeWedding" class="error-message">{{ formErrors.daysBeforeWedding }}</span>
          </div>

          <div class="form-group">
            <label>{{ $t('wedding.form.coming_with') }}</label>
            <textarea 
              v-model="formData.comingWith" 
              rows="3"
              class="form-textarea"
              placeholder="Family, friends, partner..."
            ></textarea>
          </div>

          <button type="submit" class="wedding-btn submit-btn" :disabled="submitting">
            {{ submitting ? 'Submitting...' : $t('wedding.form.submit') }}
          </button>
        </form>
      </div>
    </div>
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
    const headerSection = ref(null)
    const greetingSection = ref(null)
    const helloText = ref(null)
    const invitationText = ref(null)
    const locationText = ref(null)
    const actionButtons = ref(null)
    const acceptedText = ref(null)
    const thankYouText = ref(null)
    const additionalLinks = ref(null)
    const venueAddress = ref(null)
    const questionsModal = ref(null)

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

    // Form data
    const formData = ref({
      daysInVietnam: null,
      flightTicketDate: '',
      daysBeforeWedding: null,
      comingWith: ''
    })

    const formErrors = ref({})

    const inviteGuid = route.params.guid

    // Typing animation function
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
        
        // Set language based on guest preference
        locale.value = data.guest_language.toLowerCase()
        
        // Check if guest has already responded
        if (data.guest_responses) {
          showThankYou.value = true
        } else if (data.invitation_status?.status_name === 'accepted') {
          showAcceptedText.value = true
        }

        // Track page visit
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

    // Animate entrance
    const animateEntrance = async () => {
      const tl = gsap.timeline()
      
      // Header animation
      tl.fromTo(headerSection.value, 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Wait a bit then start typing animations
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Type "Hello" or "Xin Chào"
      await typeText(helloText.value, t('wedding.hello'), 150)
      
      // Show guest name
      gsap.fromTo('.guest-name', 
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      )

      // Show invitation text
      gsap.fromTo(invitationText.value, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5 }
      )

      // Type location
      await new Promise(resolve => setTimeout(resolve, 1000))
      await typeText(locationText.value, t('wedding.location'), 100)

      // Show action buttons
      gsap.fromTo(actionButtons.value, 
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.3 }
      )
    }

    // Accept invitation
    const acceptInvitation = async () => {
      if (guest.value.invitation_status?.status_name === 'accepted') {
        showQuestionsModal()
        return
      }

      try {
        // Celebration animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        // Update status in database
        await updateGuestStatus(inviteGuid, 'accepted')
        await trackActivity(guest.value.id, 'status_change', 0, { 
          status: 'accepted',
          timestamp: new Date().toISOString()
        })

        // Update local state
        guest.value.invitation_status = { status_name: 'accepted' }
        showAcceptedText.value = true

        // Animate transition
        gsap.to(actionButtons.value, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            gsap.fromTo(acceptedText.value, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8 }
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

        // Update local state
        guest.value.invitation_status = { status_name: 'rejected' }

        // Show sad animation or message
        gsap.to(actionButtons.value, {
          opacity: 0.5,
          scale: 0.9,
          duration: 0.5
        })

        // You could add a "We'll miss you" message here

      } catch (err) {
        console.error('Error declining invitation:', err)
      }
    }

    // Show questions modal
    const showQuestionsModal = () => {
      showQuestions.value = true
      
      nextTick(() => {
        gsap.fromTo(questionsModal.value, 
          { scale: 0, opacity: 0, rotationY: 180 },
          { scale: 1, opacity: 1, rotationY: 0, duration: 0.6, ease: 'back.out(1.7)' }
        )
      })
    }

    // Close modal
    const closeModal = () => {
      gsap.to(questionsModal.value, {
        scale: 0,
        opacity: 0,
        rotationY: -180,
        duration: 0.4,
        ease: 'power2.in',
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

        // Update state
        showQuestions.value = false
        showAcceptedText.value = false
        showThankYou.value = true

        // Animate transition
        await nextTick()
        gsap.fromTo(thankYouText.value, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        )

        gsap.fromTo(additionalLinks.value, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
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
      
      // Scroll to address section
      venueAddress.value.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })

      gsap.fromTo(venueAddress.value, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
    }

    // Show flight info
    const showFlightInfo = () => {
      // This could open a modal or navigate to flight information
      alert('Flight information feature coming soon!')
    }

    // Get country name based on language
    const getCountryName = (country) => {
      if (!country) return ''
      return locale.value === 'lt' ? country.country_name_lt : country.country_name_en
    }

    // Track session duration on page unload
    const trackSessionDuration = async () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.value) / 1000)
      if (guest.value) {
        await trackActivity(guest.value.id, 'page_visit', sessionDuration, { 
          session_end: new Date().toISOString()
        })
      }
    }

    onMounted(() => {
      loadGuestInvitation()
      window.addEventListener('beforeunload', trackSessionDuration)
    })

    onUnmounted(() => {
      window.removeEventListener('beforeunload', trackSessionDuration)
      trackSessionDuration()
    })

    return {
      // Refs
      invitationContainer,
      headerSection,
      greetingSection,
      helloText,
      invitationText,
      locationText,
      actionButtons,
      acceptedText,
      thankYouText,
      additionalLinks,
      venueAddress,
      questionsModal,
      
      // State
      loading,
      error,
      guest,
      showQuestions,
      showAcceptedText,
      showThankYou,
      showAddress,
      submitting,
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
      getCountryName,
      
      // Composables
      t
    }
  }
}
</script>

<style scoped>
/* Wedding Color Palette */
:root {
  --ivory-crepe: #FFFFF8;
  --spring-poppy: #FCB2A9;
  --english-peal: #B0D5C0;
  --nimble: #989CA0;
}

/* Import Wedding Fonts */
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@300;400;500;600;700&display=swap');

.wedding-invitation {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--ivory-crepe) 0%, #f8f9fa 50%, var(--english-peal) 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Playfair Display', serif;
}

/* Background Elements */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floral-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(60px);
}

.floral-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--spring-poppy), transparent);
  top: 10%;
  left: -5%;
  animation: float 8s ease-in-out infinite;
}

.floral-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--english-peal), transparent);
  top: 60%;
  right: -5%;
  animation: float 6s ease-in-out infinite reverse;
}

.floral-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, var(--spring-poppy), transparent);
  bottom: 20%;
  left: 10%;
  animation: float 10s ease-in-out infinite;
}

.floral-4 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--english-peal), transparent);
  top: 30%;
  right: 20%;
  animation: float 7s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  z-index: 10;
  position: relative;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--english-peal);
  border-top: 3px solid var(--spring-poppy);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--nimble);
  font-size: 1.1rem;
  font-weight: 300;
}

/* Error State */
.error-container {
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

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-family: 'Great Vibes', cursive;
  font-size: 3rem;
  color: var(--spring-poppy);
  margin-bottom: 1rem;
}

.error-description {
  color: var(--nimble);
  font-size: 1.1rem;
  max-width: 500px;
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
}

/* Header Section */
.wedding-header {
  text-align: center;
  margin-bottom: 4rem;
  margin-top: 2rem;
}

.wedding-title {
  font-family: 'Great Vibes', cursive;
  font-size: 4rem;
  color: var(--spring-poppy);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.wedding-date {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  color: var(--nimble);
  font-weight: 500;
  letter-spacing: 1px;
}

/* Greeting Section */
.greeting-section {
  max-width: 800px;
  text-align: center;
  margin-bottom: 4rem;
}

.greeting-text {
  margin-bottom: 3rem;
}

.hello-container {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-family: 'Dancing Script', cursive;
  font-weight: 600;
}

.hello-text {
  color: var(--spring-poppy);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.guest-name {
  color: var(--ivory-crepe);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
}

.invitation-text {
  font-size: 1.3rem;
  color: var(--english-peal);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-weight: 400;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.location-container {
  font-size: 2rem;
  font-family: 'Dancing Script', cursive;
  font-weight: 600;
  color: var(--spring-poppy);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.wedding-btn {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.wedding-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.wedding-btn:hover::before {
  left: 100%;
}

.accept-btn {
  background: linear-gradient(135deg, var(--spring-poppy) 0%, #ff9a8b 100%);
  color: white;
}

.accept-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(252, 178, 169, 0.4);
}

.decline-btn {
  background: linear-gradient(135deg, var(--nimble) 0%, #7a7e82 100%);
  color: white;
}

.decline-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(152, 156, 160, 0.4);
}

.curiosity-btn {
  background: linear-gradient(135deg, var(--english-peal) 0%, #9bc5a8 100%);
  color: white;
  margin-top: 1.5rem;
}

.curiosity-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(176, 213, 192, 0.4);
}

.answered-btn {
  background: linear-gradient(135deg, var(--nimble) 0%, #a8acb0 100%);
  color: white;
  margin-top: 1.5rem;
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-btn {
  background: linear-gradient(135deg, var(--spring-poppy) 0%, #ff9a8b 100%);
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(252, 178, 169, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Post-Acceptance Text */
.accepted-text,
.thank-you-text {
  text-align: center;
  margin-top: 2rem;
}

.accepted-text p,
.thank-you-text p {
  font-size: 1.2rem;
  color: var(--english-peal);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Additional Links */
.additional-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  align-items: center;
}

.link-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid var(--english-peal);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  color: var(--nimble);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: 'Playfair Display', serif;
}

.link-btn:hover {
  background: var(--english-peal);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(176, 213, 192, 0.3);
}

.flying-from {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* Venue Address */
.venue-address {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
  border: 1px solid rgba(176, 213, 192, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.venue-address h3 {
  font-family: 'Dancing Script', cursive;
  font-size: 2rem;
  color: var(--spring-poppy);
  margin-bottom: 1rem;
}

.venue-address p {
  font-size: 1.1rem;
  color: var(--nimble);
  margin-bottom: 1.5rem;
}

.map-placeholder {
  background: var(--english-peal);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  font-size: 1.1rem;
}

/* Questions Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.questions-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  border: 1px solid rgba(176, 213, 192, 0.3);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--nimble);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--spring-poppy);
  color: white;
}

.modal-title {
  font-family: 'Dancing Script', cursive;
  font-size: 2rem;
  color: var(--spring-poppy);
  text-align: center;
  margin-bottom: 2rem;
}

/* Form Styles */
.questions-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: var(--nimble);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--english-peal);
  border-radius: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--spring-poppy);
  box-shadow: 0 0 0 3px rgba(252, 178, 169, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: var(--spring-poppy);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .wedding-invitation {
    padding: 1rem;
  }

  .wedding-title {
    font-size: 2.5rem;
  }

  .wedding-date {
    font-size: 1.2rem;
  }

  .hello-container {
    font-size: 2rem;
  }

  .invitation-text {
    font-size: 1.1rem;
  }

  .location-container {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .wedding-btn {
    width: 100%;
    max-width: 300px;
  }

  .questions-modal {
    padding: 2rem;
    margin: 1rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .additional-links {
    width: 100%;
  }

  .link-btn {
    width: 100%;
    max-width: 300px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .wedding-title {
    font-size: 2rem;
  }

  .hello-container {
    font-size: 1.5rem;
  }

  .invitation-text {
    font-size: 1rem;
  }

  .location-container {
    font-size: 1.2rem;
  }

  .questions-modal {
    padding: 1.5rem;
  }

  .venue-address {
    padding: 1.5rem;
  }
}
</style>