<template>
  <aside class="sidebar">
    <div class="brand">
      <span class="brand-icon">◆</span> SmartNotes
    </div>

    <nav class="nav">
      <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
      <router-link to="/new" class="nav-link" active-class="active">+ New Meeting</router-link>
      <router-link to="/new?mode=upload" class="nav-link">Upload Audio</router-link>
      <router-link to="/new?mode=record" class="nav-link">Record Voice</router-link>
      <router-link to="/meetings" class="nav-link" active-class="active">My Meetings</router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-chip">
        <div class="avatar">{{ initials }}</div>
        <div>
          <div class="user-name">{{ state.user?.name || 'Guest' }}</div>
          <div class="user-role">{{ state.user?.email || '' }}</div>
        </div>
      </div>
      <button class="btn btn-ghost logout-btn" @click="onLogout">Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const { state, logout } = useAuth()
const initials = computed(() => (state.user?.name || 'G').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase())

function onLogout() {
  logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  background: var(--navy-900);
  border-right: 1px solid var(--navy-700);
  padding: 26px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.brand {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-icon { color: var(--teal-400); }
.nav { display: flex; flex-direction: column; gap: 4px; }
.nav-link {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--slate-400);
}
.nav-link:hover { background: var(--navy-800); color: var(--white); }
.nav-link.active { background: var(--navy-800); color: var(--teal-500); font-weight: 600; }
.sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--navy-700); }
.user-chip { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--teal-500); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px;
}
.user-name { font-size: 13px; font-weight: 600; color: var(--white); }
.user-role { font-size: 11px; color: var(--slate-400); }
.logout-btn { width: 100%; font-size: 13px; padding: 8px; }
</style>
