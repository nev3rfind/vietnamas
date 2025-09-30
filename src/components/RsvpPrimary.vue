<template>
  <div class="rsvp-container text-center">
    <!-- Initial State: Two buttons -->
    <div v-if="rsvpState === 'initial'" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        id="rsvp-action-btn"
        @click="handlePrimaryClick"
        class="px-8 py-4 bg-spring-poppy text-ivory-crepe font-serif font-semibold text-lg rounded-xl-soft shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        :aria-label="$t('wedding.buttons.accept')"
      >
        {{ $t('wedding.buttons.accept') }}
      </button>
      
      <button
        ref="secondaryBtn"
        @click="handleSecondaryClick"
        class="px-8 py-4 bg-nimble text-ivory-crepe font-serif font-semibold text-lg rounded-xl-soft shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        :aria-label="$t('wedding.buttons.decline')"
      >
        {{ $t('wedding.buttons.decline') }}
      </button>
    </div>

    <!-- Accepted State: Single button -->
    <div v-else-if="rsvpState === 'accepted'" class="flex justify-center">
      <button
        id="rsvp-action-btn"
        @click="handleCuriosityClick"
        class="px-8 py-4 bg-english-pear text-ivory-crepe font-serif font-semibold text-lg rounded-xl-soft shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        :aria-label="$t('wedding.buttons.curiosity')"
      >
        {{ $t('wedding.buttons.curiosity') }}
      </button>
    </div>

    <!-- Questions Answered State: Disabled button -->
    <div v-else-if="rsvpState === 'answered'" class="flex flex-col items-center gap-4">
      <button
        id="rsvp-action-btn"
        disabled
        class="px-8 py-4 bg-gray-300 text-gray-500 font-serif font-semibold text-lg rounded-xl-soft shadow-lg cursor-not-allowed opacity-75"
        :aria-label="$t('wedding.buttons.answered')"
      >
        {{ $t('wedding.buttons.answered') }}
      </button>
      
      <button
        @click="$emit('reveal-venue')"
        class="text-spring-poppy hover:text-nimble font-serif underline transition-colors duration-300"
      >
        {{ $t('wedding.links.reveal_address') }}
      </button>
    </div>

    <!-- Rejected State: Message -->
    <div v-else-if="rsvpState === 'rejected'" class="text-center">
      <p class="text-spring-poppy font-serif text-xl" role="status" aria-live="polite">
        {{ $t('wedding.rejected_message') }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'RsvpPrimary',
  emits: ['status-change', 'open-questions', 'reveal-venue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const rsvpState = ref('initial') // 'initial', 'accepted', 'answered', 'rejected'
    const secondaryBtn = ref(null)

    const handlePrimaryClick = async () => {
      if (rsvpState.value !== 'initial') return

      // Emit status change
      emit('status-change', 'accepted')

      // Animate secondary button out
      if (secondaryBtn.value) {
        gsap.to(secondaryBtn.value, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      // Wait for animation, then change state
      setTimeout(() => {
        rsvpState.value = 'accepted'
      }, 500)
    }

    const handleSecondaryClick = async () => {
      if (rsvpState.value !== 'initial') return

      // Emit status change
      emit('status-change', 'rejected')

      // Change state to rejected
      rsvpState.value = 'rejected'
    }

    const handleCuriosityClick = () => {
      if (rsvpState.value !== 'accepted') return
      
      // Open questions modal
      emit('open-questions')
    }

    const markAsAnswered = () => {
      rsvpState.value = 'answered'
    }

    return {
      rsvpState,
      secondaryBtn,
      handlePrimaryClick,
      handleSecondaryClick,
      handleCuriosityClick,
      markAsAnswered,
      t
    }
  }
}
</script>