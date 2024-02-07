<script setup>
defineProps({
  size: { type: Number, default: 24 },
});
</script>

<template>
  <span class="spinner" :style="{ width: `${size}px`, height: `${size}px` }" role="status">
    <span class="sr-only">Yuklanmoqda</span>
  </span>
</template>

<style scoped>
.spinner {
  display: inline-block;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  opacity: 0.8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
