<template>
  <div class="app-shell" v-if="$route.meta.auth">
    <Sidebar />
    <main class="main">
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>
