<template>
  <div v-if="meeting">
    <router-link to="/meetings" class="back-link">← Back to meetings</router-link>

    <header class="page-header">
      <div>
        <h1>{{ meeting.title }}</h1>
        <p class="subtitle">{{ meeting.date }} · {{ meeting.duration }} · {{ meeting.participants.join(', ') }}</p>
      </div>
      <div class="header-right">
        <span class="badge" :class="badgeClass">{{ meeting.status }}</span>
        <button class="btn btn-ghost" @click="downloadPdf">⬇ Download PDF</button>
      </div>
    </header>

    <div class="tabs">
      <button :class="{active: tab==='summary'}" @click="tab='summary'">Summary</button>
      <button :class="{active: tab==='actions'}" @click="tab='actions'">Action Items ({{ meeting.actionItems.length }})</button>
      <button :class="{active: tab==='transcript'}" @click="tab='transcript'">Transcript</button>
    </div>

    <div class="card" v-if="tab==='summary'">
      <h3>AI Summary</h3>
      <p class="summary-text">{{ meeting.summary }}</p>
      <h3>Key Points</h3>
      <ul class="key-points">
        <li v-for="(p,i) in meeting.keyPoints" :key="i">{{ p }}</li>
      </ul>
      <div class="tags-row">
        <span class="tag" v-for="t in meeting.tags" :key="t">{{ t }}</span>
      </div>
    </div>

    <div class="card" v-if="tab==='actions'">
      <h3>Action Items</h3>
      <ActionItem
        v-for="(a,i) in meeting.actionItems" :key="i"
        :text="a.text" :owner="a.owner" :done="a.done"
        @toggle="toggleAction(meeting.id, i)"
      />
    </div>

    <div class="card" v-if="tab==='transcript'">
      <h3>Transcript</h3>
      <p class="transcript-text">{{ meeting.transcriptSnippet }}</p>
    </div>
  </div>
  <div v-else class="card">
    <p>Meeting not found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMeetings } from '../store/meetings'
import ActionItem from '../components/ActionItem.vue'

const props = defineProps({ id: { type: String, required: true } })
const { state, getMeeting, fetchMeetings, toggleAction } = useMeetings()

onMounted(() => {
  // covers a hard refresh / direct link straight to a meeting page,
  // where the in-memory list hasn't been fetched yet
  if (!state.loaded) fetchMeetings()
})

const meeting = computed(() => getMeeting(props.id))
const tab = ref('summary')
const badgeClass = computed(() => ({
  Processed: 'badge-processed', Draft: 'badge-draft', Processing: 'badge-processing'
}[meeting.value?.status] || 'badge-draft'))

function downloadPdf() {
  const m = meeting.value
  const win = window.open('', '_blank')
  win.document.write(`<title>${m.title}</title><h1>${m.title}</h1><p>${m.date} · ${m.duration}</p><h3>Summary</h3><p>${m.summary}</p><h3>Key Points</h3><ul>${m.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul><h3>Action Items</h3><ul>${m.actionItems.map(a => `<li>${a.text} — ${a.owner}</li>`).join('')}</ul>`)
  win.document.close()
  win.print()
}
</script>

<style scoped>
.back-link { font-size: 13px; color: var(--slate-400); display: inline-block; margin-bottom: 16px; }
.back-link:hover { color: var(--teal-400); }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
.header-right { display: flex; align-items: center; gap: 10px; }
.subtitle { color: var(--slate-400); font-size: 13px; margin-top: 6px; }
.tabs { display: flex; gap: 6px; margin-bottom: 18px; border-bottom: 1px solid var(--navy-700); }
.tabs button {
  background: none; border: none; color: var(--slate-400);
  padding: 10px 14px; font-size: 14px; font-weight: 600;
  border-bottom: 2px solid transparent;
}
.tabs button.active { color: var(--teal-400); border-color: var(--teal-500); }
h3 { font-size: 14px; text-transform: uppercase; letter-spacing: .03em; color: var(--slate-400); margin: 0 0 10px; }
.summary-text { line-height: 1.7; margin-bottom: 22px; }
.key-points { margin: 0; padding-left: 18px; line-height: 1.9; }
.tags-row { margin-top: 18px; }
.transcript-text { line-height: 1.8; color: var(--slate-200); }
</style>
