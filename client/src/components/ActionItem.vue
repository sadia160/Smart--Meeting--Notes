<template>
  <div class="action-item">
    <label class="checkbox">
      <input type="checkbox" :checked="done" @change="$emit('toggle')" />
      <span :class="{ done }">{{ text }}</span>
    </label>
    <span class="owner">{{ owner }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  owner: { type: String, required: true },
  done: { type: Boolean, required: true },
})
defineEmits(['toggle'])
</script>

<style scoped>
.action-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--navy-700); }
.action-item:last-child { border-bottom: none; }
.checkbox { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.checkbox input { width: 16px; height: 16px; accent-color: var(--teal-500); }
.done { text-decoration: line-through; color: var(--slate-400); }
.owner { font-size: 12px; color: var(--slate-400); background: var(--navy-700); padding: 3px 10px; border-radius: 999px; }
</style>
