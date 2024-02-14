<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <h1>Sahifa topilmadi</h1>
    <p class="muted">Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.</p>
    <BaseButton :to="{ name: 'dashboard' }" icon="arrow-left">Bosh sahifaga qaytish</BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 100vh;
  padding: 24px;
  text-align: center;

  .btn {
    margin-top: 12px;
  }
}

.code {
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--primary), var(--gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
