<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    @click="closeModal"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="modalTitleId"
  >
    <div 
      ref="modalCard"
      @click.stop
      class="bg-ivory-crepe rounded-xl-soft shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-english-pear"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3Ccircle cx=\"53\" cy=\"53\" r=\"1\"/%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')"
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 :id="modalTitleId" class="text-2xl font-script text-spring-poppy">
            {{ $t('wedding.form.title') }}
          </h3>
          <button
            @click="closeModal"
            class="text-nimble hover:text-spring-poppy transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Days in Vietnam -->
          <div>
            <label for="days-vietnam" class="block text-sm font-serif font-medium text-nimble mb-2">
              {{ $t('wedding.form.days_vietnam') }}
            </label>
            <input
              id="days-vietnam"
              v-model.number="formData.days_in_vietnam"
              type="number"
              min="1"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl-soft focus:ring-2 focus:ring-spring-poppy focus:border-spring-poppy transition-colors duration-200"
              :class="{ 'border-spring-poppy': errors.days_in_vietnam }"
            />
            <p v-if="errors.days_in_vietnam" class="mt-1 text-sm text-spring-poppy">
              {{ errors.days_in_vietnam }}
            </p>
          </div>

          <!-- Flight Date -->
          <div>
            <label for="flight-date" class="block text-sm font-serif font-medium text-nimble mb-2">
              {{ $t('wedding.form.flight_date') }}
            </label>
            <input
              id="flight-date"
              v-model="formData.flight_ticket_date"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl-soft focus:ring-2 focus:ring-spring-poppy focus:border-spring-poppy transition-colors duration-200"
              :class="{ 'border-spring-poppy': errors.flight_ticket_date }"
            />
            <p v-if="errors.flight_ticket_date" class="mt-1 text-sm text-spring-poppy">
              {{ errors.flight_ticket_date }}
            </p>
          </div>

          <!-- Days Before Wedding -->
          <div>
            <label for="days-before" class="block text-sm font-serif font-medium text-nimble mb-2">
              {{ $t('wedding.form.days_before') }}
            </label>
            <input
              id="days-before"
              v-model.number="formData.days_before_wedding"
              type="number"
              min="0"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl-soft focus:ring-2 focus:ring-spring-poppy focus:border-spring-poppy transition-colors duration-200"
              :class="{ 'border-spring-poppy': errors.days_before_wedding }"
            />
            <p v-if="errors.days_before_wedding" class="mt-1 text-sm text-spring-poppy">
              {{ errors.days_before_wedding }}
            </p>
          </div>

          <!-- Coming With -->
          <div>
            <label for="coming-with" class="block text-sm font-serif font-medium text-nimble mb-2">
              {{ $t('wedding.form.coming_with') }}
            </label>
            <textarea
              id="coming-with"
              v-model="formData.coming_with"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl-soft focus:ring-2 focus:ring-spring-poppy focus:border-spring-poppy transition-colors duration-200 resize-none"
              :placeholder="$t('wedding.form.coming_with_placeholder')"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-3 bg-spring-poppy text-ivory-crepe font-serif font-semibold rounded-xl-soft shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="!isSubmitting">{{ $t('wedding.form.submit') }}</span>
              <span v-else>{{ $t('wedding.form.submitting') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'QuestionsModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const modalCard = ref(null)
    const isSubmitting = ref(false)
    const modalTitleId = 'questions-modal-title'

    const formData = reactive({
      days_in_vietnam: null,
      flight_ticket_date: '',
      days_before_wedding: null,
      coming_with: ''
    })

    const errors = reactive({})

    // Animate modal in when opened
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        nextTick(() => {
          if (modalCard.value) {
            gsap.fromTo(modalCard.value, 
              { scale: 0.8, opacity: 0, y: 50 },
              { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            )
          }
        })
      }
    })

    const validateForm = () => {
      Object.keys(errors).forEach(key => delete errors[key])

      if (!formData.days_in_vietnam || formData.days_in_vietnam < 1) {
        errors.days_in_vietnam = t('wedding.form.errors.days_required')
      }

      if (!formData.flight_ticket_date) {
        errors.flight_ticket_date = t('wedding.form.errors.date_required')
      }

      if (formData.days_before_wedding === null || formData.days_before_wedding < 0) {
        errors.days_before_wedding = t('wedding.form.errors.days_before_required')
      }

      return Object.keys(errors).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return

      isSubmitting.value = true

      try {
        // Emit form data to parent
        emit('submit', { ...formData })
        
        // Close modal after successful submission
        setTimeout(() => {
          closeModal()
        }, 500)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    const closeModal = () => {
      if (modalCard.value) {
        gsap.to(modalCard.value, {
          scale: 0.8,
          opacity: 0,
          y: -50,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            emit('close')
          }
        })
      } else {
        emit('close')
      }
    }

    return {
      modalCard,
      formData,
      errors,
      isSubmitting,
      modalTitleId,
      submitForm,
      closeModal,
      t
    }
  }
}
</script>