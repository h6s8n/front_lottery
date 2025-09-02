<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow pb-24"> <!-- Added padding-bottom here -->
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
// All logic has been moved to the auth.client.js plugin.
// This script block can be removed if it's empty.
</script>

<style scoped>
/* Additional styles if needed */
</style>

