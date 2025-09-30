<template>
  <div class="countdown-container flex justify-center items-center gap-2 sm:gap-4 px-4 py-6">
    <div 
      v-for="(unit, index) in timeUnits" 
      :key="unit.label"
      class="countdown-unit text-center"
    >
      <div class="bg-ivory-crepe rounded-xl-soft shadow-lg px-3 py-4 sm:px-4 sm:py-6 min-w-[60px] sm:min-w-[80px]">
        <div class="text-2xl sm:text-4xl font-bold text-spring-poppy font-serif">
          {{ unit.value.toString().padStart(2, '0') }}
        </div>
        <div class="text-xs sm:text-sm text-nimble font-sans uppercase tracking-wide mt-1">
          {{ unit.label }}
        </div>
      </div>
      
      <!-- Separator colon (except for last item) -->
      <div 
        v-if="index < timeUnits.length - 1" 
        class="text-spring-poppy text-2xl sm:text-4xl font-bold mx-1 sm:mx-2"
      >
        :
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'CountdownTimer',
  props: {
    targetDate: {
      type: String,
      default: '2025-04-05T17:00:00Z' // Default wedding date
    }
  },
  setup(props) {
    const { t } = useI18n()
    const timeUnits = ref([
      { label: t('wedding.countdown.days'), value: 0 },
      { label: t('wedding.countdown.hours'), value: 0 },
      { label: t('wedding.countdown.minutes'), value: 0 },
      { label: t('wedding.countdown.seconds'), value: 0 }
    ])

    let intervalId = null

    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(props.targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        timeUnits.value = [
          { label: t('wedding.countdown.days'), value: days },
          { label: t('wedding.countdown.hours'), value: hours },
          { label: t('wedding.countdown.minutes'), value: minutes },
          { label: t('wedding.countdown.seconds'), value: seconds }
        ]
      } else {
        // Wedding has passed
        timeUnits.value = [
          { label: t('wedding.countdown.days'), value: 0 },
          { label: t('wedding.countdown.hours'), value: 0 },
          { label: t('wedding.countdown.minutes'), value: 0 },
          { label: t('wedding.countdown.seconds'), value: 0 }
        ]
      }
    }

    onMounted(() => {
      updateCountdown()
      
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      if (!prefersReducedMotion) {
        intervalId = setInterval(updateCountdown, 1000)
      }
    })

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return {
      timeUnits
    }
  }
}
</script>