import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../store/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Dashboard from '../views/Dashboard.vue'
import Meetings from '../views/Meetings.vue'
import NewMeeting from '../views/NewMeeting.vue'
import MeetingDetail from '../views/MeetingDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { auth: true } },
  { path: '/meetings', name: 'Meetings', component: Meetings, meta: { auth: true } },
  { path: '/new', name: 'NewMeeting', component: NewMeeting, meta: { auth: true } },
  { path: '/meeting/:id', name: 'MeetingDetail', component: MeetingDetail, props: true, meta: { auth: true } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const { state } = useAuth()
  if (to.meta.auth && !state.user) return '/login'
})

export default router
