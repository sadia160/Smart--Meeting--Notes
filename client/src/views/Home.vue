<template>
  <div class="auth-shell">
    <div class="card hero">
      <div class="brand-icon big">◆</div>
      <h1>SmartNotes</h1>
      <p class="subtitle">Turn meetings into clear notes, summaries and action items — automatically.</p>
      <div class="cta-row">
        <router-link to="/login" class="btn btn-primary">Login</router-link>
        <router-link to="/signup" class="btn btn-ghost">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.hero { text-align: center; max-width: 420px; padding: 48px 36px; }
.brand-icon.big { font-size: 34px; color: var(--teal-500); margin-bottom: 6px; }
.subtitle { color: var(--slate-400); margin: 10px 0 26px; line-height: 1.6; }
.cta-row { display: flex; gap: 12px; justify-content: center; }
</style>
