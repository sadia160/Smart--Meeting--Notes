<template>
  <div class="auth-shell">
    <AuthForm
      title="Create account"
      subtitle="Start turning meetings into notes"
      submit-label="Sign Up"
      show-name
      :error="state.error"
      :loading="state.loading"
      @submit="onSubmit"
    >
      <template #switch>Already have an account? <router-link to="/login">Login</router-link></template>
    </AuthForm>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import AuthForm from '../components/AuthForm.vue'

const router = useRouter()
const { state, signup } = useAuth()

async function onSubmit({ name, email, password }) {
  try {
    await signup(name, email, password)
    router.push('/dashboard')
  } catch (err) {
    // error message is already surfaced via state.error / AuthForm
  }
}
</script>
