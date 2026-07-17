<template>
  <div class="auth-shell">
    <AuthForm
      title="Welcome back"
      subtitle="Login to your SmartNotes account"
      submit-label="Login"
      :error="state.error"
      :loading="state.loading"
      @submit="onSubmit"
    >
      <template #switch>New here? <router-link to="/signup">Create an account</router-link></template>
    </AuthForm>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import AuthForm from '../components/AuthForm.vue'

const router = useRouter()
const { state, login } = useAuth()

async function onSubmit({ email, password }) {
  try {
    await login(email, password)
    router.push('/dashboard')
  } catch (err) {
    
  }
}
</script>
