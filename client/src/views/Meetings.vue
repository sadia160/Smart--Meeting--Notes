<template>
  <div>
    <header class="page-header">
      <div>
        <h1>All Meetings</h1>
        <p class="subtitle">{{ filtered.length }} of {{ state.meetings.length }} meetings</p>
      </div>
      <router-link to="/new" class="btn btn-primary">+ New Meeting</router-link>
    </header>

    <div class="filters">
      <input type="text" v-model="query" placeholder="Search meetings, tags, participants..." />
      <select v-model="statusFilter">
        <option value="">All statuses</option>
        <option>Processed</option>
        <option>Draft</option>
        <option>Processing</option>
      </select>
    </div>

    <div class="list">
      <MeetingCard v-for="m in filtered" :key="m.id" :meeting="m" />
      <p v-if="!filtered.length && state.meetings.length" class="empty">No meetings match your search.</p>
      <p v-if="!state.meetings.length" class="empty">No meetings yet — create one to see it here.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMeetings } from '../store/meetings'
import MeetingCard from '../components/MeetingCard.vue'

const { state, fetchMeetings } = useMeetings()
onMounted(fetchMeetings)
const query = ref('')
const statusFilter = ref('')

const filtered = computed(() => state.meetings.filter(m => {
  const q = query.value.toLowerCase()
  const matchesQuery = !q ||
    m.title.toLowerCase().includes(q) ||
    m.tags.some(t => t.toLowerCase().includes(q)) ||
    m.participants.some(p => p.toLowerCase().includes(q))
  const matchesStatus = !statusFilter.value || m.status === statusFilter.value
  return matchesQuery && matchesStatus
}))
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.subtitle { color: var(--slate-400); font-size: 14px; margin-top: 4px; }
.filters { display: flex; gap: 12px; margin-bottom: 20px; }
.filters input { flex: 1; }
.filters select { max-width: 180px; }
.list { display: flex; flex-direction: column; gap: 12px; }
.empty { color: var(--slate-400); font-size: 14px; padding: 20px 0; }
</style>
