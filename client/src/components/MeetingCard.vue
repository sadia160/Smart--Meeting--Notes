<template>
  <router-link :to="`/meeting/${meeting.id}`" class="mc card">
    <div class="mc-top">
      <h3>{{ meeting.title }}</h3>
      <span class="badge" :class="badgeClass">{{ meeting.status }}</span>
    </div>
    <p class="mc-summary">{{ meeting.summary || meeting.transcriptSnippet }}</p>
    <div class="mc-meta">
      <span>{{ meeting.date }}</span> · <span>{{ meeting.duration }}</span> · <span>{{ meeting.participants.length }} participants</span>
    </div>
    <div class="mc-tags">
      <span class="tag" v-for="t in meeting.tags" :key="t">{{ t }}</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ meeting: { type: Object, required: true } })
const badgeClass = computed(() => ({
  Processed: 'badge-processed', Draft: 'badge-draft', Processing: 'badge-processing'
}[props.meeting.status] || 'badge-draft'))
</script>

<style scoped>
.mc { display: block; transition: border-color .15s ease, transform .15s ease; }
.mc:hover { border-color: var(--teal-500); transform: translateY(-2px); }
.mc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.mc-top h3 { font-size: 16px; margin: 0; }
.mc-summary { font-size: 13px; color: var(--slate-400); margin: 10px 0; line-height: 1.5; }
.mc-meta { font-size: 12px; color: var(--slate-400); margin-bottom: 10px; }
</style>
