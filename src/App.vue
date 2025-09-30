<template>
  <div id="app">
    <!-- Conditional navigation based on route meta -->
    <NavBar v-if="!isInviteRoute" />
    
    <!-- Use layout wrapper for invite routes -->
    <InviteLayout v-if="isInviteRoute">
      <router-view />
    </InviteLayout>
    
    <!-- Default layout for other routes -->
    <router-view v-else />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import InviteLayout from './layouts/InviteLayout.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    InviteLayout
  },
  setup() {
    const route = useRoute()
    
    const isInviteRoute = computed(() => {
      return route.meta?.layout === 'invite'
    })
    
    return {
      isInviteRoute
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>