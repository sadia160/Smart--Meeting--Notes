<template>
  <div class="rp">
    <div class="record-row">
      <button
        type="button"
        class="btn"
        :class="listening ? 'btn-primary recording' : 'btn-ghost'"
        :disabled="disabled"
        @click="toggleMic"
      >
        {{ listening ? '● Listening... click to stop' : '🎙 Speak to generate notes' }}
      </button>

      <label class="btn btn-ghost upload-btn" :class="{ disabled }">
        📁 Upload audio
        <input type="file" accept="audio/*" @change="onFile" :disabled="disabled" hidden />
      </label>

      <span class="hint">or paste transcript below</span>
    </div>

    <p v-if="uploading" class="status">Transcribing "{{ fileName }}"...</p>
    <p v-if="!speechSupported" class="status warn">
      Live mic dictation isn't supported in this browser — try Chrome, or use upload/paste.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// props: parent tells this child whether it should be usable right now
const props = defineProps({
  disabled: { type: Boolean, default: false },
})

// emits: child reports events up to parent instead of touching parent state directly
const emit = defineEmits(['append-text', 'file-selected'])

const listening = ref(false)
const uploading = ref(false)
const fileName = ref('')

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSupported = !!SpeechRecognitionAPI
let recognition = null

function toggleMic() {
  if (!speechSupported) return
  listening.value ? stopMic() : startMic()
}

function startMic() {
  recognition = new SpeechRecognitionAPI()
  recognition.continuous = true
  recognition.interimResults = false
  recognition.lang = 'en-US'
  recognition.onresult = (e) => {
    let text = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      text += e.results[i][0].transcript + ' '
    }
    emit('append-text', text)
  }
  recognition.onend = () => { listening.value = false }
  recognition.start()
  listening.value = true
}

function stopMic() {
  recognition?.stop()
  listening.value = false
}

// Real audio files can't be transcribed in-browser without a server API,
// so we simulate the transcription step here after "uploading" the file.
function onFile(e) {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name
  uploading.value = true
  emit('file-selected', file.name)

  setTimeout(() => {
    uploading.value = false
    emit(
      'append-text',
      `[Transcribed from ${file.name}] We reviewed progress since last sync, agreed on next steps, and assigned follow-up owners. `
    )
  }, 1500)
}
</script>

<style scoped>
.record-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 10px 0; }
.hint { font-size: 12px; color: var(--slate-400); }
.recording { animation: pulse 1.2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
.upload-btn { display: inline-flex; align-items: center; gap: 6px; }
.upload-btn.disabled { opacity: .5; pointer-events: none; }
.status { font-size: 12px; color: var(--teal-400); margin-top: 8px; }
.status.warn { color: var(--coral-400); }
</style>
