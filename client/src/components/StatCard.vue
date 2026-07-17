<template>
  <div class="stat card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>

<style scoped>
.stat-label { font-size: 12px; color: var(--slate-400); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
.stat-value { font-size: 30px; font-weight: 700; color: var(--white); margin-top: 8px; font-family: var(--font-display); }
</style>
