<script setup>
defineProps({
  height: { type: String, default: '16px' },
  width: { type: String, default: '100%' },
  radius: { type: String, default: '8px' },
});
</script>

<template>
  <span class="skeleton" :style="{ height, width, borderRadius: radius }"></span>
</template>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(90deg, #edf0f5 0%, #f6f8fb 50%, #edf0f5 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
