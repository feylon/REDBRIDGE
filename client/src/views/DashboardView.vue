<script setup>
import { computed } from 'vue';
import { statsApi } from '@/api';
import { useAsync } from '@/composables/useAsync';
import { useAuthStore } from '@/stores/auth';
import { formatDate, shortName } from '@/utils/format';
import PageHeader from '@/components/ui/PageHeader.vue';
import StatCard from '@/components/ui/StatCard.vue';
import ScorePill from '@/components/ui/ScorePill.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const auth = useAuthStore();
const { data, loading } = useAsync(statsApi.overview, { immediate: true });

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Xayrli tong';
  if (hour < 18) return 'Xayrli kun';
  return 'Xayrli kech';
});

const cards = computed(() => {
  const counts = data.value?.counts || {};
  return [
    { label: "O'quvchilar", value: counts.students ?? 0, icon: 'student', tone: 'primary', to: { name: 'students' }, hint: `${counts.activeStudents ?? 0} tasi faol` },
    { label: "O'qituvchilar", value: counts.teachers ?? 0, icon: 'teacher', tone: 'info', to: { name: 'teachers' } },
    { label: 'Sinflar', value: counts.grades ?? 0, icon: 'school', tone: 'success', to: { name: 'grades' }, hint: `${counts.subjects ?? 0} ta fan` },
    { label: 'Ota-onalar', value: counts.parents ?? 0, icon: 'parent', tone: 'warning', to: { name: 'parents' } },
  ];
});

const distribution = computed(() => {
  const items = data.value?.distribution || [];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return {
    total,
    items: items.map((item) => ({
      ...item,
      percent: total ? Math.round((item.count / total) * 100) : 0,
    })),
  };
});

const tones = { 5: 'excellent', 4: 'good', 3: 'average', 2: 'poor' };
</script>

<template>
  <div>
    <PageHeader :title="`${greeting}, ${auth.user?.firstName || 'admin'}!`" subtitle="Maktabingizdagi bugungi holat bilan tanishing">
      <BaseButton :to="{ name: 'grades' }" icon="journal">Jurnalni ochish</BaseButton>
    </PageHeader>

    <div class="grid stats">
      <template v-if="loading && !data">
        <div v-for="index in 4" :key="index" class="card skeleton-card">
          <SkeletonBlock width="48px" height="48px" radius="14px" />
          <div class="grow">
            <SkeletonBlock width="60%" height="12px" />
            <SkeletonBlock width="40%" height="24px" style="margin-top: 8px" />
          </div>
        </div>
      </template>
      <StatCard v-for="card in cards" v-else :key="card.label" v-bind="card" />
    </div>

    <div class="grid panels">
      <section class="card">
        <header class="card-header">
          <h3>Baholar taqsimoti</h3>
          <span class="badge">So'nggi 30 kun</span>
        </header>
        <div class="card-body">
          <div v-if="distribution.total" class="distribution">
            <div class="total">
              <strong>{{ distribution.total }}</strong>
              <span class="muted">ta baho qo'yilgan</span>
            </div>
            <div class="stack">
              <span
                v-for="item in distribution.items"
                :key="item.value"
                :class="`fill-${tones[item.value]}`"
                :style="{ width: `${item.percent}%` }"
              ></span>
            </div>
            <ul class="legend">
              <li v-for="item in distribution.items" :key="item.value">
                <ScorePill :value="item.value" :label="item.value" />
                <div class="bar">
                  <span :class="`fill-${tones[item.value]}`" :style="{ width: `${item.percent}%` }"></span>
                </div>
                <span class="count">{{ item.count }}</span>
                <span class="percent muted">{{ item.percent }}%</span>
              </li>
            </ul>
          </div>
          <EmptyState v-else-if="!loading" icon="journal" title="Hozircha baholar yo'q" text="Jurnalga baho qo'yilgach, statistika shu yerda ko'rinadi." />
        </div>
      </section>

      <section class="card">
        <header class="card-header">
          <h3>Eng yaxshi sinflar</h3>
          <RouterLink :to="{ name: 'grades' }" class="link">Barchasi</RouterLink>
        </header>
        <ul v-if="data?.topGrades?.length" class="rank">
          <li v-for="(grade, index) in data.topGrades" :key="grade.id">
            <span class="place" :class="{ first: index === 0 }">{{ index + 1 }}</span>
            <RouterLink :to="{ name: 'grade', params: { id: grade.id } }" class="rank-name">
              <strong>{{ grade.name }}</strong>
              <small class="muted">{{ grade.count }} ta baho</small>
            </RouterLink>
            <ScorePill :value="grade.average" :label="grade.average.toFixed(2)" />
          </li>
        </ul>
        <EmptyState v-else-if="!loading" icon="trend" title="Maʼlumot yetarli emas" />
      </section>

      <section class="card wide">
        <header class="card-header">
          <h3>So'nggi baholar</h3>
        </header>
        <div v-if="data?.recentScores?.length" class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>O'quvchi</th>
                <th>Fan</th>
                <th>Sana</th>
                <th class="actions">Baho</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in data.recentScores" :key="score.id">
                <td><strong>{{ shortName(score.student) }}</strong></td>
                <td>{{ score.subject?.name || '—' }}</td>
                <td class="muted nowrap">{{ formatDate(score.date) }}</td>
                <td class="actions"><ScorePill :value="score.value" :label="score.value" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else-if="!loading" icon="clock" title="Hali baholar qo'yilmagan" />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @include down($bp-lg) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include down($bp-sm) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;

  .grow {
    flex: 1;
  }
}

.panels {
  grid-template-columns: 1.4fr 1fr;
  margin-top: 18px;

  .wide {
    grid-column: 1 / -1;
  }

  @include down($bp-md) {
    grid-template-columns: 1fr;
  }
}

.nowrap {
  white-space: nowrap;
}

.link {
  color: var(--primary);
  font-weight: 600;
  font-size: 13px;
}

.total {
  display: flex;
  align-items: baseline;
  gap: 8px;

  strong {
    font-family: var(--font-display);
    font-size: 30px;
  }
}

.stack {
  display: flex;
  height: 12px;
  margin: 14px 0 22px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-2);

  span {
    height: 100%;
    transition: width 0.6s var(--ease);
  }
}

.fill-excellent {
  background: var(--success);
}

.fill-good {
  background: var(--info);
}

.fill-average {
  background: #f59e0b;
}

.fill-poor {
  background: var(--danger);
}

.legend {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: auto 1fr 48px 44px;
    align-items: center;
    gap: 14px;
  }

  .count {
    font-weight: 700;
    text-align: right;
  }

  .percent {
    text-align: right;
    font-size: 13px;
  }
}

.bar {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-2);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
  }
}

.rank {
  margin: 0;
  padding: 8px 12px;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 8px;
    border-bottom: 1px dashed var(--border);

    &:last-child {
      border-bottom: 0;
    }
  }
}

.place {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--surface-2);
  font-weight: 700;
  color: var(--muted);

  &.first {
    background: rgba(215, 181, 109, 0.2);
    color: #a8842f;
  }
}

.rank-name {
  flex: 1;
  display: flex;
  flex-direction: column;

  &:hover strong {
    color: var(--primary);
  }
}
</style>
