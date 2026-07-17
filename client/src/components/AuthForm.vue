<template>
  <div class="card auth-card">
    <h1>{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>

    <label v-if="showName">Full Name</label>
    <input v-if="showName" type="text" v-model="name" placeholder="Ayesha Khan" />

    <label>Email</label>
    <input type="text" v-model="email" placeholder="you@example.com" />

    <label>Password</label>
    <input type="text" v-model="password" placeholder="••••••••" />

    <p v-if="error" class="error-line">{{ error }}</p>

    <button class="btn btn-primary submit-btn" :disabled="!canSubmit || loading" @click="$emit('submit', { name, email, password })">
      {{ loading ? 'Please wait...' : submitLabel }}
    </button>

    <p class="switch-line"><slot name="switch" /></p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  submitLabel: { type: String, required: true },
  showName: { type: Boolean, default: false },
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
defineEmits(['submit'])

const name = ref('')
const email = ref('')
const password = ref('')
const canSubmit = computed(() => email.value.trim() && password.value.trim() && (!props.showName || name.value.trim()))
</script>

<style scoped>
.auth-card { width: 360px; padding: 36px 32px; }
.subtitle { color: var(--slate-400); font-size: 13px; margin: 6px 0 22px; }
label:not(:first-of-type) { margin-top: 14px; }
.submit-btn { width: 100%; margin-top: 22px; }
.error-line { color: var(--coral-400); font-size: 13px; margin-top: 14px; }
.switch-line { text-align: center; font-size: 13px; color: var(--slate-400); margin-top: 18px; }
.switch-line :deep(a) { color: var(--teal-500); font-weight: 600; }
</style>
