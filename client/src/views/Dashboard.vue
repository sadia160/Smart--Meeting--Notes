<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p class="subtitle">Overview of your meeting activity</p>
      </div>
      <router-link to="/new" class="btn btn-primary">+ New Meeting</router-link>
    </header>

    <div class="quick-actions">
      <router-link to="/new" class="qa card">🆕<span>New Meeting</span></router-link>
      <router-link to="/new?mode=upload" class="qa card">⬆️<span>Upload Audio</span></router-link>
      <router-link to="/new?mode=record" class="qa card">🎙️<span>Record Voice</span></router-link>
      <router-link to="/meetings" class="qa card">📁<span>My Meetings</span></router-link>
    </div>

    <div class="stats-grid">
      <StatCard label="Total Meetings" :value="state.meetings.length" />
      <StatCard label="Action Items Open" :value="openActions" />
      <StatCard label="Hours Recorded" :value="totalHours" />
      <StatCard label="Processed" :value="processedCount" />
    </div>

    <h2 class="section-title">Recent Meetings</h2>
    <div class="list" v-if="recent.length">
      <MeetingCard v-for="m in recent" :key="m.id" :meeting="m" />
    </div>
    <div class="empty-state" v-else>
      <p>No meetings yet. Record, upload audio, or paste a transcript to get started.</p>
      <router-link to="/new" class="btn btn-primary">+ New Meeting</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMeetings } from '../store/meetings'
import StatCard from '../components/StatCard.vue'
import MeetingCard from '../components/MeetingCard.vue'

const { state, fetchMeetings } = useMeetings()
onMounted(fetchMeetings)
const recent = computed(() => state.meetings.slice(0, 4))
const openActions = computed(() =>
  state.meetings.reduce((sum, m) => sum + m.actionItems.filter(a => !a.done).length, 0)
)
const processedCount = computed(() => state.meetings.filter(m => m.status === 'Processed').length)
const totalHours = computed(() => {
  const mins = state.meetings.reduce((s, m) => s + (parseInt(m.duration) || 0), 0)
  return (mins / 60).toFixed(1)
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
.subtitle { color: var(--slate-400); font-size: 14px; margin-top: 4px; }
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.qa { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 22px; text-align: center; }
.qa span { font-size: 13px; font-weight: 600; color: var(--slate-200); }
.qa:hover { border-color: var(--teal-500); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
.section-title { font-size: 17px; margin-bottom: 14px; }
.list { display: flex; flex-direction: column; gap: 12px; }
.empty-state { text-align: center; padding: 40px 20px; color: var(--slate-400); }
.empty-state p { margin-bottom: 16px; }
@media (max-width: 800px) { .stats-grid, .quick-actions { grid-template-columns: repeat(2, 1fr); } }
</style>
