<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow pb-24"> <!-- Added padding-bottom here -->
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Additional styles if needed */
</style>
