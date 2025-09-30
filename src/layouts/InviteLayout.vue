<template>
  <div class="invite-layout">
    <!-- No navigation bar for invite pages -->
    <main class="min-h-screen">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'InviteLayout'
}
</script>

<style scoped>
.invite-layout {
  background: var(--ivory-crepe);
  min-height: 100vh;
}
</style>