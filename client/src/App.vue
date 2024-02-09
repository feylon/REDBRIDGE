<script setup>
import ToastHost from '@/components/ui/ToastHost.vue';
import ConfirmHost from '@/components/ui/ConfirmHost.vue';
</script>

<template>
  <RouterView />
  <ToastHost />
  <ConfirmHost />
</template>
