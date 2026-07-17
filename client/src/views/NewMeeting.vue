<template>
  <div>
    <header class="page-header">
      <h1>New Meeting</h1>
      <p class="subtitle">Record, upload, or paste a transcript — SmartNotes will generate the summary and action items.</p>
    </header>

    <div class="card form-card" v-if="stage === 'input'">
      <label>Meeting Title</label>
      <input type="text" v-model="title" placeholder="e.g. Weekly Engineering Sync" />

      <label>Participants (comma separated)</label>
      <input type="text" v-model="participantsRaw" placeholder="Ayesha Khan, Bilal Ahmed" />

      <label>Tags (comma separated)</label>
      <input type="text" v-model="tagsRaw" placeholder="Product, Planning" />

      <label>Transcript</label>
      <RecordingPanel :disabled="false" @append-text="transcript += $event" @file-selected="onFileSelected" />
      <textarea v-model="transcript" rows="8" placeholder="Transcript will appear here..."></textarea>

      <button class="btn btn-primary generate-btn" :disabled="!canGenerate" @click="generate">
        ✨ Generate Smart Notes
      </button>
    </div>

    <div class="card processing-card" v-if="stage === 'processing'">
      <div class="spinner"></div>
      <h3>Analyzing transcript...</h3>
      <p class="subtitle">Extracting summary, key points and action items</p>
    </div>

    <div class="card edit-card" v-if="stage === 'edit'">
      <h3>✅ Notes generated — review &amp; edit</h3>

      <label>Summary</label>
      <textarea v-model="draft.summary" rows="3"></textarea>

      <label>Key Points (one per line)</label>
      <textarea v-model="keyPointsRaw" rows="4"></textarea>

      <label>Action Items (one per line: text - owner)</label>
      <textarea v-model="actionsRaw" rows="3"></textarea>

      <button class="btn btn-primary generate-btn" @click="save">💾 Save Notes</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetings } from '../store/meetings'
import RecordingPanel from '../components/RecordingPanel.vue'

const router = useRouter()
const { addMeeting } = useMeetings()

const title = ref('')
const participantsRaw = ref('')
const tagsRaw = ref('')
const transcript = ref('')
const stage = ref('input') // input -> processing -> edit
const draft = ref({ summary: '', participants: [], tags: [] })
const keyPointsRaw = ref('')
const actionsRaw = ref('')

const canGenerate = computed(() => title.value.trim() && transcript.value.trim())

function onFileSelected(name) {
  if (!title.value.trim()) title.value = name.replace(/\.[^.]+$/, '')
}

function generate() {
  stage.value = 'processing'
  setTimeout(() => {
    const participants = participantsRaw.value.split(',').map(s => s.trim()).filter(Boolean)
    const tags = tagsRaw.value.split(',').map(s => s.trim()).filter(Boolean)
    const keyPoints = transcript.value.split('. ').filter(s => s.length > 15).slice(0, 4).map(s => s.trim())

    draft.value = {
      participants: participants.length ? participants : ['You'],
      tags: tags.length ? tags : ['General'],
      summary: 'Auto-generated summary: ' + transcript.value.slice(0, 160) + '...',
    }
    keyPointsRaw.value = keyPoints.join('\n')
    actionsRaw.value = [
      `Follow up on discussed items - ${participants[0] || 'You'}`,
      `Share meeting notes with the team - ${participants[1] || 'You'}`,
    ].join('\n')

    stage.value = 'edit'
  }, 1400)
}

async function save() {
  const words = transcript.value.split(/\s+/).filter(Boolean)
  const actionItems = actionsRaw.value.split('\n').filter(Boolean).map(line => {
    const [text, owner] = line.split(' - ')
    return { text: (text || line).trim(), owner: (owner || 'You').trim(), done: false }
  })

  const id = await addMeeting({
    title: title.value,
    date: new Date().toISOString().slice(0, 10),
    duration: Math.max(5, Math.round(words.length / 130)) + ' min',
    participants: draft.value.participants,
    tags: draft.value.tags,
    transcript: transcript.value,
    transcriptSnippet: transcript.value.slice(0, 140) + '...',
    summary: draft.value.summary,
    keyPoints: keyPointsRaw.value.split('\n').filter(Boolean),
    actionItems,
    status: 'Processed',
  })

  router.push(`/meeting/${id}`)
}
</script>

<style scoped>
.page-header { margin-bottom: 24px; }
.subtitle { color: var(--slate-400); font-size: 14px; margin-top: 4px; }
.form-card, .edit-card { display: flex; flex-direction: column; gap: 6px; max-width: 640px; }
.form-card > label:not(:first-child), .edit-card > label:not(:first-of-type) { margin-top: 14px; }
textarea { resize: vertical; font-family: var(--font-body); margin-top: 10px; }
.generate-btn { margin-top: 20px; align-self: flex-start; }
.processing-card { text-align: center; padding: 50px 20px; max-width: 480px; }
.spinner {
  width: 36px; height: 36px; margin: 0 auto 18px;
  border: 3px solid var(--navy-700); border-top-color: var(--teal-500);
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
