<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { scoresApi } from '@/api';
import { useToastStore } from '@/stores/toast';
import { formatDate, shortName, toInputDate } from '@/utils/format';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import ScorePill from '@/components/ui/ScorePill.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import AppIcon from '@/components/ui/AppIcon.vue';

const props = defineProps({
  student: { type: Object, default: null },
  subject: { type: Object, default: null },
});

const emit = defineEmits(['changed']);
const open = defineModel('open', { type: Boolean, default: false });
const toast = useToastStore();

const scores = ref([]);
const loading = ref(false);
const saving = ref(false);
const form = reactive({ value: 5, date: toInputDate(new Date()), comment: '' });
const values = [5, 4, 3, 2];

const average = computed(() => {
  if (!scores.value.length) return null;
  return scores.value.reduce((sum, item) => sum + item.value, 0) / scores.value.length;
});

const title = computed(() => (props.student ? shortName(props.student) : ''));

async function load() {
  if (!props.student || !props.subject) return;
  loading.value = true;
  try {
    scores.value = await scoresApi.list({ student: props.student.id, subject: props.subject.id });
  } catch (err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

watch(open, (value) => {
  if (!value) return;
  form.value = 5;
  form.date = toInputDate(new Date());
  form.comment = '';
  load();
});

async function add() {
  saving.value = true;
  try {
    const score = await scoresApi.create({
      student: props.student.id,
      subject: props.subject.id,
      value: form.value,
      date: new Date(form.date).toISOString(),
      comment: form.comment,
    });
    scores.value = [score, ...scores.value].sort((a, b) => new Date(b.date) - new Date(a.date));
    form.comment = '';
    emit('changed');
    toast.success("Baho qo'yildi");
  } catch (err) {
    toast.error(err.message);
  } finally {
    saving.value = false;
  }
}

async function remove(score) {
  try {
    await scoresApi.remove(score.id);
    scores.value = scores.value.filter((item) => item.id !== score.id);
    emit('changed');
  } catch (err) {
    toast.error(err.message);
  }
}
</script>

<template>
  <BaseModal v-model:open="open" :title="title" :subtitle="subject?.name" width="560px">
    <form class="add" @submit.prevent="add">
      <div class="values" role="radiogroup" aria-label="Baho">
        <button
          v-for="value in values"
          :key="value"
          type="button"
          class="value"
          :class="[`v${value}`, { active: form.value === value }]"
          role="radio"
          :aria-checked="form.value === value"
          @click="form.value = value"
        >
          {{ value }}
        </button>
      </div>
      <div class="add-row">
        <BaseInput v-model="form.date" type="date" icon="calendar" aria-label="Sana" />
        <BaseInput v-model="form.comment" placeholder="Izoh (ixtiyoriy)" maxlength="200" />
        <BaseButton type="submit" icon="plus" :loading="saving">Qo'yish</BaseButton>
      </div>
    </form>

    <div class="history-head">
      <h4>Baholar tarixi</h4>
      <span class="muted">O'rtacha: <ScorePill :value="average" /></span>
    </div>

    <div v-if="loading" class="center"><BaseSpinner /></div>
    <p v-else-if="!scores.length" class="center muted">Bu fandan hali baho qo'yilmagan</p>
    <TransitionGroup v-else tag="ul" name="fade" class="history">
      <li v-for="score in scores" :key="score.id">
        <ScorePill :value="score.value" :label="score.value" />
        <div class="meta">
          <strong>{{ formatDate(score.date) }}</strong>
          <small v-if="score.comment" class="muted">{{ score.comment }}</small>
        </div>
        <button type="button" class="remove" title="O'chirish" @click="remove(score)">
          <AppIcon name="trash" :size="16" />
        </button>
      </li>
    </TransitionGroup>
  </BaseModal>
</template>

<style lang="scss" scoped>
.add {
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: var(--radius);
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.values {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.value {
  height: 48px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--muted);
  transition: all 0.15s;

  &:hover {
    border-color: var(--tone);
    color: var(--tone);
  }

  &.active {
    border-color: var(--tone);
    background: var(--tone);
    color: #fff;
    box-shadow: 0 8px 18px -10px var(--tone);
  }

  &.v5 {
    --tone: var(--success);
  }

  &.v4 {
    --tone: var(--info);
  }

  &.v3 {
    --tone: #f59e0b;
  }

  &.v2 {
    --tone: var(--danger);
  }
}

.add-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: 8px;
  align-items: end;

  @include down($bp-sm) {
    grid-template-columns: 1fr;
  }
}

.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px 0 10px;

  h4 {
    font-size: 15px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.center {
  display: grid;
  place-items: center;
  padding: 24px;
  color: var(--primary);
}

.history {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
  }
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.remove {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--subtle);

  &:hover {
    background: var(--danger-50);
    color: var(--danger);
  }
}
</style>
